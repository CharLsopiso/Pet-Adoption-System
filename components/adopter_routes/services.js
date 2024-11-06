import Link from "next/link";
import { Button } from "../ui/button";

const ServicesModule = () => {
  return (
    <>
      <div className="flex justify-center">
        {/* BOX CONTAINER */}
        <div className="w-full lg:w-[80%]">
          <div className="p-6 flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Adopt a pet
            </h2>
            <div className="flex justify-center p-6">
              <div className="h-72 w-full">
                <img
                  src="/images/L2.png"
                  alt="Pet adoption logo"
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-lime-500">
                Benefits of Pet Adoption
              </p>
              <p className="text-lg">
                Provide a loving home to a pet in need. Experience the
                unconditional love of a pet. Create lasting memories and
                cherished moments.
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-lime-500">Adoption Process</p>
              <p className="text-lg">
                Step 1: Fill out the application or adopter background form
              </p>
              <p className="text-lg">
                Step 2: Attend the onsite interview and complete the necessary
                paperwork.
              </p>
              <p className="text-lg">
                Step 3: Meet our shelter animals in person and take your pet
                home.
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-lime-500">Responsibilities</p>
              <p className="text-lg">
                Adopting a pet comes with responsibilities, including feeding,
                grooming, regular exercise, and providing medical care.
              </p>
            </div>
            <div className="flex justify-center">
                <Button asChild variant="lime" className="w-full md:w-1/5">
                <Link href="/pet/adoption">Find your perfect companion</Link>
                </Button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicesModule;
