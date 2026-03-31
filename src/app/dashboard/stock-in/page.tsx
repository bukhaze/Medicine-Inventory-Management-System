import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { StockIn } from '@/types/database'

export default async function StockInPage() {
  const supabase = await createClient()

  // Select stock in records with related medicine and supplier names
  const { data, error } = await supabase
    .from('stock_in')
    .select(`
      *,
      medicines ( name ),
      suppliers ( name )
    `)
    .order('created_at', { ascending: false })

  const stockIns = data || []

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Stock In Records</h1>
          <p className="mt-2 text-sm text-gray-700">
            A history of all stock additions. Adding a record here automatically increases the medicine's available quantity.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/dashboard/stock-in/new"
            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add Stock
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
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Medicine
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Supplier
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Added Qty
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Batch
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {error && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-red-500 text-sm">
                        Database error: {error.message}
                      </td>
                    </tr>
                  )}
                  {stockIns.length === 0 && !error ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500 text-sm py-8">
                        No stock records found. Click "Add Stock" to receive inventory.
                      </td>
                    </tr>
                  ) : (
                    stockIns.map((record: any) => (
                      <tr key={record.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {new Date(record.date || record.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                          {record.medicines?.name || 'Unknown'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {record.suppliers?.name || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-green-600">
                          +{record.quantity}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {record.batch_number}
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
