import { useRouter } from "next/router";
import QRCode from "qrcode";
import { useState, useEffect } from "react";
import Image from "next/image";

function CheckTicket() {
  const router = useRouter();
  const { id } = router.query;

  // Možete koristiti `id` kako biste izvršili potrebne operacije ili dobili podatke
  const [src, setSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(
    "Loading ticket, please wait..."
  );

  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setIsLoadingStatus("Loading ticket, please wait...");

      fetchTicket().then(() => {
        setIsLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (ticket) {
      QRCode.toDataURL(`${process.env.web_url}/tickets/${id}`).then(setSrc);
    }
  }, ticket);

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/fetchTicket?id=${id}`);
      const jsonData = await response.json();
      setTicket(jsonData);
    } catch (error) {
      setIsLoading(false);
      console.error("Greška prilikom dohvatanja podataka:", error);
    }
  };

  return (
    <>
      {!isLoading ? (
        ticket ? (
          <div className="container px-5 pt-[180px] pb-12 mx-auto  gap-[40px] min-h-screen flex flex-col items-center justify-center">
            <div className="flex items-center gap-[2px]">
              <h1>Ticket status:</h1>
              <p
                className={`ml-2 px-2 py-1 rounded-[8px]  ${
                  ticket.status === "Approved"
                    ? "bg-green-300 text-green-700"
                    : "bg-yellow-300 text-yellow-700"
                }`}
              >
                {ticket.status}
              </p>
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
                    <p className="text-black">Sunday, 9th July 2023, 9:00 PM</p>
                  </div>
                </div>
                <div className="mt-[10px] flex items-center justify-between border-b pb-[10px] ">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400">Ticket Type</label>
                    <p className="text-black">{ticket.ticketType}</p>
                  </div>
                  <div className="flex flex-col text-right">
                    <label className="text-sm text-gray-400">Price</label>
                    <p className="text-black">{ticket.price}$</p>
                  </div>
                </div>
                <div className="pt-[10px] flex items-center justify-between ">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400">Customer</label>
                    <p className="text-black">{ticket.name}</p>
                  </div>
                  <div className="flex flex-col text-right">
                    <label className="text-sm text-gray-400">Ordered on</label>
                    <p className="text-black">{ticket.orderedOn}</p>
                  </div>
                </div>
                <img className="mx-auto mt-[20px]" src={src} />
              </div>

              <div className="bg-blue-500 w-full min-h-[25px] rounded-bl-[20px] rounded-br-[20px] text-xs py-2 px-4 flex items-center">
                Important: Do not scan QR Code until the concert starts!
              </div>
            </div>
          </div>
        ) : (
          <div className="container px-5 pt-[180px] pb-12 mx-auto  gap-[40px] min-h-screen flex flex-col items-center justify-center">
            ERROR: This ticket does not exists!
          </div>
        )
      ) : (
        <div className="container px-5 pt-[180px] pb-12 mx-auto  gap-[40px] min-h-screen flex flex-col items-center justify-center">
          {isLoadingStatus}
        </div>
      )}
    </>
  );
}

export default CheckTicket;
