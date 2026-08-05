export const STORAGE_KEY = "sqlatolyesi.progress.v1";

/**
 * localStorage bazı ortamlarda (gizli sekme, izin engeli) erişilemez
 * olabilir ve erişim `SecurityError` fırlatabilir — bu yüzden tüm erişim
 * try/catch ile sarılır; başarısız olursa sessizce yok sayılır.
 */
export function safeGetItem(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function safeSetItem(deger: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, deger);
  } catch {
    // yoksay
  }
}
