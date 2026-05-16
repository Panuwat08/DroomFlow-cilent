"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Lock, Mail, MailCheck, Receipt, Eye, EyeOff, LockIcon } from "lucide-react";
import { API_URL } from "../../src/lib/config";

// Function to decode JWT token
const decodeToken = (token) => {

     // เช็คก่อนว่า token มีไหม
     if (!token || typeof token !== "string") {
          return null;
     }

     try {

          const base64Url = token.split('.')[1];

          if (!base64Url) {
               return null;
          }

          const base64 = base64Url
               .replace(/-/g, '+')
               .replace(/_/g, '/');

          const jsonPayload = decodeURIComponent(
               atob(base64)
                    .split('')
                    .map((c) => {
                         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join('')
          );

          return JSON.parse(jsonPayload);

     } catch (error) {

          console.error("Invalid token:", error);

          return null;
     }
};

export default function LoginPage() {
     const router = useRouter();

     const [email, setEmail] = useState("");

     const [password, setPassword] = useState("");

     const [loading, setLoading] = useState(false);
     const [showPassword, setShowPassword] = useState(false);

     const handleLogin = async (e) => {
          e.preventDefault();

          // Validate inputs
          if (!email || !password) {
               Swal.fire({
                    icon: "warning",
                    title: "ข้อมูลไม่ครบถ้วน",
                    text: "กรุณากรอก Email และ Password",
               });
               return;
          }

          try {

               setLoading(true);

               const { data } = await axios.post(
                    `${API_URL}/auth/login`,
                    {
                         email,
                         password,
                    }
               );

               // save token
               localStorage.setItem(
                    "token",
                    data.token
               );

               // save user
               localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
               );

               Swal.fire({
                    icon: "success",
                    title: "เข้าสู่ระบบสำเร็จ",
                    timer: 1500,
                    showConfirmButton: false,
               });

               // redirect
               if (data.user.role === "ADMIN") {

                    router.push("/admin/dashboard");

               } else if (data.user.role === "TENANT") {

                    router.push("/tenant/dashboard");

               } else {

                    router.push("/");
               }

          } catch (error) {

               console.log(error);

               const errorMessage =
                    error.response?.data?.message ||
                    "เกิดข้อผิดพลาด";

               Swal.fire({
                    icon: "error",
                    title: "เข้าสู่ระบบไม่สำเร็จ",
                    text: errorMessage,
               });

          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-green-100 flex items-center justify-center px-3 sm:px-4 py-4">
               <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-6 sm:p-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-green-100 rounded-full mb-6 sm:mb-8 shadow-lg">
                         <Receipt className="w-10 h-10 sm:w-12 sm:h-12 text-green-700" />
                    </div>
                    {/* Header */}
                    <div className="text-center mb-3">

                         <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                              DormFlow
                         </h1>
                         <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                              ระบบเก็บค่าน้ำค่าไฟหอพัก
                         </p>
                    </div>
                    {/* Form */}
                    <form
                         onSubmit={handleLogin}
                         className="space-y-4 sm:space-y-5"
                    >
                         {/* Email */}
                         <div>
                              <label className="block text-xs sm:text-sm font-medium mb-0.5">
                                   <div className="flex gap-1 ml-1">
                                        <MailCheck className="w-4 sm:w-5 shrink-0" />
                                        <p className="mt-0.5">Email</p>
                                   </div>
                              </label>
                              <input
                                   type="email"
                                   placeholder="example@gmail.com"
                                   value={email}
                                   onChange={(e) =>
                                        setEmail(e.target.value)
                                   }
                                   className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500" />
                         </div>
                         <div className="relative">
                              <label className="block text-xs sm:text-sm font-medium mb-0.5">
                                   <div className="flex gap-1 ml-1">
                                        <LockIcon className="w-4 sm:w-5 shrink-0" />
                                        <p className="mt-0.5">Password</p>
                                   </div>
                              </label>

                              <input
                                   type={
                                        showPassword
                                             ? "text"
                                             : "password"
                                   }

                                   placeholder="••••••••"
                                   value={password}

                                   onChange={(e) =>
                                        setPassword(e.target.value)
                                   }
                                   className="w-full border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                              />

                              <button
                                   type="button"

                                   onClick={() =>
                                        setShowPassword(
                                             !showPassword
                                        )
                                   }

                                   className="absolute right-4 top-1/2 mt-3 -translate-y-1/2 text-gray-500 hover:text-green-600 transition"
                              >

                                   {
                                        showPassword
                                             ? <EyeOff size={20} />
                                             : <Eye size={20} />
                                   }

                              </button>

                         </div>
                         {/* Button */}
                         <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition duration-300 text-sm sm:text-base"
                         >
                              {
                                   loading
                                        ? "กำลังเข้าสู่ระบบ..."
                                        : "เข้าสู่ระบบ"
                              }
                         </button>

                         <div className="text-center">
                              <p className="text-xs sm:text-sm text-gray-500">
                                   หากลืมรหัสผ่านกรุณาติดต่อผู้ดูแลระบบ
                              </p>
                         </div>
                    </form>
               </div>
          </div>
     );
}