import { PUBLIC_SUPABASE_URL } from "$env/static/public"
import type { UserProfile } from "./types/user";

export function getAuthToken() {
  const authorizationKey = PUBLIC_SUPABASE_URL.split('https://')[1].split('.')[0];
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(`sb-${authorizationKey}-auth-token`);
}

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
      'Authorization': getAuthToken()
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

export function formatUserName({first_name, last_name}:UserProfile) {
  return `${first_name} ${last_name}`;
}

export function getUserInitials({first_name, last_name}:UserProfile) {
  return `${first_name[0]}${last_name[0]}`;
}