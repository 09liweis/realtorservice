export const WEBSITE_NAME = 'Realtor Service';

export const getPageTitle = (title:string) => {
  return `${title} - ${WEBSITE_NAME}`;
}

export function formatAmount(amount:number|string|undefined) {
  if (!amount) return '';
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export const PROPERTY_TYPES = ['House', 'Condo', 'Townhouse', 'Apartment', 'Other'];

export const OCCUPATION_STATUS_OPTIONS = ["Vacant", "Occupied"];

export const STAGING_STATUS_OPTIONS = ["draft", "submitted", "confirmed", "paid", "scheduled","completed"];

export const STATUS_STEPS_NEXT = {
  draft: "submitted",
  submitted: "confirmed",
  confirmed: "paid",
  paid: "scheduled",
  schedule: "complete"
}