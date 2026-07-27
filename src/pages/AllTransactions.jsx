import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { formatCurrency } from "../lib/format"

// Nhóm transactions theo tháng
function groupByMonth(transactions) {
  const groups = {}

  transactions.forEach((tx) => {
    const date = new Date(tx.transaction_date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

    if (!groups[key]) {
      groups[key] = { key, label, transactions: [], totalIncome: 0, totalExpense: 0 }
    }

    groups[key].transactions.push(tx)
    if (tx.type === 'income') groups[key].totalIncome += Number(tx.amount)
    else groups[key].totalExpense += Number(tx.amount)
  })

  // Sắp xếp tháng mới nhất lên trên
  return Object.values(groups).sort((a, b) => b.key.localeCompare(a.key))
}

// Icon theo category
function getCategoryIcon(tx) {
  const map = {
    'Ăn uống': 'restaurant',
    'Mua sắm': 'shopping_bag',
    'Di chuyển': 'directions_car',
    'Giải trí': 'sports_esports',
    'Nhà cửa': 'home',
    'Hóa đơn': 'receipt',
    'Lương': 'payments',
    'Đầu tư': 'trending_up',
    'Thưởng': 'star',
    'Kinh doanh': 'business_center',
    'Được tặng': 'card_giftcard',
    'Bù trừ (Liên kết)': 'link',
  }
  return map[tx.category] || (tx.type === 'income' ? 'add_circle' : 'remove_circle')
}

export default function AllTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'income' | 'expense'

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false })
      if (error) throw error
      setTransactions(data || [])
    } catch (err) {
      console.error('Error fetching transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter((t) => t.type === filter)

  const grouped = groupByMonth(filtered)

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-white/[0.06] px-container-padding py-md flex items-center gap-3">
        <Link
          to="/"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </Link>
        <div className="flex-1">
          <h1 className="text-headline-md font-headline-md text-on-surface">Tất cả giao dịch</h1>
          <p className="text-label-sm text-on-surface-variant">{transactions.length} giao dịch</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-container-padding pt-lg space-y-lg">

        {/* Tổng quan */}
        <section className="grid grid-cols-2 gap-sm">
          <div className="bg-secondary-container/20 border border-secondary/15 rounded-2xl p-4 space-y-1">
            <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">trending_up</span>
              Tổng thu
            </p>
            <p className="text-headline-md font-headline-md text-secondary">+{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-error-container/20 border border-error/15 rounded-2xl p-4 space-y-1">
            <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-error">trending_down</span>
              Tổng chi
            </p>
            <p className="text-headline-md font-headline-md text-error">-{formatCurrency(totalExpense)}</p>
          </div>
        </section>

        {/* Filter tabs */}
        <section className="flex gap-2 bg-surface-container-lowest rounded-2xl p-1">
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'income', label: 'Thu nhập' },
            { key: 'expense', label: 'Chi tiêu' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2.5 rounded-xl text-label-lg font-label-lg transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-surface-container-high text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        {/* Danh sách nhóm theo tháng */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg className="animate-spin h-8 w-8 text-secondary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-on-surface-variant text-label-sm">Đang tải...</span>
          </div>
        ) : grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-outlined text-5xl text-outline">receipt_long</span>
            <p className="text-on-surface-variant text-body-md">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {grouped.map((group) => (
              <section key={group.key} className="space-y-2">

                {/* Month header */}
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-label-lg font-label-lg text-on-surface-variant uppercase tracking-wider capitalize">
                    {group.label}
                  </h2>
                  <div className="flex items-center gap-3 text-label-sm">
                    <span className="text-secondary">+{formatCurrency(group.totalIncome)}</span>
                    <span className="text-outline-variant">·</span>
                    <span className="text-error">-{formatCurrency(group.totalExpense)}</span>
                  </div>
                </div>

                {/* Monthly net summary pill */}
                <div className={`mx-1 px-3 py-2 rounded-xl flex items-center justify-between text-label-sm ${
                  (group.totalIncome - group.totalExpense) >= 0
                    ? 'bg-secondary-container/15 border border-secondary/10'
                    : 'bg-error-container/15 border border-error/10'
                }`}>
                  <span className="text-on-surface-variant">Số dư tháng này</span>
                  <span className={`font-bold ${(group.totalIncome - group.totalExpense) >= 0 ? 'text-secondary' : 'text-error'}`}>
                    {(group.totalIncome - group.totalExpense) >= 0 ? '+' : ''}
                    {formatCurrency(group.totalIncome - group.totalExpense)}
                  </span>
                </div>

                {/* Transactions in month */}
                <div className="bg-surface-container-lowest rounded-2xl border border-white/[0.04] overflow-hidden shadow-[0px_2px_12px_rgba(0,0,0,0.15)]">
                  {group.transactions.map((tx, idx) => (
                    <Link
                      to={`/transaction?id=${tx.id}`}
                      key={tx.id}
                      className={`flex items-center gap-3 px-4 py-3.5 group hover:bg-surface-container-low active:scale-[0.99] transition-all cursor-pointer ${
                        idx !== group.transactions.length - 1 ? 'border-b border-white/[0.04]' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tx.type === 'income'
                          ? 'bg-secondary-container/25 text-secondary'
                          : 'bg-error-container/25 text-error'
                      }`}>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {getCategoryIcon(tx)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-label-lg font-label-lg text-on-surface truncate">{tx.title}</p>
                        <p className="text-label-sm text-on-surface-variant">{tx.category}</p>
                      </div>

                      {/* Amount + date */}
                      <div className="text-right flex-shrink-0">
                        <p className={`text-label-lg font-label-lg ${tx.type === 'income' ? 'text-secondary' : 'text-error'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          {new Date(tx.transaction_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </p>
                      </div>

                      <span className="material-symbols-outlined text-outline-variant text-[18px] group-hover:text-primary transition-colors">
                        chevron_right
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl border-t border-outline-variant/30 flex justify-around items-center px-4 py-2 pb-safe z-50">
        <Link to="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-secondary transition-colors transition-transform active:scale-90">
          <span className="material-symbols-outlined">home</span>
          <span className="text-label-sm font-label-sm">Trang chủ</span>
        </Link>
        <Link to="/transactions" className="flex flex-col items-center justify-center text-secondary font-bold transition-transform active:scale-90">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>receipt_long</span>
          <span className="text-label-sm font-label-sm">Giao dịch</span>
        </Link>
        <Link to="/add" className="relative -top-6">
          <button className="w-14 h-14 bg-secondary rounded-full text-on-secondary shadow-lg shadow-secondary/30 flex items-center justify-center active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </Link>
      </nav>
    </div>
  )
}
