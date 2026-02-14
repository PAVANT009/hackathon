import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { User2 } from 'lucide-react'
import React, { useMemo } from 'react'
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import Image from 'next/image';

interface SidebarFooterProps {
    userName?: string
}

export default function SidebarFooterAvatar({userName}:SidebarFooterProps) {
    const avatar = useMemo(() => {
 return createAvatar(botttsNeutral, {
   size: 67,
   // ... other options
 }).toDataUri();
}, []);
//   return (
  return <Image  src={avatar} alt="Avatar" width={35} height={35} className='rounded-md'/>;
//   )
}


