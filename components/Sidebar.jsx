"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
    FileSignatureIcon,
    LayoutDashboard,
    LibrarySquare,
    FileText,
    FileSearch2,
    Search,
    Home,
    Settings,
    ChevronsLeftRight,
    MailOpen,
    CalendarClock,
    SquareKanban,
} from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";

export default function SideNavbar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileWidth, setIsMobileWidth] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsMobileWidth(window.innerWidth < 1200);
        }

        // Set the initial value and add resize listener
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const links = [
        { title: "Admin", icon: Home, href: "/admin" },
        { title: "Customer Panel", icon: FileText, href: "/customerPanel" },
        { title: "Product Stock Panel", icon: LayoutDashboard, href: "/productStock" },
        { title: "Log Panel", icon: CalendarClock, href: "/logPanel" },
    ];

    function toggleSidebar() {
        setIsCollapsed(!isCollapsed);
    }

    if (isMobileWidth) {
        return null; // Hide sidebar on mobile
    }

    const logout = async () => {
        // delete user_session
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            window.location.href = '/login';
        }
    }

    return (
        <div className="relative min-w-[60px] pt-8 flex justify-center items-center">
            {/* Toggle button */}
            <div className="absolute right-[-20px] -translate-y-1/2">
                <Button
                    onClick={toggleSidebar}
                    variant="secondary"
                    className="p-2 w-10 h-8"
                >
                    <ChevronsLeftRight />
                </Button>
            </div>
            <div className={isCollapsed ? "hidden" : "w-full"}>
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.title}>
                            <a
                                href={link.href}
                                className="flex items-center gap-2 p-4 text-gray-800 hover:text-black hover:bg-gray-100 rounded-md"
                            >
                                <link.icon className="w-5 h-5" />
                                {!isCollapsed && <span>{link.title}</span>}
                            </a>
                        </li>
                    ))}
                </ul>
                <Button
                    variant="ghost"
                    className="w-full justify-start flex items-center gap-4 text-red-800 "
                    onClick={logout}
                >
                    <ExitIcon className="w-5 h-5" />
                    {!isCollapsed && <span>Logout</span>}
                </Button>
            </div>
        </div>
    );
}
