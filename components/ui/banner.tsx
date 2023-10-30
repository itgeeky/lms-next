import { AlertTriangle, CheckCheckIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const bannerVariants = cva(
  'border text-center p-4 text-sm flex items-center w-full',
  {
    variants: {
      variant: {
        success: 'bg-emerald-700 text-secondary border-emerald-800',
        warning: 'bg-yellow-200/80 text-primary border-yellow-30',
      },
    },
    defaultVariants: {
      variant: 'warning',
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

const BannerIcon = {
  success: CheckCheckIcon,
  warning: AlertTriangle,
};

export const Banner = ({ label, variant }: BannerProps) => {
  const Icon = BannerIcon[variant || 'warning'];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className='h-4 w-4 mr-2' />
      {label}
    </div>
  );
};
