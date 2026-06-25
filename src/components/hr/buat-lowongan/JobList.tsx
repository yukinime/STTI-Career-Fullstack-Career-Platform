"use client";

import JobCard from "./JobCard";
import type { JobType } from "./types";

interface JobListProps {
  jobs?: JobType[];
  onEdit?: (job: JobType) => void;
  onDelete?: (id: number) => void;
}

export default function JobList({ jobs = [], onEdit, onDelete }: JobListProps) {
  if (!jobs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">Belum ada lowongan tersedia.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
