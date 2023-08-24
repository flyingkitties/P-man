import { databases } from '@/appWrite';

export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
  );
  const todos = data.documents;

  // Transforming the array into a Map with Key value pairs to transform the data
  const columns = todos.reduce((accumulator, todo) => {
    if (!accumulator.get(todo.status)) {
      accumulator.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    accumulator.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      //  Get the image only if it exists - spread and if there is an image append using the push
      ...(todo.image && { image: todo.image }),
    });
    return accumulator;
  }, new Map<TypedColumn, Column>());

  // If the columns dont have any status tasks then add an empty array to it
  const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done'];
  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  }
  // Sort columns by column type
  // Get all the value pairs from columns and tranform into and array
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]),
    ),
  );

  const board: Board = {
    columns: sortedColumns,
  };
  return board;
};
