import { NavLink } from "react-router";

function PageNavigation() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Cart", path: "/cart" },
    { name: "Login", path: "/login" },
  ];

  return (
    <ul className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-white sm:gap-6 sm:text-base">
      {navItems.map(({ name, path }) => (
        <li key={name}>
          <NavLink
            to={path}
            className="px-2 py-1 transition-all duration-200 ease-in-out hover:scale-110 hover:text-emerald-200"
          >
            {name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default PageNavigation;
