"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import Swal from "sweetalert2";

import {
     X,
     Building2,
     DollarSign,
     Droplets,
     Zap,
     Layers3,
     Save,
} from "lucide-react";

import { API_URL } from "@/src/lib/config";

const ManageModalRoom = ({
     open,
     setOpen,
     getRooms,
     editData,
}) => {

     const [roomNumber, setRoomNumber] = useState("");

     const [floor, setFloor] = useState("");

     const [monthlyRent, setMonthlyRent] = useState("");

     const [waterRate, setWaterRate] = useState("");

     const [electricRate, setElectricRate] = useState("");

     const [loading, setLoading] = useState(false);

     useEffect(() => {

          if (editData) {

               setRoomNumber(editData.roomNumber || "");

               setFloor(editData.floor || "");

               setMonthlyRent(editData.monthlyRent || "");

               setWaterRate(editData.waterRate || "");

               setElectricRate(editData.electricRate || "");

          } else {

               setRoomNumber("");

               setFloor("");

               setMonthlyRent("");

               setWaterRate("");

               setElectricRate("");
          }

     }, [editData]);

     const handleSubmit = async () => {

          try {

               if (
                    !roomNumber ||
                    !floor ||
                    !monthlyRent ||
                    !waterRate ||
                    !electricRate
               ) {

                    return Swal.fire({
                         icon: "warning",
                         title: "ข้อมูลไม่ครบ",
                         text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                    });
               }

               setLoading(true);

               // update
               if (editData) {

                    await axios.put(
                         `${API_URL}/manage-room/update/${editData.id}`,
                         {
                              roomNumber,
                              floor,
                              monthlyRent,
                              waterRate,
                              electricRate,
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
                         text: "แก้ไขห้องสำเร็จ",
                    });

               } else {

                    // create
                    await axios.post(
                         `${API_URL}/manage-room/create`,
                         {
                              roomNumber,
                              floor,
                              monthlyRent,
                              waterRate,
                              electricRate,
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
                         text: "เพิ่มห้องสำเร็จ",
                    });
               }

               getRooms();

               setOpen(false);

          } catch (error) {

               console.error(error);

               Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text:
                         error?.response?.data?.message ||
                         "ไม่สามารถบันทึกข้อมูลได้",
               });

          } finally {

               setLoading(false);
          }
     };

     return (
          <>
               {
                    open && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">

                              {/* Modal */}
                              <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                                   {/* Header */}
                                   <div className="bg-linear-to-r from-green-600 to-lime-700 p-6 flex items-center justify-between">

                                        <div className="flex items-center gap-3">

                                             <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">

                                                  <Building2 className="text-white" />

                                             </div>

                                             <div>

                                                  <h2 className="text-3xl font-black text-white">

                                                       {
                                                            editData
                                                                 ? "แก้ไขห้องพัก"
                                                                 : "เพิ่มห้องพัก"
                                                       }

                                                  </h2>

                                                  <p className="text-green-100 text-sm mt-1">

                                                       จัดการข้อมูลห้องพักในระบบ

                                                  </p>

                                             </div>

                                        </div>

                                        {/* Close */}
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

                                        {/* Room Number */}
                                        <div>

                                             <label className="block text-sm font-semibold mb-2">
                                                  เลขห้อง
                                             </label>

                                             <div className="relative">

                                                  <input
                                                       type="text"

                                                       value={roomNumber}

                                                       onChange={(e) =>
                                                            setRoomNumber(
                                                                 e.target.value
                                                            )
                                                       }

                                                       placeholder="A101"

                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <Building2
                                                       size={20}

                                                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                  />

                                             </div>

                                        </div>

                                        {/* Floor */}
                                        <div>

                                             <label className="block text-sm font-semibold mb-2">
                                                  ชั้น
                                             </label>

                                             <div className="relative">

                                                  <input
                                                       type="number"

                                                       value={floor}

                                                       onChange={(e) =>
                                                            setFloor(
                                                                 e.target.value
                                                            )
                                                       }

                                                       placeholder="1"

                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <Layers3
                                                       size={20}

                                                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                  />

                                             </div>

                                        </div>

                                        {/* Rent */}
                                        <div>

                                             <label className="block text-sm font-semibold mb-2">
                                                  ค่าเช่า
                                             </label>

                                             <div className="relative">

                                                  <input
                                                       type="number"

                                                       value={monthlyRent}

                                                       onChange={(e) =>
                                                            setMonthlyRent(
                                                                 e.target.value
                                                            )
                                                       }

                                                       placeholder="3500"

                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <DollarSign
                                                       size={20}

                                                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                  />

                                             </div>

                                        </div>

                                        {/* Water */}
                                        <div>

                                             <label className="block text-sm font-semibold mb-2">
                                                  ค่าน้ำ
                                             </label>

                                             <div className="relative">

                                                  <input
                                                       type="number"

                                                       value={waterRate}

                                                       onChange={(e) =>
                                                            setWaterRate(
                                                                 e.target.value
                                                            )
                                                       }

                                                       placeholder="18"

                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <Droplets
                                                       size={20}

                                                       className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                  />

                                             </div>

                                        </div>

                                        {/* Electric */}
                                        <div className="md:col-span-2">

                                             <label className="block text-sm font-semibold mb-2">
                                                  ค่าไฟ
                                             </label>

                                             <div className="relative">

                                                  <input
                                                       type="number"

                                                       value={electricRate}

                                                       onChange={(e) =>
                                                            setElectricRate(
                                                                 e.target.value
                                                            )
                                                       }

                                                       placeholder="8"

                                                       className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                  />

                                                  <Zap
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
                                             onClick={handleSubmit}

                                             disabled={loading}

                                             className="px-6 py-3 rounded-2xl bg-linear-to-r from-green-600 to-lime-700 text-white font-semibold hover:opacity-90 transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                                        >

                                             <Save size={18} />

                                             {
                                                  loading
                                                       ? "กำลังบันทึก..."
                                                       : editData
                                                            ? "บันทึกการแก้ไข"
                                                            : "เพิ่มห้อง"
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

export default ManageModalRoom;