"use client";

import { useEffect, useState, } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import {
  X,
  Droplets,
  Zap,
  Calendar,
  House,
  FileText,
} from "lucide-react";
import { API_URL } from "@/src/lib/config";

const ModelMeters = ({
  open,
  setOpen,
  getMeters,
  editData,
}) => {

  const [rooms, setRooms] =
    useState([]);

  const [roomId, setRoomId] =
    useState("");

  const [month, setMonth] =
    useState(
      new Date().getMonth() + 1
    );

  const [year, setYear] =
    useState(
      new Date().getFullYear()
    );

  const [currentWater, setCurrentWater] =
    useState("");

  const [currentElectric, setCurrentElectric] =
    useState("");

  const [otherAmount, setOtherAmount] =
    useState("");

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // get rooms
  const getRooms = async () => {

    try {

      const { data } =
        await axios.get(
          `${API_URL}/manage-room/all`,
          {
            headers: {
              Authorization:
                `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

      const availableRooms =
        data.data.filter(
          (room) =>
            room.status ===
            "OCCUPIED" ||

            room.id ===
            editData?.roomId
        );

      setRooms(
        availableRooms
      );

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    if (open) {

      getRooms();
    }
  }, [open]);

  // edit
  useEffect(() => {

    if (editData) {

      setRoomId(
        editData.roomId || ""
      );

      setMonth(
        editData.month || ""
      );

      setYear(
        editData.year || ""
      );

      setCurrentWater(
        editData.currentWater || ""
      );

      setCurrentElectric(
        editData.currentElectric || ""
      );

      setOtherAmount(
        editData.bill
          ?.otherAmount || ""
      );

      setNote(
        editData.bill?.note || ""
      );

    } else {

      resetForm();
    }
  }, [editData]);

  const resetForm = () => {

    setRoomId("");

    setMonth(
      new Date().getMonth() + 1
    );

    setYear(
      new Date().getFullYear()
    );

    setCurrentWater("");

    setCurrentElectric("");

    setOtherAmount("");

    setNote("");
  };

  // submit
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        if (editData) {

          const payload = {
            currentWater:
              Number(
                currentWater
              ),
            currentElectric:
              Number(
                currentElectric
              ),
            otherAmount:
              Number(
                otherAmount || 0
              ),
            note,
          };

          await axios.put(
            `${API_URL}/meter/update/${editData.id}`,
            payload,
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
              "แก้ไขข้อมูลสำเร็จ",
          });

        } else {

          const payload = {
            roomId,
            month:
              Number(month),
            year:
              Number(year),
            currentWater:
              Number(
                currentWater
              ),
            currentElectric:
              Number(
                currentElectric
              ),
            otherAmount:
              Number(
                otherAmount || 0
              ),
            note,
          };

          await axios.post(
            `${API_URL}/meter/create`,
            payload,
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
              "เพิ่มข้อมูลสำเร็จ",
          });
        }

        getMeters();

        setOpen(false);

        resetForm();

      } catch (error) {

        console.error(error);

        Swal.fire({
          icon: "error",
          title:
            "เกิดข้อผิดพลาด",

          text:
            error?.response?.data
              ?.message ||
            "ไม่สามารถบันทึกข้อมูลได้",
        });

      } finally {

        setLoading(false);
      }
    };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">

      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-5 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-black text-white">

              {
                editData
                  ? "แก้ไขมิเตอร์"
                  : "เพิ่มมิเตอร์"
              }

            </h2>

            <p className="text-green-100 text-sm mt-1">

              จัดการข้อมูลค่าน้ำค่าไฟ

            </p>

          </div>

          <button
            onClick={() =>
              setOpen(false)
            }

            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >

            <X size={22} />

          </button>

        </div>

        {/* Body */}
        <form
          onSubmit={
            handleSubmit
          }

          className="p-6 space-y-6 max-h-[85vh] overflow-y-auto"
        >

          {/* Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Room */}
            {!editData && (
              <div>

                <label className="block text-sm font-semibold mb-2">
                  ห้องพัก
                </label>

                <div className="relative">

                  <select
                    value={roomId}

                    onChange={(e) =>
                      setRoomId(
                        e.target.value
                      )
                    }

                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >

                    <option value="">
                      เลือกห้องพัก
                    </option>

                    {
                      rooms.map(
                        (room) => (
                          <option
                            key={
                              room.id
                            }

                            value={
                              room.id
                            }
                          >

                            {
                              room.roomNumber
                            }

                          </option>
                        )
                      )
                    }

                  </select>

                  <House
                    size={20}

                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>
            )}

            {editData && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  ห้องพัก
                </label>
                <div className="w-full bg-gray-100 border border-gray-300 rounded-2xl px-4 py-3 text-gray-700">
                  {editData?.room?.roomNumber}
                </div>
              </div>
            )}

            {/* Month */}
            {!editData && (
              <div>

                <label className="block text-sm font-semibold mb-2">
                  เดือน
                </label>

                <div className="relative">

                  <input
                    type="number"

                    value={month}

                    onChange={(e) =>
                      setMonth(
                        e.target.value
                      )
                    }

                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  <Calendar
                    size={20}

                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>
            )}

            {editData && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  เดือน
                </label>
                <div className="w-full bg-gray-100 border border-gray-300 rounded-2xl px-4 py-3 text-gray-700">
                  {editData?.month}
                </div>
              </div>
            )}

            {/* Year */}
            {!editData && (
              <div>

                <label className="block text-sm font-semibold mb-2">
                  ปี
                </label>

                <input
                  type="number"

                  value={year}

                  onChange={(e) =>
                    setYear(
                      e.target.value
                    )
                  }

                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

              </div>
            )}

            {editData && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  ปี
                </label>
                <div className="w-full bg-gray-100 border border-gray-300 rounded-2xl px-4 py-3 text-gray-700">
                  {editData?.year}
                </div>
              </div>
            )}

          </div>

          {/* Meter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Water */}
            <div>

              <label className="block text-sm font-semibold mb-2">
                มิเตอร์น้ำใหม่
              </label>

              <div className="relative">

                <input
                  type="number"

                  value={
                    currentWater
                  }

                  onChange={(e) =>
                    setCurrentWater(
                      e.target.value
                    )
                  }

                  placeholder="0"

                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <Droplets
                  size={20}

                  className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                />

              </div>

            </div>

            {/* Electric */}
            <div>

              <label className="block text-sm font-semibold mb-2">
                มิเตอร์ไฟใหม่
              </label>

              <div className="relative">

                <input
                  type="number"

                  value={
                    currentElectric
                  }

                  onChange={(e) =>
                    setCurrentElectric(
                      e.target.value
                    )
                  }

                  placeholder="0"

                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

                <Zap
                  size={20}

                  className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500"
                />

              </div>

            </div>

          </div>

          {/* Other */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Other Amount */}
            <div>

              <label className="block text-sm font-semibold mb-2">
                ค่าใช้จ่ายเพิ่มเติม
              </label>

              <input
                type="number"

                value={
                  otherAmount
                }

                onChange={(e) =>
                  setOtherAmount(
                    e.target.value
                  )
                }

                placeholder="0"

                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

            </div>

            {/* Note */}
            <div>

              <label className="block text-sm font-semibold mb-2">
                หมายเหตุ
              </label>

              <div className="relative">

                <input
                  type="text"

                  value={note}

                  onChange={(e) =>
                    setNote(
                      e.target.value
                    )
                  }

                  placeholder="หมายเหตุ"

                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <FileText
                  size={20}

                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">

            <button
              type="button"

              onClick={() =>
                setOpen(false)
              }

              className="px-5 py-3 rounded-2xl border border-gray-300 hover:bg-gray-100 transition font-semibold"
            >

              ยกเลิก

            </button>

            <button
              type="submit"

              disabled={loading}

              className="px-5 py-3 rounded-2xl bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg transition disabled:opacity-50"
            >

              {
                loading
                  ? "กำลังบันทึก..."
                  : editData
                    ? "บันทึกการแก้ไข"
                    : "เพิ่มข้อมูล"
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default ModelMeters;