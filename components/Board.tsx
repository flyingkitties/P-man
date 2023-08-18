'use client';

import { useBoardStore } from '@/store/BoardStore';
import { Result } from 'postcss';
import React, { useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

function Board() {
  const [board, getBoard] = useBoardStore((state: any) => [
    state.board,
    state.getBoard,
  ]);
  useEffect(() => {
    getBoard();
  }, [getBoard]);
  console.log(board);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    console.log('dest', destination);
    console.log('src', source);
    console.log('type', type);
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
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default Board;
