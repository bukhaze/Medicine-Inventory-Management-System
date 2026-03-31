import Link from 'next/link'
import { Pill, Tags, Users, Bell, TrendingUp, AlertTriangle, ArrowRight, Package, Calculator, History } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import CategoryPieChart from '@/components/charts/CategoryPieChart'

export default async function DashboardOverview() {
  const supabase = await createClient()

  // Fetch real counts from the database
  const { count: medCount } = await supabase.from('medicines').select('*', { count: 'exact', head: true })
  const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
  const { count: supCount } = await supabase.from('suppliers').select('*', { count: 'exact', head: true })

  // Find low stock medicines (where quantity <= min_stock)
  const { data: allMeds } = await supabase.from('medicines').select('quantity, min_stock, buying_price, selling_price, categories(name)')
  const lowStockCount = allMeds?.filter(m => Number(m.quantity) <= Number(m.min_stock)).length || 0

  // Calculate Value Trends
  const totalRawValue = allMeds?.reduce((acc, curr) => acc + (Number(curr.quantity) * Number(curr.buying_price)), 0) || 0
  
  // Aggregate data for Pie Chart (stock by category)
  const categorySummary: Record<string, number> = {}
  allMeds?.forEach((med: any) => {
    const catName = med.categories?.name || 'Uncategorized'
    categorySummary[catName] = (categorySummary[catName] || 0) + Number(med.quantity)
  })
  const pieData = Object.keys(categorySummary).map(name => ({
    name: name,
    value: categorySummary[name]
  })).sort((a, b) => b.value - a.value).slice(0, 5)

  // Recent Stock In
  const { data: recentStockIn } = await supabase
    .from('stock_in')
    .select('*, medicines(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  // Expiring Soon (actual logic: expire in next 90 days)
  const today = new Date()
  const ninetyDaysFromNow = new Date()
  ninetyDaysFromNow.setDate(today.getDate() + 90)
  
  const { data: expiringSoon } = await supabase
    .from('medicines')
    .select('id, name, expiry_date, batch_number')
    .lte('expiry_date', ninetyDaysFromNow.toISOString())
    .order('expiry_date', { ascending: true })
    .limit(5)

  const stats = [
    { name: 'Inventory Size', value: medCount || 0, label: 'Unique Medicines', icon: Pill, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', link: '/dashboard/medicines' },
    { name: 'Stock Shortage', value: lowStockCount, label: 'Items Below Min', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', link: '/dashboard/alerts' },
    { name: 'Vendors', value: supCount || 0, label: 'Active Suppliers', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', link: '/dashboard/suppliers' },
    { name: 'Categories', value: catCount || 0, label: 'Drug Classifications', icon: Tags, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', link: '/dashboard/categories' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">System Overview</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">Real-time snapshots of your pharmacy operations and supply chain health.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Live Database Stream</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border ${item.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">{item.name}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-gray-900">{item.value}</p>
                <p className="text-xs font-bold text-gray-500">{item.label}</p>
              </div>
            </div>
            {/* Background Accent */}
            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full ${item.bg} opacity-10 group-hover:scale-150 transition-transform duration-700`} />
          </Link>
        ))}
      </div>

      {/* Secondary Dashboard Section: Analytics & Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Category Visualization - NEW */}
        <div className="lg:col-span-1 bg-white shadow-sm rounded-2xl border border-gray-100 p-6">
           <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
             <Calculator className="h-4 w-4 text-blue-500" />
             Stock Distribution
           </h3>
           <CategoryPieChart data={pieData} />
           <div className="mt-8 pt-4 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">Net Inventory Value (Cost)</p>
              <p className="text-2xl font-black text-center text-gray-900">${totalRawValue.toLocaleString()}</p>
           </div>
        </div>

        {/* Combined Stock Tracking - NEW */}
        <div className="lg:col-span-2 space-y-8">
           {/* Recent Stock In Table */}
           <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
             <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
               <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                 <TrendingUp className="h-4 w-4 text-emerald-500" />
                 Recent Inbound Logistics
               </h2>
               <Link href="/dashboard/stock-in" className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-tighter">View Full Ledger</Link>
             </div>
             <div className="p-0">
               <ul role="list" className="divide-y divide-gray-50">
                 {!recentStockIn || recentStockIn.length === 0 ? (
                   <li className="px-6 py-10 text-center">
                     <Package className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                     <p className="text-sm text-gray-400 font-medium">No recent inward movements found.</p>
                   </li>
                 ) : (
                   recentStockIn.map((record: any) => (
                     <li key={record.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                       <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                           <span className="text-[10px] font-black text-blue-600">+{record.quantity}</span>
                         </div>
                         <div>
                           <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{record.medicines?.name}</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                         </div>
                       </div>
                       <div className="text-[10px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded">ORDER RECEIVED</div>
                     </li>
                   ))
                 )}
               </ul>
             </div>
           </div>

           {/* Expiring Soon Table */}
           <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
             <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
               <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                 <Bell className="h-4 w-4 text-rose-500" />
                 Critical Expiry Radar
               </h2>
               <div className="flex items-center gap-2 animate-pulse">
                  <div className="h-1 w-1 rounded-full bg-rose-500" />
                  <span className="text-[8px] font-bold text-rose-600 uppercase tracking-widest">Updating Radar</span>
               </div>
             </div>
             <div className="p-0">
               <ul role="list" className="divide-y divide-gray-50">
                 {!expiringSoon || expiringSoon.length === 0 ? (
                   <li className="px-6 py-10 text-center">
                     <div className="p-3 bg-emerald-50 rounded-full w-fit mx-auto mb-2">
                       <TrendingUp className="h-6 w-6 text-emerald-400" />
                     </div>
                     <p className="text-sm text-gray-400 font-medium font-bold uppercase tracking-widest">Inventory Status: Healthy</p>
                   </li>
                 ) : (
                   expiringSoon.map((med: any) => {
                     const isExpired = new Date(med.expiry_date) < new Date()
                     return (
                       <li key={med.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                         <div className="flex items-center gap-3">
                           <div className={`h-8 w-8 rounded-lg ${isExpired ? 'bg-rose-50' : 'bg-amber-50'} flex items-center justify-center`}>
                              <AlertTriangle className={`h-4 w-4 ${isExpired ? 'text-rose-500' : 'text-amber-500'}`} />
                           </div>
                           <div>
                             <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{med.name}</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Batch: {med.batch_number}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className={`text-xs font-black ${isExpired ? 'text-rose-600' : 'text-gray-900'}`}>
                             {new Date(med.expiry_date).toLocaleDateString()}
                           </p>
                           <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{isExpired ? 'EXPIRED' : 'EXPECTED EXPIRY'}</p>
                         </div>
                       </li>
                     )
                   })
                 )}
               </ul>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
