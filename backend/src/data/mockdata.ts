import type { User } from "../types/user"
import type { Customer } from "../types/customer"
import type { Order } from "../types/order"
import type { Product } from "../types/product"

export const mockUsers: User[] = [
  { id: 1, email: 'admin@example.com', passwordHash: 'admin123', role: 'admin' },
  { id: 2, email: 'editor@example.com', passwordHash: 'editor123', role: 'editor' },
  { id: 3, email: 'user@example.com', passwordHash: 'user123', role: 'user' }
]

export const mockCustomers: Customer[] = [
  { id: 1, fname: 'Anders', lname: 'Andersson', email: 'anders@example.com' },
  { id: 2, fname: 'Erik', lname: 'Eriksson', email: 'erik@example.com' },
  { id: 3, fname: 'John', lname: 'Johnsson', email: 'john@example.com' }
]

export const mockOrders: Order[] = [
  { id: 1, customer_id: 1, payment_method_id: 2, delivery_method_id: 1, ordered_at: '2026-07-18 17:42:00+00', sum: 1799 },
  { id: 2, customer_id: 2, payment_method_id: 1, delivery_method_id: 2, ordered_at: '2026-02-01 12:30:00+00', sum: 1499 },
  { id: 3, customer_id: 3, payment_method_id: 3, delivery_method_id: 1, ordered_at: '2026-03-01 09:15:00+00', sum: 2899 }
]

export const mockProducts: Product[] = [
  { id: 1, name: 'Compass One', brand_name: 'SailTell', description: 'Kompakt trådlös kompassensor för segling som skickar kursdata till kompatibla enheter via Bluetooth.', details: ['Bluetooth Low Energy', 'Uppladdningsbart batteri', 'Vattentålig konstruktion', 'Utformad för montering på mast, bom eller annan fast punkt på båten'], stock: 1, created_at: '2026-05-01 08:00:00+00', updated_at: '2026-08-10 12:30:00+00' },
  { id: 2, name: 'Mast Mount', brand_name: 'SailTell', description: 'Lågprofilsfäste för montering av SailTell Compass One på mast.', details: ['Snabbfäste för Compass One', 'Passar runda och profilerade master med medföljande monteringsband.'], stock: 0, created_at: '2026-05-01 08:00:00+00', updated_at: '2026-07-22 10:00:00+00' },
  { id: 3, name: 'Rail Mount', brand_name: 'SailTell', description: 'Justerbart fäste för rör, pulpits och andra runda profiler.', details: ['Passar rör med diameter 20–32 mm', 'Verktygslös vinkeljustering och snabbkoppling för Compass One.'], stock: 38, created_at: '2026-05-01 08:00:00+00', updated_at: '2026-08-02 07:15:00+00' },
  { id: 4, name: 'Deck Mount', brand_name: 'SailTell', description: 'Självhäftande lågprofilfäste för plana ytor.', details: ['Monteras med marint dubbelhäftande tejpsystem', 'Compass One klickas fast med snabbkoppling.'], stock: 67, created_at: '2026-05-20 11:00:00+00', updated_at: '2026-07-30 09:00:00+00' },
  { id: 5, name: 'Charging Dock', brand_name: 'SailTell', description: 'USB-C-laddningsdocka för SailTell Compass One.', details: ['Magnetisk dockning', 'USB-C-ingång', 'Kabel medföljer.'], stock: 43, created_at: '2026-05-01 08:00:00+00', updated_at: '2026-08-04 14:20:00+00' },
]