export interface Customer {
  id: number
  fname: string
  lname: string
  email: string
  phone?: string | undefined
}

export interface CreateCustomer {
  fname: string
  lname: string
  email: string
  phone?: string | undefined
}

export interface UpdateCustomer {
  fname?: string
  lname?: string
  email?: string
  phone?: string | undefined
}
