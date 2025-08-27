import type { RequestEvent } from '@sveltejs/kit';

export function logApiError(
  request: RequestEvent,
  error: unknown,
): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const stack = error instanceof Error ? error.stack : undefined;
  const url = request.url;
  
  console.error({
    message: `API Error in ${url}: ${errorMessage}`,
    stack
  });
}
