'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createStockOut(formData: FormData) {
  const supabase = await createClient()

  const medicine_id = formData.get('medicine_id') as string
  const quantity = parseInt(formData.get('quantity') as string)
  
  // 1. Fetch current medicine quantity to validate sufficient stock
  const { data: medicine, error: medError } = await supabase
    .from('medicines')
    .select('quantity, name')
    .eq('id', medicine_id)
    .single()

  if (medError || !medicine) {
    return redirect('/dashboard/stock-out/new?message=Medicine not found')
  }

  // Validation rule: Prevent stock-out if quantity is insufficient
  if (medicine.quantity < quantity) {
    return redirect(`/dashboard/stock-out/new?message=Insufficient stock for ${medicine.name}. Available: ${medicine.quantity}`)
  }

  const data = {
    medicine_id,
    quantity,
    reason: formData.get('reason') as string,
    date: formData.get('date') as string || new Date().toISOString(),
    notes: formData.get('notes') as string,
  }

  // 2. Insert Stock Out Record
  const { error: insertError } = await supabase.from('stock_out').insert([data])

  if (insertError) {
    return redirect('/dashboard/stock-out/new?message=Failed to create stock out record')
  }

  // 3. Update medicine total quantity (Reduction)
  await supabase
    .from('medicines')
    .update({ quantity: Number(medicine.quantity) - quantity })
    .eq('id', medicine_id)

  revalidatePath('/dashboard/stock-out')
  revalidatePath('/dashboard/medicines')
  revalidatePath('/dashboard')
  redirect('/dashboard/stock-out')
}
