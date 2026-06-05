"use client";

import JobCard from "./JobCard";

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
}

interface JobListProps {
  jobs: Job[];
  onApply?: (jobId: string | number) => void;
}

export default function JobList({ jobs, onApply }: JobListProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onApply={onApply} />
      ))}
    </div>
  );
}
