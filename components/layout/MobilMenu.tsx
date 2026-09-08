"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { NAV_LINKS, navLinkAktifMi } from "@/lib/nav-links";

type MobilMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobilMenu({ open, onOpenChange }: MobilMenuProps) {
  const pathname = usePathname();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-0 right-0 bottom-0 left-0 z-[60] flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col rounded-none bg-foreground p-6 text-background ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">Site menüsü</DialogTitle>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="self-end rounded-full border border-background/30 p-2 text-background transition-colors hover:bg-background/10"
          aria-label="Menüyü kapat"
        >
          <X className="h-5 w-5" />
        </button>
        <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto">
          {NAV_LINKS.map((link, index) => {
            const aktif = navLinkAktifMi(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onOpenChange(false)}
                className="group flex items-center gap-4 border-b border-background/15 py-4"
              >
                <span className="font-mono text-sm text-brand-orange">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`flex-1 text-2xl font-bold tracking-tight transition-colors sm:text-3xl ${
                    aktif
                      ? "text-background"
                      : "text-background/70 group-hover:text-background"
                  }`}
                >
                  {link.label}
                </span>
                {aktif && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-brand-orange" />
                )}
              </Link>
            );
          })}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
