import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildPrompt(
  applicant: { bio?: string | null; skills: string[]; experienceYears?: number | null },
  job: { title: string; description: string }
) {
  return `Sən HR AI-sınsan. Namizədi elanla müqayisə et.

ELAN:
Başlıq: ${job.title}
Təsvir: ${job.description}

NAMİZƏD:
Bacarıqlar: ${applicant.skills.join(', ') || 'qeyd olunmayıb'}
Təcrübə: ${applicant.experienceYears ?? 'qeyd olunmayıb'} il
Bio: ${applicant.bio || 'qeyd olunmayıb'}

Yalnız bu formatda JSON qaytar, başqa heç nə yazma:
{"score": <0-100 arası tam ədəd>, "note": "<maksimum 15 sözlük, Azərbaycan dilində qısa qeyd>"}`;
}

export async function calculateMatchScore(
  applicant: { bio?: string | null; skills: string[]; experienceYears?: number | null },
  job: { title: string; description: string }
): Promise<{ score: number | null; note: string | null }> {
  let raw = '';

  try {
 const completion = await groq.chat.completions.create({
  model: 'openai/gpt-oss-20b',
  messages: [{ role: 'user', content: buildPrompt(applicant, job) }],
  temperature: 0.3,
  max_tokens: 500, // 👈 300 → 500, ehtiyat üçün
  reasoning_effort: 'low', // 👈 YENİ — sadə tapşırıq, dərin düşünmə lazım deyil
});

    raw = completion.choices[0]?.message?.content ?? '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.warn('⚠️ AI cavabında JSON tapılmadı (bəlkə kəsilib), tam cavab:', raw);
      return { score: null, note: null };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const score = Number(parsed.score);
    const note = typeof parsed.note === 'string' ? parsed.note.trim() : null;

    if (!Number.isFinite(score)) {
      console.warn('⚠️ AI cavabında etibarlı score yoxdur:', parsed);
      return { score: null, note };
    }

    return { score: Math.max(0, Math.min(100, score)), note };
  } catch (error) {
    console.error('AI match score xətası:', error, '| raw cavab:', raw);
    return { score: null, note: null };
  }
}