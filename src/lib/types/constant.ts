export type MenuItem = {
  name: string;
  href?: string;
  submenu?: MenuItem[];
};

export const WEBSITE_NAME = "Realtor Service";
export const PHONE_NUMBER = "416-800-0688";
export const CONTACT_EMAIL = "dev@realtorservice.ca";

// Public navigation items
export const MENU_ITEMS:MenuItem[] = [
  { name: "About Us", href: "/about" },
  {
    name: "Realtor Services",
    submenu: [
      {
        name: "Listing Service",
        href: "/realtor-services/listing",
        submenu: [
          {
            name: "Painting & Renovating",
            href: "/realtor-services/listing/painting",
          },
          { name: "Cleaning", href: "/realtor-services/listing/cleaning" },
          { name: "Staging", href: "/realtor-services/listing/staging" },
          {
            name: "Photographing & Media Services",
            href: "/realtor-services/listing/photographing",
          },
          {
            name: "Sign Post Installation",
            href: "/realtor-services/listing/sign-post",
          },
        ],
      },
      {
        name: "Social Media & Branding Service",
        href: "/realtor-services/social-media",
        submenu: [
          {
            name: "Logo/Business Card/Website Design",
            href: "/realtor-services/social-media/design",
          },
          {
            name: "Social Media Account Management",
            href: "/realtor-services/social-media/management",
          },
          {
            name: "Video Editing Service",
            href: "/realtor-services/social-media/video",
          },
        ],
      },
    ],
  },
  {
    name: "Assignment & Coming Soon",
    href: "/listings",
    submenu: [
      {
        name: "Assignment Sales Listing",
        href: "/listings?listing_type=assignment_sale",
      },
      {
        name: "Coming Soon Listing",
        href: "/listings?listing_type=coming_soon",
      },
    ],
  },
  {
    name: "Realtor Tools",
    submenu: [
      { name: "Mortgage Calculator", href: "/mortgage-calculator" },
      {
        name: "Open House Registration Tool",
        href: "/realtor-tools/open-house",
      },
      {
        name: "Offer Management Tool",
        href: "/realtor-tools/offer-management",
      },
      {
        name: "Downloadable Tools",
        href: "/realtor-tools/downloadable",
        // submenu: [
        //   { name: "New Realtor Starter Kit", href: "/realtor-tools/downloadable/starter-kit" },
        //   { name: "Buyer Presentation Package", href: "/realtor-tools/downloadable/buyer-package" },
        //   { name: "Seller Presentation Package", href: "/realtor-tools/downloadable/seller-package" },
        //   { name: "Handbook for Landlord/Buyer/Seller", href: "/realtor-tools/downloadable/handbook" }
        // ]
      },
    ],
  },
  {
    name: "Market Insights",
    submenu: [
      {
        name: "Bank of Canada Policy Rate",
        href: "/market-insights/bank-rate",
      },
      { name: "Mortgage Rate", href: "/market-insights/mortgage-rate" },
      { name: "Market Stats Update", href: "/market-insights/market-stats" },
      // { name: "Policy Update", href: "/market-insights/policy-update" }
    ],
  },
];

export const DASHBOARD_STAGINGS_URL = '/dashboard/stagings';
export const DASHBOARD_CLEANINGS_URL = '/dashboard/cleanings';
export const DASHBOARD_SOCIAL_MEDIA_SERVICES_URL = '/dashboard/social_media_services';
export const DASHBOARD_VIDEO_SERVICES_URL =  '/dashboard/video_services';
export const DASHBOARD_LISTINGS_URL = '/dashboard/listings';
export const DASHBOARD_OPENHOUSES_URL = '/dashboard/openhouses';
export const DASHBOARD_OFFERS_URL = '/dashboard/offers';
export const DASHBOARD_PROFILE_URL = '/dashboard/profile';

export const getPageTitle = (title: string) => {
  return `${title} - ${WEBSITE_NAME}`;
};

export function formatAmount(amount: number | string | undefined) {
  if (!amount) return "";
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const LISTING_TYPES = ["Assignment_Sale", "Coming_Soon"];

export const PROPERTY_TYPES = [
  "House",
  "Condo",
  "Townhouse",
  "Apartment",
  "Commercial",
  "Other",
];

export const ROOM_NUMS = [
  "1",
  "1+",
  "2",
  "2+",
  "3",
  "3+",
  "4",
  "4+",
  "5",
  "5+",
];

export const OCCUPATION_STATUS_OPTIONS = ["Vacant", "Occupied"];

export const STAGING_STATUS_OPTIONS = [
  "draft",
  "submitted",
  "confirmed",
  "paid",
  "scheduled",
  "completed",
];

export type ProjectStatus =
  | "draft"
  | "submitted"
  | "confirmed"
  | "paid"
  | "scheduled"
  | "completed";

export const STATUS_STEPS_NEXT = {
  draft: "submitted",
  submitted: "confirmed",
  confirmed: "paid",
  paid: "scheduled",
  schedule: "complete",
};

export function getStatusStyle(status: string) {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "submitted":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "scheduled":
      return "bg-purple-100 text-purple-800";
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
