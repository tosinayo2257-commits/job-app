import { useEffect, useState } from "react";
import { Board, Column, JobApplication } from "../models/models-types";
import { updateJobApplication } from "../actions/job-application";

export function useBoard(initialBoard?: Board | null) {
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBoard) {
      setBoard(initialBoard);
      setColumns(initialBoard.columns || []);
    }
  }, [initialBoard]);

  /**
   * Move job between columns (drag & drop)
   */
  async function moveJob(
    jobApplicationId: string,
    sourceColumnId: string,
    destinationColumnId: string,
  ) {
    // ✅ Optimistic UI update
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        jobApplications: [...(col.jobApplications || [])],
      }));

      let movedJob: JobApplication | null = null;

      // 1. Remove job from source column
      const sourceColumn = newColumns.find(
        (col) => String(col._id) === String(sourceColumnId),
      );

      if (sourceColumn) {
        const index = sourceColumn.jobApplications.findIndex(
          (job) => String(job._id) === String(jobApplicationId),
        );

        if (index !== -1) {
          movedJob = sourceColumn.jobApplications[index];
          sourceColumn.jobApplications.splice(index, 1);
        }
      }

      // 2. Add job to destination column
      const destColumn = newColumns.find(
        (col) => String(col._id) === String(destinationColumnId),
      );

      if (destColumn && movedJob) {
        destColumn.jobApplications.push({
          ...movedJob,
          columnId: destinationColumnId,
        });
      }

      return newColumns;
    });

    // ✅ Backend sync
    try {
      await updateJobApplication(jobApplicationId, {
        columnId: destinationColumnId,
      });
    } catch (err) {
      console.error("Error moving job:", err);
      setError("Failed to move job application");
    }
  }

  return { board, columns, error, moveJob };
}
