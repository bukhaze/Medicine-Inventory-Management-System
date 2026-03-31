import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import MedicineClient from '@/components/medicines/MedicineClient'

export default async function MedicinesPage() {
  const supabase = await createClient()

  const { data: medicines, error } = await supabase
    .from('medicines')
    .select('*, categories(name), suppliers(name)')
    .order('name', { ascending: true })

  if (error) {
    return <div className="text-red-500 font-bold p-8 bg-red-50 rounded-xl border border-red-100">CRITICAL ERROR: Failed to fetch medicine database. Please check your connection.</div>
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="sm:flex sm:items-center justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            Medicine Inventory
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-widest">Master List</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">Manage your entire medical catalog, track stock availability, and check batch expirations in real-time.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/dashboard/medicines/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Medicine
          </Link>
        </div>
      </div>

      <MedicineClient medicines={medicines || []} />
    </div>
  )
}
