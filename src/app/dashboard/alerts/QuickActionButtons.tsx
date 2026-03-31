'use client'

import React, { useTransition } from 'react'
import { quickDispose } from './actions'
import { Trash2, Loader2, Link as LinkIcon, Plus } from 'lucide-react'
import Link from 'next/link'

interface QuickActionButtonsProps {
  type: 'restock' | 'dispose'
  medicineId: string
  name: string
  currentQty: number
}

export default function QuickActionButtons({ type, medicineId, name, currentQty }: QuickActionButtonsProps) {
  const [isPending, startTransition] = useTransition()

  const handleDispose = () => {
    if (confirm(`Are you sure you want to dispose of all ${currentQty} units of ${name}? This will record a 'Disposal' Stock Out.`)) {
      startTransition(async () => {
        try {
          await quickDispose(medicineId, currentQty)
        } catch (err) {
          alert('Failed to dispose medicine: ' + err)
        }
      })
    }
  }

  if (type === 'restock') {
    return (
      <Link 
        href={`/dashboard/stock-in/new?medicineId=${medicineId}`}
        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 transition-all hover:bg-blue-100 active:scale-95"
      >
        <Plus className="h-3 w-3" />
        Order Stock
      </Link>
    )
  }

  return (
    <button
      onClick={handleDispose}
      disabled={isPending || currentQty <= 0}
      className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 ${
        isPending || currentQty <= 0
          ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
          : 'bg-rose-50 text-rose-600 hover:text-rose-800 border-rose-100 hover:bg-rose-100'
      }`}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
      {isPending ? 'Processing...' : 'Disposal'}
    </button>
  )
}
