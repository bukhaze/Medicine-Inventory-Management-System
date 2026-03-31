import { createClient } from '@/utils/supabase/server'
import { Activity, DollarSign, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import ValuationChart from '@/components/charts/ValuationChart'

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

  // 2. Fetch Stock Movements (Basic aggregation for this month)
  const currentMonthDate = new Date()
  currentMonthDate.setDate(1) // Start of month
  const firstDayOfMonthStr = currentMonthDate.toISOString()

  // Count stock ins this month
  const { data: monthlyStockIn } = await supabase
    .from('stock_in')
    .select('quantity')
    .gte('date', firstDayOfMonthStr)

  let monthlyInQuantity = 0
  monthlyStockIn?.forEach((record) => {
    monthlyInQuantity += Number(record.quantity)
  })

  // Count stock outs this month
  const { data: monthlyStockOut } = await supabase
    .from('stock_out')
    .select('quantity, reason')
    .gte('date', firstDayOfMonthStr)

  let monthlyOutQuantity = 0
  let monthlySalesQuantity = 0
  monthlyStockOut?.forEach((record) => {
    monthlyOutQuantity += Number(record.quantity)
    if (record.reason.toLowerCase().includes('sale') || record.reason.toLowerCase().includes('dispensed')) {
      monthlySalesQuantity += Number(record.quantity)
    }
  })

  return (
    <div>
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Inventory Reports</h1>
          <p className="mt-2 text-sm text-gray-700">
            A high-level view of your pharmacy's financial valuation and monthly stock movements.
          </p>
        </div>
      </div>

      {/* Financial Valuation Cards */}
      <h2 className="text-lg font-medium text-gray-900 mb-4">Financial Valuation</h2>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-8">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-100 flex items-center">
          <div className="p-3 bg-blue-50 rounded-lg mr-4">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <dt className="truncate text-sm font-medium text-gray-500">Total Inventory Cost (Buying Price)</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">${totalInventoryCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-emerald-50 border-t-4 border-t-emerald-500 flex items-center">
          <div className="p-3 bg-emerald-50 rounded-lg mr-4">
            <Activity className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <dt className="truncate text-sm font-medium text-gray-500">Projected Retail Value (Selling Price)</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">${totalRetailValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
            <p className="mt-1 text-xs text-gray-500">Potential Gross Profit: ${(totalRetailValue - totalInventoryCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </dl>

      {/* Valuation Chart */}
      <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6 border border-gray-100 mb-12">
        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-6 border-b pb-4">Valuation by Category</h3>
        <ValuationChart data={chartData} />
      </div>

      {/* Monthly Stock Movement */}
      <h2 className="text-lg font-medium text-gray-900 mb-4">Stock Movement (Current Month)</h2>
      <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          <div className="px-6 py-4">
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
              <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" /> Stock Received
            </div>
            <div className="text-2xl font-bold text-gray-900">{monthlyInQuantity} <span className="text-sm font-normal text-gray-500">units</span></div>
          </div>
          
          <div className="px-6 py-4">
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
              <ArrowDownRight className="h-4 w-4 mr-1 text-red-500" /> Total Stock Dispensed/Lost
            </div>
            <div className="text-2xl font-bold text-gray-900">{monthlyOutQuantity} <span className="text-sm font-normal text-gray-500">units</span></div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1 flex-col items-start">
             Overall Efficiency
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <p>Of the <strong>{monthlyOutQuantity}</strong> items removed this month, <strong>{monthlySalesQuantity}</strong> items ({monthlyOutQuantity > 0 ? Math.round((monthlySalesQuantity/monthlyOutQuantity)*100) : 0}%) were successfully sold or dispensed to patients.</p>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  )
}
