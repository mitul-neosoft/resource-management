import { parseSkillsFromJD } from "./skillsParser";

export interface ParsedJD {
  title: string;
  skills: string[];
  experience: string;
  location: string;
  jdText: string;
}

/** Extract job fields from JD Details cell text */
export function parseJobFromJDDetails(
  jdDetails: string,
  fallbackLocation = "Remote"
): ParsedJD {
  const jdText = jdDetails?.trim() || "";
  const lines = jdText.split(/\n/).map((l) => l.trim()).filter(Boolean);

  let title = lines[0] || "Open Position";
  let experience = "3+ yrs";
  let location = fallbackLocation;

  const expMatch = jdText.match(/(\d+)\+?\s*(?:yrs?|years?)\s*(?:exp|experience)?/i);
  if (expMatch) experience = `${expMatch[1]}+ yrs`;

  const locMatch = jdText.match(
    /(?:location|based in|work from)[:\s]+([A-Za-z\s,]+)/i
  );
  if (locMatch) location = locMatch[1].trim();

  const titleLine = jdText.match(/^([A-Za-z0-9\s/+.&-]+(?:Developer|Engineer|Architect|Lead|Consultant|Analyst))/im);
  if (titleLine) title = titleLine[1].trim();

  const skills = parseSkillsFromJD(title);
  const inlineSkills = jdText.match(/skills?[:\s]+([^\n]+)/i);
  if (inlineSkills) {
    inlineSkills[1]
      .split(/[,;|+]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => {
        if (!skills.some((k) => k.toLowerCase() === s.toLowerCase())) {
          skills.push(s);
        }
      });
  }

  return { title, skills, experience, location, jdText };
}
