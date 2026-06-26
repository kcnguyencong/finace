import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { supabase } from "../lib/supabase"

export default function AddTransaction() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!amount || !category) return alert('Vui lòng nhập số tiền và danh mục')
    try {
      setLoading(true)
      const { error } = await supabase.from('transactions').insert([
        {
          title: category, // For simplicity, using category as title or could be input
          amount: parseFloat(amount),
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
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-outline-variant/20 px-container-padding py-md flex items-center justify-between">
        <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-all active:scale-95">
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </Link>
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">Thêm mới giao dịch</h1>
        <div className="w-10 h-10"></div> {/* Spacer for alignment */}
      </nav>

      <main className="max-w-md mx-auto mt-6 px-container-padding space-y-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] space-y-4">
          
          <div className="space-y-2 text-center pb-4">
            <p className="text-label-sm text-on-surface-variant uppercase">Số tiền</p>
            <div className="relative inline-flex items-center">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent border-none text-center text-display-md font-display-md text-primary focus:ring-0 placeholder:text-outline-variant p-0 m-0 outline-none" 
                placeholder="0" 
                autoFocus
              />
              <span className="text-headline-lg text-primary ml-2">đ</span>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-outline-variant/20">
            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Loại giao dịch</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => setType('income')}
                  variant={type === 'income' ? 'primary' : 'ghost'} 
                  className={type === 'income' ? 'bg-secondary-container/20 text-secondary shadow-none hover:bg-secondary-container/30' : 'bg-surface-container text-on-surface'}
                >
                  Thu nhập
                </Button>
                <Button 
                  onClick={() => setType('expense')}
                  variant={type === 'expense' ? 'primary' : 'ghost'} 
                  className={type === 'expense' ? 'bg-error-container/20 text-error shadow-none hover:bg-error-container/30' : 'bg-surface-container text-on-surface'}
                >
                  Chi tiêu
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Danh mục</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">category</span>
                <Input 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="pl-12 bg-surface-container-low" 
                  placeholder="Nhập danh mục..." 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Ngày giao dịch</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">calendar_today</span>
                <Input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-12 bg-surface-container-low" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Ghi chú</label>
              <div className="relative">
                <span className="absolute left-4 top-4 material-symbols-outlined text-outline">notes</span>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full min-h-[100px] rounded-[12px] bg-surface-container-low pl-12 py-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-secondary resize-none" 
                  placeholder="Thêm ghi chú..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/30 px-container-padding py-4 flex gap-4">
        <Button 
          variant="primary" 
          disabled={loading}
          onClick={handleSave}
          className="w-full h-14 text-[16px] rounded-xl bg-primary text-white hover:bg-primary/90"
        >
          {loading ? 'Đang lưu...' : 'Lưu giao dịch'}
        </Button>
      </div>
    </div>
  )
}
