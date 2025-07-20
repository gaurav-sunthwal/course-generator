"use client";
import { Button } from "@/components/ui/button";
import { ColorModeButton } from "@/components/ui/color-mode";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Header({ params }: { params: string }) {
  const { user } = useUser();

  return (
    <div className="p-4 mt-0">
      <div className="flex flex-wrap items-center justify-between">
        {/* Logo Section */}
        <Link
          href={user ? "/dashboard" : ""}
          className="sm:text-2xl lg:text-3xl"
        >
          <h1 className="font-bold text-nowrap text-gray-800 dark:text-white">
            CourseCrafter AI
          </h1>
        </Link>

        {/* Buttons Section */}
        <div className="flex flex-wrap items-center gap-6 mt-2 md:mt-0">
          {params === "" ? (
            params === "" ? (
              <Link href={"/dashboard"} className="items-center">
                <Button>{user ? "Dashboard" : "Get Started"}</Button>
              </Link>
            ) : (
              ""
            )
          ) : (
            <UserButton />
          )}
          <ColorModeButton />
        </div>
      </div>
    </div>
  );
}
