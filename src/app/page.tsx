import Link from 'next/link'
import Image from 'next/image'
import { Pill, ShieldCheck, Zap, BarChart3, ArrowRight, ShieldIcon, CheckCircle2, LayoutDashboard } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 italic-none">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <Pill className="h-6 w-6 text-white" />
             </div>
             <span className="text-xl font-black tracking-tight text-gray-900 uppercase">MedInventory <span className="text-blue-600">Pro</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-widest">
             <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
             <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
             <a href="#analytics" className="hover:text-blue-600 transition-colors">Analytics</a>
          </div>

          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-gray-900/10 hover:bg-gray-800 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Launch System
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent rounded-full blur-3xl opacity-50 -z-10" />

         <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-6">
               <ShieldCheck className="h-4 w-4 text-blue-600" />
               <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest leading-none">Enterprise Registered - V2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 max-w-4xl mx-auto leading-[0.95] mb-8 uppercase">
               Next-Gen Medicine <br/> 
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Inventory Hub</span>
            </h1>

            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium mb-12">
               A high-performance command center for modern pharmacies. Monitor stock levels, track batch expirations, and generate financial reports with military-grade precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
               <Link 
                  href="/login" 
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
               >
                  <LayoutDashboard className="h-5 w-5" />
                  Admin Console
               </Link>
               <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-all">
                  Documentation
               </button>
            </div>

            {/* Product Preview Image */}
            <div className="relative max-w-5xl mx-auto rounded-3xl p-2 bg-gradient-to-br from-gray-200 via-gray-100 to-white shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
               <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-video relative">
                  <Image 
                    src="/pharmacy_dashboard_preview.png" 
                    alt="System Dashboard Preview" 
                    fill 
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-left">
                     <p className="text-white text-xl font-black uppercase tracking-widest mb-1">Live Analytics Matrix</p>
                     <p className="text-white/60 text-sm font-medium">Real-time data synchronization with Supabase Global Edge.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-gray-50/50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
               <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-3">Capabilities</p>
               <h2 className="text-4xl font-black text-gray-900 uppercase">Operational Excellence</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: "Smart Expiry Radar", desc: "Predictive algorithms that highlight medicines expiring within 90 days automatically.", icon: Zap },
                  { title: "Financial Valuation", desc: "Instant calculation of total inventory cost vs. projected retail profit margins.", icon: BarChart3 },
                  { title: "One-Click Disposal", desc: "Seamless workflow to mark expired or damaged items without manual form filling.", icon: CheckCircle2 }
               ].map((f) => (
                  <div key={f.title} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                     <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white duration-500">
                        <f.icon className="h-7 w-7" />
                     </div>
                     <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-4">{f.title}</h3>
                     <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Security Banner */}
      <section id="security" className="py-20 bg-gray-900 relative overflow-hidden">
         <div className="absolute top-0 right-0 h-full w-1/3 bg-blue-600/10 skew-x-12 translate-x-20" />
         <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
               <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 mb-6">
                  <ShieldIcon className="h-4 w-4 text-blue-400" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Security Architecture</span>
               </div>
               <h2 className="text-4xl font-black text-white uppercase mb-6 tracking-tight">Your Data, Protected.</h2>
               <p className="text-white/60 font-medium max-w-xl text-lg">
                  Every transaction is secured behind Supabase's military-grade authentication layer. Private keys, health records, and financial logs are encrypted end-to-end.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-2xl font-black text-white mb-1">AES-256</p>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Encryption Standard</p>
               </div>
               <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-2xl font-black text-white mb-1">99.9%</p>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">Uptime SLA</p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
               <Pill className="h-6 w-6 text-blue-600" />
               <span className="text-xl font-black tracking-tight text-gray-900 uppercase italic-none">MedInventory <span className="text-blue-600">Pro</span></span>
            </div>
            <p className="text-gray-400 text-sm font-medium">© 2026 Medical Cloud Systems Co. All rights reserved.</p>
            <div className="flex items-center justify-center gap-6 mt-6">
               <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><LayoutDashboard className="h-5 w-5" /></a>
               <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><ShieldCheck className="h-5 w-5" /></a>
               <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><Zap className="h-5 w-5" /></a>
            </div>
         </div>
      </footer>
    </div>
  )
}
