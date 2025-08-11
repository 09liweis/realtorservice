import { PUBLIC_SUPABASE_URL } from "$env/static/public"


interface sendRequestType {
  url:string
  method?:string
  body?:any
}
export const sendRequest = async ({url, body, method = 'POST'}:sendRequestType) => {

  const authorizationKey = PUBLIC_SUPABASE_URL.split('https://')[1].split('.')[0];

  const options:{[key:string]:any} = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem(`sb-${authorizationKey}-auth-token`)
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