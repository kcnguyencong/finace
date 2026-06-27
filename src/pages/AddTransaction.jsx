import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { supabase } from "../lib/supabase"

// Format số có dấu chấm phân cách nghìn kiểu VN: 1000000 → "1.000.000"
function formatDisplayAmount(raw) {
  if (!raw) return ''
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// Chỉ lấy chữ số thuần, bỏ dấu chấm
function parseRawAmount(formatted) {
  return formatted.replace(/\./g, '')
}

export default function AddTransaction() {
  const navigate = useNavigate()
  const [displayAmount, setDisplayAmount] = useState('') // chuỗi hiển thị: "1.000.000"
  const [rawAmount, setRawAmount] = useState('')         // số thật: "1000000"
  const [type, setType] = useState('income')             // default: thu nhập
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const expenseCategories = ['Ăn uống', 'Mua sắm', 'Di chuyển', 'Giải trí', 'Nhà cửa', 'Hóa đơn']
  const incomeCategories = ['Lương', 'Đầu tư', 'Thưởng', 'Kinh doanh', 'Được tặng']
  const categories = type === 'expense' ? expenseCategories : incomeCategories

  function handleAmountChange(e) {
    const input = e.target.value
    // Chỉ giữ lại số
    const digits = input.replace(/[^\d]/g, '')
    setRawAmount(digits)
    setDisplayAmount(formatDisplayAmount(digits))
  }

  const handleSave = async () => {
    if (!rawAmount || !category) return alert('Vui lòng nhập số tiền và danh mục')
    try {
      setLoading(true)
      const { error } = await supabase.from('transactions').insert([
        {
          title: category,
          amount: parseFloat(rawAmount),
          type,
          category,
          transaction_date: date,
          note,
          account: 'Tài khoản mặc định'
        }
      ])
      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Error saving transaction', error)
      alert('Có lỗi xảy ra: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-on-background min-h-screen pb-24 bg-surface">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 border-b border-white/[0.06] px-container-padding py-md flex items-center justify-between">
        <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-all active:scale-95">
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </Link>
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Thêm mới giao dịch</h1>
        <div className="w-10 h-10"></div>
      </nav>

      <main className="max-w-md mx-auto mt-6 px-container-padding space-y-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.2)] border border-white/[0.04] space-y-4">

          {/* Amount Input */}
          <div className="space-y-2 text-center pb-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest">Số tiền</p>
            <div className="relative flex items-center justify-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={displayAmount}
                onChange={handleAmountChange}
                className="bg-transparent border-none text-center text-display-md font-display-md text-secondary focus:ring-0 placeholder:text-outline-variant p-0 m-0 outline-none w-full max-w-[220px]"
                placeholder="0"
                autoFocus
              />
              <span className="text-headline-lg text-secondary font-bold">đ</span>
            </div>
            {rawAmount && (
              <p className="text-label-sm text-on-surface-variant">
                = {Number(rawAmount).toLocaleString('vi-VN')} VNĐ
              </p>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Loại giao dịch</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => { setType('income'); setCategory('') }}
                  variant={type === 'income' ? 'primary' : 'ghost'}
                  className={type === 'income'
                    ? 'bg-secondary-container/30 text-secondary shadow-none hover:bg-secondary-container/40 border border-secondary/20'
                    : 'bg-surface-container text-on-surface border border-white/[0.06]'}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>trending_up</span>
                  Thu nhập
                </Button>
                <Button
                  onClick={() => { setType('expense'); setCategory('') }}
                  variant={type === 'expense' ? 'primary' : 'ghost'}
                  className={type === 'expense'
                    ? 'bg-error-container/30 text-error shadow-none hover:bg-error-container/40 border border-error/20'
                    : 'bg-surface-container text-on-surface border border-white/[0.06]'}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>trending_down</span>
                  Chi tiêu
                </Button>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Danh mục</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">category</span>
                <input
                  list="category-suggestions"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 rounded-full pl-12 pr-4 bg-surface-container text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-white/[0.06]"
                  placeholder="Nhập hoặc chọn danh mục..."
                  autoComplete="off"
                />
                <datalist id="category-suggestions">
                  {categories.map((c, i) => <option key={i} value={c} />)}
                </datalist>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Ngày giao dịch</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">calendar_today</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 rounded-full pl-12 pr-4 bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-white/[0.06]"
                />
              </div>
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Ghi chú</label>
              <div className="relative">
                <span className="absolute left-4 top-4 material-symbols-outlined text-outline">notes</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full min-h-[100px] rounded-[12px] bg-surface-container pl-12 py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none border border-white/[0.06]"
                  placeholder="Thêm ghi chú..."
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-white/[0.06] px-container-padding py-4 flex gap-4">
        <Button
          variant="primary"
          disabled={loading}
          onClick={handleSave}
          className="w-full h-14 text-[16px] rounded-xl bg-secondary text-on-secondary hover:brightness-110 shadow-lg shadow-secondary/20"
        >
          {loading ? 'Đang lưu...' : 'Lưu giao dịch'}
        </Button>
      </div>
    </div>
  )
}
