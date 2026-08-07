import { isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { SqlCodeBlock } from "@/components/sql/SqlCodeBlock";

const PROSE_SINIFI =
  "prose prose-stone max-w-none dark:prose-invert " +
  "prose-headings:font-semibold prose-headings:tracking-tight " +
  "prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 " +
  "prose-strong:font-semibold prose-strong:text-stone-900 dark:prose-strong:text-white " +
  "prose-a:text-accent prose-a:font-medium prose-a:no-underline hover:prose-a:underline " +
  "prose-ul:my-3 prose-li:my-1 " +
  "prose-table:text-sm prose-thead:border-stone-300 dark:prose-thead:border-stone-700 " +
  "prose-th:bg-stone-50 dark:prose-th:bg-stone-900 prose-th:font-semibold prose-th:text-left " +
  "prose-td:border prose-td:border-stone-200 dark:prose-td:border-stone-800 " +
  "prose-code:rounded prose-code:bg-stone-100 dark:prose-code:bg-stone-900 prose-code:px-1 prose-code:py-0.5 prose-code:font-normal " +
  "prose-code:before:content-none prose-code:after:content-none prose-pre:bg-stone-900";

function AnlatimNotu({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-4 rounded-r-lg border-l-4 border-accent bg-orange-50 py-3 pl-4 pr-4 text-sm text-orange-900 [&_p]:m-0 [&_p]:leading-relaxed dark:bg-orange-950/40 dark:text-orange-100">
      {children}
    </div>
  );
}

const ortakBilesenler: Components = {
  blockquote({ children }) {
    return <AnlatimNotu>{children}</AnlatimNotu>;
  },
};

export function MarkdownIcerik({
  children,
  sqlBloklariVar = false,
}: {
  children: string;
  sqlBloklariVar?: boolean;
}) {
  const bilesenler: Components = sqlBloklariVar
    ? {
        ...ortakBilesenler,
        pre({ children: preChildren }) {
          const kod = Array.isArray(preChildren) ? preChildren[0] : preChildren;
          if (
            isValidElement<{ className?: string; children?: unknown }>(kod) &&
            /language-sql/.test(kod.props.className ?? "")
          ) {
            return <SqlCodeBlock sql={String(kod.props.children ?? "").replace(/\n$/, "")} />;
          }
          return <pre>{preChildren}</pre>;
        },
      }
    : ortakBilesenler;

  return (
    <div className={PROSE_SINIFI}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={bilesenler}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
