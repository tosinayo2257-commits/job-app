import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
  { name: "Wish List", order: 0 },
  { name: "Applied", order: 1 },
  { name: "Interviewing", order: 2 },
  { name: "Offer", order: 3 },
  { name: "Rejected", order: 4 },
];

export async function initializeUserBoard(userId: string) {
  await connectDB();

  // Check if the user already has a "Job Hunt" board
  const existingBoard = await Board.findOne({
    userId,
    name: "Job Hunt",
  }).populate("columns");

  if (existingBoard) {
    return existingBoard;
  }

  // Create a new board
  const board = await Board.create({
    name: "Job Hunt",
    userId,
    columns: [],
  });

  // Create default columns for the board
  const columns = await Promise.all(
    DEFAULT_COLUMNS.map((col) =>
      Column.create({
        name: col.name,
        order: col.order,
        boardId: board._id,
        jobApplications: [], // corrected field name
      }),
    ),
  );

  // Attach columns to the board
  board.columns = columns.map((col) => col._id);
  await board.save();

  // Populate the "columns" field before returning
  return await Board.findById(board._id).populate("columns");
}
