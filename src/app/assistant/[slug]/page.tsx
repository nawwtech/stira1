import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getStory, stories } from "@/lib/content";
import { AssistantChat } from "@/components/assistant-chat";
export function generateStaticParams(){return stories.map(s=>({slug:s.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;return {title:`Tanya AI · ${getStory(slug)?.title??"Cerita"}`}}
export default async function StoryAssistantPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const story=getStory(slug);if(!story)notFound();return <section className="site-wrap max-w-3xl py-10 md:py-16"><Link href={`/issues/${slug}`} className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-[var(--blue)]"><ArrowLeft size={15}/> Kembali ke cerita</Link><p className="eyebrow text-[var(--blue)]">Diskusi sesuai halaman</p><h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl">{story.title}</h1><p className="mb-8 mt-4 leading-7 text-[var(--muted)]">Tanya apa pun soal ringkasan ini. Asisten akan menggunakan konteks cerita yang sedang kamu buka.</p><AssistantChat slug={slug} title={story.title}/></section>}
