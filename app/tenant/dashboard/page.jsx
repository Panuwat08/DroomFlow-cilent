"use client";
import {
  Home,
  Wallet,
  Droplets,
  Zap,
  CalendarDays,
  CircleCheckBig,
  UserIcon,
  Download,
} from "lucide-react";
import { API_URL } from "@/src/lib/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const TenantDashboardPage = () => {

  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getBillStatus = (
    status
  ) => {

    switch (status) {

      case "PENDING":
        return "รอชำระ";

      case "WAITING_VERIFY":
        return "รอตรวจสอบ";

      case "PAID":
        return "ชำระแล้ว";

      case "OVERDUE":
        return "ค้างชำระ";

      default:
        return "-";
    }
  };
  const fetchDashboard = async () => {

    try {

      // get token
      const token =
        localStorage.getItem("token");

      // check token
      if (!token) {

        setError(
          "กรุณาเข้าสู่ระบบ"
        );

        setLoading(false);

        return;
      }

      // request api
      const response =
        await axios.get(`${API_URL}/tenant/dashboard`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      // success
      if (
        response.data.success
      ) {

        setDashboard(
          response.data.data
        );

      } else {

        setError(
          response.data.message
        );
      }

    } catch (error) {

      console.log(
        "🚀 ~ fetchDashboard error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
        "เกิดข้อผิดพลาด"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchDashboard();

  }, []);

  if (loading) {

    return (
      <div className="flex shadow-md items-center justify-center min-h-screen">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500">
            กำลังโหลดข้อมูล...
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">

        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-3xl shadow-md">

          <h2 className="text-2xl font-black">
            Error
          </h2>

          <p className="mt-2">
            {error}
          </p>

        </div>

      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        ไม่พบข้อมูล
      </div>
    );
  }

  const tenant = dashboard?.tenant;
  const latestBill = dashboard?.latestBill;

  return (

    <div className="bg-gray-50 p-4 sm:p-6 min-h-full shadow-md rounded-xl">
      {/* Header */}
      <div className="mb-6">

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          Dashboardผู้เช่าห้องพัก
        </h1>
        <p className="text-gray-500 mt-2">
          ภาพรวมข้อมูลห้องพักและการชำระเงิน
        </p>
      </div>
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Room */}
        <div className="rounded-3xl bg-linear-to-r from-blue-500 to-indigo-600 p-5 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">
                ห้องพัก
              </p>
              <h2 className="text-3xl font-black mt-2">
                {tenant?.room?.roomNumber || "-"}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Home size={30} />
            </div>
          </div>
        </div>
        {/* Total Bill */}
        <div className="rounded-3xl bg-linear-to-r from-green-600 to-lime-600 p-5 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">
                ค่าใช้จ่ายเดือนนี้
              </p>
              <h2 className="text-3xl font-black mt-2">
                ฿{latestBill?.totalAmount || 0}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Wallet size={30} />
            </div>
          </div>
        </div>

        {/* Water */}
        <div className="rounded-3xl bg-linear-to-r from-cyan-600 to-sky-500 p-5 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">
                ค่าน้ำ
              </p>
              <h2 className="text-3xl font-black mt-2">
                {latestBill?.waterAmount || 0}
              </h2>
              <p className="text-sm opacity-80 mt-1">
                บาท
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Droplets size={30} />
            </div>

          </div>

        </div>

        {/* Electric */}
        <div className="rounded-3xl bg-linear-to-r from-amber-500 to-orange-500 p-5 shadow-lg text-white">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm opacity-90">
                ค่าไฟ
              </p>

              <h2 className="text-3xl font-black mt-2">

                {latestBill?.electricAmount ||
                  0}

              </h2>

              <p className="text-sm opacity-80 mt-1">
                บาท
              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">

              <Zap size={30} />

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Layout */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-5 mt-6">

        {/* Bill Summary */}
        <div className="2xl:col-span-2 bg-white rounded-3xl shadow-md p-6 border border-gray-100">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-black text-gray-900">

                สรุปค่าใช้จ่าย

              </h2>

              <p className="text-gray-500 mt-1">

                รายละเอียดค่าใช้จ่ายประจำเดือน

              </p>

            </div>

            <div
              className={`px-4 py-2 rounded-2xl font-semibold text-sm ${latestBill?.status ===
                "PENDING"
                ? "bg-yellow-100 text-yellow-700"

                : latestBill?.status ===
                  "WAITING_VERIFY"
                  ? "bg-blue-100 text-blue-700"

                  : latestBill?.status ===
                    "PAID"
                    ? "bg-green-100 text-green-700"

                    : "bg-red-100 text-red-700"
                }`}
            >

              {
                getBillStatus(
                  latestBill?.status
                )
              }

            </div>

          </div>

          <div className="space-y-4">

            {/* Water */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">

                  <Droplets size={24} />

                </div>

                <div>

                  <p className="font-bold text-gray-800">

                    ค่าน้ำ

                  </p>

                  <p className="text-sm text-gray-500">

                    ใช้น้ำ{" "}
                    {latestBill?.waterUnit ||
                      0}{" "}
                    หน่วย

                  </p>

                </div>

              </div>

              <h3 className="text-lg font-black text-gray-900">

                ฿
                {latestBill?.waterAmount ||
                  0}

              </h3>

            </div>

            {/* Electric */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">

                  <Zap size={24} />

                </div>

                <div>

                  <p className="font-bold text-gray-800">

                    ค่าไฟ

                  </p>

                  <p className="text-sm text-gray-500">

                    ใช้ไฟ{" "}
                    {latestBill?.electricUnit ||
                      0}{" "}
                    หน่วย

                  </p>

                </div>

              </div>

              <h3 className="text-lg font-black text-gray-900">

                ฿
                {latestBill?.electricAmount ||
                  0}

              </h3>

            </div>
            {/* Electric */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">

                  <Zap size={24} />

                </div>

                <div>

                  <p className="font-bold text-gray-800">

                    ค่าอื่นๆ

                  </p>

                </div>

              </div>

              <h3 className="text-lg font-black text-gray-900">

                ฿{latestBill?.otherAmount || 0}

              </h3>

            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-green-50 border border-green-100">

              <div>

                <p className="text-sm text-green-700 font-semibold">

                  รวมทั้งหมด

                </p>

                <h2 className="text-3xl font-black text-green-700 mt-1">
                  {latestBill?.totalAmount?.toLocaleString() || 0} ฿
                </h2>

              </div>
              {
                latestBill?.status ===
                  "PAID" ? (

                  <button
                    className= "flex gap-1 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
                    onClick={() =>
                      window.open(
                        `${API_URL}/receipt/${latestBill.id}`,
                        "_blank"
                      )
                    }
                  >
                    ดาวน์โหลดใบเสร็จ
                    <Download size={18} className="mt-0.5" />
                  </button>

                ) : (

                  <button
                    className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition"
                    onClick={() =>
                      router.push(
                        "/tenant/payment"
                      )
                    }
                  >

                    ชำระเงิน

                  </button>
                )
              }

            </div>

          </div>

        </div>

        {/* Profile */}
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-linear-to-r from-green-600 to-lime-600 text-white flex items-center justify-center text-3xl font-black shadow-lg">
              <UserIcon size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mt-4">
              {tenant?.user?.first_name}{" "}{tenant?.user?.last_name}
            </h2>
            <p className="text-gray-500 mt-1">
              ผู้เช่าห้องพัก
            </p>

            <div className="mt-6 w-full space-y-3">

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">

                <CalendarDays
                  size={20}
                  className="text-gray-500"
                />

                <div className="text-left">

                  <p className="text-xs text-gray-500">
                    วันที่เข้าพัก
                  </p>

                  <p className="font-semibold text-gray-800">

                    {new Date(
                      tenant?.createdAt
                    ).toLocaleDateString(
                      "th-TH"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboardPage;