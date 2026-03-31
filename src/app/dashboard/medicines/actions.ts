'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMedicine(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    category_id: formData.get('category_id') as string,
    supplier_id: formData.get('supplier_id') as string,
    batch_number: formData.get('batch_number') as string,
    dosage: formData.get('dosage') as string,
    expiry_date: formData.get('expiry_date') as string,
    quantity: parseInt(formData.get('quantity') as string),
    buying_price: parseFloat(formData.get('buying_price') as string),
    selling_price: parseFloat(formData.get('selling_price') as string),
    min_stock: parseInt(formData.get('min_stock') as string),
    description: formData.get('description') as string,
  }

  const { error } = await supabase.from('medicines').insert([data])

  if (error) {
    return redirect('/dashboard/medicines/new?message=Failed to create medicine')
  }

  revalidatePath('/dashboard/medicines')
  redirect('/dashboard/medicines')
}
