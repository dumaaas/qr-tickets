import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container px-5 pt-[160px] pb-12 mx-auto flex flex-wrap gap-[40px] items-center justify-between min-h-screen">
      <div className="xl:flex-[40%]">
        <p className="xl:text-6xl md:text-5xl text-4xl font-semibold leading-[80px] xl:text-left text-center">
          Harmony Festival
        </p>
        <p className="pt-5 xl:w-[60%] md:w-[65%] w-[90%] xl:text-left text-center mx-auto xl:mx-0 xl:text-base text-md">
          Dive into the ultimate music experience - join us at Harmony Festival! Discover a world of captivating rhythms and electrifying performances that will leave you breathless. Secure your spot now and get ready to dance, sing, and celebrate in an unforgettable musical journey. Purchase your tickets in just a few simple steps below and prepare for an extraordinary festival experience.
        </p>
        <Link href={"/purchase"} className="group relative overflow-hidden rounded-[20px] px-4 py-2 mt-[30px] bg-gradient-to-r from-blue-600 to-purple-800 font-semibold mx-auto xl:mx-0 table">
          <p className="relative z-30 group-hover:underline"> Explore your options</p>
          <div className="overflow-hidden absolute left-0 top-0 rounded-[20px] bg-black group-hover:w-full h-full  bg-gradient-to-r from-purple-800 to-blue-600 w-0 transition-all duration-200 ease-in-out"></div>
        </Link>
      </div>
      <Image
        className="relative drop-shadow-[0_0_0.3rem_#ffffff70] rounded-full xl:shadow-[0_0px_50px_rgb(255,0,255,0.2)] mx-auto"
        src="/cover.jpg"
        alt="cover"
        width={500}
        height={127}
        priority
      />

    </div>
  )
}
