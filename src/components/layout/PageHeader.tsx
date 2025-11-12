import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, action, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          {action && <div>{action}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}
