"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Column, JobAppliccation } from "../models";

export async function deleteJobApplication(jobId: string) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  // Find job
  const job = await JobAppliccation.findById(jobId);

  if (!job) {
    return { error: "Job not found" };
  }

  // Security check
  if (job.userId !== session.user.id) {
    return { error: "Not allowed" };
  }

  // Remove job from column
  await Column.findByIdAndUpdate(job.columnId, {
    $pull: { jobApplications: job._id },
  });

  // Delete job
  await JobAppliccation.findByIdAndDelete(jobId);

  revalidatePath("/dashboard");

  return { success: true };
}
