'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import logo from '@/public/logo.png';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Avatar from 'react-avatar';
import { UserCircleIcon } from '@heroicons/react/20/solid';
import { useBoardStore } from '@/store/BoardStore';
import fetchSuggestion from '@/lib/fetchSuggestion';

function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [sugestion, setSugestion] = useState<string>('');

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSugestion(suggestion);
      setLoading(false);
    };
    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div
        className="flex flex-col md:flex-row items-center p-3
       space-y-2 md:space-y-0 bg-gray-500/10 "
      >
        {/* Left section*/}
        <div className="flex items-center ">
          {/* Logo */}
          <Image
            src={logo}
            alt="P-Man Logo"
            width={100}
            height={100}
            className="w-7 lg:w-10 rounded-lg"
          />
          {/* Title */}
          <h1 className="text-lg md:text-xl lg:text-2xl px-2 font-semibold text-white">
            P-Man
          </h1>
        </div>

        {/* Right section */}
        <div className="flex space-x-3 flex-1 justify-end w-full px-5 md:px-0">
          {/* Search Box */}
          <form
            className="flex items-center space-x-3 bg-white rounded-md px-2
           shadow-md flex-1 md:flex-initial "
          >
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1 outline-none p-1 font-light"
            />

            <button
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 " />
            </button>
          </form>

          {/* Avatar */}
          <Avatar
            name="rita"
            size="35"
            round
            color="#D1A6E8"
            textSizeRatio={2}
          />
        </div>
      </div>

      {/* Helper Box */}
      <div
        className="flex items-center justify-center px-5 py-5
       "
      >
        <p
          className="inline-flex items-center text-sm font-light
         bg-white rounded-md shadow-lg p-3"
        >
          <UserCircleIcon
            className={`w-7 h-7 text-[#D1A6E8] mr-1
          ${loading && 'animate-spin'}`}
          />
          {sugestion && !loading ? sugestion : 'GPT is optimizing your day...'}
        </p>
      </div>
    </header>
  );
}

export default Header;
