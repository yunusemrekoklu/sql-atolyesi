// sql.js dist dosyalarını (sql-wasm.js + sql-wasm.wasm) public/vendor/sqljs-<sürüm>/ altına kopyalar.
// Bundler'a sokulmaz; app/layout.tsx bir <script> etiketiyle bu dosyayı yükler (bkz. PROJE_PLANI.md #1).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkgPath = path.join(__dirname, "..", "node_modules", "sql.js", "package.json");
const version = JSON.parse(fs.readFileSync(pkgPath, "utf8")).version;

const srcDir = path.join(__dirname, "..", "node_modules", "sql.js", "dist");
const vendorRoot = path.join(__dirname, "..", "public", "vendor");
const destDir = path.join(vendorRoot, `sqljs-${version}`);

fs.mkdirSync(destDir, { recursive: true });

for (const file of ["sql-wasm.js", "sql-wasm.wasm"]) {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
}

// Eski sürüm klasörlerini temizle (versiyon değiştiğinde public/vendor'da birikmesin).
for (const entry of fs.readdirSync(vendorRoot)) {
  if (entry.startsWith("sqljs-") && entry !== `sqljs-${version}`) {
    fs.rmSync(path.join(vendorRoot, entry), { recursive: true, force: true });
  }
}

const versionFilePath = path.join(__dirname, "..", "lib", "sql", "sqljs-version.ts");
fs.mkdirSync(path.dirname(versionFilePath), { recursive: true });
fs.writeFileSync(
  versionFilePath,
  `// Bu dosya scripts/copy-sqljs.mjs tarafından otomatik üretilir, elle düzenleme.\nexport const SQLJS_VERSION = "${version}";\n`,
);

console.log(`sql.js ${version} → public/vendor/sqljs-${version}/ kopyalandı.`);
