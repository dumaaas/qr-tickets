"use client";

import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.stripe_public_key);
import axios from "axios";
export default function Purchase() {
  const [isTargetVisible, setIsTargetVisible] = useState(false);
  const [isCheckoutButtonDisabled, setIsCheckoutButtonDisabled] =
    useState(false);
  const [festivalTicket, setFestivalTicket] = useState({
    name: "Festival Ticket",
    price: 20,
    quantity: 0,
  });
  const [parkingTicket, setParkingTicket] = useState({
    name: "Parking Ticket",
    price: 15,
    quantity: 0,
  });

  const targetDivRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (targetDivRef.current) {
        const targetDiv = targetDivRef.current;
        const targetDivPosition = targetDiv.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (targetDivPosition.top <= viewportHeight - 100) {
          setIsTargetVisible(true);
        } else {
          setIsTargetVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleQuantityChange = (type, operation) => {
    if (type === "ticket") {
      setFestivalTicket((prevState) => ({
        ...prevState,
        quantity:
          operation == "minus"
            ? prevState.quantity - 1
            : prevState.quantity + 1,
      }));
    } else {
      setParkingTicket((prevState) => ({
        ...prevState,
        quantity:
          operation == "minus"
            ? prevState.quantity - 1
            : prevState.quantity + 1,
      }));
    }
  };

  const createCheckoutSession = async () => {
    setIsCheckoutButtonDisabled(true);
    const stripe = await stripePromise;

    // Call the backend to create a checkout session...
    const checkoutItems = [];
    if (festivalTicket.quantity > 0) {
      checkoutItems.push(festivalTicket);
    }
    if (parkingTicket.quantity > 0) {
      checkoutItems.push(parkingTicket);
    }

    if (checkoutItems.length) {
      const checkoutSession = await axios.post("/api/create-checkout-session", {
        items: checkoutItems,
      });

      // Redirect user/customer to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id,
      });
    } else {
      return;
    }
  };

  return (
    <div className="relative container px-5 pt-[180px] pb-12 mx-auto md:gap-[60px] gap-[40px]  lg:gap-[80px] min-h-screen flex flex-col items-center justify-center">
      {!isTargetVisible &&
        (parkingTicket.quantity > 0 || festivalTicket.quantity > 0) && (
          <div className="flex lg:hidden items-center justify-between z-[100000] bottom-0 left-0 w-screen px-6 py-4 fixed  bg-gradient-to-r from-blue-600 to-black">
            <div className="flex items-center gap-[20px]">
              <h3 className="text-lg font-bold text-white">Total: </h3>
              <p className="font-semibold text-white">
                {parkingTicket.quantity * parkingTicket.price +
                  festivalTicket.quantity * festivalTicket.price}
                $
              </p>
            </div>
            <div className="flex">
              <div className="w-[97px] h-[40px] items-center justify-center group relative overflow-hidden rounded-[20px] px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-800 font-semibold ml-auto xl:mx-0 inline-flex">
                <button
                  onClick={() => createCheckoutSession()}
                  role="link"
                  disabled={isCheckoutButtonDisabled}
                  className="relative z-30 group-hover:underline"
                >
                  {" "}
                  {isCheckoutButtonDisabled ? (
                    <Image
                      className="relative"
                      src="/loading.svg"
                      alt="logo"
                      width={20}
                      height={60}
                      priority
                    />
                  ) : (
                    "Purchase"
                  )}
                </button>
                <div className="overflow-hidden absolute left-0 top-0 rounded-[20px] bg-black group-hover:w-full h-full  bg-gradient-to-r from-purple-800 to-blue-600 w-0 transition-all duration-200 ease-in-out"></div>
              </div>
            </div>
          </div>
        )}
      <h1 className="text-3xl font-bold md:text-4xl">Purchase your ticket </h1>
      <div className="flex items-center justify-evenly w-full gap-[40px] lg:flex-row flex-col">
        {router.query.type !== "2" ? (
          <div
            className={`bg-white rounded-[12px] px-4 py-4 lg:w-[40%] w-full ${
              router.query.type == "1" ? "lg:w-[60%]" : "lg:w-[40%]"
            }`}
          >
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
                <button
                  onClick={() => handleQuantityChange("ticket", "minus")}
                  className={`${
                    festivalTicket.quantity == 0
                      ? "cursor-not-allowed pointer-events-none  bg-gray-500"
                      : ""
                  } cursor-pointer hover:bg-red-600 bg-red-500 rounded-full w-[26px] h-[26px] flex items-center justify-center`}
                >
                  <svg
                    width="22px"
                    height="22px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
                      fill="#fff"
                    />
                  </svg>
                </button>
                <p className="text-black">{festivalTicket.quantity}</p>
                <button
                  onClick={() => handleQuantityChange("ticket", "plus")}
                  className="cursor-pointer hover:bg-green-600 bg-green-500 rounded-full w-[26px] h-[26px] flex items-center justify-center"
                >
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7C13 6.44771 12.5523 6 12 6C11.4477 6 11 6.44771 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17Z"
                      fill="#fff"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {router.query.type !== "1" ? (
          <div
            className={`bg-white rounded-[12px] px-4 py-4 lg:w-[40%] w-full ${
              router.query.type == "2" ? "lg:w-[60%]" : "lg:w-[40%]"
            }`}
          >
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
                <button
                  onClick={() => handleQuantityChange("parking", "minus")}
                  className={`${
                    parkingTicket.quantity == 0
                      ? "cursor-not-allowed pointer-events-none  bg-gray-500"
                      : ""
                  } cursor-pointer hover:bg-red-600 bg-red-500 rounded-full w-[26px] h-[26px] flex items-center justify-center`}
                >
                  <svg
                    width="22px"
                    height="22px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
                      fill="#fff"
                    />
                  </svg>
                </button>
                <p className="text-black">{parkingTicket.quantity}</p>
                <button
                  onClick={() => handleQuantityChange("parking", "plus")}
                  className="cursor-pointer hover:bg-green-600 bg-green-500 rounded-full w-[26px] h-[26px] flex items-center justify-center"
                >
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7C13 6.44771 12.5523 6 12 6C11.4477 6 11 6.44771 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17Z"
                      fill="#fff"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {parkingTicket.quantity > 0 || festivalTicket.quantity > 0 ? (
        <div
          ref={targetDivRef}
          className={`w-full bg-white rounded-[20px] ${
            router.query.type == "1" || router.query.type == "2"
              ? "lg:w-[60%]"
              : "lg:w-[89%]"
          }`}
        >
          <h3 className="px-4 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-800 rounded-tr-[20px] rounded-tl-[20px]">
            Your cart
          </h3>
          <div className="px-4">
            {router.query.type !== "2" && festivalTicket.quantity > 0 ? (
              <div
                className={`flex items-center justify-between py-4 ${
                  router.query.type == "1" ? "border-b" : ""
                }`}
              >
                <p className="text-black ">
                  Festival ticket x{festivalTicket.quantity}
                </p>

                <p className="font-semibold text-black">
                  {festivalTicket.price * festivalTicket.quantity}$
                </p>
              </div>
            ) : null}
            {router.query.type !== "1" && parkingTicket.quantity > 0 ? (
              <div className="flex items-center justify-between py-4 border-b">
                <p className="text-black ">
                  Parking ticket x{parkingTicket.quantity}
                </p>

                <p className="font-semibold text-black">
                  {parkingTicket.price * parkingTicket.quantity}$
                </p>
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <p className="text-black ">Total</p>

            <p className="font-semibold text-black">
              {parkingTicket.quantity * parkingTicket.price +
                festivalTicket.quantity * festivalTicket.price}
              $
            </p>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <p className="text-black ">Proced to the checkout</p>
            <div className="flex">
              <div className="w-[97px] h-[40px] items-center justify-center group relative overflow-hidden rounded-[20px] px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-800 font-semibold ml-auto xl:mx-0 inline-flex">
                <button
                  onClick={() => createCheckoutSession()}
                  role="link"
                  disabled={isCheckoutButtonDisabled}
                  className="relative z-30 group-hover:underline"
                >
                  {" "}
                  {isCheckoutButtonDisabled ? (
                    <Image
                      className="relative"
                      src="/loading.svg"
                      alt="logo"
                      width={20}
                      height={60}
                      priority
                    />
                  ) : (
                    "Purchase"
                  )}
                </button>
                <div className="overflow-hidden absolute left-0 top-0 rounded-[20px] bg-black group-hover:w-full h-full  bg-gradient-to-r from-purple-800 to-blue-600 w-0 transition-all duration-200 ease-in-out"></div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
