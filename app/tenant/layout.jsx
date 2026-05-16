"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import SidebarTenant from "@/components/SidebarTenant";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function TenantLayout({
     children,
}) {

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

          // not tenant
          if (user.role !== "TENANT") {
               router.push("/login");
          }

     }, []);

     return (
          <div className="min-h-screen bg-gray-100">

               {/* Sidebar */}
               <div className="fixed top-0 left-0 h-screen w-72 z-50">
                    <SidebarTenant />
               </div>

               {/* Main */}
               <main className="lg:ml-72 min-h-screen flex flex-col">

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