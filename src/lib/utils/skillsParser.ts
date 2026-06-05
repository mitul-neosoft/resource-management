const ACRONYM_MAP: Record<string, string[]> = {
  mern: ["MongoDB", "Express", "React", "Node.js"],
  mean: ["MongoDB", "Express", "Angular", "Node.js"],
  lamp: ["Linux", "Apache", "MySQL", "PHP"],
  java: ["Java"],
  python: ["Python"],
  devops: ["Docker", "Kubernetes", "CI/CD", "AWS"],
};

const KNOWN_SKILLS = [
  "Angular",
  "React",
  "Vue",
  "Node.js",
  "MongoDB",
  "Express",
  "TypeScript",
  "JavaScript",
  "Java",
  "Spring Boot",
  "Python",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
  "MySQL",
  "Kafka",
  "Redis",
  "GraphQL",
  "Next.js",
  "Terraform",
  "Selenium",
  "Cypress",
  ".NET",
  "C#",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "PHP",
  "Ruby",
  "Rails",
  "Django",
  "Flask",
  "Spark",
  "Hadoop",
  "TensorFlow",
  "PyTorch",
  "Figma",
  "UI/UX",
];

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/** Parse skills from JD title e.g. "Angular + React Developer", "MERN Developer" */
export function parseSkillsFromJD(jd: string): string[] {
  if (!jd?.trim()) return [];

  const lower = jd.toLowerCase().trim();
  const found = new Set<string>();

  for (const [key, skills] of Object.entries(ACRONYM_MAP)) {
    if (lower.includes(key)) {
      skills.forEach((s) => found.add(s));
    }
  }

  const plusParts = jd.split(/\+|\/|,|&|\band\b/gi);
  for (const part of plusParts) {
    const cleaned = part
      .replace(/\b(developer|engineer|architect|lead|consultant|specialist)\b/gi, "")
      .trim();
    if (!cleaned) continue;

    for (const skill of KNOWN_SKILLS) {
      if (cleaned.toLowerCase().includes(skill.toLowerCase())) {
        found.add(skill);
      }
    }

    if (cleaned.length >= 2 && cleaned.length <= 20 && !/^\d/.test(cleaned)) {
      const words = cleaned.split(/\s+/).filter((w) => w.length > 2);
      words.forEach((w) => {
        const match = KNOWN_SKILLS.find(
          (k) => k.toLowerCase() === w.toLowerCase()
        );
        if (match) found.add(match);
        else if (/^[A-Za-z.#+]+$/.test(w)) found.add(titleCase(w));
      });
    }
  }

  if (found.size === 0) {
    const fallback = jd
      .replace(/\b(developer|engineer|architect|lead)\b/gi, "")
      .trim();
    if (fallback) found.add(fallback);
  }

  return Array.from(found);
}

export function computeSkillMatch(
  userSkills: string[],
  jobSkills: string[]
): { score: number; matchedSkills: string[]; missingSkills: string[] } {
  if (!jobSkills.length) {
    return { score: 0, matchedSkills: [], missingSkills: [] };
  }

  const userLower = userSkills.map((s) => s.toLowerCase());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const js of jobSkills) {
    const jl = js.toLowerCase();
    const hit = userSkills.find(
      (us, i) =>
        userLower[i].includes(jl) ||
        jl.includes(userLower[i]) ||
        userLower[i] === jl
    );
    if (hit) matchedSkills.push(js);
    else missingSkills.push(js);
  }

  const score = Math.round((matchedSkills.length / jobSkills.length) * 100);
  return { score, matchedSkills, missingSkills };
}
