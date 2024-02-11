import IconBadge from '@/components/icon-badge';
import { LucideIcon } from 'lucide-react';
import React from 'react';

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  variant?: 'default' | 'success';
}

const InfoCard = ({ variant, count, label, icon: Icon }: InfoCardProps) => {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
      <IconBadge icon={Icon} variant={variant} />
      <div>
        <p className='font-medium'>{label}</p>
        <p className='text-slate-500 text-sm'>{count} {count === 1 ? 'Course': 'Courses'}</p>
      </div>
    </div>
  );
};

export default InfoCard;
