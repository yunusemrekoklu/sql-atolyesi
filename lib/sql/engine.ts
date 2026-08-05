import type { InitSqlJsStatic, SqlJsStatic } from "sql.js";
import { SQLJS_VERSION } from "./sqljs-version";

let enginePromise: Promise<SqlJsStatic> | null = null;

function vendorUrl(dosya: string): string {
  return `/vendor/sqljs-${SQLJS_VERSION}/${dosya}`;
}

// @types/sql.js `initSqlJs`'i global bir değişken olarak da bildiriyor; bu
// yüzden `window.initSqlJs`'i doğrudan (Window arayüzünü genişletmeden) ve
// "belki tanımsız" varsayarak okuyoruz.
function windowInitSqlJs(): InitSqlJsStatic | undefined {
  return (window as unknown as { initSqlJs?: InitSqlJsStatic }).initSqlJs;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mevcut = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (mevcut) {
      if (windowInitSqlJs()) {
        resolve();
        return;
      }
      mevcut.addEventListener("load", () => resolve());
      mevcut.addEventListener("error", () => reject(new Error(`${src} yüklenemedi.`)));
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`${src} yüklenemedi.`));
    document.head.appendChild(script);
  });
}

/**
 * sql.js WASM motorunu tarayıcıda script-tag ile yükler (bundler'a sokulmaz,
 * bkz. scripts/copy-sqljs.mjs). Promise-singleton: StrictMode çift-effect'te
 * ve eşzamanlı çağrılarda tek bir yükleme yapılır.
 */
export function getSqlJs(): Promise<SqlJsStatic> {
  if (!enginePromise) {
    enginePromise = loadScript(vendorUrl("sql-wasm.js")).then(() => {
      const initSqlJs = windowInitSqlJs();
      if (!initSqlJs) {
        throw new Error("sql-wasm.js yüklendi ama window.initSqlJs bulunamadı.");
      }
      return initSqlJs({ locateFile: vendorUrl });
    });
    enginePromise.catch(() => {
      enginePromise = null;
    });
  }
  return enginePromise;
}
