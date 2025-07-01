export interface UserProfile {
  created_at?: string | undefined;
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  brokerage: string,
  reco_number: string,
  role: string, //admin, realtor
  realtor_approved: boolean
  credits: number
}