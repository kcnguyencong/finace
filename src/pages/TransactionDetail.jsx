import React, { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function TransactionDetail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')
  
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showIncomeInput, setShowIncomeInput] = useState(false)

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  if (loading) {
    return <div className="min-h-screen bg-surface p-8 text-center text-on-surface">Đang tải...</div>
  }

  if (!transaction) {
    return <div className="min-h-screen bg-surface p-8 text-center text-on-surface">Không tìm thấy giao dịch.</div>
  }

  const isIncome = transaction.type === 'income'

  return (
    <div className="text-on-background min-h-screen pb-24 bg-surface">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-outline-variant/20 px-container-padding py-md flex items-center justify-between">
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
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] text-center space-y-2">
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
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm font-label-sm ${isIncome ? 'bg-secondary-container/30 text-secondary' : 'bg-error-container text-on-error-container'}`}>
            {isIncome ? 'Thu nhập' : 'Chi tiêu'}
          </div>
        </section>

        {/* Metadata Section */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="divide-y divide-outline-variant/30">
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
                {new Date(transaction.transaction_date).toLocaleString('vi-VN')}
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
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/30 px-container-padding py-4 flex gap-4">
        <button className="flex-1 py-3 bg-surface-container-high text-on-surface font-semibold rounded-xl text-body-md transition-transform active:scale-95">Sửa</button>
        <button onClick={handleDelete} className="flex-1 py-3 bg-error text-on-error font-semibold rounded-xl text-body-md transition-transform active:scale-95">Xóa</button>
      </div>
    </div>
  )
}
