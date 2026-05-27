"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import connectDB from "../db";
import { Board, Column, JobAppliccation } from "../models";

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

interface UpdateJobApplicationData {
  company?: string;
  position?: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId?: string;
  boardId?: string;
  tags?: string[];
  description?: string;
  order?: number;
}

export async function createJobApplication(data: JobApplicationData) {
  try {
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

    if (!company || !position || !columnId || !boardId) {
      return { error: "Missing required fields" };
    }

    const board = await Board.findOne({
      _id: boardId,
      userId: session.user.id,
    });

    if (!board) {
      return { error: "Board not found" };
    }

    const column = await Column.findOne({
      _id: columnId,
      boardId,
    });

    if (!column) {
      return { error: "Column not found" };
    }

    const lastJob = await JobAppliccation.findOne({
      columnId,
    })
      .sort({ order: -1 })
      .lean();

    const nextOrder = lastJob ? lastJob.order + 1 : 0;

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

    // Push job into column
    await Column.findByIdAndUpdate(columnId, {
      $push: {
        jobApplications: jobApplication._id,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(jobApplication)),
    };
  } catch (error) {
    console.error("CREATE_JOB_APPLICATION_ERROR:", error);

    return {
      error: "Failed to create job application",
    };
  }
}

export async function updateJobApplication(
  id: string,
  updates: UpdateJobApplicationData,
) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    await connectDB();

    const jobApplication = await JobAppliccation.findById(id);

    if (!jobApplication) {
      return { error: "Job application not found" };
    }

    if (jobApplication.userId.toString() !== session.user.id) {
      return { error: "Unauthorized" };
    }

    const currentColumnId = jobApplication.columnId.toString();
    const newColumnId = updates.columnId;

    if (newColumnId && newColumnId !== currentColumnId) {
      // Remove from old column
      await Column.findByIdAndUpdate(currentColumnId, {
        $pull: {
          jobApplications: id,
        },
      });

      await Column.findByIdAndUpdate(newColumnId, {
        $push: {
          jobApplications: id,
        },
      });

      const lastJobInNewColumn = await JobAppliccation.findOne({
        columnId: newColumnId,
        _id: { $ne: id },
      })
        .sort({ order: 1 })
        .lean();

      updates.order = lastJobInNewColumn ? lastJobInNewColumn.order + 1 : 0;
    }

    // Update job application
    const updatedJobApplication = await JobAppliccation.findByIdAndUpdate(
      id,
      {
        $set: updates,
      },
      {
        new: true,
      },
    );

    revalidatePath("/dashboard");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedJobApplication)),
    };
  } catch (error) {
    console.error("UPDATE_JOB_APPLICATION_ERROR:", error);

    return {
      error: "Failed to update job application",
    };
  }
}
