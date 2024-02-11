import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import React from 'react';

interface DataCardProps {
  label: string;
  value: number;
  shouldFormat?: boolean;
}

const DataCard = ({ label, value, shouldFormat }: DataCardProps) => {
  return (
    <Card>
      <CardHeader className='flex  flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='font-medium text-sm'>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-xl font-bold'>{shouldFormat ? formatPrice(value) : value}</div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
