"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  RectangleGroupIcon,
  ListBulletIcon,
  InboxIcon,
  ClockIcon,
  UsersIcon,
  Bars3Icon,
  ArrowLeftStartOnRectangleIcon
} from "@heroicons/react/24/solid";
import Dashboard from "@/components/admin_routes/dashboard";
import ApprovalModule from "@/components/admin_routes/approval";
import PetTypesModule from "@/components/admin_routes/types";
import BreedModule from "@/components/admin_routes/breeds";
import PetsModule from "@/components/admin_routes/pets";
import UsersModule from "@/components/admin_routes/users";
import InterviewModule from "@/components/admin_routes/interview";
import HistoryModule from "@/components/admin_routes/history";


const Sidebar = ({ activeItem, setActiveItem, toggleCollapse }) => {
  const linkStyle = `flex items-center min-h-[40px] h-full text-sidebar-foreground py-2 px-4 transition duration-300 hover:border-l-4 hover:border-lime-500 hover:bg-lime-50 ${
    toggleCollapse ? "justify-center" : ""
  }`;

  const menuGroups = [
    {
      title: "General",
      items: [
        { name: "Dashboard", icon: <RectangleGroupIcon /> },
        { name: "Adoption Requests", icon: <InboxIcon /> },
        { name: "Interviews", icon: <ListBulletIcon /> },
        { name: "Adoption History", icon: <ClockIcon /> },
      ],
    },
    {
      title: "Masterlist",
      items: [
        { name: "Species", icon: <ListBulletIcon /> },
        { name: "Breeds", icon: <ListBulletIcon /> },
        { name: "Pets", icon: <ListBulletIcon /> },
        { name: "Users", icon: <UsersIcon /> },
      ],
    },
    {
      title: "Settings",
      items: [
        { name: "Logout", icon: <ArrowLeftStartOnRectangleIcon /> },
      ],
    }
  ];

  return (
    <aside
      className={`sidebar overflow-y-auto fixed bg-white border-r-1 border-gray-300 z-50 h-full drop-shadow-sm transition duration-300 ease-in-out w-[20rem] ${
        toggleCollapse ? "sm:w-[5.6rem] sm:left-0 left-[-100%]" : "w-[20rem]"
      }`}
    >
      <div className="flex relative items-center py-5 px-2">
        <Image
          alt="Pet adoption logo"
          src="/images/logo.png"
          className="w-12 mx-3.5 min-h-fit"
          width={48}
          height={48}
        />
        <h3
          className={`pl-2 font-bold text-2xl text-slate-900 min-w-max ${
            toggleCollapse ? "hidden" : ""
          }`}
        >
          Pet Adoption
        </h3>
      </div>

      <nav className="flex flex-col gap-4 transition duration-300 ease-in-out">
        {/* Map through groups */}
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Group title */}
            {!toggleCollapse ? (
              <h4 className="px-4 text-xs font-semibold uppercase text-slate-500 mt-4">
                {group.title}
              </h4>
            ) : (
              <h4 className="px-4 text-center font-semibold uppercase text-slate-500 mt-2">
                ...
              </h4>
            )}


            {/* Map through items within the group */}
            {/* Adjusting spacing */}
            {group.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex flex-col gap-2 px-4 mt-2" 
                onClick={() => setActiveItem(item.name)}
              >
                <div
                  className={`${linkStyle} ${
                    activeItem === item.name
                      ? "border-l-4 border-lime-500 bg-lime-50"
                      : ""
                  }`}
                >
                  <div className="min-w-[26px]">
                    {React.cloneElement(item.icon, {
                      className: `${
                        activeItem === item.name
                          ? "text-lime-500"
                          : "text-slate-900"
                      }`,
                    })}
                  </div>

                  {!toggleCollapse && (
                    <span
                      className={`ml-3 leading-6 ${
                        activeItem === item.name
                          ? "text-lime-500"
                          : "text-slate-900"
                      }`}
                    >
                      {item.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};



const Home = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const sidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  const router = useRouter();

    useEffect(() => {
      const data = localStorage.getItem("admin");

      const checkData = async () => {
        if (!data) {
          router.push("/admin");
        } else {
          const parsedData = JSON.parse(data);
          setCurrentUser(parsedData);
          setLoading(false);
        }
      };
      checkData();
    }, []);

    const handleLogOut = () => {
      localStorage.removeItem("admin");
      window.location.href = "/admin";
    };

  const renderActiveComponent = () => {
    switch (activeItem) {
      case "Dashboard":
        return <Dashboard/>;
      case "Adoption Requests":
      return <ApprovalModule/>;
      case "Interviews":
      return <InterviewModule/>;
      case "Adoption History":
      return <HistoryModule/>;
      case "Species":
        return <PetTypesModule/>;
      case "Breeds":
      return <BreedModule/>;
      case "Pets":
        return <PetsModule/>;
      case "Users":
        return <UsersModule/>;
      case "Logout":
        return handleLogOut();
      default:
        return (
          <h3 className="text-xl font-semibold">
            Welcome to Pet Adoption Manager
          </h3>
        );
    }
  };

  return (
    <>
      { loading ? (
        <div>Loading...</div>
      ) : currentUser ? (
        <div className="flex min-h-screen">
          <Sidebar
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            toggleCollapse={toggleCollapse}
          />

          {/* Header */}
          <header
            className={`fixed bg-white w-full z-0 px-2 drop-shadow-sm transition-all duration-300 ease-in-out ${
              toggleCollapse ? "sm:pl-[6rem]" : "sm:pl-[20.4rem]"
            }`}
          >
            <div className="flex items-center justify-between h-16">

              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center text-center drop-shadow-md order-1 sm:order-2">
                <span>A</span>
              </div>

              {/* Toggle Button */}
              <button
                onClick={sidebarToggle}
                className="text-slate-900 h-[30px] flex items-center justify-center cursor-pointer order-2 sm:order-1"
              >
                <Bars3Icon className="h-8 w-8 transition duration-300 ease-in-out" />
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div
            className={`bg-[#f9f9f9] flex-grow text-black p-2 mt-16 transition-all duration-300 ease-in-out ${
              toggleCollapse ? "sm:pl-[6rem]" : "sm:pl-[20.4rem]"
            }`}
          >
            {renderActiveComponent()}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Home;
