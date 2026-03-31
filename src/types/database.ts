export type Category = {
  id: string
  name: string
  description?: string
  created_at: string
}

export type Supplier = {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  created_at: string
}

export type Medicine = {
  id: string
  name: string
  category_id: string
  supplier_id: string
  batch_number: string
  dosage: string
  expiry_date: string
  quantity: number
  buying_price: number
  selling_price: number
  min_stock: number
  description?: string
  created_at: string
  categories?: Category
  suppliers?: Supplier
}

export type StockIn = {
  id: string
  medicine_id: string
  supplier_id: string
  quantity: number
  batch_number: string
  expiry_date: string
  date: string
  notes?: string
  created_at: string
}

export type StockOut = {
  id: string
  medicine_id: string
  quantity: number
  date: string
  reason: string
  notes?: string
  created_at: string
}
