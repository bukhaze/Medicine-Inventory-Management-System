import { createClient } from '@/utils/supabase/server'
import { Activity, DollarSign, ArrowDownRight, ArrowUpRight, TrendingUp, BarChart3, Calculator, PiggyBank, PackageSearch } from 'lucide-react'
import ValuationChart from '@/components/charts/ValuationChart'
import ReportActions from './ReportActions'

export default async function ReportsPage() {
  const supabase = await createClient()

  // 1. Fetch total medicines for valuation by category
  const { data: medicines } = await supabase.from('medicines').select('quantity, buying_price, selling_price, categories(name)')
  
  let totalInventoryCost = 0
  let totalRetailValue = 0
  
  // Aggregate data for the Chart
  const categoryMap: Record<string, { inventoryCost: number, retailValue: number }> = {}

  medicines?.forEach((med: any) => {
    const qty = Number(med.quantity)
    const cost = Number(med.buying_price) * qty
    const retail = Number(med.selling_price) * qty
    
    totalInventoryCost += cost
    totalRetailValue += retail

    const catName = med.categories?.name || 'Uncategorized'
    if (!categoryMap[catName]) {
      categoryMap[catName] = { inventoryCost: 0, retailValue: 0 }
    }
    categoryMap[catName].inventoryCost += cost
    categoryMap[catName].retailValue += retail
  })

  // Format data for Recharts
  const chartData = Object.keys(categoryMap).map(key => ({
    categoryName: key,
    inventoryCost: categoryMap[key].inventoryCost,
    retailValue: categoryMap[key].retailValue,
  }))

  const profitSpread = totalRetailValue - totalInventoryCost
  const marginPercentage = totalRetailValue > 0 ? (profitSpread / totalRetailValue) * 100 : 0

  // 2. Fetch Stock Movements (Current month)
  const currentMonthDate = new Date()
  currentMonthDate.setDate(1)
  const firstDayOfMonthStr = currentMonthDate.toISOString()

  // Count stock ins this month
  const { data: monthlyStockIn } = await supabase
    .from('stock_in')
    .select('quantity')
    .gte('created_at', firstDayOfMonthStr) // Using created_at for more accuracy

  let monthlyInQuantity = 0
  monthlyStockIn?.forEach((record) => {
    monthlyInQuantity += Number(record.quantity)
  })

  // Count stock outs this month
  const { data: monthlyStockOut } = await supabase
    .from('stock_out')
    .select('quantity, reason')
    .gte('created_at', firstDayOfMonthStr)

  let monthlyOutQuantity = 0
  let monthlySalesQuantity = 0
  monthlyStockOut?.forEach((record) => {
    monthlyOutQuantity += Number(record.quantity)
    const reason = record.reason.toLowerCase()
    if (reason.includes('sale') || reason.includes('dispensed') || reason.includes('sold')) {
      monthlySalesQuantity += Number(record.quantity)
    }
  })

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase flex items-center gap-3">
            Financial Intelligence
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700 ring-1 ring-inset ring-emerald-700/10 uppercase tracking-widest leading-none">Pro Reporting</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium font-bold uppercase tracking-tighter">
            Executive overview of inventory capital, projected margins, and operational velocity.
          </p>
        </div>
        <ReportActions />
      </div>

      {/* Primary Financial Overview Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 transition-transform group-hover:scale-110">
                 <PiggyBank className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded">CAPITAL AT RISK</span>
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Assets (Cost Value)</p>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">${totalInventoryCost.toLocaleString()}</h2>
           <div className="absolute -right-2 -bottom-2 h-16 w-16 bg-blue-50 opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700" />
        </div>

        <div className="bg-emerald-600 rounded-2xl p-6 shadow-xl shadow-emerald-200 relative overflow-hidden group">
           <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl text-white">
                 <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black text-white/60 bg-white/10 px-2 py-1 rounded uppercase">Projected Portfolio</span>
           </div>
           <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Total Expected Revenue</p>
           <h2 className="text-3xl font-black text-white tracking-tight">${totalRetailValue.toLocaleString()}</h2>
           <div className="mt-3 flex items-center gap-2">
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white" style={{ width: `${marginPercentage}%` }} />
              </div>
              <span className="text-[10px] font-black text-white whitespace-nowrap">{Math.round(marginPercentage)}% Margin</span>
           </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
           <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gross Profit Breakdown</span>
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unrealized Net Margin</p>
              <h2 className="text-3xl font-black text-emerald-600 tracking-tight">+${profitSpread.toLocaleString()}</h2>
           </div>
           <p className="mt-3 text-[10px] italic text-gray-400 leading-tight border-t border-gray-50 pt-2 font-medium">Estimated purely on current stock levels and global price delta settings.</p>
        </div>
      </section>

      {/* Valuation Chart Section */}
      <section className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              Categorical Asset Valuation
            </h3>
            <div className="flex items-center gap-2">
               <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-500" /><span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Cost</span></div>
               <div className="flex items-center gap-1.5 ml-4"><div className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Retail</span></div>
            </div>
        </div>
        <div className="p-8">
            <ValuationChart data={chartData} />
        </div>
      </section>

      {/* Operational Velocity Section */}
      <section>
          <div className="flex items-center gap-2 mb-6">
             <div className="p-2 bg-gray-100 rounded-xl"><PackageSearch className="h-5 w-5 text-gray-500" /></div>
             <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Operational Velocity (This Month)</h3>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  <div className="p-8 hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-2 mb-4">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500 transition-transform group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Supply Chain Inbound</span>
                      </div>
                      <p className="text-4xl font-black text-gray-900 leading-none">{monthlyInQuantity}</p>
                      <p className="mt-2 text-[10px] font-bold text-gray-500 uppercase leading-none">Units Processed</p>
                  </div>

                  <div className="p-8 hover:bg-gray-50 transition-colors group border-gray-100">
                      <div className="flex items-center gap-2 mb-4 text-rose-500">
                        <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-y-[2px] group-hover:translate-x-[2px]" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational Outbound</span>
                      </div>
                      <p className="text-4xl font-black text-gray-900 leading-none">{monthlyOutQuantity}</p>
                      <p className="mt-2 text-[10px] font-bold text-gray-500 uppercase leading-none">Total Units Dispensed</p>
                  </div>

                  <div className="p-8 bg-gray-900 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                           <Activity className="h-4 w-4 text-blue-400" />
                           <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Dispense Efficiency</span>
                        </div>
                        <p className="text-4xl font-black leading-none">{monthlyOutQuantity > 0 ? Math.round((monthlySalesQuantity/monthlyOutQuantity)*100) : 0}%</p>
                        <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase leading-tight font-medium">Successfully dispensed to patients vs. total outbound movements.</p>
                      </div>
                      <Activity className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 group-hover:scale-125 transition-transform duration-1000" />
                  </div>
              </div>
          </div>
      </section>
    </div>
  )
}
