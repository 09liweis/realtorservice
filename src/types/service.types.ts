import type { ProjectStatus } from "$lib/types/constant";

export type Service = {
  id?: string;
  user_id?: string;
  notes?: string;
  estimate_price?: number;
  quotation_price?: number;
  status: ProjectStatus;
  history?: Array<{status: string, date: string, note?: string}>;
  created_at?: Date;
  updated_at?: Date;
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