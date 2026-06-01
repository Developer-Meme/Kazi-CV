export type SectionKind = "experience" | "skills" | "education" | "projects";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  period: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  description: string;
}

export type AnyItem = ExperienceItem | SkillItem | EducationItem | ProjectItem;

export interface ResumeSection {
  id: string;
  kind: SectionKind;
  title: string;
  items: AnyItem[];
}

export interface ResumeProfile {
  name: string;
  title: string;
  email: string;
  location: string;
  summary: string;
}

export type TemplateId = "minimal" | "sidebar" | "editorial" | "bold";

export interface ResumeState {
  profile: ResumeProfile;
  sections: ResumeSection[];
  template: TemplateId;
}

export const TEMPLATES: { id: TemplateId; label: string; desc: string }[] = [
  { id: "minimal", label: "Minimal", desc: "Clean single column" },
  { id: "sidebar", label: "Sidebar", desc: "Two-column with aside" },
  { id: "editorial", label: "Editorial", desc: "Serif, centered" },
  { id: "bold", label: "Bold", desc: "Gradient header" },
];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const blankItem = (kind: SectionKind): AnyItem => {
  switch (kind) {
    case "experience":
      return { id: uid(), role: "Software Engineer", company: "Safaricom PLC", period: "2022 — Present", description: "Built scalable microservices that handle 2M+ daily M-Pesa transactions." };
    case "skills":
      return { id: uid(), name: "React / TypeScript", level: "Expert" };
    case "education":
      return { id: uid(), degree: "B.Sc. Computer Science", school: "University of Nairobi", period: "2016 — 2020" };
    case "projects":
      return { id: uid(), name: "PesaTrack", link: "pesatrack.co.ke", description: "Open-source M-Pesa expense tracker with 5k+ active users." };
  }
};

export const defaultResume = (): ResumeState => ({
  template: "minimal",
  profile: {
    name: "Samuel Mungania",
    title: "Full-Stack Engineer & Tech Lead",
    email: "samuel@techbridge.co.ke",
    location: "Nairobi, Kenya",
    summary: "Software engineer with 8 years building fintech, healthtech, and civic-tech products across East Africa. Passionate about scalable systems, developer communities, and empowering the next generation of Kenyan engineers.",
  },
  sections: [
    {
      id: uid(),
      kind: "experience",
      title: "Experience",
      items: [
        { id: uid(), role: "Engineering Lead", company: "Twiga Foods", period: "2022 — Present", description: "Leading a team of 9 engineers rebuilding the supply-chain platform that now processes 50k+ orders daily across Kenya and Uganda." },
        { id: uid(), role: "Senior Software Engineer", company: "Safaricom PLC", period: "2019 — 2022", description: "Designed and shipped core APIs for M-PESA Super App. Reduced transaction latency by 40% through async queue architecture." },
        { id: uid(), role: "Software Developer", company: "Andela Kenya", period: "2017 — 2019", description: "Delivered client-facing React applications for US-based startups while mentoring junior engineers in the Nairobi cohort." },
      ],
    },
    {
      id: uid(),
      kind: "skills",
      title: "Skills",
      items: [
        { id: uid(), name: "TypeScript / Node.js", level: "Expert" },
        { id: uid(), name: "React / Next.js", level: "Expert" },
        { id: uid(), name: "PostgreSQL / Redis", level: "Advanced" },
        { id: uid(), name: "AWS / GCP", level: "Advanced" },
        { id: uid(), name: "M-PESA Daraja API", level: "Expert" },
      ],
    },
    {
      id: uid(),
      kind: "projects",
      title: "Projects",
      items: [
        { id: uid(), name: "PesaTrack", link: "pesatrack.co.ke", description: "Open-source M-Pesa budgeting tool with offline-first support, used by 8k+ Kenyans." },
        { id: uid(), name: "AfyaBot", link: "afyabot.health", description: "WhatsApp health triage chatbot serving community clinics in Kisumu and Mombasa." },
      ],
    },
    {
      id: uid(),
      kind: "education",
      title: "Education",
      items: [
        { id: uid(), degree: "B.Sc. Computer Science", school: "University of Nairobi", period: "2013 — 2017" },
      ],
    },
  ],
});
