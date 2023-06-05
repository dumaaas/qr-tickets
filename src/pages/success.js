import { useRouter } from "next/router";
import QRCode from "qrcode";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
function Success() {
  const router = useRouter();
  const { id } = router.query;

  // Možete koristiti `id` kako biste izvršili potrebne operacije ili dobili podatke
  const [src, setSrc] = useState("");
  const generate = (e) => {
    e.preventDefault();
    console.log("???");
  };
  useEffect(() => {
    QRCode.toDataURL("http://localhost:3001/tickets/1234").then(setSrc);
  }, []);
  return (
    <div className="container px-5 pt-[180px] pb-12 mx-auto  gap-[30px] min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center gap-[20px] justify-center">
        <span className="text-[40px]">✅</span>
        <h1 className="text-[22px]">
          Thank you, you have successfully purchased the ticket!
        </h1>
      </div>
      <div>
        <p>Check your email, your tickets are there!</p>
      </div>
      <Link
        href={"/purchase"}
        className="group relative overflow-hidden rounded-[20px] px-4 py-2 mt-[30px] bg-gradient-to-r from-blue-600 to-purple-800 font-semibold mx-auto xl:mx-0 table"
      >
        <p className="relative z-30 group-hover:underline">
          {" "}
          Continue purchase
        </p>
        <div className="overflow-hidden absolute left-0 top-0 rounded-[20px] bg-black group-hover:w-full h-full  bg-gradient-to-r from-purple-800 to-blue-600 w-0 transition-all duration-200 ease-in-out"></div>
      </Link>
    </div>
  );
}

export default Success;
