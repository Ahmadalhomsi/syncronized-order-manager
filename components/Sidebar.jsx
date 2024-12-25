
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Package, ClipboardList, Users, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const pathname = usePathname();

  const routes = [
    { path: '/productStock', icon: Package, label: 'Product Stock' },
    { path: '/logPanel', icon: ClipboardList, label: 'Log Panel' },
    { path: '/customerPanel', icon: Users, label: 'Customer Panel' },
    { path: '/admin', icon: Settings, label: 'Admin' }
  ];

  return (
    <div className="w-64 bg-gray-100 p-4 border-r min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <nav className="space-y-2">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link href={route.path} key={route.path}>
              <Button 
                variant={pathname === route.path ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Icon className="mr-2 h-5 w-5" />
                {route.label}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;