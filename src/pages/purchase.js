"use client";

import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { useState } from "react";

export default function Purchase() {
  const [src, setSrc] = useState("");
  const generate = (e) => {
    e.preventDefault();
    console.log("???");
    QRCode.toDataURL("https://myqrcode.com/generator/url?preview=template").then(setSrc);
  };

  return (
    <div className="container px-5 pt-[180px] pb-12 mx-auto  gap-[40px] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Purchase your ticket</h1>
      <div className="flex items-center justify-center gap-[20px] bg-white rounded-full px-4 py-2">
        <Image
          className=""
          src="/mastercard-logo.png"
          alt="cover"
          width={50}
          height={127}
          priority
        />
        <Image
          className=""
          src="/visa.png"
          alt="cover"
          width={75}
          height={127}
          priority
        />
      </div>
      <form className="w-[50%] mx-auto flex flex-col gap-[12px]">
        <div className="flex gap-[12px]">
          <input
            type="text"
            placeholder="Ticket type..."
            className="w-full h-[48px] px-4 rounded-[8px] bg-transparent border placeholder:text-white"
          />
          <input
            type="text"
            placeholder="Ticket type..."
            className="w-full h-[48px] px-4 rounded-[8px] bg-transparent border placeholder:text-white"
          />
        </div>
        <div className="flex gap-[12px]">
          <input
            type="text"
            placeholder="Your firstname..."
            className="w-full h-[48px] px-4 rounded-[8px] bg-transparent border placeholder:text-white"
          />
          <input
            type="text"
            placeholder="Your lastname..."
            className="w-full h-[48px] px-4 rounded-[8px] bg-transparent border placeholder:text-white"
          />
        </div>
        <div className="flex gap-[12px]">
          <input
            type="text"
            placeholder="Card number..."
            className="w-[80%] h-[48px] px-4 rounded-[8px] bg-transparent border placeholder:text-white"
          />
          <input
            type="text"
            placeholder="Card CV..."
            className="w-[30%] h-[48px] px-4 rounded-[8px] bg-transparent border placeholder:text-white"
          />
        </div>
        <div className="flex gap-[12px]">
          <input
            type="text"
            placeholder="Your city..."
            className="w-full h-[48px] px-4 rounded-[8px] bg-transparent border placeholder:text-white"
          />
          <input
            type="text"
            placeholder="Your number..."
            className="w-full h-[48px] px-4 rounded-[8px] bg-transparent border placeholder:text-white"
          />
        </div>
        <button
          onClick={(e) => generate(e)}
          className="text-center group relative overflow-hidden rounded-[20px] uppercase px-4 py-[10px] text-lg mt-[30px] bg-gradient-to-r from-blue-600 to-purple-800 font-semibold mx-auto xl:mx-0 inline-block"
        >
          <p className="relative z-30 group-hover:underline"> Purchase</p>
          <div className="overflow-hidden absolute left-0 top-0 rounded-[20px] bg-black group-hover:w-full h-full  bg-gradient-to-r from-purple-800 to-blue-600 w-0 transition-all duration-200 ease-in-out"></div>
        </button>
      </form>
      <Link href={src}>
        <img src={src} />
      </Link>
      {/* <Canvas
                text={'https://github.com/dumaaas'}
                options={{
                    level: 'M',
                    margin: 3,
                    scale: 4,
                    width: 200,
                    color: {
                        dark: '#000',
                        light: '#fff',
                    },
                }}
            /> */}
    </div>
  );
}
