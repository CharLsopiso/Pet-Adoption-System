import FeaturedPets from "./featured_pets";

const FeaturedSection = () => {
  return (
    <>
      <p className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 flex items-center justify-center text-center text-3xl md:text-xl cursor-pointer">
        Featured pets from our shelter
      </p>
      <div className="w-screen overflow-x-scroll text-slate-900">
        {/* WRAPPER */}
        <div className="w-max flex">
          <FeaturedPets />
        </div>
      </div>
      <p className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 flex items-center justify-center text-center text-3xl md:text-xl cursor-pointer">
        Pet adoption process overview
      </p>
    </>
  );
};

export default FeaturedSection;
