import type { RequestEvent, RequestHandler } from '@sveltejs/kit';

export function logApiError(
  request: any,
  error: unknown,
): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const stack = error instanceof Error ? error.stack : undefined;
  
  console.error({
    message: `API Error in: ${errorMessage}`,
    stack
  });
}
