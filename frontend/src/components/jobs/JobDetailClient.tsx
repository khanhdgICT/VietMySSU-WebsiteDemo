'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  MapPin, DollarSign, Clock, Briefcase, Users, ArrowLeft, Send, CheckCircle2,
} from 'lucide-react';
import { jobsApi } from '@/lib/api';
import { getLocalizedField } from '@/lib/utils';

interface Job {
  id: string;
  title: string;
  titleEn?: string;
  location: string;
  salary?: string;
  jobType: string;
  description: string;
  descriptionEn?: string;
  requirements: string;
  requirementsEn?: string;
  benefits?: string;
  benefitsEn?: string;
  deadline?: string;
  quantity: number;
  status: string;
}

interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  coverLetter?: string;
}

export default function JobDetailClient({ id, locale }: { id: string; locale: string }) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ApplicationForm>();

  useEffect(() => {
    jobsApi.getBySlug(id)
      .then((res) => setJob(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data: ApplicationForm) => {
    if (!job) return;
    setSubmitting(true);
    try {
      await jobsApi.apply(job.id, data);
      setSubmitted(true);
      reset();
      toast.success(locale === 'vi' ? 'Ứng tuyển thành công!' : 'Application submitted successfully!');
    } catch {
      toast.error(locale === 'vi' ? 'Có lỗi xảy ra. Vui lòng thử lại.' : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 container-custom">
        <div className="animate-pulse max-w-4xl mx-auto space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-32 pb-20 container-custom text-center">
        <p className="text-gray-400">{locale === 'vi' ? 'Không tìm thấy vị trí.' : 'Job not found.'}</p>
      </div>
    );
  }

  const title = getLocalizedField(job, 'title', locale);
  const description = getLocalizedField(job, 'description', locale);
  const requirements = getLocalizedField(job, 'requirements', locale);
  const benefits = getLocalizedField(job, 'benefits', locale);

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href={`/${locale}/jobs`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--primary)] mb-8 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            {locale === 'vi' ? 'Quay lại tuyển dụng' : 'Back to careers'}
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-red-400" />{job.location}</span>
                  {job.salary && <span className="flex items-center gap-1"><DollarSign size={14} className="text-green-500" />{job.salary}</span>}
                  <span className="flex items-center gap-1"><Users size={14} className="text-blue-400" />{job.quantity} {locale === 'vi' ? 'vị trí' : 'positions'}</span>
                  {job.deadline && <span className="flex items-center gap-1"><Clock size={14} className="text-orange-400" />{new Date(job.deadline).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">{locale === 'vi' ? 'Mô tả công việc' : 'Job Description'}</h2>
                <div className="prose-content" dangerouslySetInnerHTML={{ __html: description }} />
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">{locale === 'vi' ? 'Yêu cầu' : 'Requirements'}</h2>
                <div className="prose-content" dangerouslySetInnerHTML={{ __html: requirements }} />
              </div>

              {/* Benefits */}
              {benefits && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">{locale === 'vi' ? 'Quyền lợi' : 'Benefits'}</h2>
                  <div className="prose-content" dangerouslySetInnerHTML={{ __html: benefits }} />
                </div>
              )}
            </div>

            {/* Application Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
                <h3 className="text-lg font-bold text-gray-800 mb-5">
                  {locale === 'vi' ? 'Ứng tuyển ngay' : 'Apply Now'}
                </h3>

                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
                    <p className="font-semibold text-gray-700">
                      {locale === 'vi' ? 'Đã gửi hồ sơ thành công!' : 'Application submitted!'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {locale === 'vi' ? 'Chúng tôi sẽ liên hệ sớm.' : 'We will contact you soon.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        {locale === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                      </label>
                      <input
                        {...register('fullName', { required: true })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={locale === 'vi' ? 'Nhập họ và tên' : 'Enter full name'}
                      />
                      {errors.fullName && <span className="text-red-500 text-xs mt-1">{locale === 'vi' ? 'Bắt buộc' : 'Required'}</span>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                      <input
                        {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                        type="email"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@example.com"
                      />
                      {errors.email && <span className="text-red-500 text-xs mt-1">{locale === 'vi' ? 'Email không hợp lệ' : 'Invalid email'}</span>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        {locale === 'vi' ? 'Số điện thoại *' : 'Phone *'}
                      </label>
                      <input
                        {...register('phone', { required: true })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0912 345 678"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        {locale === 'vi' ? 'Thư giới thiệu' : 'Cover Letter'}
                      </label>
                      <textarea
                        {...register('coverLetter')}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder={locale === 'vi' ? 'Giới thiệu bản thân...' : 'Introduce yourself...'}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] text-white font-semibold py-3 rounded-xl hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-60"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          {locale === 'vi' ? 'Gửi hồ sơ' : 'Submit Application'}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
