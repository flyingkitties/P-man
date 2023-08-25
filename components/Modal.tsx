'use client';

import { FormEvent, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useModalStore } from '@/store/ModalStore';
import { useBoardStore } from '@/store/BoardStore';
import RadioGroupForm from './RadioGroupForm';
import Image from 'next/image';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/20/solid';

function Modal(closeOnClickingOutside: any) {
  // global state for modal opening
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);

  const [addTask, newTaskInput, setNewTaskInput, image, setImage, newTaskType] =
    useBoardStore((state) => [
      state.addTask,
      state.newTaskInput,
      state.setNewTaskInput,
      state.image,
      state.setImage,
      state.newTaskType,
    ]);

  const imagePicker = useRef<HTMLInputElement>(null);

  const Overlay = closeOnClickingOutside ? 'div' : Dialog.Panel;
  const Content = closeOnClickingOutside ? Dialog.Panel : 'div';

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // No input just return
    if (!newTaskInput) return;

    console.log('inside handler');

    // Add task to board DB
    addTask(newTaskInput, newTaskType, image);

    setImage(null);
    closeModal();
  };

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        as="form"
        onSubmit={handleSubmit}
        className="relative z-30"
        open={isOpen}
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 bg-opacity-25" />
        </Transition.Child>

        <Overlay className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl
                      bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <Dialog.Title
                  as="h2"
                  className="text-xl font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Task
                </Dialog.Title>
                <div className="mt-5">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter your task here..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>
                <RadioGroupForm />

                <div className="pb-10">
                  <button
                    type="button"
                    onClick={() => {
                      imagePicker.current?.click();
                    }}
                    className={`w-full rounded-md outline-none focus-visible:ring-2 
                    focus-visible:ring-purple-400/80 focus-visible:ring-offset-2
                   ring-offset-pink-300/70 ${
                     image
                       ? 'bg-[#2A2F4F] text-white rounded-t-md pb-1'
                       : 'py-5 border border-gray-300 px-1'
                   }`}
                  >
                    {image ? (
                      <div
                        className="flex items-center justify-end mr-2 my-1"
                        onClick={() => {
                          setImage(null);
                        }}
                      >
                        <XMarkIcon className="h-6 w-6 bg-white/90 rounded-full text-[#2A2F4F] " />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-[#2A2F4F]">
                        <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                        <p>Upload image</p>
                      </div>
                    )}
                  </button>
                  {image && (
                    <div className="-mt-[5px]">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt='"Upload Image'
                        width={200}
                        height={200}
                        className={`w-full h-44 object-cover -mt-[5px] filter hover:grayscale 
                     transition-all duration-150 cursor-not-allowed
                     }`}
                        onClick={() => {
                          setImage(null);
                        }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={imagePicker}
                    hidden
                    onChange={(e) => {
                      if (!e.target.files![0].type.startsWith('image/')) return;
                      setImage(e.target.files![0]);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-16">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex justify-center rounded-md text-[#2A2F4F] bg-white
                     px-6 py-2 text-sm font-medium ring-[#2A2F4F] ring-2 hover:ring-2 
                      hover:ring-purple-400/80 ring-opacity-80 ring-offset-pink-300/70 leading-6"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newTaskInput}
                    // onClick={handleSubmit}
                    className="inline-flex justify-center rounded-md text-white bg-[#2A2F4F]
                     px-6 py-2 text-sm font-medium ring-2 ring-transparent hover:ring-2
                      hover:ring-purple-400/80 ring-opacity-80 ring-offset-pink-300/70 leading-6
                      disabled:text-gray-500"
                  >
                    Add Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Overlay>
      </Dialog>
    </Transition>
  );
}

export default Modal;
