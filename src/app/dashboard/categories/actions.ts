'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('categories')
    .insert([{ name, description }])

  if (error) {
    return redirect('/dashboard/categories/new?message=Failed to create category')
  }

  revalidatePath('/dashboard/categories')
  redirect('/dashboard/categories')
}
