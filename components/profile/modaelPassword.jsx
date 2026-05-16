"use client";

import { useState } from "react";

import {
     Lock,
     Eye,
     EyeOff,
     X,
     Save,
} from "lucide-react";

import axios from "axios";

import Swal from "sweetalert2";

import { API_URL }
     from "@/src/lib/config";

const ModalPassword = ({
     open,
     setOpen,
}) => {

     const [
          showOldPassword,
          setShowOldPassword,
     ] = useState(false);

     const [
          showNewPassword,
          setShowNewPassword,
     ] = useState(false);

     const [
          showConfirmPassword,
          setShowConfirmPassword,
     ] = useState(false);

     const [
          oldPassword,
          setOldPassword,
     ] = useState("");

     const [
          newPassword,
          setNewPassword,
     ] = useState("");

     const [
          confirmNewPassword,
          setConfirmNewPassword,
     ] = useState("");

     const [loading, setLoading] =
          useState(false);

     const handleSubmit = async () => {

          if (
               !oldPassword ||
               !newPassword ||
               !confirmNewPassword
          ) {

               return Swal.fire({
                    icon: "warning",
                    title: "ข้อมูลไม่ครบ",
                    text: "กรุณากรอกข้อมูลให้ครบถ้วน",
               });
          }

          if (
               newPassword !==
               confirmNewPassword
          ) {

               return Swal.fire({
                    icon: "warning",
                    title: "รหัสผ่านไม่ตรงกัน",
                    text: "กรุณาตรวจสอบรหัสผ่านใหม่",
               });
          }

          try {

               setLoading(true);

               await axios.post(
                    `${API_URL}/profile/update-password`,

                    {
                         oldPassword,
                         newPassword,
                         confirmNewPassword,
                    },

                    {
                         headers: {
                              "Content-Type":
                                   "application/json",

                              Authorization:
                                   `Bearer ${localStorage.getItem("token")}`,
                         },
                    }
               );

               Swal.fire({
                    icon: "success",
                    title: "สำเร็จ",
                    text: "เปลี่ยนรหัสผ่านสำเร็จ",
               });

               setOpen(false);

               setOldPassword("");
               setNewPassword("");
               setConfirmNewPassword("");

          } catch (error) {

               console.log(
                    error.response.data
               );

               Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",

                    text:
                         error?.response?.data?.message ||
                         "เกิดข้อผิดพลาด",
               });

          } finally {

               setLoading(false);
          }
     };

     return (
          <>
               {
                    open && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2 sm:px-4 py-4">

                              {/* Modal */}
                              <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                                   {/* Header */}
                                   <div className="bg-linear-to-r from-green-600 to-lime-700 p-4 sm:p-6 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                  <Lock className="text-white" size={20} />
                                             </div>
                                             <div className="min-w-0">
                                                  <h2 className="text-xl sm:text-2xl font-black text-white  wrap-break">
                                                       เปลี่ยนรหัสผ่าน
                                                  </h2>
                                                  <p className="text-green-100 text-xs sm:text-sm">
                                                       กรุณากรอกข้อมูลให้ครบถ้วน
                                                  </p>
                                             </div>
                                        </div>
                                        {/* Close */}
                                        <button
                                             onClick={() =>
                                                  setOpen(false)
                                             }
                                             className="text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition shrink-0"
                                        >
                                             <X size={20} className="sm:block hidden" />
                                             <X size={18} className="sm:hidden" />
                                        </button>
                                   </div>
                                   {/* Body */}
                                   <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                                        {/* Old Password */}
                                        <div>
                                             <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                                                  รหัสผ่านเดิม
                                             </label>
                                             <div className="relative">
                                                  <input
                                                       type={
                                                            showOldPassword
                                                                 ? "text"
                                                                 : "password"
                                                       }
                                                       placeholder="กรอกรหัสผ่านเดิม"
                                                       value={oldPassword}
                                                       onChange={(e) =>
                                                            setOldPassword(
                                                                 e.target.value
                                                            )
                                                       }
                                                       className="w-full border border-gray-300 rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />
                                                  <button
                                                       type="button"
                                                       onClick={() =>
                                                            setShowOldPassword(
                                                                 !showOldPassword
                                                            )
                                                       }
                                                       className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                  >
                                                       {
                                                            showOldPassword
                                                                 ? <EyeOff size={18} className="sm:hidden" />
                                                                 : <Eye size={18} className="sm:hidden" />
                                                       }
                                                       {
                                                            showOldPassword
                                                                 ? <EyeOff size={20} className="hidden sm:block" />
                                                                 : <Eye size={20} className="hidden sm:block" />
                                                       }
                                                  </button>
                                             </div>
                                        </div>
                                        {/* New Password */}
                                        <div>
                                             <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                                                  รหัสผ่านใหม่
                                             </label>
                                             <div className="relative">
                                                  <input
                                                       type={
                                                            showNewPassword
                                                                 ? "text"
                                                                 : "password"
                                                       }
                                                       placeholder="กรอกรหัสผ่านใหม่"
                                                       value={newPassword}
                                                       onChange={(e) =>
                                                            setNewPassword(
                                                                 e.target.value
                                                            )
                                                       }
                                                       className="w-full border border-gray-300 rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />
                                                  <button
                                                       type="button"
                                                       onClick={() =>
                                                            setShowNewPassword(
                                                                 !showNewPassword
                                                            )
                                                       }
                                                       className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                  >
                                                       {
                                                            showNewPassword
                                                                 ? <EyeOff size={18} className="sm:hidden" />
                                                                 : <Eye size={18} className="sm:hidden" />
                                                       }
                                                       {
                                                            showNewPassword
                                                                 ? <EyeOff size={20} className="hidden sm:block" />
                                                                 : <Eye size={20} className="hidden sm:block" />
                                                       }
                                                  </button>
                                             </div>
                                        </div>
                                        {/* Confirm Password */}
                                        <div>
                                             <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                                                  ยืนยันรหัสผ่านใหม่
                                             </label>
                                             <div className="relative">
                                                  <input
                                                       type={
                                                            showConfirmPassword
                                                                 ? "text"
                                                                 : "password"
                                                       }
                                                       placeholder="ยืนยันรหัสผ่านใหม่"
                                                       value={confirmNewPassword}
                                                       onChange={(e) =>
                                                            setConfirmNewPassword(
                                                                 e.target.value
                                                            )
                                                       }
                                                       className="w-full border border-gray-300 rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />
                                                  <button
                                                       type="button"
                                                       onClick={() =>
                                                            setShowConfirmPassword(
                                                                 !showConfirmPassword
                                                            )
                                                       }
                                                       className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                  >
                                                       {
                                                            showConfirmPassword
                                                                 ? <EyeOff size={18} className="sm:hidden" />
                                                                 : <Eye size={18} className="sm:hidden" />
                                                       }
                                                       {
                                                            showConfirmPassword
                                                                 ? <EyeOff size={20} className="hidden sm:block" />
                                                                 : <Eye size={20} className="hidden sm:block" />
                                                       }
                                                  </button>
                                             </div>
                                        </div>
                                        {/* Footer */}
                                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
                                             <button
                                                  onClick={() =>
                                                       setOpen(false)
                                                  }
                                                  className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-2xl bg-gray-100 hover:bg-gray-200 transition text-sm sm:text-base font-medium"
                                             >
                                                  ยกเลิก
                                             </button>
                                             <button
                                                  onClick={handleSubmit}
                                                  disabled={loading}
                                                  className=" flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-2xl bg-linear-to-r from-green-500 to-green-700 text-white font-semibold hover:opacity-90 transition shadow-lg disabled:opacity-50 text-sm sm:text-base"
                                             >
                                                  <Save size={18} className="sm:hidden" />
                                                  <Save size={20} className="hidden sm:block" />
                                                  {
                                                       loading
                                                            ? "กำลังบันทึก..."
                                                            : "บันทึก"
                                                  }
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )
               }
          </>
     );
};

export default ModalPassword;