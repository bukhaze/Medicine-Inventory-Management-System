'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function quickDispose(medicineId: string, quantity: number) {
  const supabase = await createClient()

  const { data: med } = await supabase
    .from('medicines')
    .select('name')
    .eq('id', medicineId)
    .single()

  // 1. Log the stock out
  const { error: stockOutError } = await supabase.from('stock_out').insert({
    medicine_id: medicineId,
    quantity,
    reason: 'Quick Disposal (Expired/Damaged)',
    date: new Date().toISOString()
  })

  if (stockOutError) throw new Error(stockOutError.message)

  // 2. Reduce the inventory to 0 (since it's a disposal of the batch)
  const { error: updateError } = await supabase
    .from('medicines')
    .update({ quantity: 0 })
    .eq('id', medicineId)

  if (updateError) throw new Error(updateError.message)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/alerts')
  return { success: true }
}
