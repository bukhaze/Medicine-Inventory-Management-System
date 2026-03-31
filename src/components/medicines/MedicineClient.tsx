'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, Plus, AlertCircle, Calendar, DollarSign, Package } from 'lucide-react'

interface MedicineWithDetails {
  id: string
  name: string
  dosage: string | null
  batch_number: string
  expiry_date: string
  quantity: number
  min_stock: number
  buying_price: number
  selling_price: number
  categories: { name: string } | null
  suppliers: { name: string } | null
}

interface MedicineClientProps {
  medicines: MedicineWithDetails[]
}

export default function MedicineClient({ medicines }: MedicineClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'low_stock' | 'expired'>('all')

  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      const matchesSearch = 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.categories?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.suppliers?.name.toLowerCase().includes(searchTerm.toLowerCase())

      const isLowStock = med.quantity <= med.min_stock
      const isExpired = new Date(med.expiry_date) < new Date()

      if (statusFilter === 'low_stock') return matchesSearch && isLowStock
      if (statusFilter === 'expired') return matchesSearch && isExpired
      return matchesSearch
    })
  }, [medicines, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-400"
            placeholder="Search name, batch, category, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
          >
            All Medicines
          </button>
          <button
            onClick={() => setStatusFilter('low_stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${statusFilter === 'low_stock' ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100'}`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Low Stock
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${statusFilter === 'expired' ? 'bg-rose-500 text-white shadow-sm' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100'}`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Expired
          </button>
        </div>
      </div>

      {/* Table Results */}
      <div className="overflow-hidden bg-white shadow-sm border border-gray-100 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Medicine Information</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Logistics</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Financials</th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((med) => {
                  const isLowStock = med.quantity <= med.min_stock
                  const isOutOfStock = med.quantity === 0
                  const isExpired = new Date(med.expiry_date) < new Date()
                  
                  return (
                    <tr key={med.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${isExpired ? 'bg-rose-50' : 'bg-blue-50'}`}>
                            <Package className={`h-5 w-5 ${isExpired ? 'text-rose-500' : 'text-blue-500'}`} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{med.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 border border-gray-200">{med.dosage || 'No Dosage'}</span>
                              <span>•</span>
                              <span>{med.categories?.name || 'Uncategorized'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{med.quantity}</span>
                            <span className="text-xs text-gray-400">units</span>
                          </div>
                          {isOutOfStock ? (
                            <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-inset ring-rose-600/20 uppercase mt-1">Out of Stock</span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20 uppercase mt-1">Low Stock (Min: {med.min_stock})</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 uppercase mt-1">Healthy Stock</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span className={isExpired ? 'text-rose-600 font-bold underline decoration-rose-300 underline-offset-2' : ''}>
                              {new Date(med.expiry_date).toLocaleDateString()} {isExpired && '(EXPIRED)'}
                            </span>
                          </div>
                          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Batch: {med.batch_number}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">Buy / Sell</span>
                            <div className="flex items-center text-xs font-bold text-gray-700">
                              <span className="text-blue-600 font-black">${med.buying_price}</span>
                              <span className="mx-1 text-gray-300">/</span>
                              <span className="text-emerald-600 font-black">${med.selling_price}</span>
                            </div>
                          </div>
                          <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">Inventory Value</span>
                            <span className="text-xs font-black text-gray-900">${(med.quantity * med.buying_price).toLocaleString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          href={`/dashboard/stock-in/new?medicineId=${med.id}`} 
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 transition-all hover:bg-blue-100"
                        >
                          <Plus className="h-3 w-3" />
                          Restock
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-gray-100 rounded-full mb-3">
                        <Filter className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">No medicines found</p>
                      <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
                      <Link 
                        href="/dashboard/medicines/new"
                        className="mt-4 text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline"
                      >
                        + Add Your First Medicine
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Statistics Bar - Bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Unique Medicines</p>
             <p className="text-xl font-black text-gray-900">{filteredMedicines.length}</p>
           </div>
           <Package className="h-8 w-8 text-blue-100" />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Critical Alerts</p>
             <p className="text-xl font-black text-rose-600">{filteredMedicines.filter(m => m.quantity <= m.min_stock || new Date(m.expiry_date) < new Date()).length}</p>
           </div>
           <AlertCircle className="h-8 w-8 text-rose-100" />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Est. Stock Value</p>
             <p className="text-xl font-black text-emerald-600">${filteredMedicines.reduce((acc, curr) => acc + (curr.quantity * curr.buying_price), 0).toLocaleString()}</p>
           </div>
           <DollarSign className="h-8 w-8 text-emerald-100" />
        </div>
      </div>
    </div>
  )
}
