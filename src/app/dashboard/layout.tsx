import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col lg:pl-72 w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
