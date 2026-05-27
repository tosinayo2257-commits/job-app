"use client";

import React, { useState, useTransition } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { updateJobApplication } from "@/lib/actions/job-application";

type DragHandleProps = React.HTMLAttributes<HTMLDivElement>;

interface JobApplicationCardProps {
  job: JobApplication; // ✅ FIXED (no longer optional)
  columns: Column[];
  dragHandleProps?: DragHandleProps;
}

export default function JobApplicationCard({
  job,
  columns,
  dragHandleProps,
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // ✅ SAFE INITIAL STATE (no hook rule violation)
  const [formData, setFormData] = useState(() => ({
    company: job.company || "",
    position: job.position || "",
    location: job.location || "",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    tags: Array.isArray(job.tags) ? job.tags.join(", ") : "",
    description: job.description || "",
  }));

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await updateJobApplication(job._id, {
          ...formData,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        });

        if (!result?.error) {
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Failed to update job application:", error);
      }
    });
  }

  async function handleMove(newColumnId: string) {
    try {
      await updateJobApplication(job._id, {
        columnId: newColumnId,
      });
    } catch (error) {
      console.error("Failed to move job application:", error);
    }
  }

  async function handleDelete() {
    startTransition(async () => {
      try {
        const result = await deleteJobApplication(job._id);

        if (result?.error) {
          console.error("Failed to delete job application:", result.error);
        }
      } catch (error) {
        console.error("Failed to delete job application:", error);
      }
    });
  }

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        {...dragHandleProps}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            {/* LEFT */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">
                {job.position || "No position"}
              </h3>

              <p className="text-xs text-muted-foreground mb-2">
                {job.company || "No company"}
              </p>

              {job.description && (
                <p className="text-xs mb-2 line-clamp-3">{job.description}</p>
              )}

              {Array.isArray(job.tags) && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {job.tags.filter(Boolean).map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
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

            {/* MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>

                {columns
                  .filter((c) => String(c._id) !== String(job.columnId))
                  .map((col) => (
                    <DropdownMenuItem
                      key={String(col._id)}
                      onClick={() => handleMove(String(col._id))}
                    >
                      Move to {col.name}
                    </DropdownMenuItem>
                  ))}

                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isPending}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isPending ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* EDIT MODAL */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
            <DialogDescription>
              Update your job application details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              required
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="Company"
            />

            <Input
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="Position"
            />

            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="Location"
            />

            <Input
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              placeholder="Salary"
            />

            <Input
              value={formData.jobUrl}
              onChange={(e) =>
                setFormData({ ...formData, jobUrl: e.target.value })
              }
              placeholder="Job URL"
            />

            <Input
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="Tags (comma separated)"
            />

            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
            />

            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Notes"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
