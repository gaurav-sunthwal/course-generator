"use client";
import { Button } from "@/components/ui/button";
import { ColorModeButton } from "@/components/ui/color-mode";
import { HStack } from "@chakra-ui/react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Header({ params }: { params: string }) {
  const { user } = useUser();

  return (
    <div className="p-4 mt-0">
      <HStack
        justifyContent="space-between"
        className="flex flex-wrap items-center"
      >
        {/* Logo Section */}
        <Link href={"/"} className="sm:text-2xl lg:text-3xl">
          <h1 className="font-bold text-nowrap  text-gray-800 dark:text-white">
            CourseCrafter AI
          </h1>
        </Link>

        {/* Buttons Section */}
        <HStack
          gap={6}
          justifyContent="center"
          className="flex-wrap mt-2 md:mt-0"
        >
          <Link href={"/dashboard"}>
            {params === "dashboard" ? (
              params === "dashboard" ? (
                <UserButton />
              ) : (
                ""
              )
            ) : (
              <Button>{user ? "Dashboard" : "Get Started"}</Button>
            )}
          </Link>
          <ColorModeButton />
        </HStack>
      </HStack>
    </div>
  );
}
