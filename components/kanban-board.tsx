"use client";

import { Board, Column } from "@/lib/models/models-types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface KanbanBoardprops {
  board: Board;
  userId: string;
}
interface colConfig {
  color: string;
  icon: React.ReactNode;
}
const COLUMN_CONFIG: Array<colConfig> = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4" />,
  },
];
function DroppableColumn({
  column,
  config,
  boardId,
}: {
  column: Column;
  config: colConfig;
  boardId: string;
}) {
  console.log(column);

  return (
    <Card>
      <CardHeader className={`${config.color}`}>
        <div>
          <div>
            {config.icon}
            <CardTitle>{column.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost">
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-4 bg-gray-50/50 min-h-[400px] rounded-b-lg"></CardContent>
    </Card>
  );
}

export default function KanbanBoard({ board, userId }: KanbanBoardprops) {
  const columns = board?.columns ?? [];

  return (
    <>
      <div>
        <div>
          {columns.map((col, key) => {
            const config = COLUMN_CONFIG[key] || {
              color: "bg-gray-500",
              icon: <Calendar className="h-4 w-4" />,
            };
            return (
              <DroppableColumn
                key={key}
                column={col}
                config={config}
                boardId={board._id}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
