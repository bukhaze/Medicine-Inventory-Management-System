'use client'

import React from 'react'
import { Printer, Download, Share2 } from 'lucide-react'

export default function ReportActions() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex items-center gap-3 no-print">
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
      >
        <Printer className="h-4 w-4 text-gray-400" />
        Print PDF Report
      </button>
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-300 shadow-sm border border-gray-100 cursor-not-allowed"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </button>
    </div>
  )
}
