import { motion, AnimatePresence } from "framer-motion";
import type { ResumeSection, ResumeState, ExperienceItem, SkillItem, EducationItem, ProjectItem } from "@/lib/resume-types";

function SectionBlock({ section }: { section: ResumeSection }) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="resume-section mb-6"
    >
      <h2 className="text-lg font-semibold uppercase tracking-[0.18em] text-[color:var(--royal)] mb-3">
        {section.title}
      </h2>
      <div className="space-y-4">
        {section.kind === "experience" &&
          (section.items as ExperienceItem[]).map((i) => (
            <div key={i.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-foreground">{i.role} <span className="text-[color:var(--gold)]">· {i.company}</span></p>
                <p className="text-xs text-muted-foreground">{i.period}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{i.description}</p>
            </div>
          ))}
        {section.kind === "skills" && (
          <div className="flex flex-wrap gap-2">
            {(section.items as SkillItem[]).map((i) => (
              <span key={i.id} className="text-xs px-3 py-1.5 rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 text-foreground">
                {i.name} <span className="text-muted-foreground">· {i.level}</span>
              </span>
            ))}
          </div>
        )}
        {section.kind === "education" &&
          (section.items as EducationItem[]).map((i) => (
            <div key={i.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-foreground">{i.degree}</p>
                <p className="text-xs text-muted-foreground">{i.period}</p>
              </div>
              <p className="text-sm text-muted-foreground">{i.school}</p>
            </div>
          ))}
        {section.kind === "projects" &&
          (section.items as ProjectItem[]).map((i) => (
            <div key={i.id}>
              <p className="font-semibold text-foreground">{i.name} <span className="text-[color:var(--gold)] text-xs">↗ {i.link}</span></p>
              <p className="text-sm text-muted-foreground mt-1">{i.description}</p>
            </div>
          ))}
      </div>
    </motion.section>
  );
}

export function ResumePreview({ state }: { state: ResumeState }) {
  const asideKinds: Record<string, boolean> = state.template === "sidebar"
    ? { skills: true, education: true }
    : {};
  const aside = state.sections.filter((s) => asideKinds[s.kind]);
  const main = state.sections.filter((s) => !asideKinds[s.kind]);

  return (
    <div className={`tpl-${state.template}`}>
      <motion.article
        layout
        className="resume-root bg-card text-card-foreground p-10 md:p-14 rounded-2xl shadow-elegant border border-border/60 min-h-[60vh]"
      >
        <header className="resume-header mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">{state.profile.name}</h1>
          <p className="text-base md:text-lg text-[color:var(--gold)] mt-1">{state.profile.title}</p>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">
            {state.profile.email} · {state.profile.location}
          </p>
          <p className="text-sm text-muted-foreground mt-4 max-w-2xl">{state.profile.summary}</p>
        </header>

        {state.template === "sidebar" ? (
          <>
            <aside className="resume-aside">
              <AnimatePresence>
                {aside.map((s) => <SectionBlock key={s.id} section={s} />)}
              </AnimatePresence>
            </aside>
            <div className="resume-body">
              <AnimatePresence>
                {main.map((s) => <SectionBlock key={s.id} section={s} />)}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="resume-body">
            <AnimatePresence>
              {state.sections.map((s) => <SectionBlock key={s.id} section={s} />)}
            </AnimatePresence>
          </div>
        )}
      </motion.article>
    </div>
  );
}