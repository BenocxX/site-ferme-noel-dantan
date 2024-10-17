/* eslint-disable quotes */
import crypto from 'crypto';
import { formatDate } from 'date-fns';
import { frCA } from 'date-fns/locale';
import { z } from 'zod';

import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email';
import { PrismaClient } from '@prisma/client';

const schema = z.object({
  language: z.string().optional(),
  reservationId: z.coerce.number(),
  email: z.string().email(),
});

export function json(content, init = {}) {
  const { headers, ...rest } = init;
  return new Response(JSON.stringify(content), {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  });
}

export function getParams(request) {
  return new URL(request.url).searchParams;
}

export function getParam(request, key) {
  return getParams(request).get(key);
}

const prisma = new PrismaClient();

/**
 * Returns all available reservation spots for a specific date.
 */
export async function GET(request) {
  const dateId = getParam(request, 'dateId');

  const result = z.coerce.number().safeParse(dateId);
  if (result.error) {
    return json({ error: 'Invalid dateId' }, { status: 400 });
  }

  const date = await prisma.openDate.findFirst({
    where: {
      id: result.data,
    },
  });

  if (!date) {
    return json({ error: 'Date not found' }, { status: 404 });
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      openDateId: result.data,
      count: {
        lt: 10,
      },
    },
    orderBy: {
      halfHourId: 'asc',
    },
    include: {
      halfHour: true,
    },
  });

  return json(reservations);
}

/**
 * Reserves a spot for a specific date and half hour.
 */
export async function POST(request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (result.error) {
    return json({ error: 'Invalid body' }, { status: 400 });
  }

  const { reservationId, email, language } = result.data;

  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId },
    include: {
      openDate: true,
      halfHour: true,
    },
  });

  if (!reservation) {
    return json({ error: 'reservationNotFound' }, { status: 404 });
  }

  if (reservation.count >= 10) {
    return json({ error: 'reservationIsFull' }, { status: 400 });
  }

  const hash = await createUniqueReservation({ reservation, email });
  await incrementReservationCount({ reservation });

  const hour = reservation.halfHour.period.split(':')[0];
  const minutes = reservation.halfHour.period.split(':')[1];

  const date = new Date(reservation.openDate.date);
  date.setHours(+hour, +minutes);

  const isSuccess = await sendReservationEmail({ hash, email, date, language });
  return json({ hash, email, date }, { status: 200 });
}

async function createUniqueReservation({ reservation, email }) {
  // It's ok if this is public, we just need a secret to hash the reservation to avoid humans from guessing the hash
  const secret = 'ferme-noel-dantan';
  const hash = crypto
    .createHmac('sha256', secret)
    .update(
      `${reservation.id}-${reservation.halfHourId}-${reservation.openDateId}-${email}-${new Date().getTime()}`
    )
    .digest('hex');

  // If we are very unlucky and the hash already exists, we can just return an error. This will never happen
  if (await prisma.uniqueReservation.findFirst({ where: { hash } })) {
    return json({ error: 'unknowError' }, { status: 500 });
  }

  await prisma.uniqueReservation.create({
    data: {
      hash,
      reservation: {
        connect: {
          id: reservation.id,
        },
      },
    },
  });

  return hash;
}

async function incrementReservationCount({ reservation }) {
  await prisma.reservation.update({
    where: {
      id: reservation.id,
    },
    data: {
      count: {
        increment: 1,
      },
    },
  });
}

async function sendReservationEmail({ hash, email, date, language }) {
  const formattedDate = formatDate(date, 'PPP', {
    locale: language === 'fr' ? frCA : undefined,
  });

  const enContent = {
    subject: "Reservation confirmation at Ferme Noël d'Antan",
    plainText: `This is the confirmation of the reservation for ${formattedDate}`,
    html: generateEnglishEmail({
      email,
      date: formattedDate,
      hash,
      rawDate: date,
    }),
  };

  const frContent = {
    subject: "Confirmation de la réservation chez Ferme Noël d'Antan",
    plainText: `Ceci est la confirmation de la réservation pour ${formattedDate}`,
    html: generateFrenchEmail({
      email,
      date: formattedDate,
      hash,
      rawDate: date,
    }),
  };

  const message = {
    senderAddress: process.env.SENDER_ADDRESS_DO_NOT_REPLY,
    recipients: {
      to: [{ address: email }],
    },
    content: language === 'fr' ? frContent : enContent,
  };

  const client = new EmailClient(process.env.COMMUNICATION_SERVICE_CONNECTION_STRING);
  const poller = await client.beginSend(message);
  const pollerResult = await poller.pollUntilDone();

  if (pollerResult.status !== KnownEmailSendStatus.Succeeded) {
    console.error('Failed to send email. Error:', pollerResult.error);
    return false;
  }

  return true;
}

function generateEnglishEmail({ email, date, hash, rawDate }) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$-->
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
    <meta name="x-apple-disable-message-reformatting"/>
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
    Reservation confirmation at Ferme Noël d&#x27;Antan
    <div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>
  <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:0 48px">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:32px;line-height:24px;margin:16px 0;color:#b80022;text-align:left">Ferme Noël d&#x27;Antan</p>
                    <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0"/>
                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Your reservation for ${date} has been successfully submitted. Looking forward to seeing you soon!</p>
                    <a href="${process.env.CONSULT_URL}?hash=${hash}&amp;email=${email}&amp;date=${rawDate}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#b80022;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px 10px 10px" target="_blank">
                      <span>
                        <!--[if mso]><i style="mso-font-width:500%;mso-text-raise:15" hidden>&#8202;</i><![endif]-->
                      </span>
                      <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px">Consult your reservation</span>
                      <span>
                        <!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8203;</i><![endif]-->
                      </span>
                    </a>
                    <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0"/>
                    <p style="font-size:12px;line-height:16px;margin:16px 0;color:#8898aa">Tous droits réservés à Ferme Noël d&#x27;Antan et Konkat</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
<!--/$-->`;
}

function generateFrenchEmail({ email, date, hash, rawDate }) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$-->
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
    <meta name="x-apple-disable-message-reformatting"/>
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
    Confirmation de réservation à la Ferme Noël d&#x27;Antan
    <div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>
  <body style="background-color:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Ubuntu,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em;background-color:#ffffff;margin:0 auto;padding:20px 0 48px;margin-bottom:64px">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:0 48px">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:32px;line-height:24px;margin:16px 0;color:#b80022;text-align:left">Ferme Noël d&#x27;Antan</p>
                    <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0"/>
                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Votre réservation du ${date} a été soumise avec succès. Au plaisir de vous voir bientôt!</p>
                    <a href="${process.env.CONSULT_URL}?hash=${hash}&amp;email=${email}&amp;date=${rawDate}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#b80022;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px 10px 10px" target="_blank">
                      <span>
                        <!--[if mso]><i style="mso-font-width:500%;mso-text-raise:15" hidden>&#8202;</i><![endif]-->
                      </span>
                      <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px">Consulter votre réservation</span>
                      <span>
                        <!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8203;</i><![endif]-->
                      </span>
                    </a>
                    <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0"/>
                    <p style="font-size:12px;line-height:16px;margin:16px 0;color:#8898aa">Tous droits réservés à Ferme Noël d&#x27;Antan et Konkat</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
<!--/$-->`;
}
