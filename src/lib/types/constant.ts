export const WEBSITE_NAME = 'Realtor Service';
export const PHONE_NUMBER = '416-800-0688';
export const CONTACT_EMAIL = 'dev@realtorservice.ca';

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

export const LISTING_TYPES = ['Assignment Sale','Coming Soon']

export const PROPERTY_TYPES = ['House', 'Condo', 'Townhouse', 'Apartment', 'Commercial', 'Other'];

export const ROOM_NUMS = ['1', '1+', '2', '2+', '3', '3+', '4', '4+', '5', '5+'];

export const OCCUPATION_STATUS_OPTIONS = ["Vacant", "Occupied"];

export const STAGING_STATUS_OPTIONS = ["draft", "submitted", "confirmed", "paid", "scheduled","completed"];

export type ProjectStatus = 'draft' | 'submitted' | 'confirmed' | 'paid' | 'scheduled' | 'completed';

export const STATUS_STEPS_NEXT = {
  draft: "submitted",
  submitted: "confirmed",
  confirmed: "paid",
  paid: "scheduled",
  schedule: "complete"
}

export function getStatusStyle(status: ProjectStatus) {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'submitted':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}