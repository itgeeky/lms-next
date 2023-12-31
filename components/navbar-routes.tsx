'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import SearchInput from './search-input';

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacher = pathname?.startsWith('/teacher');
  const isPlayer = pathname?.includes('/courses');
  const isSearch = pathname === '/search';

  return (
    <>
      {isSearch && (
        <div className='hidden md:block'>
          <SearchInput/>
        </div>
      )}
      <div className='flex gap-x-2 ml-auto'>
        {isTeacher || isPlayer ? (
          <Link href='/'>
            <Button size='sm' variant='ghost'>
              <LogOut className='h-4 w-4 mr-2' /> Exit
            </Button>
          </Link>
        ) : (
          <Link href='/teacher/courses'>
            <Button size='sm' variant='ghost'>
              Teacher mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl='/' />
      </div>
    </>
  );
};

export default NavbarRoutes;
