import { createClient } from '@/utils/supabase/server'
import { AlertCircle, Clock, Package, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react'
import QuickActionButtons from './QuickActionButtons'

export default async function AlertsPage() {
  const supabase = await createClient()

  const { data: allMedicines } = await supabase
    .from('medicines')
    .select('*, suppliers(name), categories(name)')
    .order('name')

  const medicines = allMedicines || []

  // 1. Low Stock Alerts
  const lowStockMedicines = medicines.filter(
    (med: any) => med.quantity <= med.min_stock
  )

  // 2. Expiry Alerts (Within 90 Days)
  const today = new Date()
  const ninetyDaysFromNow = new Date()
  ninetyDaysFromNow.setDate(today.getDate() + 90)

  const expiryAlerts = medicines.filter((med: any) => {
    const expiryDate = new Date(med.expiry_date)
    return expiryDate <= ninetyDaysFromNow
  }).sort((a: any, b: any) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="sm:flex sm:items-center justify-between gap-4 border-b pb-6">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase flex items-center gap-3">
            Intelligence Center
            <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-black text-rose-700 ring-1 ring-inset ring-rose-700/10 uppercase tracking-widest leading-none">Critical Alerts</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium font-bold uppercase tracking-tighter">
            Monitoring inventory health. Items listed require immediate attention for restocking or disposal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Low Stock Alerts Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                   <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Global Low Stock Tracking</h2>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medicines below their safety stock levels.</p>
                </div>
             </div>
             <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 uppercase tracking-widest">
                {lowStockMedicines.length} Issues Found
             </span>
          </div>
          
          <div className="overflow-hidden bg-white shadow-sm border border-gray-100 rounded-2xl">
            <table className="min-w-full divide-y divide-gray-100 table-fixed">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="py-4 pl-6 pr-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/3">Medicine & Supplier</th>
                  <th scope="col" className="px-3 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory State</th>
                  <th scope="col" className="px-3 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Minimum Safety Level</th>
                  <th scope="col" className="relative py-4 pl-3 pr-6 text-right">
                    <span className="sr-only">Quick Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lowStockMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 bg-emerald-50/20 text-center animate-in fade-in">
                       <ShieldCheck className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
                       <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest">All stock levels are optimal.</p>
                    </td>
                  </tr>
                ) : (
                  lowStockMedicines.map((med: any) => (
                    <tr key={med.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-5 pl-6 pr-3">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                               <Package className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                               <div className="text-sm font-black text-gray-900 uppercase tracking-tight">{med.name}</div>
                               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">{med.suppliers?.name || 'No Supplier'}</div>
                            </div>
                         </div>
                      </td>
                      <td className="px-3 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-rose-600 leading-none">{med.quantity} Units</span>
                          <span className="text-[9px] font-black italic text-rose-400 uppercase tracking-tighter mt-1">{med.quantity === 0 ? 'COMPLETELY VOID' : 'BELOW SAFETY LIMIT'}</span>
                        </div>
                      </td>
                      <td className="px-3 py-5 whitespace-nowrap">
                         <div className="flex items-center gap-2">
                           <ShieldCheck className="h-4 w-4 text-gray-200" />
                           <span className="text-sm font-bold text-gray-500 uppercase">{med.min_stock} UNITS</span>
                         </div>
                      </td>
                      <td className="py-5 pl-3 pr-6 text-right">
                        <QuickActionButtons type="restock" medicineId={med.id} name={med.name} currentQty={med.quantity} />
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
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 rounded-xl">
                  <Clock className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                   <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Critical Expiry Timeline</h2>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medicines expiring in the next 90 days or already expired.</p>
                </div>
             </div>
             <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700 uppercase tracking-widest">
                {expiryAlerts.length} Critical Expirations
             </span>
          </div>
          
          <div className="overflow-hidden bg-white shadow-sm border border-gray-100 rounded-2xl">
            <table className="min-w-full divide-y divide-gray-100 table-fixed">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="py-4 pl-6 pr-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-1/3">Medicine & Batch</th>
                  <th scope="col" className="px-3 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Stock</th>
                  <th scope="col" className="px-3 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry Deadline</th>
                  <th scope="col" className="relative py-4 pl-3 pr-6 text-right">
                    <span className="sr-only">Quick Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expiryAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 bg-blue-50/20 text-center animate-in fade-in">
                       <ShieldCheck className="h-10 w-10 text-blue-300 mx-auto mb-3" />
                       <p className="text-sm font-bold text-blue-700 uppercase tracking-widest">All medicines are safely within the date range.</p>
                    </td>
                  </tr>
                ) : (
                  expiryAlerts.map((med: any) => {
                    const isExpired = new Date(med.expiry_date) < today
                    return (
                      <tr key={med.id} className={`hover:bg-rose-50/30 transition-all ${isExpired ? 'bg-rose-50/10' : ''}`}>
                        <td className="py-5 pl-6 pr-3">
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isExpired ? 'bg-rose-100' : 'bg-orange-100'}`}>
                                 <AlertCircle className={`h-5 w-5 ${isExpired ? 'text-rose-600' : 'text-orange-600'}`} />
                              </div>
                              <div>
                                 <div className="text-sm font-black text-gray-900 uppercase tracking-tight">{med.name}</div>
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mt-0.5">Batch Record: {med.batch_number}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-3 py-5 whitespace-nowrap">
                           <span className="text-sm font-black text-gray-600 uppercase tracking-widest">{med.quantity} UNITS</span>
                        </td>
                        <td className="px-3 py-5 whitespace-nowrap">
                           <div className="flex flex-col">
                              <div className={`text-sm font-black ${isExpired ? 'text-rose-600' : 'text-orange-600'} leading-none`}>
                                 {new Date(med.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-widest mt-1 text-gray-400">{isExpired ? 'ILLEGAL TO SELL' : 'EXPIRING SOON'}</span>
                           </div>
                        </td>
                        <td className="py-5 pl-3 pr-6 text-right">
                           <QuickActionButtons type="dispose" medicineId={med.id} name={med.name} currentQty={med.quantity} />
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
