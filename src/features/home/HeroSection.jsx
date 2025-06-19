// import { useNavigate } from "react-router";

// function HeroSection() {
//   const navigate = useNavigate();

//   return (
//     <section className="mb-8 grid grid-cols-1 items-center justify-center gap-8 bg-blue-50 md:grid-cols-2">
//       <div className="py-24 pl-[20%]">
//         <h2 className="font-island mb-4 text-3xl font-bold">Today's Special</h2>
//         <div className="flex flex-col space-y-4 text-5xl font-extrabold uppercase">
//           <p>The Online</p>
//           <p>Grocery Store</p>
//         </div>

//         <button
//           onClick={() => navigate("/shop")}
//           className="mt-6 inline-block rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white transition hover:bg-green-700"
//         >
//           Shop Now
//         </button>
//       </div>

//       <div className="flex justify-center md:justify-end">
//         <img
//           src="assets/hero-img.png"
//           alt="Fresh produce"
//           className="w-full rounded-lg"
//         />
//       </div>
//     </section>
//   );
// }

// export default HeroSection;

import { useNavigate } from "react-router";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="mb-8 grid grid-cols-1 items-center justify-center gap-8 bg-blue-50 px-4 md:grid-cols-2 md:px-16">
      <div className="py-12 sm:py-20 md:py-24">
        <h2 className="font-island mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
          Today's Special
        </h2>
        <div className="flex flex-col space-y-2 text-3xl font-extrabold uppercase sm:text-4xl md:text-5xl">
          <p>The Online</p>
          <p>Grocery Store</p>
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="mt-6 inline-block rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white transition hover:bg-green-700"
        >
          Shop Now
        </button>
      </div>

      <div className="flex justify-center md:justify-end">
        <img
          src="assets/hero-img.png"
          alt="Fresh produce"
          className="w-full max-w-md rounded-lg md:max-w-lg lg:max-w-xl"
        />
      </div>
    </section>
  );
}

export default HeroSection;
