'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { authApi } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import 'react-toastify/dist/ReactToastify.css';

interface LoginForm {
  email: string;
  password: string;
}

interface TwoFaForm {
  code: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requiresTwoFa, setRequiresTwoFa] = useState(false);
  const [tempToken, setTempToken] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { register: register2FA, handleSubmit: handleSubmit2FA, formState: { errors: errors2FA } } = useForm<TwoFaForm>();

  const onLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      if (res.data.requiresTwoFa) {
        setRequiresTwoFa(true);
        setTempToken(res.data.tempToken);
        toast.info('Please enter your 2FA code');
      } else {
        setAuth(res.data.accessToken, res.data.refreshToken, res.data.user);
        toast.success('Login successful!');
        router.push('/admin');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const on2FA = async (data: TwoFaForm) => {
    setLoading(true);
    try {
      const res = await authApi.verify2FA(data.code);
      setAuth(res.data.accessToken, res.data.refreshToken, res.data.user);
      toast.success('Login successful!');
      router.push('/admin');
    } catch {
      toast.error('Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1a4e] to-[#0056b3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <span className="text-white font-black text-2xl">V</span>
          </div>
          <h1 className="text-2xl font-black text-white">VietMy SSU</h1>
          <p className="text-blue-300 text-sm mt-1">Admin Dashboard</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {!requiresTwoFa ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Sign In</h2>
              <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="admin@vietmy.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('password', { required: true, minLength: 6 })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-xl hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-6">
                Default: admin@vietmy.com / Admin@123
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Shield size={28} className="text-[var(--primary)]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Two-Factor Auth</h2>
                <p className="text-sm text-gray-500 mt-1">Enter the 6-digit code from your authenticator app</p>
              </div>
              <form onSubmit={handleSubmit2FA(on2FA)} className="space-y-4">
                <input
                  {...register2FA('code', { required: true, minLength: 6, maxLength: 6 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="000000"
                  maxLength={6}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-xl hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-60"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
                <button type="button" onClick={() => setRequiresTwoFa(false)} className="w-full text-sm text-gray-400 hover:text-gray-600">
                  ← Back to login
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
