import type { Metadata } from "next";
import { creators } from "@/lib/content";
import { CreatorCard } from "@/components/creator-card";
export const metadata:Metadata={title:"Kreator"};
export default function CreatorsPage(){return <section className="site-wrap min-h-[60vh] py-14 md:py-20"><p className="eyebrow text-[var(--blue)]">Suara dan aksi</p><h1 className="display mt-4 max-w-3xl text-6xl md:text-8xl">Orang di balik<br/>cerita.</h1><p className="mt-6 max-w-xl leading-7 text-[var(--muted)]">Kenali para kreator, lihat topik yang mereka angkat, lalu buka konten aslinya.</p><div className="mt-10 grid gap-5 md:grid-cols-2">{creators.filter(c=>c.kind!=="developer").map(c=><CreatorCard key={c.slug} creator={c}/>)}</div></section>}