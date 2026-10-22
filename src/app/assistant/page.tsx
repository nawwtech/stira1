import type { Metadata } from "next";
import { AssistantChat } from "@/components/assistant-chat";
export const metadata:Metadata={title:"Asisten Muhammad Nawal"};
export default function AssistantPage(){return <section className="site-wrap max-w-3xl py-10 md:py-16"><p className="eyebrow text-[var(--blue)]">Ruang diskusi</p><h1 className="display mt-4 text-5xl sm:text-6xl md:text-7xl">Ada yang mau<br/><span className="text-[var(--blue)]">kamu tanyakan?</span></h1><p className="mb-8 mt-5 max-w-xl leading-7 text-[var(--muted)]">Asisten Muhammad Nawal bisa bantu menjelaskan topik, membedah ringkasan, atau menyusun pertanyaan untuk diskusi. Tetap cek sumber asli untuk hal yang penting.</p><AssistantChat/></section>}
