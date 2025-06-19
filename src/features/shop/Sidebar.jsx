import { FaCaretDown } from "react-icons/fa";

function Sidebar({
  toggle,
  openCategory,
  activeCategory,
  activeSubCategory,
  setActiveCategory,
  setActiveSubCategory,
}) {
  const allCategories = [
    {
      key: "vegetables",
      title: "Vegetables",
      items: ["all", "Onions", "Carrots", "Broccoli"],
    },
    {
      key: "fruits",
      title: "Fruits",
      items: ["all", "Oranges", "Bananas", "Mangoes"],
    },
    {
      key: "pulses",
      title: "Pulses",
      items: ["all", "Lentils", "Chickpeas"],
    },
    {
      key: "rice",
      title: "Rice",
      items: ["all", "Basmati", "Jasmine"],
    },
  ];

  return (
    <aside className="h-full space-y-6 border-r border-gray-200 bg-white pr-4">
      <h2 className="mb-4 border-b border-green-600 pb-2 text-xl font-semibold text-green-700">
        Shop Categories
      </h2>

      <nav className="space-y-2 text-sm text-gray-700">
        {allCategories.map((category) => (
          <div key={category.key}>
            <button
              className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left font-medium transition ${
                openCategory === category.key
                  ? "bg-gray-100 text-green-700"
                  : "hover:bg-gray-50 hover:text-green-700"
              }`}
              onClick={() => toggle(category.key)}
            >
              <span>{category.title}</span>
              <FaCaretDown
                className={`ml-2 text-sm transition-transform duration-200 ${
                  openCategory === category.key ? "rotate-180" : ""
                }`}
              />
            </button>

            {openCategory === category.key && (
              <ul className="mt-2 ml-4 space-y-2 border-l border-dotted border-gray-300 pl-4">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className={`cursor-pointer rounded px-2 py-1 text-gray-500 transition hover:bg-green-50 hover:text-green-700 ${
                      activeCategory === category.key &&
                      activeSubCategory === (item === "all" ? null : item)
                        ? "bg-green-100 font-semibold text-green-700"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveCategory(category.key);
                      setActiveSubCategory(item === "all" ? null : item);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
