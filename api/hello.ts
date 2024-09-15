export function GET(_: Request) {
  return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}
