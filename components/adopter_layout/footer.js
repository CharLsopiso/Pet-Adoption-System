import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="border-t-2 border-gray-100 h-12 md:h-16 p-4 lg:px-20 xl:px-40 text-slate-900 flex items-center justify-between">
      <div className="text-sm font-bold md:text-lg">
          <Link href="/pet">Pet Adoption</Link>
      </div>
      <p className="text-sm md:text-lg">©2024 App created by Team Opiso.</p>
    </div>
  );
};

export default Footer;