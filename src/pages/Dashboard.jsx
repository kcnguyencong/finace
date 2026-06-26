import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { formatCurrency } from "../lib/format"
import { AreaChart, Area, ResponsiveContainer } from "recharts"

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
      
      if (error) throw error
      if (data) {
        setTransactions(data)
        processChartData(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  function processChartData(data) {
    // Group by day and calculate cumulative balance
    // First, sort ascending
    const sorted = [...data].sort((a, b) => new Date(a.transaction_date) - new Date(b.transaction_date))
    let balance = 0
    const grouped = {}
    
    sorted.forEach(tx => {
      const dateStr = new Date(tx.transaction_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
      const amount = Number(tx.amount)
      if (tx.type === 'income') balance += amount
      if (tx.type === 'expense') balance -= amount
      grouped[dateStr] = balance
    })
    
    const cData = Object.keys(grouped).map(date => ({
      name: date,
      balance: grouped[date]
    }))

    // Add a default starting point if empty
    if (cData.length === 0) {
      cData.push({ name: 'Hôm nay', balance: 0 })
    }
    
    setChartData(cData)
  }

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0)
  const netTotal = totalIncome - totalExpense

  const latestTransactions = transactions.slice(0, 10)

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      {/* Top Navigation Bar */}
      <header className="bg-background sticky top-0 z-40 w-full px-container-padding py-md flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-Hmmz21EuR7jrl364jlf9Pkd6etCj2w6QxbUfgJ-0Pzz1FBDBa8gTxSCTygcwheO3G8EcSxMFCog31mITT4Lk6G7TyaGbX53WFg_21dzT1q3syVZkTYAf8_D1_c4ytk5JhsbBxgcsbTBfpfo39cJFB8vCFgkQP064xG10zocsvDTqaHBtcfMXEk-m4FmuN2WjhMrpluMPIBLIH6HoHWxPje7T3bhnFqpoMelBvwIV6U239zKtXRZzAI8YsKLpqAAB-WsMdQTaGmaw" alt="User Profile" />
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm font-label-sm text-on-surface-variant">Xin chào,</span>
            <h1 className="text-headline-md font-headline-md text-on-surface">Nguyễn Văn An</h1>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant/50 rounded-full transition-transform active:scale-95">
            <span className="material-symbols-outlined text-on-surface">search</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant/50 rounded-full relative transition-transform active:scale-95">
            <span className="material-symbols-outlined text-on-surface">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-container-padding space-y-lg py-sm">
        {/* Hero Card: Total Accumulated Balance */}
        <section className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[24px] p-lg text-white shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-md">
            <div>
              <div className="flex items-center gap-xs text-white/70 text-label-sm font-label-sm mb-xs">
                TỔNG LƯU CHUYỂN
                <span className="material-symbols-outlined text-[16px]">visibility</span>
              </div>
              <div className="text-display-md font-display-md">{netTotal > 0 ? '+' : ''}{formatCurrency(netTotal)}</div>
              <div className="text-label-sm font-label-sm text-white/50">Tổng thu - Tổng chi</div>
            </div>
          </div>

          <div className="h-24 w-full mt-lg relative">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4edea3" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4edea3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="balance" stroke="#4edea3" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid gap-sm mt-lg pt-lg border-t border-white/10 md:grid-cols-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/60 mb-xs flex items-center gap-xs">
                <span className="w-1.5 h-1.5 bg-secondary-fixed rounded-full"></span>
                Tổng thu
              </span>
              <span className="text-label-lg font-label-lg text-secondary-fixed">+{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/60 mb-xs flex items-center gap-xs">
                <span className="w-1.5 h-1.5 bg-error rounded-full"></span>
                Tổng chi
              </span>
              <span className="text-label-lg font-label-lg text-error-container">-{formatCurrency(totalExpense)}</span>
            </div>
          </div>
        </section>

        {/* Quick Action Icons */}
        <section className="flex justify-between items-start gap-xs no-scrollbar overflow-x-auto py-xs">
          <Link to="/add" className="flex flex-col items-center min-w-[72px] gap-sm cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center group-hover:bg-secondary-container/50 transition-colors">
              <span className="material-symbols-outlined">add_card</span>
            </div>
            <span className="text-[10px] font-label-sm text-center leading-tight">Thêm thu nhập</span>
          </Link>
          <Link to="/add" className="flex flex-col items-center min-w-[72px] gap-sm cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-error-container/30 text-error flex items-center justify-center group-hover:bg-error-container/50 transition-colors">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-[10px] font-label-sm text-center leading-tight">Thêm chi tiêu</span>
          </Link>
        </section>

        {/* Transactions */}
        <section className="space-y-md pb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-label-lg font-label-lg text-on-surface-variant uppercase tracking-wider">GIAO DỊCH GẦN ĐÂY</h2>
            <button className="text-label-sm font-label-sm text-tertiary flex items-center gap-xs">
              Xem tất cả <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
          <div className="space-y-sm">
            {loading ? (
              <p className="text-center text-on-surface-variant text-sm py-4">Đang tải...</p>
            ) : latestTransactions.length === 0 ? (
              <p className="text-center text-on-surface-variant text-sm py-4">Chưa có giao dịch nào.</p>
            ) : latestTransactions.map((tx) => (
              <Link to={`/transaction?id=${tx.id}`} key={tx.id} className="bg-surface-container-lowest rounded-xl p-md flex items-center justify-between shadow-[0px_2px_8px_rgba(15,23,42,0.03)] border border-outline-variant/10 group active:scale-[0.98] transition-transform cursor-pointer hover:bg-surface-container-low">
                <div className="flex items-center gap-md">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-secondary-container/20 text-secondary' : 'bg-error-container/20 text-error'}`}>
                    <span className="material-symbols-outlined">{tx.type === 'income' ? 'trending_up' : 'call_made'}</span>
                  </div>
                  <div>
                    <p className="text-label-lg font-label-lg text-on-surface">{tx.title}</p>
                    <p className="text-[12px] text-on-surface-variant">{tx.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <div className="text-right">
                    <p className={`text-label-lg font-label-lg ${tx.type === 'income' ? 'text-secondary' : 'text-error'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      {new Date(tx.transaction_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant text-[20px] group-hover:text-primary transition-colors">chevron_right</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl border-t border-outline-variant/30 flex justify-around items-center px-4 py-2 pb-safe z-50">
        <Link to="/" className="flex flex-col items-center justify-center text-primary font-bold transition-transform active:scale-90">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
          <span className="text-label-sm font-label-sm">Trang chủ</span>
        </Link>
        <Link to="/add" className="relative -top-6">
          <button className="w-14 h-14 bg-primary-container rounded-full text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </Link>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors transition-transform active:scale-90" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-label-sm font-label-sm">Cá nhân</span>
        </a>
      </nav>
    </div>
  )
}

