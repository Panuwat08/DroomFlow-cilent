import React from "react";

import {
     CircleCheckBig,
} from "lucide-react";

const detail = [
     {
          id: 1,
          title:
               "เปิดแอป Mobile Banking",
     },

     {
          id: 2,
          title:
               "สแกน QR Code ด้านบน",
     },

     {
          id: 3,
          title:
               "ชำระเงินตามยอดที่กำหนด",
     },

     {
          id: 4,
          title:
               "แนบสลิปและกดยืนยันการชำระเงิน",
     },
];

const detail = () => {

     return (

          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">

               <div className="flex items-center gap-3 mb-5">

                    <CircleCheckBig
                         size={28}
                         className="text-green-600"
                    />

                    <h2 className="text-2xl font-black text-gray-900">

                         วิธีการชำระ

                    </h2>

               </div>

               <div className="space-y-4 text-gray-600">

                    {detailUploadSlipCard.map(
                         (step) => (

                              <div
                                   key={step.id}
                                   className="flex gap-3"
                              >

                                   <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">

                                        {step.id}

                                   </div>

                                   <p>

                                        {step.title}

                                   </p>

                              </div>
                         )
                    )}

               </div>

          </div>
     );
};

export default Detail;