export interface CreditRecord {
  amount: number, //+100, -100
  tp: string, //usage: topup, staging, cleaning
  status: string, //pending, done
  stripe_client_secret?: string,
  id?: string,
  user_id: string,
  tp_id?: string,
  notes?: string,
  created_at?: string,
  updated_at?: string
}