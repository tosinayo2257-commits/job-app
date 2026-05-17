"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobAppliccation } from "../models"; // ✅ fixed spelling

interface JobApplicationData {
  company: string;
  position: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId: string;
  boardId: string;
  tags?: string[];
  description?: string;
}

export async function createJobApplication(data: JobApplicationData) {
  const session = await getSession();

  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await connectDB();

  const {
    company,
    position,
    location,
    notes,
    salary,
    jobUrl,
    columnId,
    boardId,
    tags,
    description,
  } = data;

  // Validate required fields
  if (!company || !position || !columnId || !boardId) {
    return { error: "Missing required fields" };
  }

  // Ensure board belongs to the user
  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Board not found" };
  }

  // Ensure column belongs to the board
  const column = await Column.findOne({
    _id: columnId,
    boardId,
  });

  if (!column) {
    return { error: "Column not found" };
  }

  // Find the highest order in this column
  const maxOrderDoc = await JobAppliccation.findOne({ columnId })
    .sort({ order: -1 })
    .select("order")
    .lean();

  const nextOrder = maxOrderDoc ? maxOrderDoc.order + 1 : 0;

  // Create new job application
  const jobApplication = await JobAppliccation.create({
    company,
    position,
    location,
    notes,
    salary,
    jobUrl,
    columnId,
    boardId,
    userId: session.user.id,
    tags: tags || [],
    description,
    status: "applied",
    order: nextOrder,
  });

  // Attach job application to column (plural field name)
  await Column.findByIdAndUpdate(columnId, {
    $push: { jobApplications: jobApplication._id },
  });

  // Revalidate dashboard path
  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(jobApplication)) };
}
