// import CategoryCard from "./CatagoryCard";
// function FeaturedCatagories() {
//   return (
//     <div className="grid grid-cols-4 gap-4 sm:gap-8">
//       <CategoryCard bgColor="bg-green-100">
//         <img src="assets/vegetables/veg-ctg.webp" alt="Vegetables Catagory" />
//         <p className="mt-2">Vegetables</p>
//       </CategoryCard>

//       <CategoryCard bgColor="bg-neutral-100">
//         <img src="assets/lentils/lentils-group.webp" alt="Lentils Catagory" />
//         <p className="mt-2">Lentils</p>
//       </CategoryCard>

//       <CategoryCard bgColor="bg-amber-50">
//         <img src="assets/fruits/fruits-catagory.webp" alt="Fruits Catagory" />
//         <p className="mt-2">Fruits</p>
//       </CategoryCard>

//       <CategoryCard bgColor="bg-stone-100">
//         <img src="assets/rice/rice-catagory.webp" alt="Rice Catagory" />
//         <p className="mt-2">Rice</p>
//       </CategoryCard>
//     </div>
//   );
// }

// export default FeaturedCatagories;

import CategoryCard from "./CatagoryCard";

function FeaturedCatagories() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-4 lg:gap-8">
      <CategoryCard bgColor="bg-green-100">
        <img src="assets/vegetables/veg-ctg.webp" alt="Vegetables Catagory" />
        <p className="mt-2">Vegetables</p>
      </CategoryCard>

      <CategoryCard bgColor="bg-neutral-100">
        <img src="assets/lentils/lentils-group.webp" alt="Lentils Catagory" />
        <p className="mt-2">Lentils</p>
      </CategoryCard>

      <CategoryCard bgColor="bg-amber-50">
        <img src="assets/fruits/fruits-catagory.webp" alt="Fruits Catagory" />
        <p className="mt-2">Fruits</p>
      </CategoryCard>

      <CategoryCard bgColor="bg-stone-100">
        <img src="assets/rice/rice-catagory.webp" alt="Rice Catagory" />
        <p className="mt-2">Rice</p>
      </CategoryCard>
    </div>
  );
}

export default FeaturedCatagories;
