const ApplicationProcessSection = () => {

  const ApplicationProcess = [
    {
      id: 1,
      title: "Fill out the application or adopter background form",
      desc: "Start by filling out the adoption application form where you can provide your details. This helps us understand your needs and match you with the right pet. Note: An adoption fee is required to cover vet visits, vaccinations, and general pet care to ensure a smooth adoption process.",
      img: "/images/p1.png",
      bgColor: "#93c5fd",
      color: "white",
    },
    {
      id: 2,
      title: "Attend the onsite interview",
      desc: "Once your application is reviewed, you'll be invited to an interview. This is a chance for us to get to know you better and ensure a perfect match between you and the pet.",
      img: "/images/p2.png",
      bgColor: "#fcd34d",
      color: "white",
    },
    {
      id: 3,
      title:"Meet our shelter animals in person and take your pet home",
      desc: "After the interview, you'll meet the animals in person at the shelter. If everything goes well, you can finalize the adoption and take your new pet home!",
      img: "/images/p3.png",
      bgColor: "#f9a8d4 ",
      color: "white",
    },
  ];
  

  return (
    <>
      <div className="w-screen">
        {/* WRAPPER */}
        <div className="w-full grid md:grid-cols-3">
          {ApplicationProcess.map((category) => (
            <div
              key={category.id}
              className="relative flex items-center overflow-hidden p-8"
              style={{ backgroundColor: category.bgColor }}
            >
              <div className={`text-${category.color} w-1/2 z-10`}>
                <h1 className="font-bold text-2xl">{category.title}</h1>
                <p className="text-sm my-8">{category.desc}</p>
              </div>

              <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full overflow-hidden">
                <img
                  src={category.img}
                  alt={category.title}
                  className="h-full object-cover translate-x-1/4" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );  
}

export default ApplicationProcessSection
