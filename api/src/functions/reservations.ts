import { HttpRequest, HttpResponseInit, InvocationContext, app } from '@azure/functions';

export async function reservations(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get('name') || (await request.text()) || 'world';

  return { body: `Hello, ${name}!` };
}

app.http('reservations', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: reservations,
});
