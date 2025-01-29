import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChatWindow } from './ChatWindow';
import { MessageSquare, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Rnd } from 'react-rnd';

export function DraggableChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && isMaximized) {
        containerRef.current.style.width = `${window.innerWidth - 100}px`;
        containerRef.current.style.height = `${window.innerHeight - 100}px`;
      }
    };

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isMaximized]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Rnd
      default={{
        x: window.innerWidth - 420,
        y: window.innerHeight - 600,
        width: 400,
        height: 500
      }}
      minWidth={300}
      minHeight={400}
      bounds="window"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      className="z-50 fixed"
    >
      <Card
        ref={containerRef}
        className={cn(
          'flex flex-col w-full h-full overflow-hidden shadow-xl',
          isMaximized && 'fixed inset-4 w-auto h-auto'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h3 className="font-semibold">Chat</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleMaximize}
            >
              {isMaximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatWindow />
        </div>
      </Card>
    </Rnd>
  );
}