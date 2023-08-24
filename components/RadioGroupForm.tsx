import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useBoardStore } from '@/store/BoardStore';

const types = [
  {
    id: 'todo',
    name: 'To do',
    description: 'A new Task to be compleated',
    color: 'bg-red-500',
  },
  {
    id: 'inprogress',
    name: 'In Progress',
    description: 'A Task that is currently being worked on',
    color: 'bg-red-500',
  },
  {
    id: 'done',
    name: 'Done',
    description: 'A Task that is now compleated',
    color: 'bg-red-500',
  },
];

function RadioGroupForm() {
  const [newTaskType, setNewTaskType] = useBoardStore((state) => [
    state.newTaskType,
    state.setNewTaskType,
  ]);

  return (
    <div className="w-full py-8">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup
          value={newTaskType}
          onChange={(e) => {
            setNewTaskType(e);
          }}
        >
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.id}
                value={type.id}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-purple-400/80 ring-opacity-60 ring-offset-2 ring-offset-pink-300/70'
                      : ''
                  }
                  ${checked ? 'bg-[#2A2F4F] text-white' : 'bg-white'}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-purple-50' : 'text-gray-500'
                            }`}
                          >
                            <span>{type.description}</span>{' '}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

export default RadioGroupForm;
