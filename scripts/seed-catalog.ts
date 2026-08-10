// content/*.ts'teki slug/id listelerini Supabase katalog tablolarına
// (lesson_catalog, exercise_catalog, interview_catalog) yansıtır — sertifika
// hak edişi sunucu tarafında bu tablolara bakılarak doğrulanıyor.
// SADECE upsert yapar, asla silmez: kaldırılan/yeniden adlandırılan bir slug,
// bağımlı kullanıcı ilerlemesini öksüz bırakmasın diye elle temizlenmeli.
// Çalıştırma: npm run seed-catalog (içerik her değiştiğinde elle).
// Gerekli env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY (.env.local).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { TUM_DERSLER } from "../content/lessons";
import { TUM_PRATIK_SETLERI } from "../content/practice";
import { TUM_MULAKAT_SORULARI } from "../content/interview";

// tsx .env.local'ı kendiliğinden yüklemez — eksik değişkenleri buradan al.
function envLocalYukle(): void {
  let icerik: string;
  try {
    icerik = readFileSync(join(process.cwd(), ".env.local"), "utf8");
  } catch {
    return;
  }
  for (const satir of icerik.split(/\r?\n/)) {
    const eslesme = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(satir);
    if (!eslesme) continue;
    const [, anahtar, hamDeger] = eslesme;
    if (process.env[anahtar] !== undefined) continue;
    process.env[anahtar] = hamDeger.replace(/^["']|["']$/g, "");
  }
}

async function main(): Promise<void> {
  envLocalYukle();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    console.error(
      "✗ NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SECRET_KEY gerekli (.env.local).\n" +
        "  Secret key: Supabase Dashboard → Project Settings → API keys.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, secretKey, {
    auth: { persistSession: false },
  });

  const dersler = TUM_DERSLER.map((ders) => ({
    slug: ders.slug,
    unit_id: ders.uniteId,
    title: ders.baslik,
  }));

  const alistirmalar = [
    ...TUM_DERSLER.flatMap((ders) =>
      ders.alistirmalar.map((alistirma) => ({
        exercise_id: alistirma.id,
        source: "lesson" as const,
        parent_slug: ders.slug,
        title: alistirma.baslik,
      })),
    ),
    ...TUM_PRATIK_SETLERI.flatMap((set) =>
      set.sorular.map((soru) => ({
        exercise_id: soru.id,
        source: "practice" as const,
        parent_slug: set.slug,
        title: soru.baslik,
      })),
    ),
  ];

  const mulakatSorulari = TUM_MULAKAT_SORULARI.map((soru) => ({
    slug: soru.slug,
    title: soru.baslik,
  }));

  const { error: dersHatasi } = await supabase
    .from("lesson_catalog")
    .upsert(dersler, { onConflict: "slug" });
  if (dersHatasi) throw new Error(`lesson_catalog: ${dersHatasi.message}`);
  console.log(`✓ lesson_catalog: ${dersler.length} ders upsert edildi.`);

  const { error: alistirmaHatasi } = await supabase
    .from("exercise_catalog")
    .upsert(alistirmalar, { onConflict: "exercise_id" });
  if (alistirmaHatasi) throw new Error(`exercise_catalog: ${alistirmaHatasi.message}`);
  console.log(`✓ exercise_catalog: ${alistirmalar.length} alıştırma upsert edildi.`);

  const { error: mulakatHatasi } = await supabase
    .from("interview_catalog")
    .upsert(mulakatSorulari, { onConflict: "slug" });
  if (mulakatHatasi) throw new Error(`interview_catalog: ${mulakatHatasi.message}`);
  console.log(`✓ interview_catalog: ${mulakatSorulari.length} mülakat sorusu upsert edildi.`);
}

main().catch((err) => {
  console.error(`✗ ${(err as Error).message}`);
  process.exit(1);
});
