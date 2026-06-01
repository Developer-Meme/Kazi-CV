import { useMemo, useState } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { Moon, Sun, Code2, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import {
  defaultResume,
  TEMPLATES,
  uid,
  blankItem,
  type ResumeSection,
  type ResumeState,
  type SectionKind,
  type TemplateId,
} from "@/lib/resume-types";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { SortableSection } from "@/components/resume/SortableSection";
import { ExportModal } from "@/components/resume/ExportModal";

export default function App() {
  const { theme, toggle } = useTheme();
  const [state, setState] = useState<ResumeState>(() => {
    const resume = defaultResume();
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const isDark = stored ? stored === "dark" : true;
    resume.template = isDark ? "sidebar" : "bold";
    return resume;
  });
  const [exportOpen, setExportOpen] = useState(false);

  const handleToggle = () => {
    toggle();
    setState((s) => {
      const switchingToDark = theme === "light";
      const isOnDefault = s.template === "sidebar" || s.template === "bold";
      if (!isOnDefault) return s;
      return { ...s, template: switchingToDark ? "sidebar" : "bold" };
    });
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const ids = useMemo(() => state.sections.map((s) => s.id), [state.sections]);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = ids.indexOf(active.id as string);
    const newIdx = ids.indexOf(over.id as string);
    setState((s) => ({ ...s, sections: arrayMove(s.sections, oldIdx, newIdx) }));
  };

  const updateSection = (next: ResumeSection) => {
    setState((s) => ({ ...s, sections: s.sections.map((sec) => (sec.id === next.id ? next : sec)) }));
  };
  const deleteSection = (id: string) => {
    setState((s) => ({ ...s, sections: s.sections.filter((sec) => sec.id !== id) }));
  };
  const addSection = (kind: SectionKind) => {
    const titles: Record<SectionKind, string> = {
      experience: "Experience",
      skills: "Skills",
      education: "Education",
      projects: "Projects",
    };
    setState((s) => ({
      ...s,
      sections: [...s.sections, { id: uid(), kind, title: titles[kind], items: [blankItem(kind)] }],
    }));
  };
  const setTemplate = (template: TemplateId) => setState((s) => ({ ...s, template }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl"
      >
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="h-9 w-9 rounded-xl bg-gradient-royal shadow-gold flex items-center justify-center"
            >
              <FileText className="h-4 w-4 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base font-bold tracking-tight">KaziCV</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide">Resume Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 mr-2 p-1 rounded-lg bg-muted/50 border border-border">
              {TEMPLATES.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  whileTap={{ scale: 0.96 }}
                  className={`text-xs px-3 py-1.5 rounded-md transition-smooth ${
                    state.template === t.id
                      ? "bg-gradient-royal text-white shadow-elegant"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </motion.button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={handleToggle} aria-label="Toggle theme">
              <motion.div
                key={theme}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.div>
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={() => setExportOpen(true)} className="bg-gradient-royal hover:opacity-90 shadow-elegant">
                <Code2 className="h-4 w-4 mr-2" /> Export
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 p-6">
        {/* Editor Sidebar */}
        <aside className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4 space-y-3"
          >
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">Profile</h2>
            <Input
              value={state.profile.name}
              onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, name: e.target.value } }))}
              placeholder="Full name"
            />
            <Input
              value={state.profile.title}
              onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, title: e.target.value } }))}
              placeholder="Title"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={state.profile.email}
                onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, email: e.target.value } }))}
                placeholder="Email"
              />
              <Input
                value={state.profile.location}
                onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, location: e.target.value } }))}
                placeholder="Location"
              />
            </div>
            <Textarea
              value={state.profile.summary}
              onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, summary: e.target.value } }))}
              placeholder="Short summary"
              rows={3}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
            className="flex items-center justify-between px-1"
          >
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--gold)]">Sections</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs border-[color:var(--royal)]/40 hover:bg-[color:var(--royal)]/10">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => addSection("experience")}>Experience</DropdownMenuItem>
                <DropdownMenuItem onClick={() => addSection("skills")}>Skills</DropdownMenuItem>
                <DropdownMenuItem onClick={() => addSection("education")}>Education</DropdownMenuItem>
                <DropdownMenuItem onClick={() => addSection("projects")}>Projects</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                {state.sections.map((s) => (
                  <SortableSection
                    key={s.id}
                    section={s}
                    onChange={updateSection}
                    onDelete={() => deleteSection(s.id)}
                  />
                ))}
              </motion.div>
            </SortableContext>
          </DndContext>

          {/* Mobile template switcher */}
          <div className="md:hidden p-1 rounded-lg bg-muted/50 border border-border grid grid-cols-4 gap-1">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`text-[10px] px-2 py-1.5 rounded-md transition-smooth ${
                  state.template === t.id ? "bg-gradient-royal text-white" : "text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Live Preview */}
        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="lg:sticky lg:top-20 lg:self-start"
        >
          <div className="rounded-2xl p-4 bg-gradient-to-br from-[color:var(--royal)]/10 via-transparent to-[color:var(--gold)]/10 border border-border/40">
            <ResumePreview state={state} />
          </div>
        </motion.main>
      </div>

      <ExportModal open={exportOpen} onOpenChange={setExportOpen} state={state} />

      <footer className="mt-8 border-t border-border/40 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          KaziCV — Built for Kenya's professionals &nbsp;·&nbsp; Developed by <span className="text-[color:var(--gold)] font-medium">Victor Meme</span>
        </p>
      </footer>
    </div>
  );
}
