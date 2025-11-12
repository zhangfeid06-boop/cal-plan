import { Home, Calendar, Settings, Users, DoorOpen, Shield, Menu } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '会议室管理', href: '/', icon: Home },
  { name: '预约会议室', href: '/booking', icon: Calendar },
  { name: '我的会议', href: '/my-meetings', icon: Users },
  { name: '会议水牌', href: '/display', icon: DoorOpen },
  { name: '节能场景', href: '/energy', icon: Settings },
  { name: '公告管理', href: '/announcements', icon: Shield },
];

export function AppSidebar() {
  return (
    <div className="flex h-screen w-56 flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
            M
          </div>
          <span className="text-sidebar-foreground font-semibold text-sm">
            会议室管理
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground text-xs font-medium">
            测
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              [测试] 线上通行/堪控/会...
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              17858262879
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
