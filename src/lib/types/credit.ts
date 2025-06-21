export interface CreditRecord {
  amount: number,
  tp: string,
  stripe_client_secret: string,
  id?: string,
  user_id: string
}