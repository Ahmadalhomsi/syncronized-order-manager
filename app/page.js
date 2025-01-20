"use client"

import SideNavbar from '@/components/Sidebar';
import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';


const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin');
  }, []);

  return (
    <div className="flex min-h-screen w-full">
    </div>
  );
};

export default AdminDashboard;