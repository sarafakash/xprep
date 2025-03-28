'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/dbactions';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button 
      className="cursor-pointer" 
      onClick={() => startTransition(() => logout())} 
      disabled={isPending}
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
