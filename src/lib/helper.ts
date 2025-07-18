interface sendRequestType {
  url:string
  body:any
}
export const sendRequest = async ({url, body}:sendRequestType) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return {response, data};
}

// Format date helper function
export function formatDate(date: string|undefined) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}