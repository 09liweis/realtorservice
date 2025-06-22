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