import { createClient } from '@/utils/supabase/server'
import { createStockIn } from '../actions'
import Link from 'next/link'

export default async function NewStockInPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const supabase = await createClient()

  const { data: medicines } = await supabase.from('medicines').select('id, name').order('name')
  const { data: suppliers } = await supabase.from('suppliers').select('id, name').order('name')

  const params = await searchParams

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Receive Stock (Stock In)
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Adding stock will logically increase the total medicine quantity in your inventory.
          </p>
        </div>
      </div>

      <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10 pb-12">
            
            <div className="sm:col-span-3">
              <label htmlFor="medicine_id" className="block text-sm font-medium leading-6 text-gray-900">
                Medicine <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="medicine_id"
                  name="medicine_id"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select a medicine...</option>
                  {medicines?.map((med) => (
                    <option key={med.id} value={med.id}>{med.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="supplier_id" className="block text-sm font-medium leading-6 text-gray-900">
                Supplier
              </label>
              <div className="mt-2">
                <select
                  id="supplier_id"
                  name="supplier_id"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select a supplier (optional)</option>
                  {suppliers?.map((sup) => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">
                Quantity Added <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  required
                  min="1"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="batch_number" className="block text-sm font-medium leading-6 text-gray-900">
                Batch Number <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="batch_number"
                  id="batch_number"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="expiry_date" className="block text-sm font-medium leading-6 text-gray-900">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="expiry_date"
                  id="expiry_date"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                Receive Date <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]} // Default to today
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                Notes
              </label>
              <div className="mt-2">
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        {params?.message && (
          <div className="px-4 py-3 text-sm text-red-500 bg-red-50 mx-4 rounded border border-red-200">
            {params.message}
          </div>
        )}

        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 bg-gray-50 rounded-b-xl">
          <Link href="/dashboard/stock-in" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </Link>
          <button
            formAction={createStockIn}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Receive Stock
          </button>
        </div>
      </form>
    </div>
  )
}
