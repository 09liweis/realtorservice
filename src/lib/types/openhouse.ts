export interface OpenHouse {
  id?: string,
  address: string,
  date: string
}

export interface OpenHouseGuest {
  id?: string,
  openhouse_id: string,
  property_id: string;
  name: string;
  phone: string;
  email: string;
  buy_lease: string;
  has_agent: string;
}