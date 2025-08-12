import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const Hero = () => {
  return (
    <div className="w-full bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:60px_60px]">
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-10 px-6 py-16">
        <div className="max-w-2xl text-center">
          <Badge>Hola Mundo 👋</Badge>
          <h1 className="mt-6 text-7xl font-bold !leading-[1.2] tracking-tight lg:text-7xl md:text-7xl">
            Segaris Inventory
          </h1>
          <p className="mt-6 text-base sm:text-lg">
            Memudahkan kamu dalam mengelola inventaris barang. <br /> Ayo mulai
            sekarang!
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href={"#features"} className="flex items-center gap-1">
              <Button size="lg" className="text-base">
                Get Started
              </Button>
            </Link>
            <Button
              variant="neutral"
              size="lg"
              className="text-base shadow-none"
            >
              Login Sekarang!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
