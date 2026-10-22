"use client";
import { FormEvent, useState } from "react";
import { Send, Sparkles, Bot, UserRound } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export function AssistantChat({ slug, title }: { slug?: string; title?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(e: FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || busy) return;

    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setQuestion("");
    setBusy(true);
    setError("");

    try {
      const r = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, question: q, history: messages }),
      });
      const data = await r.json();
      
      if (!r.ok) {
        throw new Error(data.error || "Tidak bisa memproses pertanyaan.");
      }
      
      setMessages([...next, { role: "assistant", content: data.answer }]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Ada kendala teknis. Coba lagi.";
      setError(errorMsg);
      console.error("API Error:", errorMsg);
    } finally {
      setBusy(false);
    }
  }

  const assistantName = "Asisten Si Cerdas";

  return (
    <section className="soft-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[var(--line)] bg-[#edf4ff] p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl blue-btn">
          <Sparkles size={20} />
        </span>
        <div>
          <h2 className="font-black">{assistantName}</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Teman diskusi {title ? `untuk "${title}"` : "tentang isu sosial dan lingkungan"}
          </p>
        </div>
      </div>

      <div className="grid min-h-64 gap-4 p-4 sm:p-6">
        {messages.length === 0 && (
          <div className="my-auto rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-5">
            <p className="font-bold">Mau bahas bagian yang mana?</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Tanya soal konteks cerita, istilah yang belum jelas, atau ide untuk diskusi tugas. Jawaban dibuat dari ringkasan halaman ini dan pengetahuan model, jadi cek sumber asli untuk detail penting.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Apa inti masalahnya?", "Apa dampaknya bagi masyarakat?", "Solusi apa yang bisa dilakukan?"].map(
                (q) => (
                  <button
                    key={q}
                    onClick={() => setQuestion(q)}
                    className="rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                  >
                    {q}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl p-4 text-sm leading-6 ${
                m.role === "user"
                  ? "blue-btn"
                  : "border border-[var(--line)] bg-white"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider opacity-70">
                {m.role === "assistant" ? <Bot size={13} /> : <UserRound size={13} />}
                {m.role === "assistant" ? assistantName : "Kamu"}
              </div>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}

        {busy && (
          <p className="animate-pulse text-sm font-semibold text-blue-700">
            {assistantName} lagi mikir sebentar…
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            ⚠️ {error}
          </p>
        )}
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-[var(--line)] bg-white p-3 sm:p-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={1500}
          placeholder="Tulis pertanyaanmu…"
          className="min-w-0 flex-1 rounded-xl border border-blue-100 bg-[#f7faff] px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
        <button
          disabled={busy || !question.trim()}
          aria-label="Kirim pertanyaan"
          className="blue-btn flex h-12 w-12 shrink-0 items-center justify-center rounded-xl disabled:opacity-50"
        >
          <Send size={17} />
        </button>
      </form>
    </section>
  );
}
