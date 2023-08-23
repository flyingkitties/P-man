'use client';

import { useBoardStore } from '@/store/BoardStore';
import { Result } from 'postcss';
import React, { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import Column from './Column';
import { number } from 'prop-types';

function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state: any) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ],
  );
  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // If card dragged outside permited area - dont do anything
    if (!destination) return;

    // handle "column" is dragged
    if (type === 'column') {
      const entries = Array.from(board.columns.entries()); // creare an array called entries out of the board columns

      const [removed] = entries.splice(source.index, 1); // removed the dragged item
      entries.splice(destination.index, 0, removed); // push prev removed item
      const reArrangedColumns = new Map<TypedColumn, Column>(
        entries as [TypedColumn, Column][],
      ); // stored the new Map in reArrangedClomuns

      setBoardState({
        ...board,
        columns: reArrangedColumns,
      }); // set new board state to keep prev board plus new column data
    }

    //  indexes are stored as 0,1,2 ... instead of ids
    const columns: [TypedColumn, Column][] = Array.from(board.columns);

    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    // If dragged into the same place do nothing
    if (!startCol || !finishCol) return;
    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;

    // Cut that todo
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // Same column task drag
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      // Set the board for same column drag
      setBoardState({ ...board, columns: newColumns });
    } else {
      // different column task drag
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      // Update in the database
      updateTodoInDB(todoMoved, finishCol.id);

      // Set the board for different column drag
      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <div className="px-5 lg:px-10 mt-2 md:mt-5">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable
          droppableId="board"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 xl:gap-10 max-w-7xl mx-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Array.from<[string, Column]>(board.columns.entries()).map(
                ([id, column]: [string, Column], index) => (
                  <Column
                    key={id}
                    id={id as TypedColumn}
                    todos={column.todos}
                    index={index}
                  />
                ),
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Board;
