"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import MobileMenu from "./menu";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("user");
    const checkData = async () => {
      if (data) {
        const parsedData = JSON.parse(data);
        setUser(parsedData);
        setAvatar(parsedData.avatar);
        console.log("PARSED DATA" + JSON.stringify(parsedData));
        setLoading(false);
      }
      setLoading(false);
    };
    checkData();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/pet";
  };


  return (
    <div className="border-b-2 border-gray-100 h-12 text-slate-900 p-2 flex items-center justify-between md:h-16 lg:px-20 xl:px-40">
      {/* LEFT LINKS */}
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/pet">Home</Link>
        <Link href="/pet/services">Services</Link>
        <Link href="/pet/adoption">Adoption</Link>
        <Link href="/pet/contact">Contact Us</Link>
      </div>
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <Image
          alt="Pet adoption logo"
          src="/images/logo.png"
          className="w-10 min-h-fit md:w-12"
          width={48}
          height={48}
        />
        <div className="text-sm font-bold md:text-xl">
          <Link href="/pet">Pet Adoption</Link>
        </div>
      </div>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        <MobileMenu />
      </div>
      {/* RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className="h-10 w-10 cursor-pointer drop-shadow-sm"
                >
                  <img
                    src={`${
                      user.avatar
                        ? `http://localhost/pet-adoption-api/avatar/${user.avatar}`
                        : "/images/blank_profile.webp"
                    }`}
                    alt="Avatar"
                    className="object-cover h-full w-full rounded-full"
                    onError={(e) => {
                      console.log("Image failed to load", e);
                      e.target.src = "/images/blank_profile.webp";
                    }}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/pet/profile">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link href="/pet/background">
                    <DropdownMenuItem>Background</DropdownMenuItem>
                  </Link>
                  <Link href="/pet/requests">
                    <DropdownMenuItem>Adoption requests</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link href="#" onClick={() => handleLogOut()}>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button asChild variant="lime">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="aroma">
              <Link href="/signup">Signup</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
