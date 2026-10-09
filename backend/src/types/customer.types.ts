export interface Customer {
  id: number
  fname: string
  lname: string
  email: string
  phone: string
}

export interface CreateCustomer {
  fname: string
  lname: string
  email: string
  phone: string
  street: string
  zipcode: string
  city: string
  country: string
}

export interface UpdateCustomer {
  fname?: string
  lname?: string
  email?: string
  phone?: string
}