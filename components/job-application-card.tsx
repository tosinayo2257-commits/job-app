"use client";

import { useTransition } from "react";
import { Column, JobApplication } from "@/lib/models/models-types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { deleteJobApplication } from "@/lib/actions/delete-job-application";

interface JobApplicationCardProps {
  job?: JobApplication;
  columns: Column[];
}

export default function JobApplicationCard({
  job,
  columns,
}: JobApplicationCardProps) {
  const [isPending, startTransition] = useTransition();

  if (!job) return null;

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();

    if (!job._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job application?",
    );
    if (!confirmDelete) return;

    startTransition(() => {
      deleteJobApplication(String(job._id));
    });
  }

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
            <p className="text-xs text-muted-foreground mb-2">{job.company}</p>

            {job.description && (
              <p className="text-xs mb-2 line-clamp-3">{job.description}</p>
            )}

            {Array.isArray(job.tags) && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-muted px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {job.jobUrl && (
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View Job
              </a>
            )}
          </div>

          {/* Right menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isPending}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </DropdownMenuItem>

              {columns
                .filter((c) => String(c._id) !== String(job.columnId))
                .map((col) => (
                  <DropdownMenuItem
                    key={String(col._id)}
                    className="flex items-center gap-2"
                  >
                    Move to {col.name}
                  </DropdownMenuItem>
                ))}

              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isPending}
                className="flex items-center gap-2 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
                {isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
