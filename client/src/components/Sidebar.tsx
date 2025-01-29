import { useState, useEffect, ReactNode } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface SidebarProps {
  children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleLeftSidebarToggle = (event: CustomEvent<{ open: boolean }>) => {
      setIsCollapsed(!event.detail.open);
    };

    window.addEventListener('toggleLeftSidebar', handleLeftSidebarToggle as EventListener);

    return () => {
      window.removeEventListener('toggleLeftSidebar', handleLeftSidebarToggle as EventListener);
    };
  }, []);

  return (
    <div
      className={cn(
        'border-r min-h-[calc(100vh-4rem)] bg-background transition-all duration-300',
        isCollapsed ? 'w-0 border-0' : 'w-80'
      )}
    >
      <ScrollArea className="h-full">
        {!isCollapsed && children}
      </ScrollArea>
    </div>
  );
}