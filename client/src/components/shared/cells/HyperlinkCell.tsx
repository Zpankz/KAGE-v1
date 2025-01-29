import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HyperlinkCellProps {
  to: string;
  text: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
}

export function HyperlinkCell({
  to,
  text,
  icon,
  className,
  disabled = false,
  tooltip,
}: HyperlinkCellProps) {
  const content = (
    <div
      className={cn(
        'flex items-center gap-2',
        disabled ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:underline',
        className
      )}
      title={tooltip}
    >
      {icon}
      <span>{text}</span>
    </div>
  );

  if (disabled) {
    return content;
  }

  return (
    <Link 
      to={to}
      className="outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {content}
    </Link>
  );
}