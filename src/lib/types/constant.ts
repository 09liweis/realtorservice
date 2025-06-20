export const WEBSITE_NAME = 'Realtor Service';

export const getPageTitle = (title:string) => {
    return `${title} - ${WEBSITE_NAME}`;
}

export const PROPERTY_TYPES = ['House', 'Condo', 'Townhouse', 'Apartment', 'Other'];

export const OCCUPATION_STATUS_OPTIONS = ["Vacant", "Occupied"];

export const STAGING_STATUS_OPTIONS = ["Pending", "Scheduled", "Completed", "Cancelled"];