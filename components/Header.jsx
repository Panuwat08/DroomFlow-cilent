"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

const Header = () => {

     const router = useRouter();

     const [user, setUser] = useState(null);

     useEffect(() => {

          const storedUser =
               localStorage.getItem("user");

          if (storedUser) {
               setUser(JSON.parse(storedUser));
          }

     }, []);

     const handleLogout = () => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/");
     };

     return (
          <header className="w-full bg-linear-to-r from-green-600 to-lime-600 mb-4 sm:mb-4 px-2 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-2">
               {/* Left */}
               <div className="min-w-0">
                    <h1 className=" text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                         ระบบเก็บค่าน้ำค่าไฟหอพัก
                    </h1>
               </div>
               {/* Right */}
               <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    {/* User Info */}
                    <div className="text-right hidden sm:block">
                         <h2 className="font-semibold text-white text-sm md:text-base truncate">
                              {user?.first_name} {user?.last_name}
                         </h2>
                         <p className="text-xs md:text-sm text-gray-200">
                              {user?.role}
                         </p>
                    </div>
                    {/* Avatar */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white bg-linear-to-b from-gray-800 to-gray-700 text-white flex items-center justify-center font-bold shrink-0">
                         <User size={20} className="sm:block hidden" />
                         <User size={18} className="sm:hidden" />
                    </div>
               </div>
          </header>
     );
};
export default Header;
