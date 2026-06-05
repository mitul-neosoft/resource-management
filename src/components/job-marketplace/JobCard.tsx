"use client";

export interface Job {
  id: string | number;
  title: string;
  company: string;
  description: string;
  skills: string[];
  experience: string;
  duration: string;
  location: string;
  type: string;
  match: number;
  isNew?: boolean;
  missingSkills?: string[];
  matchedSkills?: string[];
  recommended?: boolean;
}

interface Props {
  job: Job;
  onApply?: (jobId: string | number) => void;
  showMatchDetails?: boolean;
}

export default function JobCard({
  job,
  onApply,
  showMatchDetails,
}: Props): React.JSX.Element {
  const matchColor =
    job.match >= 90
      ? "bg-green-600"
      : job.match >= 70
        ? "bg-orange-500"
        : job.match > 0
          ? "bg-yellow-500"
          : "bg-gray-300";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm ${
        job.recommended ? "border-red-300 ring-1 ring-red-200" : "border-gray-200"
      }`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${matchColor}`} />

      {job.isNew && (
        <div className="absolute right-5 top-5 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
          NEW
        </div>
      )}

      {job.recommended && (
        <div className="absolute right-5 top-14 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          RECOMMENDED
        </div>
      )}

      <div className="pl-2">
        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
        <p className="mt-1 text-sm font-semibold text-red-600">{job.company}</p>
        <p className="mt-3 text-sm text-gray-500">{job.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
            >
              {skill}
            </span>
          ))}
        </div>

        {showMatchDetails && job.match > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {job.matchedSkills?.map((s) => (
              <span
                key={s}
                className="rounded bg-green-50 px-2 py-0.5 text-xs text-green-700"
              >
                ✓ {s}
              </span>
            ))}
            {job.missingSkills?.map((s) => (
              <span
                key={s}
                className="rounded bg-red-50 px-2 py-0.5 text-xs text-red-700"
              >
                ✗ {s}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>{job.experience}</span>
          <span>{job.duration}</span>
          <span>{job.location}</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
            {job.type}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              job.match >= 90
                ? "bg-green-100 text-green-700"
                : job.match >= 70
                  ? "bg-orange-100 text-orange-700"
                  : job.match > 0
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
            }`}
          >
            {job.match > 0 ? `${job.match}% Match` : "No match data"}
          </div>

          <button
            type="button"
            onClick={() => onApply?.(job.id)}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
          >
            Apply Now →
          </button>
        </div>
      </div>
    </div>
  );
}
