'use client';

import { XCircleIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from '@hello-pangea/dnd';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';
import { useBoardStore } from '@/store/BoardStore';
import getURL from '@/lib/getURL';
import Image from 'next/image';
import { storage } from '@/appWrite';
import { log } from 'console';
import { object, string } from 'prop-types';

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
  const [imageurl, setImageUrl] = useState<string | null>(null);

  const deleteTask = useBoardStore((state) => state.deleteTask);

  useEffect(() => {
    if (todo.image) {
      const { image } = todo;

      // if it's a string
      if (typeof image == 'string') {
        const imageObject = JSON.parse(image as unknown as string);

        const fetchImage = async () => {
          const url = await getURL(imageObject);
          if (url) {
            setImageUrl(url.toString());
          }
        };
        fetchImage();
        // if its an object object
      } else {
        const fetchImage = async () => {
          const url = await getURL(image);
          if (url) {
            setImageUrl(url.toString());
          }
        };
        fetchImage();
      }
    }
  }, [todo]);

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
      {/* Image */}
      {imageurl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={imageurl}
            alt="Task image"
            width={400}
            height={200}
            priority={true}
            placeholder="empty"
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
