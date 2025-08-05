interface sendRequestType {
  url:string
  method?:string
  body?:any
}
export const sendRequest = async ({url, body, method = 'POST'}:sendRequestType) => {
  const options:{[key:string]:any} = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('sb-tpnoaousxfcvtbzqdcog-auth-token')
    },
  }
  if (body) {
    options.body = JSON.stringify(body)
  }
  const response = await fetch(url, options);
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