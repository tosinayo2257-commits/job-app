"use client";

import React, { useCallback } from "react";

import { Board, Column, JobApplication } from "@/lib/models/models-types";

import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import { useBoard } from "@/lib/hooks/useBoards";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Button } from "./ui/button";

import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

interface ColConfig {
  color: string;
  icon: React.ReactNode;
}

const COLUMN_CONFIG: ColConfig[] = [
  { color: "bg-cyan-500", icon: <Calendar className="h-4 w-4" /> },
  { color: "bg-purple-500", icon: <CheckCircle2 className="h-4 w-4" /> },
  { color: "bg-green-500", icon: <Mic className="h-4 w-4" /> },
  { color: "bg-yellow-500", icon: <Award className="h-4 w-4" /> },
  { color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
];

function SortableJobCard({
  job,
  columns,
}: {
  job: JobApplication;
  columns: Column[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(job._id),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <JobApplicationCard
        job={job}
        columns={columns}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}

function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: {
  column: Column;
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: String(column._id),
  });

  const sortedJobs = [...(column.jobApplications || [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <Card className="min-w-[300px] flex-shrink-0 shadow-md">
      <CardHeader className={`${config.color} text-white rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}

            <CardTitle>{column.name}</CardTitle>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent
        ref={setNodeRef}
        className={`min-h-[400px] space-y-3 p-4 ${
          isOver ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <SortableContext
          items={sortedJobs.map((job) => String(job._id))}
          strategy={verticalListSortingStrategy}
        >
          {sortedJobs.map((job) => (
            <SortableJobCard
              key={String(job._id)}
              job={job}
              columns={sortedColumns}
            />
          ))}
        </SortableContext>

        <CreateJobApplicationDialog
          columnId={String(column._id)}
          boardId={boardId}
        />
      </CardContent>
    </Card>
  );
}

export default function KanbanBoard({ board }: KanbanBoardProps) {
  const { columns, moveJob } = useBoard(board);

  const sortedColumns = [...(columns || [])].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      const activeJobId = String(active.id);

      if (active.id === over.id) return;

      let destinationColumnId: string | null = null;

      const targetColumn = columns.find(
        (column) => String(column._id) === String(over.id),
      );

      if (targetColumn) {
        destinationColumnId = String(targetColumn._id);
      }

      if (!destinationColumnId) {
        for (const column of columns) {
          const hasJob = column.jobApplications?.some(
            (job) => String(job._id) === String(over.id),
          );

          if (hasJob) {
            destinationColumnId = String(column._id);
            break;
          }
        }
      }

      if (!destinationColumnId) {
        console.error("Destination column not found");
        return;
      }

      try {
        await moveJob(activeJobId, destinationColumnId);
      } catch (error) {
        console.error("Move job failed:", error);
      }
    },
    [columns, moveJob],
  );
  const activeJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job._id === active.id);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto p-4">
          {sortedColumns.map((column, index) => {
            const config = COLUMN_CONFIG[index] || {
              color: "bg-gray-500",
              icon: <Calendar className="h-4 w-4" />,
            };

            return (
              <DroppableColumn
                key={String(column._id)}
                column={column}
                config={config}
                boardId={String(board._id)}
                sortedColumns={sortedColumns}
              />
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeJob ? (
          <div className="opacity-50">
            <JobApplicationCard job={activeJob} columns={sortedColumns} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
