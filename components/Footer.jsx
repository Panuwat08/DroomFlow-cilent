"use client";

const Footer = () => {
     return (
          <footer className="w-full bg-linear-to-r from-green-600 to-lime-700 border-t border-green-100 px-6 py-10 shadow-md">

               <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                    <div className="text-sm text-white text-center md:text-center">
                         <p>
                              © 2026 developed by <span className="font-semibold">Panuwat Phichaiched</span>
                         </p>
                         <p className="mt-1">
                              email: <span className="font-semibold">Panuwat080447@gmail.com</span>
                         </p>
                    </div>
               </div>
          </footer>
     );
};

export default Footer;