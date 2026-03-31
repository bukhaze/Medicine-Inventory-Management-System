'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createStockIn(formData: FormData) {
  const supabase = await createClient()

  const medicine_id = formData.get('medicine_id') as string
  const quantity = parseInt(formData.get('quantity') as string)
  
  const data = {
    medicine_id,
    supplier_id: formData.get('supplier_id') as string,
    quantity,
    batch_number: formData.get('batch_number') as string,
    expiry_date: formData.get('expiry_date') as string,
    date: formData.get('date') as string || new Date().toISOString(),
    notes: formData.get('notes') as string,
  }

  // 1. Insert Stock In Record
  const { error: insertError } = await supabase.from('stock_in').insert([data])

  if (insertError) {
    return redirect('/dashboard/stock-in/new?message=Failed to create stock record')
  }

  // 2. Fetch current medicine quantity
  const { data: medicine, error: medError } = await supabase
    .from('medicines')
    .select('quantity')
    .eq('id', medicine_id)
    .single()

  if (!medError && medicine) {
    // 3. Update medicine total quantity
    await supabase
      .from('medicines')
      .update({ quantity: Number(medicine.quantity) + quantity })
      .eq('id', medicine_id)
  }

  revalidatePath('/dashboard/stock-in')
  revalidatePath('/dashboard/medicines')
  revalidatePath('/dashboard')
  redirect('/dashboard/stock-in')
}
