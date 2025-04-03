
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Package2, 
  Calendar, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      href: '/',
    },
    {
      icon: <Users size={20} />,
      label: 'Customers',
      href: '/customers',
    },
    {
      icon: <ClipboardList size={20} />,
      label: 'Orders',
      href: '/orders',
    },
    {
      icon: <Package2 size={20} />,
      label: 'Inventory',
      href: '/inventory',
    },
    {
      icon: <Calendar size={20} />,
      label: 'Production',
      href: '/production',
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      href: '/settings',
    },
  ];

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground flex flex-col fixed left-0 top-0 z-40 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-bold">PrintFlow</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "ml-auto"
          )}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                <span>{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={cn(
        "p-4 border-t border-sidebar-border text-sm",
        collapsed && "hidden"
      )}>
        <p className="text-sidebar-foreground/70">
          PrintFlow v1.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
