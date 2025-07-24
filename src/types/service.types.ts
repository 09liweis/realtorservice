import type { ProjectStatus } from "$lib/types/constant";

export type Service = {
  id?: string;
  user_id?: string;
  notes?: string;
  estimate_price?: number;
  quotation_price?: number;
  status: ProjectStatus;
  history?: Array<{status: string, date: Date, note?: string}>;
  is_admin_unread?: boolean;
  is_user_unread?: boolean;
  created_at?: string;
  updated_at?: string;
  user_profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    brokerage: string;
  }
};

export const EMPTY_SERVICE: Service = {
  id: undefined,
  user_id: undefined,
  notes: '',
  estimate_price: 0,
  quotation_price: 0,
  status: 'submitted' as ProjectStatus,
  history: [],
  created_at: undefined,
  updated_at: undefined
};