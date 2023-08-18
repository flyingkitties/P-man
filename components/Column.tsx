import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TodoCard from './TodoCard';
import { PlusCircleIcon } from '@heroicons/react/20/solid';

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

function Column({ id, todos, index }: Props) {
  return (
    <Draggable
      draggableId={id}
      index={index}
    >
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Droppable
            droppableId={index.toString()}
            type="card"
          >
            {(provided, snapshot) => (
              <div
                className={`p-2 rounded-md shadow-md ${
                  snapshot.isDraggingOver ? 'bg-green-100' : 'bg-white/50'
                }`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2 className="flex justify-between font-semibold p-1">
                  {idToColumnText[id]}
                  <span className="text-gray-500 bg-[#FFF3DA]/50 rounded-full px-2 text-sm font-light">
                    {todos.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos.map((todo, index) => (
                    <Draggable
                      key={todo.$id}
                      draggableId={todo.$id}
                      index={index}
                    >
                      {(provided) => (
                        <TodoCard
                          todo={todo}
                          index={index}
                          id={id}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
                  {/* Makes space for the dragged item  */}
                  {provided.placeholder}
                  <div className="flex items-end p-2">
                    <button>
                      <PlusCircleIcon className="h-5 w-5 text-green-500" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default Column;