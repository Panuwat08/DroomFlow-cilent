"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
     X,
     Save,
     User,
     Mail,
     Phone,
     Lock,
     House,
} from "lucide-react";

import { API_URL } from "@/src/lib/config";
import { formatPhone } from "@/src/lib/formatPhone";
const ManageModalTenant = ({
     open,
     setOpen,
     getTenants,
     editData,
}) => {

     const [prefix, setPrefix] = useState("");
     const [firstName, setFirstName] = useState("");
     const [lastName, setLastName] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [phone, setPhone] = useState("");
     const [roomNumber, setRoomNumber] = useState("");
     const [loading, setLoading] = useState(false);

     const [room, setRoom] = useState([]);

     useEffect(() => {

          if (editData) {

               setPrefix(editData.prefix || "");
               setFirstName(editData.first_name || "");
               setLastName(editData.last_name || "");
               setEmail(editData.email || "");
               setPhone(editData.phone || "");
               setRoomNumber(editData?.tenant?.room?.roomNumber || "");
               setPassword("");
          } else {
               setPrefix("");
               setFirstName("");
               setLastName("");
               setEmail("");
               setPassword("");
               setPhone("");
               setRoomNumber("");
          }
     }, [editData]);
     const handleSubmit =
          async () => {
               try {

                    if (
                         !prefix ||
                         !firstName ||
                         !lastName ||
                         !email ||
                         !phone ||
                         !roomNumber
                    ) {

                         return Swal.fire({
                              icon: "warning",
                              title: "ข้อมูลไม่ครบ",
                              text:
                                   "กรุณากรอกข้อมูลให้ครบถ้วน",
                         });
                    }

                    // create only
                    if (
                         !editData &&
                         !password
                    ) {

                         return Swal.fire({
                              icon: "warning",
                              title:
                                   "กรุณากรอกรหัสผ่าน",
                         });
                    }

                    setLoading(true);
                    // update
                    if (editData) {
                         await axios.put(
                              `${API_URL}/manage-tenant/update/${editData.id}`,
                              {
                                   prefix,
                                   first_name: firstName,
                                   last_name: lastName,
                                   email,
                                   password,
                                   phone,
                                   roomNumber,
                              },
                              {
                                   headers: {
                                        Authorization:
                                             `Bearer ${localStorage.getItem("token")}`,
                                   },
                              }
                         );
                         Swal.fire({
                              icon: "success",
                              title: "สำเร็จ",
                              text:
                                   "แก้ไขข้อมูลผู้เช่าสำเร็จ",
                         });
                    } else {
                         // create
                         await axios.post(
                              `${API_URL}/manage-tenant/create`,
                              {
                                   prefix,
                                   first_name: firstName,
                                   last_name: lastName,
                                   email,
                                   password,
                                   phone,
                                   roomNumber,
                              },
                              {
                                   headers: {
                                        Authorization:
                                             `Bearer ${localStorage.getItem("token")}`,
                                   },
                              }
                         );

                         Swal.fire({
                              icon: "success",
                              title: "สำเร็จ",
                              text:
                                   "เพิ่มผู้เช่าสำเร็จ",
                         });
                    }
                    getTenants();
                    setOpen(false);

               } catch (error) {
                    console.error(error);
                    Swal.fire({
                         icon: "error",
                         title: "เกิดข้อผิดพลาด",
                         text:
                              error?.response?.data
                                   ?.message ||
                              "ไม่สามารถบันทึกข้อมูลได้",
                    });
               } finally {
                    setLoading(false);
               }
          };

     const getRoom = async () => {
          try {
               const { data } = await axios.get(
                    `${API_URL}/manage-room/get-valiable`,
                    {
                         headers: {
                              Authorization:
                                   `Bearer ${localStorage.getItem("token")}`,
                         },
                    }
               );
               setRoom(data.data);
          } catch (error) {
               console.log("🚀 ~ getRoom ~ error:", error)
          }
     }

     useEffect(() => {
          getRoom();
     }, [])
     const formatPhone = (
          value
     ) => {
          const phoneNumber = value.replace(/\D/g, "");
          const match = phoneNumber.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

          if (!match)
               return value;
          return [
               match[1],
               match[2],
               match[3],
          ]
               .filter(Boolean)
               .join("-");
     };
     return (
          <>
               {
                    open && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                              {/* Modal */}
                              <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                                   {/* Header */}
                                   <div className="bg-linear-to-r from-green-600 to-green-700 p-6 flex items-center justify-between">
                                        <div>
                                             <h2 className="text-3xl font-black text-white">
                                                  {
                                                       editData
                                                            ? "แก้ไขผู้เช่าห้องพัก"
                                                            : "เพิ่มผู้เช่าห้องพัก"
                                                  }
                                             </h2>
                                             <p className="text-green-100 mt-1">
                                                  จัดการข้อมูลผู้เช่าห้องพัก
                                             </p>
                                        </div>
                                        <button
                                             onClick={() =>
                                                  setOpen(false)
                                             }
                                             className="text-white hover:bg-white/20 p-2 rounded-xl transition"
                                        >
                                             <X size={24} />
                                        </button>
                                   </div>
                                   {/* Body */}
                                   <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Prefix */}
                                        <div>

                                             <label className="block text-sm font-semibold mb-2">
                                                  คำนำหน้า
                                             </label>

                                             <select
                                                  value={prefix}

                                                  onChange={(e) =>
                                                       setPrefix(
                                                            e.target.value
                                                       )
                                                  }

                                                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                             >

                                                  <option value="" disabled> --เลือกคำนำหน้า--</option>
                                                  <option value="นาย">
                                                       นาย
                                                  </option>
                                                  <option value="นาง">
                                                       นาง
                                                  </option>
                                                  <option value="นางสาว">
                                                       นางสาว
                                                  </option>
                                             </select>
                                        </div>
                                        <div className="">
                                             <label className="block text-sm font-semibold mb-2">
                                                  ห้องพัก
                                             </label>
                                             <select
                                                  value={roomNumber}
                                                  onChange={(e) =>
                                                       setRoomNumber(
                                                            e.target.value
                                                       )
                                                  }
                                                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                             >
                                                  <option value="" disabled>
                                                       --เลือกห้องพัก--
                                                  </option>
                                                  {
                                                       room.map((roomItem) => (
                                                            <option
                                                                 key={roomItem.id}
                                                                 value={roomItem.roomNumber}
                                                            >
                                                                 {roomItem.roomNumber}
                                                                 {" "}
                                                                 (ชั้น {roomItem.floor})
                                                            </option>
                                                       ))
                                                  }
                                             </select>
                                        </div>
                                        {/* First Name */}
                                        <div>
                                             <label className="block text-sm font-semibold mb-2">
                                                  ชื่อ
                                             </label>
                                             <div className="relative">
                                                  <input
                                                       type="text"
                                                       value={firstName}
                                                       onChange={(e) =>
                                                            setFirstName(e.target.value)
                                                       }
                                                       placeholder="ชื่อ"
                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <User
                                                       size={20}

                                                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                  />

                                             </div>

                                        </div>

                                        {/* Last Name */}
                                        <div>

                                             <label className="block text-sm font-semibold mb-2">
                                                  นามสกุล
                                             </label>

                                             <div className="relative">

                                                  <input
                                                       type="text"

                                                       value={lastName}

                                                       onChange={(e) =>
                                                            setLastName(
                                                                 e.target.value
                                                            )
                                                       }

                                                       placeholder="นามสกุล"

                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <User
                                                       size={20}

                                                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                  />

                                             </div>

                                        </div>

                                        {/* Email */}
                                        <div>

                                             <label className="block text-sm font-semibold mb-2">
                                                  Email
                                             </label>

                                             <div className="relative">

                                                  <input
                                                       type="email"

                                                       value={email}

                                                       onChange={(e) =>
                                                            setEmail(
                                                                 e.target.value
                                                            )
                                                       }

                                                       placeholder="example@gmail.com"

                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <Mail
                                                       size={20}

                                                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                  />

                                             </div>

                                        </div>

                                        {/* Phone */}
                                        <div>

                                             <label className="block text-sm font-semibold mb-2">
                                                  เบอร์โทรศัพท์
                                             </label>

                                             <div className="relative">

                                                  <input
                                                       type="text"

                                                       value={phone}

                                                       onChange={(e) =>
                                                            setPhone(
                                                                 formatPhone(
                                                                      e.target.value
                                                                 )
                                                            )
                                                       }

                                                       placeholder="0999999999"
                                                       maxLength={12}
                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <Phone
                                                       size={20}

                                                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                  />

                                             </div>

                                        </div>

                                        {/* Password */}
                                        <div className="md:col-span-2">

                                             <label className="block text-sm font-semibold mb-2">

                                                  {
                                                       editData
                                                            ? "รหัสผ่านใหม่ (ไม่กรอก = ใช้รหัสเดิม)"
                                                            : "รหัสผ่าน"
                                                  }

                                             </label>

                                             <div className="relative">

                                                  <input
                                                       type="password"

                                                       value={password}

                                                       onChange={(e) =>
                                                            setPassword(
                                                                 e.target.value
                                                            )
                                                       }

                                                       placeholder="********"

                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <Lock
                                                       size={20}

                                                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                  />

                                             </div>

                                        </div>

                                   </div>

                                   {/* Footer */}
                                   <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">

                                        <button
                                             onClick={() =>
                                                  setOpen(false)
                                             }

                                             className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition"
                                        >

                                             ยกเลิก

                                        </button>

                                        <button
                                             onClick={
                                                  handleSubmit
                                             }

                                             disabled={loading}

                                             className="px-6 py-3 rounded-2xl bg-linear-to-r from-green-500 to-green-700 text-white font-semibold hover:opacity-90 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                                        >

                                             <Save size={18} />

                                             {
                                                  loading
                                                       ? "กำลังบันทึก..."
                                                       : editData
                                                            ? "บันทึกการแก้ไข"
                                                            : "เพิ่มผู้เช่า"
                                             }

                                        </button>

                                   </div>

                              </div>

                         </div>
                    )
               }
          </>
     );
};

export default ManageModalTenant;