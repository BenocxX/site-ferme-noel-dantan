export function json(content) {
  return new Response(JSON.stringify(content), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function getParams(request) {
  return new URL(request.url).searchParams;
}

export function getParam(request, key) {
  return getParams(request).get(key);
}
