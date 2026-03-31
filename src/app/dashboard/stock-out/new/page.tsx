import { createClient } from '@/utils/supabase/server'
import { createStockOut } from '../actions'
import Link from 'next/link'

export default async function NewStockOutPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const supabase = await createClient()

  // Select only medicines with quantity > 0 for standard stock out selection 
  // though we could show all, it's better UX to show all with their current stock 
  const { data: medicines } = await supabase.from('medicines').select('id, name, quantity').order('name')

  const params = await searchParams

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Issue Stock (Stock Out)
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Issuing stock will logically decrease the total medicine quantity in your inventory.
            You cannot issue more stock than what is currently available.
          </p>
        </div>
      </div>

      <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10 pb-12">
            
            <div className="col-span-full">
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
                    <option key={med.id} value={med.id} disabled={med.quantity <= 0}>
                      {med.name} (Available: {med.quantity}) {med.quantity <= 0 ? '- OUT OF STOCK' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">
                Quantity Removed <span className="text-red-500">*</span>
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

            <div className="sm:col-span-4">
              <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">
                Reason / Type <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 text-gray-500 text-xs mb-1">e.g. Sales, Used in Clinic, Expired, Damaged</div>
              <select
                id="reason"
                name="reason"
                required
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value="Sale / Dispensed">Sale / Dispensed</option>
                <option value="Clinic Usage">Clinic Usage</option>
                <option value="Expired">Expired</option>
                <option value="Damaged / Lost">Damaged / Lost</option>
                <option value="Adjustment">Inventory Adjustment</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                Notes / Patient ID / Prescription Reference
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
          <div className="px-4 py-3 text-sm font-medium text-red-800 bg-red-100 mx-4 rounded-md border border-red-200">
            ⚠ {params.message}
          </div>
        )}

        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8 bg-gray-50 rounded-b-xl">
          <Link href="/dashboard/stock-out" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </Link>
          <button
            formAction={createStockOut}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Confirm Issue
          </button>
        </div>
      </form>
    </div>
  )
}
