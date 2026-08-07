"use client";

import { useEffect, useRef, useState } from "react";

export function OkumaIlerlemeCubugu() {
  const [yuzde, setYuzde] = useState(0);
  const beklemede = useRef(false);

  useEffect(() => {
    function onScroll() {
      if (beklemede.current) return;
      beklemede.current = true;
      requestAnimationFrame(() => {
        const toplamYukseklik = document.documentElement.scrollHeight - window.innerHeight;
        const oran = toplamYukseklik > 0 ? (window.scrollY / toplamYukseklik) * 100 : 0;
        setYuzde(Math.min(100, Math.max(0, oran)));
        beklemede.current = false;
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-100"
        style={{ width: `${yuzde}%` }}
      />
    </div>
  );
}
