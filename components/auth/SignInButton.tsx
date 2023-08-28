'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import {
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';
import React from 'react';
import Avatar from 'react-avatar';
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from '@material-tailwind/react';

function SignInButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    // user is signed In
    return (
      <div>
        <Menu
          placement="bottom-end"
          animate={{
            mount: { y: 0 },
            unmount: { y: 25 },
          }}
        >
          <MenuHandler>
            <Button className="flex items-center rounded-xl px-1 shadow-none group">
              <Avatar
                name={session?.user.name as string}
                size="35"
                round
                color="#D1A6E8"
                textSizeRatio={2}
                className="group-hover:shadow-sm"
              />
              <ChevronDownIcon className="h-6 w-6 text-[#D1A6E8]" />
            </Button>
          </MenuHandler>
          <MenuList className="menuList">
            <MenuItem className="menuItem group">
              <Cog6ToothIcon className="menuDropIcon group-hover:text-[#c68de4]" />
              <p>Settings and privacy</p>
            </MenuItem>
            <MenuItem className="menuItem group">
              <InformationCircleIcon className="menuDropIcon group-hover:text-[#c68de4]" />
              <p>Help & support</p>
            </MenuItem>
            <MenuItem
              onClick={() => signOut()}
              onKeyDown={() => signOut()}
              tabIndex={0}
              className="menuItem group"
            >
              <ArrowLeftOnRectangleIcon className="menuDropIcon group-hover:text-[#c68de4]" />
              <p>Log out</p>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    );
  } else {
    // user is not signed In
    return (
      <div>
        <button
          onClick={() => signIn()}
          className="bg-[#D1A6E8] py-1 px-3 rounded-md hover:shadow-xl shadow-md text-white tracking-wide"
        >
          <p>Sign In</p>
        </button>
      </div>
    );
  }
}

export default SignInButton;
