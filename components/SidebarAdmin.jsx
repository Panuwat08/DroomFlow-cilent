"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Building2,
  Users,
  Zap,
  CreditCard,
  LogOut,
  ReceiptCent,
  UserCog,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

export default function SidebarAdmin() {

  const pathname = usePathname();

  const [open, setOpen] =
    useState(false);

  const menus = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "จัดการห้องพัก",
      href: "/admin/manage-rooms",
      icon: Building2,
    },

    {
      name: "จัดการผู้เช่า",
      href: "/admin/manage-tenants",
      icon: Users,
    },

    {
      name: "เเจ้งค่าน้ำค่าไฟ",
      href: "/admin/meters",
      icon: Zap,
    },

    {
      name: "รายการชำระเงิน",
      href: "/admin/payments",
      icon: CreditCard,
    },

    {
      name: "โปรไฟล์",
      href: "/admin/profile",
      icon: UserCog,
    },
  ];

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white h-16 flex items-center justify-between px-4 shadow-lg">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">

            <ReceiptCent size={20} />

          </div>

          <h1 className="text-2xl font-black">
            DormFlow
          </h1>

        </div>

        {/* Menu Button */}
        <button
          onClick={() =>
            setOpen(!open)
          }
        >

          {
            open
              ? <X size={28} />
              : <Menu size={28} />
          }

        </button>

      </div>

      {/* Overlay */}
      {
        open && (
          <div
            onClick={() =>
              setOpen(false)
            }

            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )
      }

      {/* Sidebar */}
      <aside
        className={`
    fixed top-0 left-0 z-50
    w-64 h-screen bg-linear-to-b from-gray-800 to-gray-700 text-white flex flex-col shadow-2xl transition-transform duration-300

    ${open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
  `}
      >

        {/* Logo */}
        <div className="h-20 flex items-center justify-center gap-3 border-b border-green-700">

          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">

            <ReceiptCent size={25} />

          </div>

          <h1 className="text-3xl font-black">

            DormFlow

          </h1>

        </div>

        {/* Menu */}
        <div className="flex-1 p-5 space-y-2 overflow-y-auto">

          {
            menus.map((menu) => {

              const Icon =
                menu.icon;

              return (
                <Link
                  key={menu.href}
                  href={menu.href}

                  onClick={() =>
                    setOpen(false)
                  }

                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-2xl transition duration-300

                    ${pathname === menu.href
                      ? "bg-green-600 shadow-lg"
                      : "hover:bg-green-700"
                    }
                  `}
                >

                  <Icon size={22} />

                  <span className="font-medium">

                    {menu.name}

                  </span>

                </Link>
              );
            })
          }

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-green-700">

          <button
            onClick={handleLogout}

            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-2xl font-semibold transition duration-300 flex items-center justify-center gap-2"
          >

            <LogOut size={20} />

            ออกจากระบบ

          </button>

        </div>

      </aside>
    </>
  );
}
