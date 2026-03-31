'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartDataProps {
  data: {
    categoryName: string
    inventoryCost: number
    retailValue: number
  }[]
}

export default function ValuationChart({ data }: ChartDataProps) {
  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-500 py-10 text-center">No valuation data available. Add medicines and categories to see charts.</div>
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="categoryName" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 13}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 13}} tickFormatter={(value) => `$${value}`} />
          <Tooltip 
            cursor={{fill: '#F3F4F6'}} 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar name="Total Cost" dataKey="inventoryCost" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Bar name="Retail Value" dataKey="retailValue" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
