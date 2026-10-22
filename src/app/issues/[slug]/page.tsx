import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, BookOpenText, Sparkles, Leaf, Quote } from "lucide-react";
import { stories, getStory, getCreator } from "@/lib/content";

export function generateStaticParams() { return stories.map((s) => ({ slug: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  return { title: story?.title ?? "Cerita tidak ditemukan", description: story?.summary };
}

export default async function IssueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const creator = getCreator(story.creatorSlug);

  return (
    <article className="story-page site-wrap">
      <Link href="/issues" className="story-back"><ArrowLeft size={16} /> <span>Kembali ke semua isu</span></Link>

      <header className="story-heading">
        <div className="story-meta-top"><span className="story-category"><span className="category-dot" />{story.category}</span><span>{story.platform}</span></div>
        <h1 className="story-title">{story.title}</h1>
        <div className="story-byline"><span className="byline-avatar">{(creator?.name ?? "K").slice(0, 1)}</span><span><strong>{creator?.name ?? "Kreator"}</strong><small>{story.dateLabel} <span aria-hidden="true">·</span> Ringkasan isu</small></span></div>
      </header>

      <section className="story-cover" aria-label="Sampul cerita">
        <img src={story.image} alt={`Ilustrasi untuk ${story.title}`} />
        <div className="story-cover-shade" />
        <div className="cover-glass"><span className="cover-kicker"><Sparkles size={13} /> SUDUT PANDANG</span><p>Satu isu. Banyak hal yang perlu kita pahami.</p><span className="cover-caption">Ringkasan dari konten kreator</span></div>
      </section>

      <div className="story-layout">
        <main className="story-main">
          <section className="summary-glass">
            <div className="section-label"><span className="section-icon"><BookOpenText size={17} /></span><span><small>BACAAN UTAMA</small><strong>Ringkasan cerita</strong></span></div>
            <p className="summary-copy">{story.summary}</p>
            <div className="summary-foot"><span className="reading-pill"><span /> Inti pembahasan</span><span className="summary-mark">01 / RINGKASAN</span></div>
          </section>

          <section className="context-panel">
            <div className="context-number">01</div><div><p className="eyebrow">KONTEKS</p><h2>Kenapa cerita ini penting?</h2><p>Isu publik sering terasa jauh sampai kita melihat dampaknya pada lingkungan, kehidupan sehari-hari, dan masa depan bersama. Ringkasan ini menjadi pintu masuk untuk mengenal topik lebih jauh, bukan pengganti riset atau sumber primer.</p></div>
          </section>

          <aside className="source-glass">
            <div className="source-icon"><Leaf size={20} /></div><div className="source-copy"><p className="eyebrow">LANJUTKAN EKSPLORASI</p><h2>Lihat konteks dari sumber asli</h2><p>Tonton konten lengkap dari kreator untuk memahami konteks, penjelasan, dan detail yang mungkin tidak tercakup dalam ringkasan ini.</p><a href={story.sourceUrl} target="_blank" rel="noreferrer" className="source-button">Buka di {story.platform}<ExternalLink size={15} /></a></div>
          </aside>

          <div className="story-note"><Quote size={17} /><p>Ringkasan ini membantu membuka percakapan. Untuk informasi yang lebih lengkap, periksa sumber asli dan bandingkan dengan sumber tepercaya lainnya.</p></div>
          <p className="story-disclaimer">Hak atas video, foto, dan karya asli tetap berada pada pemiliknya. Jika ada ketidakakuratan atau keberatan hak cipta, hubungi developer melalui kontak di footer.</p>
        </main>

        <aside className="story-rail">
          <div className="rail-card"><span className="rail-kicker">PENJELAJAHAN</span><h3>Mau bahas lebih lanjut?</h3><p>Tanyakan hal yang masih bikin penasaran tentang cerita ini.</p><Link href={`/assistant/${story.slug}`} className="rail-button">Tanya Asisten Si Cerdas <ArrowUpRight size={15} /></Link></div>
          <div className="rail-card rail-creator"><span className="rail-kicker">DARI KREATOR</span><div className="creator-mini"><span className="byline-avatar">{(creator?.name ?? "K").slice(0, 1)}</span><div><strong>{creator?.name ?? "Kreator"}</strong><small>{story.platform}</small></div></div><Link href={`/creators/${story.creatorSlug}`} className="creator-link">Lihat profil kreator <ArrowUpRight size={14} /></Link></div>
        </aside>
      </div>
    </article>
  );
}
