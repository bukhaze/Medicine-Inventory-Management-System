import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function StockOutPage() {
  const supabase = await createClient()

  // Select stock out records with related medicine names
  const { data, error } = await supabase
    .from('stock_out')
    .select(`
      *,
      medicines ( name )
    `)
    .order('created_at', { ascending: false })

  const stockOuts = data || []

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Stock Out Records</h1>
          <p className="mt-2 text-sm text-gray-700">
            A history of all inventory removals (sales, dispensations, expirations, or damage). Adding a record automatically decreases available quantity.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/dashboard/stock-out/new"
            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-4 w-4" />
            Issue Stock
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
                      Reason
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Removed Qty
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Notes
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
                  {stockOuts.length === 0 && !error ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500 text-sm py-8">
                        No stock out records found. Click "Issue Stock" to dispense inventory.
                      </td>
                    </tr>
                  ) : (
                    stockOuts.map((record: any) => (
                      <tr key={record.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {new Date(record.date || record.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                          {record.medicines?.name || 'Unknown'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                            {record.reason}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-red-600">
                          -{record.quantity}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {record.notes || '-'}
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
