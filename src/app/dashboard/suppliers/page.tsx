import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Supplier } from '@/types/database'

export default async function SuppliersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false })

  const suppliers: Supplier[] = data || []

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Suppliers</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all suppliers you purchase medicine from.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/dashboard/suppliers/new"
            className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            <Plus className="h-4 w-4" />
            Add Supplier
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
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Address
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {error && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-red-500 text-sm">
                        Database error: {error.message}. Please configure Supabase.
                      </td>
                    </tr>
                  )}
                  {suppliers.length === 0 && !error ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500 text-sm py-8">
                        No suppliers found. Click "Add Supplier" to get started.
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((supplier) => (
                      <tr key={supplier.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {supplier.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {supplier.phone || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {supplier.email || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {supplier.address || '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/dashboard/suppliers/${supplier.id}/edit`} className="text-blue-600 hover:text-blue-900">
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
