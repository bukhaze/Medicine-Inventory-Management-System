'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Pill, 
  Tags, 
  Users, 
  Box, 
  ShoppingCart, 
  Bell, 
  BarChart3,
  Activity 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Medicines', href: '/dashboard/medicines', icon: Pill },
  { name: 'Categories', href: '/dashboard/categories', icon: Tags },
  { name: 'Suppliers', href: '/dashboard/suppliers', icon: Users },
  { name: 'Stock In', href: '/dashboard/stock-in', icon: Box },
  { name: 'Stock Out', href: '/dashboard/stock-out', icon: ShoppingCart },
  { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-gray-900 border-r border-gray-800">
      <div className="flex h-16 shrink-0 items-center px-6 bg-gray-950/50 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Pill className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white tracking-tight leading-none">MEDICINE</span>
            <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em]">INVENTORY</span>
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-8">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1.5">
              {navigation.map((item) => {
                const isActive = pathname === item.name || pathname.startsWith(item.href)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        group flex gap-x-3 rounded-xl p-2.5 text-sm font-bold leading-6 transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-600/10 text-blue-400 ring-1 ring-inset ring-blue-600/20' 
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'}`}
                        aria-hidden="true"
                      />
                      {item.name}
                      {isActive && (
                        <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
          
          <li className="mt-auto pt-6 border-t border-gray-800">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50 shadow-inner">
               <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 bg-emerald-500/20 rounded-md">
                   <Activity className="h-4 w-4 text-emerald-400" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">System Live</span>
               </div>
               <p className="text-[10px] text-gray-500 leading-tight">Database: <span className="text-gray-300">Supabase Cloud</span></p>
               <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Region: <span className="text-gray-300">Default (AWS)</span></p>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}
