import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Ellipsis, PenLine, Star } from 'lucide-react'
export default function DashboardNavbar() {
  return (
    <div className='flex h-14 flex-row justify-between'>
        <div className='flex gap-3 items-center '>
          <SidebarTrigger className='bg-accent/80'/>
          <div className='flex gap-3.5'>
            <span className='text-md text-foreground  font-semibold'>How to center a div</span>
              <PenLine className='font-medium text-accent-foreground/80 size-5 '/>
          </div>
        </div>
        <div className='flex gap-2.5 '>
          <span className='p-1 h-fit bg-accent/50 text-accent-foreground/70 rounded-md'>
            <Star size={18}/>
          </span>
          <span className='p-1 h-fit bg-accent/50 text-accent-foreground/70 rounded-md'>
            <Ellipsis size={18}/>
          </span>
        </div>
    </div>
  )
}
