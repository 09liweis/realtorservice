export interface CreditRecord {
  amount: number, //+100, -100
  tp: string, //usage: topup, staging, cleaning
  stripe_client_secret: string,
  id?: string,
  user_id: string
}