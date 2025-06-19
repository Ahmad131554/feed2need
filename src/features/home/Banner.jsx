// import { FiTruck, FiClock } from "react-icons/fi";
// import { FaDollarSign, FaHandHoldingUsd } from "react-icons/fa";

// function Banner() {
//   return (
//     <section className="px-12 py-8">
//       <div className="flex items-center justify-center rounded-lg border border-[rgba(58,108,62,0.416)] p-4">
//         <div className="flex items-center justify-center gap-4 border-r-1 border-green-500 px-6 py-2">
//           <FiTruck className="h-10 w-10 text-emerald-600" />
//           <span className="text-xl">Flexible Delivery</span>
//         </div>

//         <div className="flex items-center justify-center gap-4 border-r-1 border-green-500 px-6 py-2">
//           <FaHandHoldingUsd className="h-10 w-10 text-emerald-600" />
//           <span className="text-xl">100% Money Back</span>
//         </div>

//         <div className="flex items-center justify-center gap-4 border-r-1 border-green-500 px-6 py-2">
//           <FaDollarSign className="h-10 w-10 text-emerald-600" />
//           <span className="text-xl">Secure Payment</span>
//         </div>

//         <div className="flex items-center justify-center gap-4 px-6 py-2">
//           <FiClock className="h-10 w-10 text-emerald-600" />
//           <span className="text-xl">24 Hour Support</span>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Banner;

import { FiTruck, FiClock } from "react-icons/fi";
import { FaDollarSign, FaHandHoldingUsd } from "react-icons/fa";

function Banner() {
  return (
    <section className="px-4 py-8 sm:px-12">
      <div className="flex flex-col items-center justify-center divide-y divide-green-500 rounded-lg border border-[rgba(58,108,62,0.416)] p-4 md:flex-row md:divide-x md:divide-y-0">
        <div className="flex items-center justify-center gap-4 px-6 py-4">
          <FiTruck className="h-8 w-8 text-emerald-600 sm:h-10 sm:w-10" />
          <span className="text-lg sm:text-xl">Flexible Delivery</span>
        </div>
        <div className="flex items-center justify-center gap-4 px-6 py-4">
          <FaHandHoldingUsd className="h-8 w-8 text-emerald-600 sm:h-10 sm:w-10" />
          <span className="text-lg sm:text-xl">100% Money Back</span>
        </div>
        <div className="flex items-center justify-center gap-4 px-6 py-4">
          <FaDollarSign className="h-8 w-8 text-emerald-600 sm:h-10 sm:w-10" />
          <span className="text-lg sm:text-xl">Secure Payment</span>
        </div>
        <div className="flex items-center justify-center gap-4 px-6 py-4">
          <FiClock className="h-8 w-8 text-emerald-600 sm:h-10 sm:w-10" />
          <span className="text-lg sm:text-xl">24 Hour Support</span>
        </div>
      </div>
    </section>
  );
}

export default Banner;
