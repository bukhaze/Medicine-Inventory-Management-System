'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createSupplier(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
  }

  const { error } = await supabase.from('suppliers').insert([data])

  if (error) {
    return redirect('/dashboard/suppliers/new?message=Failed to create supplier')
  }

  revalidatePath('/dashboard/suppliers')
  redirect('/dashboard/suppliers')
}
