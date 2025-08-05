interface sendRequestType {
  url:string
  method:string
  body?:any
}
export const sendRequest = async ({url, body = {}, method = 'POST'}:sendRequestType) => {
  const response = await fetch(url, {
    method,
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