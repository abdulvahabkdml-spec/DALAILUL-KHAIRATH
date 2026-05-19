import { connectToDB } from '@/lib/db';
import { News } from '@/models/News';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  await connectToDB();
  const article = await News.findOne({ slug, isPublished: true }).lean() as any;

  if (!article) notFound();

  const formattedDate = article.date
    ? new Date(article.date).toISOString().split('T')[0]
    : null;

  return (
    <main className="min-h-screen bg-[#eff3f6] py-12 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/updates"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#005D91] text-sm font-bold uppercase tracking-widest transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Updates
          </Link>
        </div>

        {/* Article Card */}
        <article className="bg-white rounded-[20px] shadow-sm overflow-hidden border border-slate-100">
          
          {/* Featured Image */}
          {article.img && (
            <div className="relative w-full bg-slate-50/50 border-b border-slate-100 p-4 sm:p-8 flex justify-center items-center min-h-[300px]">
              <div className="relative w-full h-full flex justify-center">
                 <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Content Container */}
          <div className="p-6 sm:p-10 lg:p-12">
            
            {/* Meta Data */}
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 font-body">
              {formattedDate && (
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <span>{formattedDate}</span>
                </div>
              )}
              {article.type && (
                <span className="font-semibold text-slate-800">{article.type}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif-premium font-bold text-[#002244] leading-tight mb-6">
              {article.title}
            </h1>

            {/* Divider */}
            <div className="w-full h-px bg-slate-200 mb-8"></div>

            {/* Article Body */}
            <div className="prose prose-slate max-w-none text-slate-700 font-body leading-relaxed text-[15px] sm:text-[17px] whitespace-pre-wrap">
              {article.desc}
            </div>
          </div>
        </article>

      </div>
    </main>
  );
}
