import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface BoardState {
  board: Board;
  getBoard: () => void;
}

const useBearStore = create((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
}));
