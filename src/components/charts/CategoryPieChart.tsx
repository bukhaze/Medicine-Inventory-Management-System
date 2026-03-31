'use client'

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface CategoryData {
  name: string
  value: number
}

interface CategoryPieChartProps {
  data: CategoryData[]
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const isDataEmpty = !data || data.length === 0

  if (isDataEmpty) {
    return (
      <div className="flex h-[300px] items-center justify-center text-xs text-gray-400 font-bold uppercase tracking-widest">
        No stock data found
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }} 
             formatter={(value: any) => [`${value} items`, 'Quantity']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle" 
            formatter={(value) => <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
