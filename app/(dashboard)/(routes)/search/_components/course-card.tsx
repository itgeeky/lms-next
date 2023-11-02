import Image from 'next/image';
import Link from 'next/link';

import IconBadge from '@/components/icon-badge';
import { BookOpen, Divide } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number;
  category: string;
}

const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
        <div className='relative w-full aspect-video rounded-md overflow-hidden'>
          <Image fill className='object-cover' src={imageUrl} alt={title} />
        </div>
        <div className='flex flex-col pt-2'>
          <div className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'>
            {title}
          </div>
          <p className='text-xs text-muted-foreground'>{category}</p>
          <div className='my-3 flex items-center gap-x-2 text-sm md:text-xs'>
            <div className='flex items-center gap-x-1 text-slate-500'>
              <IconBadge size='sm' icon={BookOpen}/>
              <span>{chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}</span>
            </div>
          </div>
          {progress !== null? (
            <div>
              TODO: progress bar
            </div>) : (
              <p className='text-md md:text-sm text-slate-700 font-medium'>
                {formatPrice(price)}
              </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
