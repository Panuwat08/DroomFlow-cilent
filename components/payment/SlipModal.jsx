"use client";

import React from "react";

import {
     XCircle,
} from "lucide-react";

const SlipModal = ({
     selectedSlip,
     setSelectedSlip,
}) => {

     if (!selectedSlip)
          return null;

     return (

          <div
               onClick={() =>
                    setSelectedSlip(null)
               }
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
               <div
                    onClick={(e) =>
                         e.stopPropagation()
                    }
                    className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full animate-in fade-in zoom-in duration-200"
               >

                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">

                         <div>

                              <h2 className="text-2xl font-black text-gray-900">

                                   หลักฐานการชำระเงิน

                              </h2>

                              <p className="text-sm text-gray-500 mt-1">

                                   ตรวจสอบสลิปการโอนเงินของผู้เช่า

                              </p>

                         </div>

                         <button
                              onClick={() =>
                                   setSelectedSlip(null)
                              }
                              className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center justify-center"
                         >

                              <XCircle size={24} />

                         </button>

                    </div>

                    {/* Image */}
                    <div className="p-5 bg-gray-50">

                         <img
                              src={selectedSlip}
                              alt="slip"
                              className="w-full rounded-2xl object-contain max-h-[80vh] shadow-sm"
                         />

                    </div>

               </div>

          </div>
     );
};

export default SlipModal;