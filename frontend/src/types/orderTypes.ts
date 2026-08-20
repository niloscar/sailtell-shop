export interface Order {
  id: number
  items: [{
    productId: number
    productCategory: string
    productName: string
    productPrice: number
    quantity: number
  }]
  totalPrice: number
  orderDate: string
  customerFirstName: string
  customerLastName: string
  customerAddress: {
    street: string
    zipCode: number
    city: string
    country: string
  }
  customerEmail: string
  customerPhone: number | null
}