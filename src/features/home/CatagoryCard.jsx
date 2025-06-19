// function CategoryCard({ bgColor, children }) {
//   return (
//     <div
//       className={`category-box p-4 text-center ${bgColor} transform rounded-xl shadow-md transition duration-300 hover:scale-105 hover:shadow-lg`}
//     >
//       {children}
//     </div>
//   );
// }

// export default CategoryCard;

function CategoryCard({ bgColor, children }) {
  return (
    <div
      className={`category-box p-4 text-center ${bgColor} transform rounded-xl shadow-md transition duration-300 hover:scale-105 hover:shadow-lg`}
    >
      {children}
    </div>
  );
}

export default CategoryCard;
