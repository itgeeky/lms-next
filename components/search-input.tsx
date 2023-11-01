'use client';

import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/use-debounce';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import qs from "query-string";

const SearchInput = () => {

  const [value, setValue] = useState('');
  const debounce = useDebounce(value, 800);

  const searcParams = useSearchParams();
  const router = useRouter();
  const pathnane = usePathname();

  const currentCategoryId = searcParams.get('categoryId');

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathnane,
      query: {
        title: debounce,
        categoryId: currentCategoryId,
      }
    }, { skipNull: true, skipEmptyString: true });  
    router.push(url);
  }, [ debounce, currentCategoryId, router, pathnane])
  

  return (
    <div className='relative'>
      <Search className='w-4 h-4 absolute top-3 left-3 text-slate-600' />
      <Input
        className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200'
        placeholder='Search for a course...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
