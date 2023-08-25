import { ID, databases, storage } from '@/appWrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand';

export interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;

  newTaskInput: string;
  setNewTaskInput: (input: string) => void;

  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;

  image: File | null;
  setImage: (image: File | null) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: '',
  setSearchString: (searchString: string) => set({ searchString }),
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board: Board) => set({ board }),

  newTaskInput: '',
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),

  newTaskType: 'todo',
  setNewTaskType: (newTaskType: TypedColumn) => set({ newTaskType }),

  image: null,
  setImage: (image: File | null) => set({ image }),

  updateTodoInDB: async (todo: Todo, columnId: TypedColumn) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
        image: todo.image, // test mode
      },
    );
  },

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    // Delete by todo id from the newColumns
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
    );
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;

    // If there's an image - store it in Image bucket
    if (image) {
      const fileUploaded = await uploadImage(image);

      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    console.log('creating new task');
    try {
      // Create the new task document
      const { $id } = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        ID.unique(),
        {
          title: todo,
          status: columnId,
          // Include image of there's one and stringify
          ...(file && { image: JSON.stringify(file) }),
        },
      );

      set({ newTaskInput: '' });

      set((state) => {
        const newColumnsCopy = new Map(state.board.columns);

        const newTodo: Todo = {
          $id,
          $createdAt: new Date().toISOString(),
          title: todo,
          status: columnId,
          // Image if there's one
          ...(file && { image: file }),
        };
        // which column was selected?
        const column = newColumnsCopy.get(columnId);
        if (!column) {
          newColumnsCopy.set(columnId, {
            id: columnId,
            todos: [newTodo],
          });
        } else {
          newColumnsCopy.get(columnId)?.todos.push(newTodo);
        }
        return {
          board: {
            columns: newColumnsCopy,
          },
        };
      });
    } catch (error) {
      console.log(error);
    }
  },
}));
