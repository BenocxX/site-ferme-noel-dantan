/* eslint-disable quotes */
import { z } from 'zod';

import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email';
import { PrismaClient } from '@prisma/client';

const schema = z.object({
  language: z.string().optional(),
  hash: z.string(),
  email: z.string().email(),
  date: z.string(),
  time: z.string(),
  rawDate: z.coerce.date(),
  resend: z.boolean().optional(),
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
 * Send a confirmation email to the user
 */
export async function POST(request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (result.error) {
    console.log(result.error);
    return json({ error: 'Invalid body' }, { status: 400 });
  }

  const { hash, email, date, time, language, resend } = result.data;

  const uniqueReservation = await prisma.uniqueReservation.findFirst({
    where: { hash },
  });

  if (!uniqueReservation) {
    return json({ error: 'reservationNotFound' }, { status: 404 });
  }

  if (uniqueReservation.emailSent && !resend) {
    return json({ message: 'emailAlreadySent' }, { status: 200 });
  }

  // To avoid "double sending" if user refreshes the page or goes to another page and comes back
  // before the email is sent. So we optimistically set the emailSent to true, if the email fails
  // we set it back to false.
  await prisma.uniqueReservation.update({
    where: { hash },
    data: { emailSent: true },
  });

  const isSuccess = await sendReservationEmail({ hash, email, date, time, language });

  if (!isSuccess) {
    await prisma.uniqueReservation.update({
      where: { hash },
      data: { emailSent: false },
    });

    return json({ error: 'emailError' }, { status: 500 });
  }

  return json({ message: 'emailSent' }, { status: 200 });
}

async function sendReservationEmail({ hash, email, date, time, language, rawDate }) {
  const enContent = {
    subject: "Reservation confirmation at Ferme Noël d'Antan",
    plainText: `This is the confirmation of the reservation for ${date} at ${time}`,
    html: generateEnglishEmail({ email, date, time, hash, rawDate }),
  };

  const frContent = {
    subject: "Confirmation de la réservation chez Ferme Noël d'Antan",
    plainText: `Ceci est la confirmation de la réservation du ${date} à ${time}`,
    html: generateFrenchEmail({ email, date, time, hash, rawDate }),
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

function generateEnglishEmail({ email, date, time, hash, rawDate }) {
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
                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Your reservation for ${date} at ${time} has been successfully submitted. Looking forward to seeing you soon!</p>
                    <a href="${process.env.CONSULT_URL}?hash=${hash}&amp;email=${email}&amp;date=${rawDate}&amp;time=${time}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#b80022;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px 10px 10px" target="_blank">
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

function generateFrenchEmail({ email, date, time, hash, rawDate }) {
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
                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">Votre réservation du ${date} à ${time} a été soumise avec succès. Au plaisir de vous voir bientôt!</p>
                    <a href="${process.env.CONSULT_URL}?hash=${hash}&amp;email=${email}&amp;date=${rawDate}&amp;time=${time}" style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#b80022;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px 10px 10px" target="_blank">
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
