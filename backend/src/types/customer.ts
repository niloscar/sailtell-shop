export interface Customer {
  id: number
  fname: string
  lname: string
  email: string
  phone?: string
}

export interface UpdateCustomer {
  fname?: string
  lname?: string
  email?: string
  phone?: string
}