import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { ResumeSection, AnyItem, ExperienceItem, SkillItem, EducationItem, ProjectItem } from "@/lib/resume-types";
import { blankItem } from "@/lib/resume-types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  section: ResumeSection;
  onChange: (s: ResumeSection) => void;
  onDelete: () => void;
}

export function SortableSection({ section, onChange, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const [open, setOpen] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const updateItem = (id: string, patch: Partial<AnyItem>) => {
    onChange({
      ...section,
      items: section.items.map((it) => (it.id === id ? ({ ...it, ...patch } as AnyItem) : it)),
    });
  };
  const removeItem = (id: string) => {
    onChange({ ...section, items: section.items.filter((it) => it.id !== id) });
  };
  const addItem = () => {
    onChange({ ...section, items: [...section.items, blankItem(section.kind)] });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:text-[color:var(--gold)] cursor-grab active:cursor-grabbing transition-smooth"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <input
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          className="flex-1 bg-transparent text-sm font-semibold outline-none focus:text-[color:var(--royal)]"
        />
        <button onClick={() => setOpen(!open)} className="text-muted-foreground hover:text-foreground">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <button onClick={onDelete} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="p-3 space-y-3">
          {section.items.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/60 p-3 space-y-2 bg-background/40">
              {section.kind === "experience" && (
                <>
                  <Input value={(item as ExperienceItem).role} onChange={(e) => updateItem(item.id, { role: e.target.value } as Partial<ExperienceItem>)} placeholder="Role" />
                  <Input value={(item as ExperienceItem).company} onChange={(e) => updateItem(item.id, { company: e.target.value } as Partial<ExperienceItem>)} placeholder="Company" />
                  <Input value={(item as ExperienceItem).period} onChange={(e) => updateItem(item.id, { period: e.target.value } as Partial<ExperienceItem>)} placeholder="Period" />
                  <Textarea value={(item as ExperienceItem).description} onChange={(e) => updateItem(item.id, { description: e.target.value } as Partial<ExperienceItem>)} placeholder="Description" rows={2} />
                </>
              )}
              {section.kind === "skills" && (
                <div className="flex gap-2">
                  <Input value={(item as SkillItem).name} onChange={(e) => updateItem(item.id, { name: e.target.value } as Partial<SkillItem>)} placeholder="Skill" />
                  <Input value={(item as SkillItem).level} onChange={(e) => updateItem(item.id, { level: e.target.value } as Partial<SkillItem>)} placeholder="Level" className="w-32" />
                </div>
              )}
              {section.kind === "education" && (
                <>
                  <Input value={(item as EducationItem).degree} onChange={(e) => updateItem(item.id, { degree: e.target.value } as Partial<EducationItem>)} placeholder="Degree" />
                  <Input value={(item as EducationItem).school} onChange={(e) => updateItem(item.id, { school: e.target.value } as Partial<EducationItem>)} placeholder="School" />
                  <Input value={(item as EducationItem).period} onChange={(e) => updateItem(item.id, { period: e.target.value } as Partial<EducationItem>)} placeholder="Period" />
                </>
              )}
              {section.kind === "projects" && (
                <>
                  <Input value={(item as ProjectItem).name} onChange={(e) => updateItem(item.id, { name: e.target.value } as Partial<ProjectItem>)} placeholder="Project" />
                  <Input value={(item as ProjectItem).link} onChange={(e) => updateItem(item.id, { link: e.target.value } as Partial<ProjectItem>)} placeholder="Link" />
                  <Textarea value={(item as ProjectItem).description} onChange={(e) => updateItem(item.id, { description: e.target.value } as Partial<ProjectItem>)} placeholder="Description" rows={2} />
                </>
              )}
              <button onClick={() => removeItem(item.id)} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={addItem} className="w-full border border-dashed border-border hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]">
            <Plus className="h-3 w-3 mr-1" /> Add item
          </Button>
        </div>
      )}
    </div>
  );
}