"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import { trpc } from "@/utils/trpc";

export default function GuestNavbar() {
  const { data: user, isLoading } = trpc.auth.authMe.useQuery(undefined, {
    retry: false,
  });

  return (
    <header className="w-full fixed bg-background dark:bg-secondary-background shadow-shadow py-5 px-10">
      <div className="container sm:px-32 mx-auto flex items-center justify-between">
        <nav className="flex items-center justify-start w-full gap-6">
          <Link href={"/"} className="text-foreground text-xl">
            Beranda
          </Link>
        </nav>
        <div className="flex justify-end gap-3">
          <ModeToggle />
          {!isLoading &&
            (user ? (
              <Link
                href={"/dashboard"}
                className={buttonVariants({
                  variant: "default",
                  className: "py-5",
                })}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href={"/login"}
                className={buttonVariants({
                  variant: "default",
                  className: "py-5",
                })}
              >
                Masuk
              </Link>
            ))}
        </div>
      </div>
    </header>
  );
}
