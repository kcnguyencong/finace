import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }

    try {
      setLoading(true)
      setError('')
      const { error: authError } = await signIn(email, password)
      
      if (authError) {
        if (authError.message.includes('Invalid login')) {
          setError('Email hoặc mật khẩu không đúng')
        } else {
          setError(authError.message)
        }
        return
      }
      
      navigate('/')
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-container-padding relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] right-[10%] w-[200px] h-[200px] bg-tertiary-container/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Brand / Logo */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary-container border border-white/5 shadow-lg shadow-secondary/10 mb-2">
            <span className="material-symbols-outlined text-secondary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
          </div>
          <h1 className="text-display-md font-display-md text-on-surface tracking-tight">
            Wealth
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Quản lý tài chính cá nhân thông minh
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest/60 backdrop-blur-xl border border-white/[0.06] rounded-[24px] p-6 shadow-2xl shadow-black/30 space-y-5">
          <div className="space-y-1">
            <h2 className="text-headline-md font-headline-md text-on-surface">Đăng nhập</h2>
            <p className="text-label-sm font-label-sm text-on-surface-variant">Nhập thông tin tài khoản của bạn</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error-container/20 border border-error/20">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              <span className="text-label-sm font-label-sm text-on-error-container">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 rounded-xl pl-12 pr-4 bg-surface-container text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-white/[0.06] transition-all duration-200"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Mật khẩu</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-xl pl-12 pr-12 bg-surface-container text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-white/[0.06] transition-all duration-200"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-outline text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button type="button" className="text-label-sm font-label-sm text-secondary hover:text-secondary-fixed transition-colors">
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-xl bg-gradient-to-r from-secondary to-secondary-fixed-dim text-on-secondary font-bold text-body-lg tracking-wide shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-label-sm font-label-sm text-outline mt-8">
          Premium Minimalist Wealth • v1.0
        </p>
      </div>
    </div>
  )
}
