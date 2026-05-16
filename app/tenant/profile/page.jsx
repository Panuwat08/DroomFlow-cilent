"use client";
import { useEffect, useState } from "react";
import ModalPassword from "../../../components/profile/modaelPassword";
import {
     Mail,
     Phone,
     User,
     Building2,
     Shield,
     Pencil,
     Key,
} from "lucide-react";
import ModalUpdateProfile from "../../../components/profile/modaelUpdateProfile";

export default function ProfilePage() {

     const [user, setUser] = useState(null);
     const [openPasswordModal, setOpenPasswordModal] = useState(false);
     const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);

     useEffect(() => {

          const storedUser =
               localStorage.getItem("user");

          if (storedUser) {
               setUser(JSON.parse(storedUser));
          }

     }, []);

     return (
          <div className="space-y-5 px-2 sm:px-4 md:px-6 py-4">

               {/* Profile Card */}
               <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl overflow-hidden">

                    {/* Top Section */}
                    <div className="bg-linear-to-r from-green-600 to-lime-600 p-4 sm:p-6 md:p-8">

                         <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">

                              {/* Avatar */}
                              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 backdrop-blur-md border-4 border-white flex items-center justify-center shadow-lg sm:shadow-2xl shrink-0">
                                   <User size={40} className="sm:block hidden text-white" />
                                   <User size={32} className="sm:hidden text-white" />
                              </div>

                              {/* User Info */}
                              <div className="text-white text-center md:text-left">

                                   <h2 className="text-2xl sm:text-3xl md:text-4xl font-black warp-break">

                                        {user?.prefix} {user?.first_name} {user?.last_name}

                                   </h2>

                                   <p className="text-green-100 text-sm sm:text-base md:text-lg mt-2 break-all">
                                        {user?.email}
                                   </p>

                                   <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-sm sm:text-base">

                                        <Shield size={16} className="sm:block hidden" />
                                        <Shield size={14} className="sm:hidden" />

                                        {user?.role}

                                   </div>

                              </div>

                         </div>

                    </div>

                    {/* Detail Section */}
                    <div className="p-4 sm:p-6 md:p-8">

                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                              {/* Email */}
                              <div className="bg-green-50 hover:bg-green-100 transition duration-300 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-green-100">

                                   <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">

                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg shrink-0">

                                             <Mail size={20} className="sm:block hidden" />
                                             <Mail size={18} className="sm:hidden" />

                                        </div>

                                        <div className="min-w-0">

                                             <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                                                  Email
                                             </h3>

                                             <p className="text-gray-500 text-xs sm:text-sm">
                                                  อีเมลผู้ใช้งาน
                                             </p>

                                        </div>

                                   </div>

                                   <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700 break-all">

                                        {user?.email}

                                   </p>

                              </div>

                              {/* Phone */}
                              <div className="bg-green-50 hover:bg-green-100 transition duration-300 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-green-100">

                                   <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">

                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg shrink-0">

                                             <Phone size={20} className="sm:block hidden" />
                                             <Phone size={18} className="sm:hidden" />

                                        </div>

                                        <div className="min-w-0">

                                             <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                                                  เบอร์โทรศัพท์
                                             </h3>

                                             <p className="text-gray-500 text-xs sm:text-sm">
                                                  หมายเลขติดต่อ
                                             </p>

                                        </div>

                                   </div>

                                   <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">

                                        {user?.phone || "-"}

                                   </p>

                              </div>

                              {/* Role */}
                              <div className="bg-green-50 hover:bg-green-100 transition duration-300 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-green-100">
                                   <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg shrink-0">
                                             <Shield size={20} className="sm:block hidden" />
                                             <Shield size={18} className="sm:hidden" />
                                        </div>
                                        <div className="min-w-0">
                                             <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                                                  สิทธิ์ผู้ใช้งาน
                                             </h3>
                                             <p className="text-gray-500 text-xs sm:text-sm">
                                                  ระดับการเข้าถึงระบบ
                                             </p>
                                        </div>
                                   </div>
                                   <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">
                                        {user?.role}
                                   </p>
                              </div>
                              {/* Room */}
                              <div className="bg-green-50 hover:bg-green-100 transition duration-300 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-green-100">

                                   <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">

                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg shrink-0">
                                             <Building2 size={20} className="sm:block hidden text-white" />
                                             <Building2 size={18} className="sm:hidden" />
                                        </div>
                                        <div className="min-w-0">
                                             <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                                                  ห้องพัก
                                             </h3>
                                             <p className="text-gray-500 text-xs sm:text-sm">
                                                  หมายเลขห้องพัก
                                             </p>
                                        </div>
                                   </div>
                                   <p className="text-sm sm:text-base md:text-lg font-medium text-gray-700">
                                        A-101
                                   </p>
                              </div>
                         </div>

                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 px-4 sm:px-6 md:px-8 mb-4 sm:mb-6 md:mb-8">
                         <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-b from-green-700 to-lime-700 hover:from-green-800 hover:to-lime-800 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition duration-300 shadow-lg text-sm sm:text-base"
                              onClick={() => setOpenUpdateProfileModal(true)}>
                              <Pencil size={16} className="sm:block hidden" />
                              <Pencil size={14} className="sm:hidden" />
                              แก้ไขโปรไฟล์
                         </button>
                         <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-b from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition duration-300 shadow-lg text-sm sm:text-base"
                              onClick={() => setOpenPasswordModal(true)}>

                              <Key size={16} className="sm:block hidden" />
                              <Key size={14} className="sm:hidden" />
                              เปลียนรหัสผ่าน
                         </button>
                    </div>


               </div>
               <ModalPassword
                    open={openPasswordModal}
                    setOpen={setOpenPasswordModal}
               />
               <ModalUpdateProfile
                    open={openUpdateProfileModal}
                    setOpen={setOpenUpdateProfileModal}
                    user={user}
               />
          </div>
     );
}