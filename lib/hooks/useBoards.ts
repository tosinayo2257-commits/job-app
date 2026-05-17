import { useState } from "react";
import { Board, Column } from "../models/models-types";

export function useBoard(initialBoard?: Board | null) {
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
  const [colums, setColumns] = useState<Column[]>(initialBoard?.columns || []);
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
}
