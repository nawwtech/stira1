import { NextResponse } from "next/server";
import { getStory, getCreator } from "@/lib/content";
import { GROQ_API_KEY } from "@/lib/groq-config";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      slug?: string;
      question?: string;
      history?: { role: "user" | "assistant"; content: string }[];
    };

    const question = String(body.question ?? "").trim().slice(0, 1500);
    if (!question) {
      return NextResponse.json({ error: "Tulis pertanyaan dulu, ya." }, { status: 400 });
    }

    if (!GROQ_API_KEY || GROQ_API_KEY === "GANTI_DENGAN_API_KEY_GROQ_BARU") {
      return NextResponse.json(
        { error: "API key Groq belum diisi. Masukkan API key baru di src/lib/groq-config.ts." },
        { status: 503 }
      );
    }

    const story = body.slug ? getStory(body.slug) : undefined;
    const creator = story ? getCreator(story.creatorSlug) : undefined;
    const context = story
      ? `Judul: ${story.title}\nKategori: ${story.category}\nKreator: ${creator?.name ?? "Tidak diketahui"}\nRingkasan: ${story.summary}\nSumber: ${story.sourceUrl}`
      : "Pengunjung sedang berada di halaman asisten umum untuk memahami isu sosial dan lingkungan.";

    const history = Array.isArray(body.history)
      ? body.history
          .filter((m) => m && (m.role === "user" || m.role === "assistant"))
          .slice(-8)
          .map((m) => ({
            role: m.role,
            content: String(m.content ?? "").trim().slice(0, 1200),
          }))
          .filter((m) => m.content.length > 0)
      : [];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        // llama-3.3-70b-versatile was shut down by Groq on 16 Aug 2026.
        model: "openai/gpt-oss-120b",
        temperature: 0.55,
        max_completion_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "Nama kamu Asisten Muhammad Nawal. Jawab dengan bahasa Indonesia yang natural, hangat, jelas, dan tidak kaku. Jadilah teman diskusi yang membantu memahami konteks, bukan berpura-pura sebagai manusia. Jawaban harus berlandaskan konteks yang diberikan. Jangan mengarang fakta, angka, atau kutipan. Jika informasi tidak tersedia, katakan dengan jujur dan sarankan memeriksa sumber asli. Bedakan dugaan, opini, dan fakta. Jangan mengklaim sudah menonton video; kamu hanya menerima ringkasan dan metadata berikut. Konteks halaman: " +
              context,
          },
          ...history,
          { role: "user", content: question },
        ],
      }),
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      const providerMessage =
        typeof data?.error?.message === "string" ? data.error.message : "";
      let message = `Groq gagal merespons (HTTP ${response.status}).`;

      if (response.status === 401 || response.status === 403) {
        message = "Groq menolak API key ini. Periksa apakah key masih aktif dan salin dengan benar.";
      } else if (response.status === 429) {
        message = "Batas penggunaan Groq tercapai. Tunggu sebentar lalu coba lagi.";
      } else if (response.status === 400) {
        message = `Request ditolak oleh Groq${providerMessage ? `: ${providerMessage}` : ". Periksa model dan format request."}`;
      } else if (providerMessage) {
        message = `Groq error: ${providerMessage}`;
      }

      console.error("Groq API request failed:", response.status, providerMessage);
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      console.error("Groq returned no text content.");
      return NextResponse.json(
        { error: "Groq berhasil dihubungi, tetapi tidak mengirim jawaban. Coba lagi." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer: answer.trim() });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return NextResponse.json(
        { error: "Groq terlalu lama merespons. Coba kirim pertanyaan lagi." },
        { status: 504 }
      );
    }

    console.error("Assistant API route error:", error);
    return NextResponse.json(
      { error: "Pesan belum bisa diproses. Periksa koneksi deployment lalu coba lagi." },
      { status: 500 }
    );
  }
}
