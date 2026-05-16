"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { User, Phone, Mail, X, Save, } from "lucide-react";

import { API_URL } from "@/src/lib/config";

const ModalUpdateProfile = ({ open, setOpen, user }) => {

     const [prefix, setPrefix] = useState("");
     const [firstName, setFirstName] = useState("");
     const [lastName, setLastName] = useState("");
     const [phone, setPhone] = useState("");

     const [loading, setLoading] = useState(false);

     useEffect(() => {
          if (user) {
               setPrefix(user?.prefix || "");
               setFirstName(user?.first_name || "");
               setLastName(user?.last_name || "");
               setPhone(user?.phone || "");
          }
     }, [user]);

     const handleUpdateProfile = async () => {

          try {

               if (!prefix || !firstName || !lastName || !phone) {

                    return Swal.fire({
                         icon: "warning",
                         title: "ข้อมูลไม่ครบ",
                         text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                    });
               }

               // เอาเฉพาะตัวเลข
               const rawPhone = phone.replace(/\D/g, "");

               // ตรวจ 10 หลัก
               if (rawPhone.length !== 10) {

                    return Swal.fire({
                         icon: "warning",
                         title: "ข้อมูลไม่ถูกต้อง",
                         text: "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก",
                    });
               }

               setLoading(true);

               const { data } = await axios.put(
                    `${API_URL}/profile/update-profile`,
                    {
                         prefix,
                         first_name: firstName,
                         last_name: lastName,
                         phone: rawPhone,
                    },
                    {
                         headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("token")}`,
                         },
                    }
               );

               Swal.fire({
                    icon: "success",
                    title: "สำเร็จ",
                    text: data.message,
               });

               const oldUser = JSON.parse(localStorage.getItem("user"));

               const updatedUser = {
                    ...oldUser,
                    prefix,
                    first_name: firstName,
                    last_name: lastName,
                    phone,
               };

               localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
               );

               setOpen(false);

               window.location.reload();

          } catch (error) {

               console.error(error);

               Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text:
                         error?.response?.data?.message ||
                         "ไม่สามารถอัปเดตข้อมูลได้",
               });

          } finally {

               setLoading(false);
          }
     };

     const formatPhone = (value) => {

          const phoneNumber = value.replace(/\D/g, "");

          const trimmed = phoneNumber.slice(0, 10);

          if (trimmed.length < 4) {
               return trimmed;
          }

          if (trimmed.length < 7) {
               return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
          }

          return `${trimmed.slice(0, 3)}-${trimmed.slice(3, 6)}-${trimmed.slice(6)}`;
     };

     if (!open) return null;

     return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

               <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                    {/* Header */}
                    <div className="bg-linear-to-r from-green-600 to-lime-600 px-6 py-5 flex items-center justify-between">

                         <div className="flex items-center gap-4">

                              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                   <User className="text-white" size={28} />
                              </div>

                              <div>
                                   <h2 className="text-2xl font-bold text-white">
                                        แก้ไขโปรไฟล์
                                   </h2>

                                   <p className="text-green-100 text-sm">
                                        อัปเดตข้อมูลส่วนตัวของคุณ
                                   </p>
                              </div>

                         </div>

                         <button
                              onClick={() => setOpen(false)}
                              className="p-2 rounded-xl hover:bg-white/20 transition"
                         >
                              <X className="text-white" />
                         </button>

                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">

                         {/* Row */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                              {/* Prefix */}
                              <div className="">
                                   <label className="block text-sm font-semibold mb-2">
                                        คํานําหน้าชื่อ
                                   </label>
                                   <select
                                        value={prefix}
                                        onChange={(e) => setPrefix(e.target.value)}
                                        className="w-full h-12 border border-gray-300 rounded-2xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                   >

                                        <option value=""> เลือกคำนำหน้า </option>
                                        <option value="นาย"> นาย </option>
                                        <option value="นาง"> นาง </option>
                                        <option value="นางสาว"> นางสาว </option>

                                   </select>
                              </div>


                              {/* Firstname */}
                              <div>
                                   <label className="block text-sm font-semibold mb-2">
                                        ชื่อ
                                   </label>

                                   <div className="relative">

                                        <User
                                             size={18}
                                             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                             type="text"
                                             value={firstName}
                                             onChange={(e) => setFirstName(e.target.value)}
                                             placeholder="กรอกชื่อ"
                                             className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />

                                   </div>
                              </div>

                              {/* Lastname */}
                              <div>
                                   <label className="block text-sm font-semibold mb-2">
                                        นามสกุล
                                   </label>

                                   <div className="relative">

                                        <User
                                             size={18}
                                             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                             type="text"
                                             value={lastName}
                                             onChange={(e) => setLastName(e.target.value)}
                                             placeholder="กรอกนามสกุล"
                                             className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />

                                   </div>
                              </div>

                         </div>

                         {/* Email */}
                         <div>

                              <label className="block text-sm font-semibold mb-2">
                                   Email
                              </label>

                              <div className="relative">

                                   <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                   />

                                   <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full bg-gray-100 border border-gray-300 rounded-2xl pl-11 pr-4 py-3 text-gray-500"
                                   />

                              </div>

                         </div>

                         {/* Phone */}
                         <div>

                              <label className="block text-sm font-semibold mb-2">
                                   เบอร์โทรศัพท์
                              </label>

                              <div className="relative">

                                   <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                   />

                                   <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => {
                                             setPhone(formatPhone(e.target.value));
                                        }}
                                        placeholder="08x-xxx-xxxx"
                                        maxLength={12}
                                        className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                   />

                              </div>

                         </div>

                         {/* Footer */}
                         <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

                              <button
                                   onClick={() => setOpen(false)}
                                   className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition font-medium"
                              >
                                   ยกเลิก
                              </button>

                              <button
                                   onClick={handleUpdateProfile}
                                   disabled={loading}
                                   className="px-6 py-3 rounded-2xl bg-linear-to-r from-green-500 to-green-700 text-white font-semibold shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                              >

                                   <Save size={18} />

                                   {
                                        loading
                                             ? "กำลังบันทึก..."
                                             : "บันทึกข้อมูล"
                                   }

                              </button>

                         </div>

                    </div>

               </div>

          </div>
     );
};

export default ModalUpdateProfile;