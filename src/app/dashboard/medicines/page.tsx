import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Medicine } from '@/types/database'

export default async function MedicinesPage() {
  const supabase = await createClient()

  // We should select categories and suppliers so we can display names instead of IDs
  const { data, error } = await supabase
    .from('medicines')
    .select(`
      *,
      categories ( name ),
      suppliers ( name )
    `)
    .order('created_at', { ascending: false })

  const medicines = data || []

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Medicines</h1>
          <p className="mt-2 text-sm text-gray-700">
            A complete list of medicines, showing stock levels, expiry dates, and categories.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/dashboard/medicines/new"
            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add Medicine
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name & Dosage
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Batch No
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Quantity
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Expiry
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {error && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-red-500 text-sm">
                        Database error: {error.message}. Please configure Supabase.
                      </td>
                    </tr>
                  )}
                  {medicines.length === 0 && !error ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500 text-sm py-8">
                        No medicines found. Click "Add Medicine" to get started.
                      </td>
                    </tr>
                  ) : (
                    medicines.map((medicine: any) => (
                      <tr key={medicine.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">{medicine.name}</div>
                          <div className="text-gray-500">{medicine.dosage}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {medicine.categories?.name || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {medicine.batch_number}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            medicine.quantity <= medicine.min_stock
                              ? 'bg-red-50 text-red-700 ring-red-600/10'
                              : 'bg-green-50 text-green-700 ring-green-600/20'
                          }`}>
                            {medicine.quantity}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className={`${new Date(medicine.expiry_date) < new Date() ? 'text-red-600 font-semibold' : ''}`}>
                            {new Date(medicine.expiry_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/dashboard/medicines/${medicine.id}/edit`} className="text-blue-600 hover:text-blue-900">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
