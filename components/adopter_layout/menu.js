"use client";

import React, { useState, useEffect } from "react";
import { Bars3BottomLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const MobileMenu = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user");
    const checkData = async () => {
      if (data) {
        const parsedData = JSON.parse(data);
        setUser(parsedData);
      }
    };
    checkData();
  }, []);

  const links = [
    { id: 1, title: "Home", url: "/pet" },
    { id: 2, title: "Services", url: "/pet/services" },
    { id: 3, title: "Adoption", url: "/pet/adoption" },
    { id: 4, title: "Contact", url: "/pet/contact" },
    { id: 4, title: "Profile", url: "/pet/profile" },
    { id: 4, title: "Background", url: "/pet/background" },
  ];

  const handleLogOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/pet";
  };

  const [open, setOpen] = useState(false);

  return (
    <div>
    {!open ? (
        <Bars3BottomLeftIcon className="h-5 w-5"
          onClick={() => setOpen(true)}
        />
      ) : (
        <XMarkIcon className="h-5 w-5"
          onClick={() => setOpen(false)}
        />
      )}
      {open && (
        <div className="backdrop-blur-md bg-lime-500/70 text-white absolute left-0 top-12 w-full h-[calc(100vh-3rem)] flex flex-col gap-8 items-center justify-center text-xl z-10">
          {links.map((item) => (
            <Link href={item.url} key={item.id} onClick={() => setOpen(false)}>
              {item.title}
            </Link>
          ))}

          {/* LONG WAY */}
          {!user ? (
            <>
                <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                <Link href="/signup" onClick={() => setOpen(false)}>Signup</Link>
            </>
          ) : (
            <>
              <Link href="/pet/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
              <Link href="/pet/background" onClick={() => setOpen(false)}>
                Background
              </Link>
              <Link href="/pet/requests" onClick={() => setOpen(false)}>
                Adoption requests
              </Link>
              <Link href="#" onClick={() => handleLogOut()}>
                Logout
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
