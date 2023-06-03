import { useRouter } from "next/router";
import QRCode from "qrcode";
import { useState, useEffect } from "react";
import Image from "next/image";
function Tickets() {
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
    <div className="container px-5 pt-[180px] pb-12 mx-auto  gap-[40px] min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center gap-[20px]">
        <h1>
          Ticket status:{" "}
          <span className="ml-2 px-2 py-1 rounded-[8px] bg-yellow-300 text-yellow-700">
            Pending
          </span>
        </h1>
        <div className="flex items-center gap-[8px] rounded-[20px] border-green-500 text-green-600 bg-green-200 border px-3 py-1">
          <p className="text-green-600">Approve</p>
          <span>✅</span>
        </div>
      </div>
      <div className="relative w-[92%] h-auto bg-white rounded-[20px]">
        <div className="rounded-tl-[20px] rounded-tr-[20px] flex items-center justify-between px-4 py-2 mx-auto bg-blue-500">
          <Image
            className="relative"
            src="/logo.png"
            alt="logo"
            width={130}
            height={60}
            priority
          />
          <p className="text-lg font-bold text-right">Harmony Festival</p>
        </div>
        <div className="p-6">
          <div className=" flex items-center justify-between border-b pb-[10px] ">
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">Location</label>
              <p className="text-black">Chicago, USA</p>
            </div>
            <div className="flex flex-col text-right">
              <label className="text-sm text-gray-400">Date</label>
              <p className="text-black">23-05-2023</p>
            </div>
          </div>
          <div className="mt-[10px] flex items-center justify-between border-b pb-[10px] ">
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">Type</label>
              <p className="text-black">Group ticket</p>
            </div>
            <div className="flex flex-col text-right">
              <label className="text-sm text-gray-400">Price</label>
              <p className="text-black">20$</p>
            </div>
          </div>
          <div className="pt-[10px] flex items-center justify-between ">
            <div className="flex flex-col">
              <label className="text-sm text-gray-400">Customer</label>
              <p className="text-black">Marko Dumnic</p>
            </div>
            <div className="flex flex-col text-right">
              <label className="text-sm text-gray-400">Ordered on</label>
              <p className="text-black">05-13-2023</p>
            </div>
          </div>
          <img className="mx-auto mt-[20px]" src={src} />
        </div>

        <div className="bg-blue-500 w-full min-h-[25px] rounded-bl-[20px] rounded-br-[20px] text-xs py-2 px-4 flex items-center">
          Important: Do not scan QR Code until the concert starts!
        </div>
      </div>
    </div>
  );
}

export default Tickets;
