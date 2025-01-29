import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { DraggableChat } from './DraggableChat';
import { NodeTooltip } from './NodeTooltip';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export function Layout() {
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  useEffect(() => {
    const handleRightPanelToggle = (event: CustomEvent<{ open: boolean }>) => {
      setRightPanelOpen(event.detail.open);
    };

    window.addEventListener('toggleRightPanel', handleRightPanelToggle as EventListener);

    return () => {
      window.removeEventListener('toggleRightPanel', handleRightPanelToggle as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={75}>
          <main className="p-6">
            <Outlet />
          </main>
        </ResizablePanel>
        {rightPanelOpen && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25}>
              <div className="h-[calc(100vh-4rem)] bg-background border-l">
                <NodeTooltip />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      <Footer />
      <DraggableChat />
    </div>
  );
}