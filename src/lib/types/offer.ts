export interface OfferProperty {
  user_id: string,
  id?: string,
  address: string,
  date: string,
  asking_price: string
}

export interface Offer {
  id?: string,
  user_id?: string,
  property_id: string,
  buyer: string,
  agent: string,
  phone: string,
  email: string,
  price: string,
  deposit: string,
  irrevocability: boolean,
  completion_date: string,
  title_search: string,
  schedule_a_conditions: string,
}