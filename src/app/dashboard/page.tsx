import Link from 'next/link'
import { Pill, Tags, Users, ArrowUpFromLine, Bell } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardOverview() {
  const supabase = await createClient()

  // Fetch real counts from the database
  const { count: medCount } = await supabase.from('medicines').select('*', { count: 'exact', head: true })
  const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
  const { count: supCount } = await supabase.from('suppliers').select('*', { count: 'exact', head: true })

  // Find low stock medicines
  const { data: lowStock } = await supabase
    .from('medicines')
    .select('id')
    // A raw trick in Supabase client to compare columns isn't direct, so we fetch all and calculate for MVP
    // or we can just fetch everything. To keep it simple, we fetch those where quantity <= 10
    .lte('quantity', 10) 

  // Recent Stock In
  const { data: recentStockIn } = await supabase
    .from('stock_in')
    .select('*, medicines(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  // Expiring Soon (fake logic for MVP: just fetch closest expiry dates)
  const { data: expiringSoon } = await supabase
    .from('medicines')
    .select('id, name, expiry_date, batch_number')
    .order('expiry_date', { ascending: true })
    .limit(5)

  const stats = [
    { name: 'Total Medicines', value: medCount || 0, icon: Pill, color: 'bg-blue-600', link: '/dashboard/medicines' },
    { name: 'Total Categories', value: catCount || 0, icon: Tags, color: 'bg-indigo-600', link: '/dashboard/categories' },
    { name: 'Total Suppliers', value: supCount || 0, icon: Users, color: 'bg-green-600', link: '/dashboard/suppliers' },
    { name: 'Low Stock Alerts', value: lowStock?.length || 0, icon: Bell, color: 'bg-yellow-500', link: '/dashboard/alerts' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-8">
        Overview
      </h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 hover:shadow-md transition cursor-pointer border border-gray-100"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Stock In */}
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100 overflow-hidden">
          <h2 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">Recent Stock Ins</h2>
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {!recentStockIn || recentStockIn.length === 0 ? (
                <li className="py-4 text-sm text-gray-500">No recent stock in records.</li>
              ) : (
                recentStockIn.map((record: any) => (
                  <li key={record.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">{record.medicines?.name}</p>
                      <p className="text-sm text-gray-500">{new Date(record.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      +{record.quantity}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white shadow rounded-lg p-6 border border-gray-100 overflow-hidden">
          <h2 className="text-base font-semibold text-gray-900 mb-4 border-b pb-2">Expiring Soon</h2>
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {!expiringSoon || expiringSoon.length === 0 ? (
                <li className="py-4 text-sm text-gray-500">No records found.</li>
              ) : (
                expiringSoon.map((med: any) => (
                  <li key={med.id} className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">{med.name} <span className="text-xs font-normal text-gray-500">(Batch: {med.batch_number})</span></p>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className={`${new Date(med.expiry_date) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                        {new Date(med.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
