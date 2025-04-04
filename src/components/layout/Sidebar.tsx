
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
  ChevronRight,
  Box,
  Tag,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
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
    }
  ];

  const productItems = [
    {
      icon: <Box size={18} />,
      label: 'Products',
      href: '/products',
    },
    {
      icon: <Tag size={18} />,
      label: 'Categories',
      href: '/product-categories',
    },
    {
      icon: <ShoppingCart size={18} />,
      label: 'Suppliers',
      href: '/suppliers',
    }
  ];

  const utilityItems = [
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
      
      <nav className="flex-1 py-4 overflow-y-auto">
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

          {/* Products Menu */}
          <li className="pt-2">
            {!collapsed && <div className="px-4 py-1 text-xs uppercase text-sidebar-foreground/60 font-medium">Products</div>}
            {productItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                  collapsed && "justify-center"
                )}
              >
                <span>{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </li>
          
          {/* Utilities */}
          <li className="pt-2">
            {!collapsed && <div className="px-4 py-1 text-xs uppercase text-sidebar-foreground/60 font-medium">Utilities</div>}
            {utilityItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                  collapsed && "justify-center"
                )}
              >
                <span>{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </li>
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
