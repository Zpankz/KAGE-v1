import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { DataInput } from '@/components/DataInput';
import { useAuth } from '@/contexts/AuthContext';
import { useGraph } from '@/contexts/GraphContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  AlertCircle,
  ChartBarIcon,
  FileText,
  Grid,
  Link as LinkIcon,
  LogOut,
  Menu,
  MessageSquare,
  Network,
  Settings,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navButtons = [
  { path: '/data', icon: FileText, label: 'Data' },
  { path: '/schema', icon: Grid, label: 'Schema' },
  { path: '/llm', icon: MessageSquare, label: 'LLM' },
  { path: '/graph', icon: ChartBarIcon, label: 'Graph' },
  { path: '/viewer', icon: Network, label: 'Viewer' },
];

export function Header() {
  const [inputDialog, setInputDialog] = useState<'text' | 'file' | 'url' | null>(null);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { pathwayMode, setPathwayMode } = useGraph();

  const toggleRightPanel = () => {
    setRightSidebarOpen(!rightSidebarOpen);
    window.dispatchEvent(
      new CustomEvent('toggleRightPanel', {
        detail: { open: !rightSidebarOpen }
      })
    );
  };

  const getPathwayLabel = () => {
    switch (pathwayMode) {
      case 'direct':
        return 'Direct Path';
      case 'importance':
        return 'Importance Path';
      case 'context':
        return 'Context Path';
      default:
        return '';
    }
  };

  const getPathwayColor = () => {
    switch (pathwayMode) {
      case 'direct':
        return 'text-red-500';
      case 'importance':
        return 'text-yellow-500';
      case 'context':
        return 'text-blue-500';
      default:
        return '';
    }
  };

  const cyclePathwayMode = () => {
    if (!pathwayMode) {
      setPathwayMode('direct');
    } else if (pathwayMode === 'direct') {
      setPathwayMode('importance');
    } else if (pathwayMode === 'importance') {
      setPathwayMode('context');
    } else {
      setPathwayMode(null);
    }
  };

  const handleNavClick = (path: string) => {
    if (location.pathname === path) {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          {navButtons.map((btn) => {
            const isActive = location.pathname === btn.path;
            return (
              <Button
                key={btn.path}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleNavClick(btn.path)}
                asChild
              >
                <Link to={btn.path} className="flex items-center gap-2">
                  <btn.icon className="h-4 w-4" />
                  {isActive && <span>{btn.label}</span>}
                </Link>
              </Button>
            );
          })}
        </div>

        <div className="flex-1 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputDialog('text')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputDialog('file')}
          >
            <Upload className="h-4 w-4 mr-2" />
            File
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputDialog('url')}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            URL
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {pathwayMode && (
            <span className={cn("text-sm", getPathwayColor())}>
              {getPathwayLabel()}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={cyclePathwayMode}
            className={getPathwayColor()}
          >
            <Network className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRightPanel}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>

      <Dialog open={!!inputDialog} onOpenChange={() => setInputDialog(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DataInput initialMode={inputDialog || 'text'} onClose={() => setInputDialog(null)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}