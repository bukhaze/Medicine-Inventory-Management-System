import { createClient } from '@/utils/supabase/server'
import { AlertCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AlertsPage() {
  const supabase = await createClient()

  // 1. Fetch Low Stock Alerts
  // A medicine is low stock if its current quantity is less than or equal to its min_stock
  // Since Supabase JS doesn't easily let us compare two columns in a single .select() without an RPC function or raw SQL,
  // we will fetch all medicines and filter them in memory.
  // In a large prod app, you would create an SQL view or RPC for this.
  const { data: allMedicines, error } = await supabase
    .from('medicines')
    .select('*, suppliers(name), categories(name)')
    .order('name')

  const medicines = allMedicines || []

  const lowStockMedicines = medicines.filter(
    (med: any) => med.quantity <= med.min_stock
  )

  // 2. Fetch Expiry Alerts
  // A medicine is expiring soon if its expiry_date is within the next 90 days, or already expired.
  const today = new Date()
  const ninetyDaysFromNow = new Date()
  ninetyDaysFromNow.setDate(today.getDate() + 90)

  const expiryAlerts = medicines.filter((med: any) => {
    const expiryDate = new Date(med.expiry_date)
    return expiryDate <= ninetyDaysFromNow
  }).sort((a: any, b: any) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())

  return (
    <div>
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">System Alerts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Monitoring inventory health. Items listed below require immediate attention for restocking or disposal.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Low Stock Alerts Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <h2 className="text-lg font-medium text-gray-900">Low Stock Alerts ({lowStockMedicines.length})</h2>
          </div>
          
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 bg-white">
              <thead className="bg-yellow-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Medicine</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Supplier</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Current Qty</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Min Required</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {lowStockMedicines.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-sm text-gray-500">All stock levels are healthy.</td></tr>
                ) : (
                  lowStockMedicines.map((med: any) => (
                    <tr key={med.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{med.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{med.suppliers?.name || 'N/A'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-red-600">{med.quantity}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{med.min_stock}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {med.quantity === 0 ? (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Out of Stock</span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Critical Low</span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link href={`/dashboard/stock-in/new`} className="text-blue-600 hover:text-blue-900">Restock<span className="sr-only">, {med.name}</span></Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Expiry Alerts Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-6 w-6 text-red-500" />
            <h2 className="text-lg font-medium text-gray-900">Expiry Alerts (Within 90 Days) ({expiryAlerts.length})</h2>
          </div>
          
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 bg-white">
              <thead className="bg-red-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Medicine</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Batch Number</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Current Qty</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {expiryAlerts.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-sm text-gray-500">No medicines expiring soon.</td></tr>
                ) : (
                  expiryAlerts.map((med: any) => {
                    const isExpired = new Date(med.expiry_date) < today
                    return (
                      <tr key={med.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{med.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{med.batch_number}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{med.quantity}</td>
                        <td className={`whitespace-nowrap px-3 py-4 text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-orange-500'}`}>
                          {new Date(med.expiry_date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {isExpired ? (
                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Expired</span>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">Expiring Soon</span>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/dashboard/stock-out/new`} className="text-red-600 hover:text-red-900">Dispose<span className="sr-only">, {med.name}</span></Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
