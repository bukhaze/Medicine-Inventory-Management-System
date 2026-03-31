import { login } from './actions'
import { Pill, ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex text-gray-900 font-sans selection:bg-blue-100 italic-none">
      {/* Left Decoration Side (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
         <div 
           className="absolute inset-0 grayscale opacity-40 mix-blend-overlay scale-110 animate-pulse duration-[8000ms]"
           style={{ 
             backgroundImage: 'url("/medical_auth_bg.png")', 
             backgroundSize: 'cover',
             backgroundPosition: 'center' 
           }}
         />
         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-black/60" />
         
         <div className="relative z-10 p-24 flex flex-col justify-between h-full">
            <div>
               <div className="flex items-center gap-3 mb-12">
                  <div className="p-2 bg-blue-500 rounded-xl">
                     <Pill className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tight text-white uppercase">MedInventory <span className="text-blue-400">Pro</span></span>
               </div>
               <h2 className="text-6xl font-black text-white leading-none uppercase tracking-tighter mb-8">
                  The Gold <br/> Standard of <br/> <span className="text-blue-400 font-black italic">Logistics</span>.
               </h2>
               <p className="text-white/60 text-lg max-w-sm font-medium leading-relaxed">
                  Join the elite network of pharmacies managing live inventory with precision analytics and cloud-edge security.
               </p>
            </div>

            <div className="flex items-center gap-4 border-t border-white/10 pt-12">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center">
                       <ShieldCheck className="h-5 w-5 text-blue-400" />
                    </div>
                  ))}
               </div>
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure by Global Compliance Labs</p>
            </div>
         </div>
      </div>

      {/* Right Login Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white md:bg-gray-50/30">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-12 justify-center">
              <div className="p-2 bg-blue-600 rounded-xl">
                 <Pill className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 uppercase">MedInventory <span className="text-blue-600">Pro</span></span>
          </Link>

          <div className="text-left mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full mb-6">
               <Sparkles className="h-3 w-3 text-blue-600" />
               <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest leading-none">Access Console V2.4</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-none mb-3 uppercase">
              Authentication
            </h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">
              Identify yourself to enter the inventory command center.
            </p>
          </div>

          <form className="space-y-6">
            <div className="group">
              <label
                htmlFor="email"
                className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-blue-600"
              >
                Operator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@medinventory.com"
                  className="block w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all outline-none"
                />
              </div>
            </div>

            <div className="group">
              <label
                htmlFor="password"
                className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-blue-600"
              >
                Encrypted Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-gray-900 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all outline-none"
                />
              </div>
            </div>

            {params?.message && (
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100 animate-in shake duration-500">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {params.message}
              </div>
            )}

            <div className="pt-4">
              <button
                formAction={login}
                className="group relative w-full flex items-center justify-center rounded-2xl bg-gray-900 px-6 py-5 text-sm font-black uppercase tracking-widest text-white shadow-2xl shadow-gray-950/20 hover:bg-gray-800 hover:-translate-y-1 transition-all active:scale-95"
              >
                Establish Connection
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Protected by Cloud-Edge Guard Architecture
          </p>
        </div>
      </div>
    </div>
  )
}
