'use client';
import { BarChart, Compass, Layout, List } from 'lucide-react';
import { SidebarItem } from './sidebar-item';
import { usePathname } from 'next/navigation';


const teacherRouter = [
  {
    icon: List,
    lalel: "Courses",
    href:"/teacher/courses"
  },
  {
    icon: BarChart,
    lalel: "Analytics",
    href:"/teacher/analytics"
  }
]

const guestRoutes = [
  {
    icon: Layout,
    lalel: "Dashboard",
    href:"/"
  },
  {
    icon: Compass,
    lalel: "Browser",
    href:"/search"
  }
]

const SidebarRoutes = () => {
  const pathname = usePathname(); 
  
  const isTeacher  = pathname?.includes('/teacher');
  
  const routes = isTeacher ? teacherRouter :    guestRoutes; 

  return (
    <div className='flex flex-col w-full'>
      {routes.map ((route)=> (
        <SidebarItem 
          key = {route.href}
          href = {route.href}
          icon = {route.icon}
          label = {route.lalel}
        />
      ))}
    </div>
  )
}

export default SidebarRoutes