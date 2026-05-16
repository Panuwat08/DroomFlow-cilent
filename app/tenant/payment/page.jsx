"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { API_URL } from "@/src/lib/config";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Wallet,
  QrCode,
  CircleCheckBig,
  CalendarDays,
  ReceiptText,
  Upload,
  ImageIcon,
} from "lucide-react";

const PaymentPage = () => {

  const [paymentSlip, setPaymentSlip] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [latestBill, setLatestBill] = useState(null);

  const router = useRouter();
  const handleUpload = (e) => {
    const file =
      e.target.files[0];
    if (!file) return;
    setPaymentSlip(file);
    setPreview(
      URL.createObjectURL(file)
    );
  };
  const fetchLatestBill = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/tenant/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}`, },
        }
      );
      setLatestBill(
        response.data.data.latestBill
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchLatestBill();
  }, []);
  const fetchQRCode = async () => {
    try {
      if (!latestBill) return;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/promptpay/${latestBill.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQrCode(response.data.data.qrCode);
    } catch (error) {
      console.log("🚀 ~ fetchQRCode:", error);
    }
  };
  useEffect(() => {
    fetchQRCode();
  }, [latestBill]);

  const handleSubmitPayment = async () => {
    try {
      if (!paymentSlip) {
        Swal.fire({
          icon: "warning",
          title: "ข้อมูลไม่ครบถ้วน",
          text: "กรุณาอัพโหลดหลักฐานการชำระเงิน",
        })
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("token");
      // formdata
      const formData = new FormData();
      formData.append("billId", latestBill.id);
      formData.append("amount", latestBill.totalAmount);
      formData.append("slipImage", paymentSlip);

      // request
      const response =
        await axios.post(`${API_URL}/payment/upload-slip`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}`, },
          }
        );

      Swal.fire({
        icon: "success",
        title: "ชำระเงินสำเร็จ",
        timer: 2000,
        showConfirmButton: false,
      });
      setTimeout(() => {
        router.push("/tenant/dashboard");
      }, 2000);
      setPaymentSlip(null);
      setPreview(null);
      fetchLatestBill();
      console.log(response);

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error?.response?.data?.message || "ไม่สามารถชำระเงินได้",
      })

    } finally {
      setLoading(false);
    }
  };
  return (

    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className=" flex items-center sm:flex-row justify-between mb-6">
        <div className="">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
            ชำระเงิน
          </h1>
          <p className="text-gray-500 mt-2">
            ชำระค่าเช่าผ่าน QR Code พร้อมแนบหลักฐานการชำระเงิน
          </p>
        </div>
        <div className="">
          <div className={`mt-5 px-4 py-2 rounded-2xl text-sm font-bold w-fit
    ${latestBill?.status ===
              "PAID"
              ? "bg-green-100 text-green-700"

              : latestBill?.status ===
                "WAITING_VERIFY"
                ? "bg-blue-100 text-blue-700"

                : latestBill?.status ===
                  "PENDING"
                  ? "bg-orange-100 text-orange-700"

                  : "bg-red-100 text-red-700"
            }
  `}
          >

            {
              latestBill?.status ===
                "PAID"
                ? "ชำระแล้ว"

                : latestBill?.status ===
                  "WAITING_VERIFY"
                  ? "รอตรวจสอบ"

                  : latestBill?.status ===
                    "PENDING"
                    ? "รอชำระ"

                    : "ถูกปฏิเสธ"
            }
            {
              latestBill?.payment?.status ===
              "REJECTED" && (

                <div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-200">

                  <h3 className="font-bold text-red-700">

                    การชำระเงินถูกปฏิเสธ

                  </h3>

                  <p className="text-red-600 mt-2">

                    {
                      latestBill?.payment
                        ?.rejectReason
                    }

                  </p>

                </div>
              )
            }

          </div>
        </div>
      </div>
      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                <ReceiptText size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  รายละเอียดบิล
                </h2>
                <p className="text-gray-500">
                  ข้อมูลค่าใช้จ่ายประจำเดือน
                </p>
              </div>
            </div>
            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                <div>
                  <p className="font-bold text-gray-800">
                    ค่าเช่าห้อง
                  </p>
                  <p className="text-sm text-gray-500">
                    ห้อง {latestBill?.room?.roomNumber || "-"}
                  </p>
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  ฿{latestBill?.rentAmount?.toLocaleString("th-TH") || 0}
                </h3>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                <div>
                  <p className="font-bold text-gray-800">
                    ค่าน้ำ
                  </p>
                  <p className="text-sm text-gray-500">
                    ใช้น้ำ {latestBill?.meterRecord?.waterUsed || 0} หน่วย
                  </p>
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  ฿{latestBill?.waterAmount?.toLocaleString("th-TH") || 0}
                </h3>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                <div>
                  <p className="font-bold text-gray-800">
                    ค่าไฟ
                  </p>
                  <p className="text-sm text-gray-500">
                    ใช้ไฟ {latestBill?.meterRecord?.electricUsed || 0} หน่วย
                  </p>
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  ฿{latestBill?.electricAmount?.toLocaleString("th-TH") || 0}
                </h3>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50">
                <div>
                  <p className="font-bold text-gray-800">
                    ค่าอื่นๆ
                  </p>
                </div>
                <h3 className="text-xl font-black text-gray-900">
                  ฿{latestBill?.otherAmount?.toLocaleString("th-TH") || 0}
                </h3>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 rounded-3xl bg-green-50 border border-green-100 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-semibold">
                  ยอดชำระทั้งหมด
                </p>
                <h2 className="text-4xl font-black text-green-700 mt-2">
                  ฿{latestBill?.totalAmount?.toLocaleString("th-TH") || 0}
                </h2>
              </div>
              <Wallet
                size={48}
                className="text-green-700"
              />
            </div>
          </div>

          {/* Upload Slip */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Upload size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  แนบหลักฐานการชำระเงิน
                </h2>
                <p className="text-gray-500">
                  อัปโหลดสลิปการโอนเงิน
                </p>
              </div>
            </div>

            {/* Upload Box */}
            <label className="border-2 border-dashed border-gray-300 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
              <Upload
                size={48}
                className="text-gray-400"
              />
              <h3 className="mt-4 text-xl font-bold text-gray-700">
                คลิกเพื่ออัปโหลดสลิป
              </h3>
              <p className="text-gray-500 mt-2 text-center">
                รองรับไฟล์ JPG, PNG
              </p>
            </label>

            {/* Preview */}
            {preview && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon
                    size={20}
                    className="text-green-600"
                  />
                  <p className="font-bold text-gray-800">
                    ตัวอย่างสลิป
                  </p>
                </div>
                <div className="rounded-3xl overflow-hidden border border-gray-200">
                  <img
                    src={preview}
                    alt="payment-slip"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* QR Payment */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4">
                <QrCode size={28} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                QR Code Payment
              </h2>
              <p className="text-gray-500 mt-2">
                สแกนเพื่อชำระเงินผ่าน Mobile Banking
              </p>
            </div>
            {/* QR */}
            <div className="mt-8 flex justify-center">
              <div className="w-72 h-72 rounded-3xl border-4 border-dashed border-gray-300 flex items-center justify-center bg-white overflow-hidden p-3">
                {qrCode ? (
                  <img
                    src={qrCode}
                    alt="promptpay-qr"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <QrCode
                      size={120}
                      className="mx-auto text-gray-400"
                    />
                    <p className="mt-4 text-gray-400 font-medium">
                      กำลังสร้าง QR Code...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                <span className=" font-semibold">ชื่อบัญชี:</span> ภานุวัฒน์ พิชัยเชิด
              </p>
              <p className="text-sm text-gray-500">
                จำนวนเงินที่ต้องชำระ
              </p>
              <h2 className="text-5xl font-black text-green-700 mt-2">
                ฿{
                  latestBill?.totalAmount?.toLocaleString("th-TH")
                }
              </h2>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitPayment}
              disabled={loading}
              className="mt-8 w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 transition-all text-white font-bold text-lg shadow-lg disabled:opacity-50">
              {loading
                ? "กำลังอัปโหลด..."
                : "ยืนยันการชำระเงิน"}
            </button>
          </div>
          {/* Payment Guide */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <CircleCheckBig
                size={28}
                className="text-green-600" />
              <h2 className="text-2xl font-black text-gray-900">
                วิธีการชำระ
              </h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  1
                </div>
                <p>เปิดแอป Mobile Banking</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  2
                </div>
                <p>สแกน QR Code ด้านบน</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  3
                </div>
                <p>ชำระเงินตามยอดที่กำหนด</p>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  4
                </div>
                <p>แนบสลิปและกดยืนยันการชำระเงิน</p>
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <CalendarDays
                size={28}
                className="text-yellow-600"
              />
              <h2 className="text-2xl font-black text-gray-900">
                กำหนดชำระ
              </h2>
            </div>
            <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-100">
              <p className="text-sm text-yellow-700 font-semibold">กรุณาชำระภายใน </p>
              <h2 className="text-2xl sm:text-xl font-black text-yellow-700 mt-2">
                วันที่ 5 ของทุกเดือน
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;