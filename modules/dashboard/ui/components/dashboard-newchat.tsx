import { Input } from '@/components/ui/input'
import React from 'react'
import { InputGroupCustom } from './dashboard-input-group'

export default function DashboardNewChat() {
  return (
    <div className='w-full h-full flex flex-col justify-center px-48 gap-5'>
        {/* Header */}
  <div className="text-4xl w-3/4 font-medium bg-linear-to-r from-black via-primary to-secondary bg-clip-text text-transparent dark:text-shadow-2xs">
    Hello Chud! <br />
    <span>what do you have in mind</span>
  </div>
      {/* muted text */}
      <div className='text-muted-foreground/50 font-medium'>
        use common fellow prompts below or write your own
      </div>
      {/* usual prompts */}
      <div className='flex flex-row gap-2.5'> 
            <div className='h-32 w-52 bg-muted border border-border rounded-md px-2 py-2.5 font-medium text-muted-foreground'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, eius?
            </div>
            <div className='h-32 w-52 bg-muted border border-border rounded-md px-2 py-2.5 font-medium text-muted-foreground'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, officiis!
            </div>
            <div className='h-32 w-52 bg-muted border border-border rounded-md px-2 py-2.5 font-medium text-muted-foreground'>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam, cum!
            </div>
      </div>
      {/* input */}
      <InputGroupCustom />
    </div>
  )
}
