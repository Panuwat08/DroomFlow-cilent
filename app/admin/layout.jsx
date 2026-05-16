"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import SidebarAdmin from "@/components/SidebarAdmin";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AdminLayout({ children }) {

  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("token");

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    // no token
    if (!token || !user) {
      router.push("/login");
      return;
    }

    // not admin
    if (user.role !== "ADMIN") {
      router.push("/login");
    }

  }, []);

  return (
    <div className="min-h-screen bg-green-50">

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 z-50">
        <SidebarAdmin />
      </div>

      {/* Main */}
      <main className="ml-64 min-h-screen flex flex-col">

        {/* Header */}
        <div className="sticky top-0 z-40 bg-white shadow">
          <Header />
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {children}
        </div>

        {/* Footer */}
        <Footer />

      </main>

    </div>
  );
}