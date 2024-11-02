"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Shield, Key, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hasRole } from "@/lib/auth";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType;
  role?: string;
}

const items: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "User Management",
    href: "/dashboard/users",
    icon: Users,
    role: "admin",
  },
  {
    title: "Role Management",
    href: "/dashboard/roles",
    icon: Shield,
    role: "admin",
  },
  {
    title: "License Management",
    href: "/dashboard/licenses",
    icon: Key,
    role: "admin",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          if (item.role && !hasRole(item.role)) {
            return null;
          }

          return (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                pathname === item.href && "bg-muted"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          );
        })}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={() => {
            // Handle logout
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </ScrollArea>
  );
}