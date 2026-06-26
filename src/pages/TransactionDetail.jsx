import React, { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { formatCurrency, formatDate, formatTime } from "../lib/format"

export default function TransactionDetail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')
  
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showIncomeInput, setShowIncomeInput] = useState(false)
  
  // For linked transaction
  const [linkedAmount, setLinkedAmount] = useState('')
  const [isLinking, setIsLinking] = useState(false)

  useEffect(() => {
    if (id) {
      fetchTransaction()
    }
  }, [id])

  async function fetchTransaction() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      setTransaction(data)
    } catch (error) {
      console.error('Error fetching transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Bạn có chắc muốn xoá giao dịch này?')) return
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Có lỗi xảy ra: ' + error.message)
    }
  }

  async function handleAddLinkedIncome() {
    if (!linkedAmount || isNaN(linkedAmount) || Number(linkedAmount) <= 0) {
      return alert('Vui lòng nhập số tiền hợp lệ')
    }
    
    try {
      setIsLinking(true)
      const oppositeType = transaction.type === 'expense' ? 'income' : 'expense'
      const titlePrefix = oppositeType === 'income' ? 'Bù trừ thu nhập cho:' : 'Bù trừ chi phí cho:'
      
      const { error } = await supabase.from('transactions').insert([
        {
          title: `${titlePrefix} ${transaction.title}`,
          amount: parseFloat(linkedAmount),
          type: oppositeType,
          category: 'Bù trừ (Liên kết)',
          transaction_date: new Date().toISOString(),
          note: `Liên kết với giao dịch ID: ${transaction.id}`,
          account: transaction.account
        }
      ])
      
      if (error) throw error
      
      alert('Đã thêm khoản liên kết thành công!')
      setShowIncomeInput(false)
      setLinkedAmount('')
    } catch (error) {
      console.error('Error adding linked income:', error)
      alert('Có lỗi xảy ra: ' + error.message)
    } finally {
      setIsLinking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-secondary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-on-surface-variant text-label-sm">Đang tải...</span>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-outline text-5xl">receipt_long</span>
          <p className="text-on-surface-variant">Không tìm thấy giao dịch.</p>
          <Link to="/" className="text-secondary text-label-sm hover:underline">Quay về trang chủ</Link>
        </div>
      </div>
    )
  }

  const isIncome = transaction.type === 'income'

  return (
    <div className="text-on-background min-h-screen pb-24 bg-surface">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 border-b border-white/[0.06] px-container-padding py-md flex items-center justify-between">
        <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-all active:scale-95">
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </Link>
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Chi tiết giao dịch</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-all">
          <span className="material-symbols-outlined text-on-surface">share</span>
        </button>
      </nav>

      <main className="max-w-md mx-auto mt-6 px-container-padding space-y-6">
        {/* Transaction Summary Card */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.2)] border border-white/[0.04] text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center">
              <span className={`material-symbols-outlined text-3xl ${isIncome ? 'text-secondary' : 'text-error'}`} style={{fontVariationSettings: "'FILL' 1"}}>
                {isIncome ? 'trending_up' : 'shopping_cart'}
              </span>
            </div>
          </div>
          <p className="text-label-lg font-label-lg text-on-surface-variant">{transaction.title}</p>
          <h2 className={`text-display-md font-display-md ${isIncome ? 'text-secondary' : 'text-error'}`}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </h2>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-label-sm ${isIncome ? 'bg-secondary-container/30 text-secondary' : 'bg-error-container/30 text-error'}`}>
            {isIncome ? 'Thu nhập' : 'Chi tiêu'}
          </div>
        </section>

        {/* Metadata Section */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.2)] border border-white/[0.04] overflow-hidden">
          <div className="divide-y divide-white/[0.06]">
            {/* Category */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">category</span>
                <span className="text-body-md font-body-md text-on-surface-variant">Danh mục</span>
              </div>
              <span className="text-body-md font-body-md text-on-surface font-semibold">{transaction.category}</span>
            </div>
            {/* Time */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">schedule</span>
                <span className="text-body-md font-body-md text-on-surface-variant">Thời gian</span>
              </div>
              <span className="text-body-md font-body-md text-on-surface">
                {formatTime(transaction.transaction_date)} {formatDate(transaction.transaction_date)}
              </span>
            </div>
            {/* Account */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-outline">account_balance</span>
                <span className="text-body-md font-body-md text-on-surface-variant">Tài khoản</span>
              </div>
              <span className="text-body-md font-body-md text-on-surface">{transaction.account}</span>
            </div>
            {/* Note */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-outline">notes</span>
                <span className="text-body-md font-body-md text-on-surface-variant">Ghi chú</span>
              </div>
              <p className="text-body-md font-body-md text-on-surface pl-9 italic text-on-surface-variant/80">
                {transaction.note || 'Không có ghi chú'}
              </p>
            </div>
          </div>
        </section>

        {/* Linked Income Section */}
        <section className={`rounded-xl p-5 space-y-4 shadow-lg border ${isIncome ? 'bg-error-container/20 border-error/30' : 'bg-secondary-container/20 border-secondary/30'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-error/20' : 'bg-secondary/20'}`}>
              <span className={`material-symbols-outlined ${isIncome ? 'text-error' : 'text-secondary'}`}>add_card</span>
            </div>
            <div>
              <h3 className="text-label-lg font-label-lg text-on-surface">Thêm khoản {isIncome ? 'chi tiêu' : 'thu'} liên kết</h3>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Bù trừ cho giao dịch này</p>
            </div>
          </div>
          <div className="space-y-3">
            {!showIncomeInput ? (
              <button 
                className={`w-full py-3 border rounded-xl text-body-md font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isIncome ? 'bg-error/10 hover:bg-error/20 border-error/20 text-error' : 'bg-secondary/10 hover:bg-secondary/20 border-secondary/20 text-secondary'}`}
                onClick={() => setShowIncomeInput(true)}
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Nhập số tiền bù trừ
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <input 
                    type="number" 
                    value={linkedAmount}
                    onChange={e => setLinkedAmount(e.target.value)}
                    className="w-full bg-surface-container border border-white/[0.06] outline-none rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-secondary/50 text-headline-md font-headline-md" 
                    placeholder="Nhập số tiền..." 
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">₫</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="flex-1 py-2 text-on-surface-variant text-label-sm font-label-sm hover:text-on-surface transition-colors"
                    onClick={() => {
                      setShowIncomeInput(false)
                      setLinkedAmount('')
                    }}
                    disabled={isLinking}
                  >
                    Hủy
                  </button>
                  <button 
                    className="flex-[2] py-2 bg-secondary text-on-secondary rounded-lg text-label-sm font-bold disabled:opacity-50 hover:brightness-110 transition-all"
                    onClick={handleAddLinkedIncome}
                    disabled={isLinking}
                  >
                    {isLinking ? 'Đang lưu...' : 'Xác nhận'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-white/[0.06] px-container-padding py-4 flex gap-4">
        <button className="flex-1 py-3 bg-surface-container-high text-on-surface font-semibold rounded-xl text-body-md transition-transform active:scale-95 border border-white/[0.06]">Sửa</button>
        <button onClick={handleDelete} className="flex-1 py-3 bg-error text-on-error font-semibold rounded-xl text-body-md transition-transform active:scale-95">Xóa</button>
      </div>
    </div>
  )
}
