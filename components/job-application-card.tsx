"use client";

import React, { useState, useTransition } from "react";
import { Column, JobApplication } from "@/lib/models/models-types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Plus, Trash2 } from "lucide-react";
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
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { updateJobApplication } from "@/lib/actions/job-application";

interface JobApplicationCardProps {
  job?: JobApplication;
  columns: Column[];
}

export default function JobApplicationCard({
  job,
  columns,
  dragHandleProps,
}: JobApplicationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: job?.company,
    position: job?.position,
    location: job?.location || "",
    notes: job?.notes || "",
    salary: job?.salary || "",
    jobUrl: job?.jobUrl || "",
    tags: Array.isArray(job?.tags) ? job?.tags.join(", ") : "",
    description: job?.description || "",
  });
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });
      if (!result.error) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to move job application:", error);
    }
  }

  async function handleMove(newColumnId: string) {
    try {
      const result = await updateJobApplication(job._id, {
        columnId: newColumnId,
      });
    } catch (error) {
      console.error("Failed to move job application:", error);
    }
  }

  async function handleDelete(newColumnId: string) {
    try {
      const result = await deleteJobApplication(job._id);
      if (!result.error) {
        console.error("fail to delete job application", result.error);
      }
    } catch (error) {
      console.error("Failed to move job application:", error);
    }
  }
  const [isPending, startTransition] = useTransition();

  if (!job) return null;

  // ✅ SAFE ID HANDLING

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        {...dragHandleProps}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            {/* LEFT SIDE */}
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

              {/* ✅ SAFE TAG HANDLING */}
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

            {/* RIGHT MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isPending}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                {columns
                  .filter((c) => String(c._id) !== String(job.columnId))
                  .map((col) => (
                    <DropdownMenuItem
                      key={String(col._id)}
                      className="flex items-center gap-2"
                      onClick={() => handleMove(String(col._id))}
                    >
                      Move to {col.name}
                    </DropdownMenuItem>
                  ))}

                <DropdownMenuItem
                  onClick={() => handleDelete(job._id)}
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

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
            <DialogDescription>
              Update your job application details
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    placeholder="e.g., $100k - $150k"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job URL</Label>
                <Input
                  id="jobUrl"
                  placeholder="https://..."
                  value={formData.jobUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, jobUrl: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="React, Tailwind, CSS"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief description of the role..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="Additional notes about the application..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
