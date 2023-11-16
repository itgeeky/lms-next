import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';

interface CourseProgressProps {
  variant?: 'default' | 'success';
  value: number;
  size?: 'default' | 'sm';
}

const color = {
  default: 'text-sky-700',
  success: 'text-emerald-500',
};

const sizeVariant = {
  default: 'text-sm',
  sm: 'text-xs',
};

const CourseProgress = ({ variant, value, size }: CourseProgressProps) => {
  return (
    <div>
      <Progress className='h-2' value={value} variant={variant} />
      <p className={cn('font-medium mt-2 text-sky-700', color[variant || 'default' ], sizeVariant [size || 'default'])}>{Math.round(value)}% Completed</p>
    </div>
  );
};

export default CourseProgress;
