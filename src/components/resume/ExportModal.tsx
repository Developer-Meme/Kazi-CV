import { useEffect, useMemo, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { ResumeState, ExperienceItem, SkillItem, EducationItem, ProjectItem } from "@/lib/resume-types";

function buildTailwindMarkup(state: ResumeState): string {
  const p = state.profile;
  const sectionHtml = state.sections
    .map((s) => {
      const heading = `    <h2 class="text-lg font-semibold uppercase tracking-[0.18em] text-purple-600 mb-3">${s.title}</h2>`;
      let body = "";
      if (s.kind === "experience") {
        body = (s.items as ExperienceItem[])
          .map(
            (i) => `      <div class="mb-4">
        <div class="flex justify-between items-baseline">
          <p class="font-semibold">${i.role} <span class="text-amber-500">· ${i.company}</span></p>
          <p class="text-xs text-neutral-500">${i.period}</p>
        </div>
        <p class="text-sm text-neutral-600 mt-1">${i.description}</p>
      </div>`,
          )
          .join("\n");
      } else if (s.kind === "skills") {
        body = `      <div class="flex flex-wrap gap-2">
${(s.items as SkillItem[])
  .map((i) => `        <span class="text-xs px-3 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10">${i.name} · ${i.level}</span>`)
  .join("\n")}
      </div>`;
      } else if (s.kind === "education") {
        body = (s.items as EducationItem[])
          .map(
            (i) => `      <div class="mb-3">
        <p class="font-semibold">${i.degree}</p>
        <p class="text-sm text-neutral-600">${i.school} · ${i.period}</p>
      </div>`,
          )
          .join("\n");
      } else {
        body = (s.items as ProjectItem[])
          .map(
            (i) => `      <div class="mb-3">
        <p class="font-semibold">${i.name} <span class="text-amber-500 text-xs">↗ ${i.link}</span></p>
        <p class="text-sm text-neutral-600">${i.description}</p>
      </div>`,
          )
          .join("\n");
      }
      return `  <section class="mb-6">\n${heading}\n${body}\n  </section>`;
    })
    .join("\n");

  return `<article class="max-w-3xl mx-auto bg-white text-neutral-900 p-12 rounded-2xl shadow-xl">
  <header class="mb-8 pb-4 border-b-2 border-amber-400">
    <h1 class="text-5xl font-bold">${p.name}</h1>
    <p class="text-lg text-amber-500 mt-1">${p.title}</p>
    <p class="text-sm text-neutral-500 mt-2">${p.email} · ${p.location}</p>
    <p class="text-sm text-neutral-600 mt-4 max-w-2xl">${p.summary}</p>
  </header>
${sectionHtml}
</article>`;
}

export function ExportModal({ open, onOpenChange, state }: { open: boolean; onOpenChange: (v: boolean) => void; state: ResumeState }) {
  const [tab, setTab] = useState<"html" | "json">("html");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => buildTailwindMarkup(state), [state]);
  const json = useMemo(() => JSON.stringify(state, null, 2), [state]);
  const code = tab === "html" ? html : json;

  useEffect(() => {
    if (open) Prism.highlightAll();
  }, [open, tab, code]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Export your resume</DialogTitle>
          <DialogDescription>Copy clean Tailwind markup or the raw JSON schema.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mb-2">
          <Button variant={tab === "html" ? "default" : "outline"} size="sm" onClick={() => setTab("html")}>Tailwind HTML</Button>
          <Button variant={tab === "json" ? "default" : "outline"} size="sm" onClick={() => setTab("json")}>JSON</Button>
          <Button variant="outline" size="sm" onClick={copy} className="ml-auto">
            {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <pre className="max-h-[55vh] overflow-auto rounded-lg border border-border bg-[#0d0d12] text-xs p-4 text-neutral-100">
          <code className={tab === "html" ? "language-markup" : "language-json"}>{code}</code>
        </pre>
      </DialogContent>
    </Dialog>
  );
}