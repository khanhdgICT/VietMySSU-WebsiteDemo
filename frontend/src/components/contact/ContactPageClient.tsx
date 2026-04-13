'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare,
} from 'lucide-react';
import { contactApi } from '@/lib/api';

interface ContactForm {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  branch: string;
}

const branches = [
  { value: 'hanoi', labelVi: 'Hà Nội', labelEn: 'Hanoi' },
  { value: 'hcm', labelVi: 'TP. Hồ Chí Minh', labelEn: 'Ho Chi Minh City' },
  { value: 'danang', labelVi: 'Đà Nẵng', labelEn: 'Da Nang' },
];

export default function ContactPageClient() {
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    defaultValues: { branch: 'hanoi' },
  });

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    try {
      await contactApi.submit(data);
      setSubmitted(true);
      reset();
      toast.success(
        locale === 'vi'
          ? 'Gửi thành công! Chúng tôi sẽ liên hệ trong 24h.'
          : 'Sent successfully! We will contact you within 24h.',
      );
    } catch {
      toast.error(locale === 'vi' ? 'Có lỗi xảy ra. Vui lòng thử lại.' : 'Error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
            {locale === 'vi' ? 'Liên hệ với chúng tôi' : 'Get in touch'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">
            {locale === 'vi' ? 'Chúng tôi luôn sẵn sàng' : 'We\'re always ready'}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {locale === 'vi'
              ? 'Hãy liên hệ với chúng tôi để được tư vấn miễn phí về giải pháp Call Center và BPO phù hợp với doanh nghiệp của bạn.'
              : 'Contact us for a free consultation on Call Center and BPO solutions suitable for your business.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-5">
            {[
              {
                icon: Phone,
                titleVi: 'Hotline',
                titleEn: 'Hotline',
                content: '1900 1234',
                sub: '24/7',
                href: 'tel:19001234',
                color: 'text-blue-500',
                bg: 'bg-blue-50',
              },
              {
                icon: Mail,
                titleVi: 'Email',
                titleEn: 'Email',
                content: 'info@vietmy.com',
                sub: locale === 'vi' ? 'Phản hồi trong 4h' : 'Response in 4h',
                href: 'mailto:info@vietmy.com',
                color: 'text-green-500',
                bg: 'bg-green-50',
              },
              {
                icon: Clock,
                titleVi: 'Giờ làm việc',
                titleEn: 'Working Hours',
                content: locale === 'vi' ? 'Thứ 2 - Thứ 7' : 'Mon - Sat',
                sub: '8:00 - 18:00',
                href: null,
                color: 'text-orange-500',
                bg: 'bg-orange-50',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <item.icon size={22} className={item.color} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                    {locale === 'vi' ? item.titleVi : item.titleEn}
                  </p>
                  {item.href ? (
                    <a href={item.href} className="font-bold text-gray-800 hover:text-[var(--primary)] transition-colors block">
                      {item.content}
                    </a>
                  ) : (
                    <p className="font-bold text-gray-800">{item.content}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Quick message */}
            <div className="bg-gradient-to-br from-[var(--primary)] to-blue-700 rounded-2xl p-6 text-white">
              <MessageSquare size={28} className="mb-3 opacity-80" />
              <h4 className="font-bold mb-2">
                {locale === 'vi' ? 'Cần hỗ trợ ngay?' : 'Need immediate support?'}
              </h4>
              <p className="text-sm text-blue-100 mb-3">
                {locale === 'vi'
                  ? 'Chat trực tiếp với chuyên gia của chúng tôi.'
                  : 'Chat directly with our specialists.'}
              </p>
              <a
                href="https://zalo.me/vietmy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Chat Zalo
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {locale === 'vi' ? 'Gửi thành công!' : 'Sent successfully!'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {locale === 'vi'
                      ? 'Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng 24 giờ.'
                      : 'We have received your request and will respond within 24 hours.'}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors"
                  >
                    {locale === 'vi' ? 'Gửi yêu cầu khác' : 'Send another request'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    {locale === 'vi' ? 'Gửi yêu cầu tư vấn' : 'Send Consultation Request'}
                  </h2>

                  {/* Branch selector */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      {locale === 'vi' ? 'Chi nhánh' : 'Branch'}
                    </label>
                    <div className="flex gap-2">
                      {branches.map((b) => (
                        <label key={b.value} className="flex-1 cursor-pointer">
                          <input {...register('branch')} type="radio" value={b.value} className="sr-only" />
                          <div className="border-2 border-gray-200 rounded-xl px-3 py-2 text-center text-sm font-medium hover:border-[var(--primary)] transition-colors has-[:checked]:border-[var(--primary)] has-[:checked]:bg-blue-50 has-[:checked]:text-[var(--primary)]">
                            {locale === 'vi' ? b.labelVi : b.labelEn}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                        {locale === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                      </label>
                      <input
                        {...register('fullName', { required: true })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder={locale === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{locale === 'vi' ? 'Bắt buộc' : 'Required'}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                        {locale === 'vi' ? 'Số điện thoại *' : 'Phone *'}
                      </label>
                      <input
                        {...register('phone', { required: true })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="0912 345 678"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">Email *</label>
                      <input
                        {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                        type="email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="email@company.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                        {locale === 'vi' ? 'Công ty' : 'Company'}
                      </label>
                      <input
                        {...register('company')}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder={locale === 'vi' ? 'Tên công ty' : 'Company name'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      {locale === 'vi' ? 'Chủ đề *' : 'Subject *'}
                    </label>
                    <select
                      {...register('subject', { required: true })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">{locale === 'vi' ? 'Chọn chủ đề' : 'Select subject'}</option>
                      <option value="inbound">{locale === 'vi' ? 'Call Center Inbound' : 'Inbound Call Center'}</option>
                      <option value="outbound">{locale === 'vi' ? 'Call Center Outbound' : 'Outbound Call Center'}</option>
                      <option value="bpo">{locale === 'vi' ? 'Dịch vụ BPO' : 'BPO Services'}</option>
                      <option value="ai">{locale === 'vi' ? 'Giải pháp AI' : 'AI Solutions'}</option>
                      <option value="other">{locale === 'vi' ? 'Khác' : 'Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      {locale === 'vi' ? 'Nội dung tin nhắn *' : 'Message *'}
                    </label>
                    <textarea
                      {...register('message', { required: true })}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      placeholder={locale === 'vi' ? 'Mô tả nhu cầu của bạn...' : 'Describe your needs...'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-60 text-base"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        {locale === 'vi' ? 'Gửi yêu cầu' : 'Send Request'}
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-400">
                    {locale === 'vi'
                      ? '🔒 Thông tin của bạn được bảo mật tuyệt đối.'
                      : '🔒 Your information is kept strictly confidential.'}
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
