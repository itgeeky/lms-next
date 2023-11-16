'use client'
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import toast from 'react-hot-toast';
import { set } from 'zod';
import axios from 'axios';


interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}
const CourseEnrollButton = ( {courseId, price }: CourseEnrollButtonProps ) => {

  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error('Something went wrong');
      setIsLoading(false);
    }
  }
  
  return (
    <Button className='w-full md:w-auto' size='sm' onClick={onClick} disabled={isLoading}>
      Enroll for {formatPrice(price)  }
    </Button>
  )
}

export default CourseEnrollButton