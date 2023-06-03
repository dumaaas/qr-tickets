"use client";

import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Purchase() {
  const [src, setSrc] = useState("");
  const router = useRouter();
  const { query } = router.query;
  console.log(query, "hej");

  console.log(router, "router");
  const generate = (e) => {
    e.preventDefault();
    console.log("???");
    QRCode.toDataURL(
      "https://myqrcode.com/generator/url?preview=template"
    ).then(setSrc);
  };

  return (
    <div className="container px-5 pt-[180px] pb-12 mx-auto md:gap-[60px] gap-[40px]  lg:gap-[80px] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Purchase your ticket </h1>
      <div className="flex items-center justify-evenly w-full gap-[40px] lg:flex-row flex-col">
        {router.query.type !== "2" ? (
          <div className="bg-white rounded-[12px] px-4 py-4 lg:w-[40%] w-full">
            <div className="flex items-center justify-between pb-4 border-b">
              <Image
                className="relative fill-black"
                src="/ticket.svg"
                alt="logo"
                width={40}
                height={60}
                priority
              />
              <p className="text-black">Festival ticket</p>
            </div>
            <div className="flex items-center justify-between py-4 border-b">
              <p className="font-semibold text-black">Friday, June 18, 2023</p>

              <p className="font-semibold text-black">5:00PM - 12:00PM</p>
            </div>
            <div className="flex items-center justify-between pt-4 pb-2">
              <p className="font-semibold text-black">Quantity</p>

              <div className="flex gap-[10px] items-center">
                <p className="cursor-pointer bg-red-500 rounded-full w-[30px] h-[30px] flex items-center justify-center">
                  -
                </p>
                <p className="text-black">1</p>
                <p className="cursor-pointer bg-green-500 rounded-full w-[30px] h-[30px] flex items-center justify-center">
                  +
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {router.query.type !== "1" ? (
          <div className="bg-white rounded-[12px] px-4 py-4 lg:w-[40%] w-full">
            <div className="flex items-center justify-between pb-4 border-b">
              <Image
                className="relative fill-black"
                src="/parking.svg"
                alt="logo"
                width={40}
                height={60}
                priority
              />
              <p className="text-black">Parking ticket</p>
            </div>
            <div className="flex items-center justify-between py-4 border-b">
              <p className="font-semibold text-black">Friday, June 18, 2023</p>

              <p className="font-semibold text-black">5:00PM - 12:00PM</p>
            </div>
            <div className="flex items-center justify-between pt-4 pb-2 ">
              <p className="font-semibold text-black">Quantity</p>

              <div className="flex gap-[10px] items-center">
                <p className="cursor-pointer bg-red-500 rounded-full w-[30px] h-[30px] flex items-center justify-center">
                  -
                </p>
                <p className="text-black">1</p>
                <p className="cursor-pointer bg-green-500 rounded-full w-[30px] h-[30px] flex items-center justify-center">
                  +
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="lg:w-[89%] w-full bg-white rounded-[20px]">
        <h3 className="px-4 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-800 rounded-tr-[20px] rounded-tl-[20px]">
          Your cart
        </h3>
        <div className="px-4">
          {router.query.type !== "2" ? (
            <div className={`flex items-center justify-between py-4 ${router.query.type == '1' ? 'border-b' : ''}`}>
              <p className="text-black ">Festival ticket x2</p>

              <p className="font-semibold text-black">40$</p>
            </div>
          ) : null}
          {router.query.type !== "1" ? (
            <div className="flex items-center justify-between py-4 border-b">
              <p className="text-black ">Parking ticket x3</p>

              <p className="font-semibold text-black">45$</p>
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <p className="text-black ">Total</p>

          <p className="font-semibold text-black">95$</p>
        </div>
        <div className="flex items-center justify-between px-4 py-4">
          <p className="text-black ">Proced to the checkout</p>
          <div className="flex">
            <Link
              href={"/tickets/123"}
              className="group relative overflow-hidden rounded-[20px] px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-800 font-semibold ml-auto xl:mx-0 inline-flex"
            >
              <p className="relative z-30 group-hover:underline"> Purchase</p>
              <div className="overflow-hidden absolute left-0 top-0 rounded-[20px] bg-black group-hover:w-full h-full  bg-gradient-to-r from-purple-800 to-blue-600 w-0 transition-all duration-200 ease-in-out"></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
