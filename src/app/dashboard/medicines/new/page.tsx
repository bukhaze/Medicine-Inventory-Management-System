import { createMedicine } from '../actions'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function NewMedicinePage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const supabase = await createClient()

  const { data: categories } = await supabase.from('categories').select('*').order('name')
  const { data: suppliers } = await supabase.from('suppliers').select('*').order('name')

  const params = await searchParams;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Add New Medicine
          </h2>
        </div>
      </div>

      <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 border-b border-gray-900/10 pb-12">
            
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Medicine Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="dosage" className="block text-sm font-medium leading-6 text-gray-900">
                Dosage (e.g. 500mg)
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="dosage"
                  id="dosage"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category_id" className="block text-sm font-medium leading-6 text-gray-900">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="category_id"
                  name="category_id"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="supplier_id" className="block text-sm font-medium leading-6 text-gray-900">
                Supplier <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="supplier_id"
                  name="supplier_id"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select a supplier</option>
                  {suppliers?.map((sup) => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
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

            <div className="sm:col-span-2">
              <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">
                Initial Quantity <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  required
                  min="0"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="buying_price" className="block text-sm font-medium leading-6 text-gray-900">
                Buying Price
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="buying_price"
                  id="buying_price"
                  step="0.01"
                  min="0"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="selling_price" className="block text-sm font-medium leading-6 text-gray-900">
                Selling Price
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="selling_price"
                  id="selling_price"
                  step="0.01"
                  min="0"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="min_stock" className="block text-sm font-medium leading-6 text-gray-900">
                Min Stock Level <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 text-gray-500 text-xs mb-1">Alert when stock falls below</div>
              <input
                type="number"
                name="min_stock"
                id="min_stock"
                required
                min="0"
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Description / Notes
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
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
          <Link href="/dashboard/medicines" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </Link>
          <button
            formAction={createMedicine}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Save Medicine
          </button>
        </div>
      </form>
    </div>
  )
}
