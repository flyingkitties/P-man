'use client';

import { XCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from '@hello-pangea/dnd';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';
import { useBoardStore } from '@/store/BoardStore';

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};
function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5 md:p-2 my-2">
        <p>{todo.title}</p>
        <button onClick={() => deleteTask(index, todo, id)}>
          <XCircleIcon className="h-5 w-5 text-red-400" />
        </button>
      </div>
    </div>
  );
}

export default TodoCard;
