'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Pill, 
  Tags, 
  Users, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  Bell,
  FileBarChart
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Medicines', href: '/dashboard/medicines', icon: Pill },
  { name: 'Categories', href: '/dashboard/categories', icon: Tags },
  { name: 'Suppliers', href: '/dashboard/suppliers', icon: Users },
  { name: 'Stock In', href: '/dashboard/stock-in', icon: ArrowDownToLine },
  { name: 'Stock Out', href: '/dashboard/stock-out', icon: ArrowUpFromLine },
  { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
  { name: 'Reports', href: '/dashboard/reports', icon: FileBarChart },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      <div className="flex shrink-0 items-center mt-6">
        <div className="text-xl font-bold tracking-tight text-blue-600">MedInventory</div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-2 mt-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
