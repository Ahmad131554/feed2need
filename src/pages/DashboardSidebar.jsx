import { NavLink } from "react-router";
import { DASHBOARD_NAV } from "../utils/dashboardNav";
import Logo from "../ui/Logo";
import React from "react";

function DashboardSidebar({ role }) {
  const navItems = DASHBOARD_NAV[role];

  return (
    <div className="min-h-screen w-64 bg-teal-700 text-white">
      <div className="p-4">
        <Logo />
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map(({ label, icon, path }) => (
            <li key={label}>
              <NavLink
                to={path}
                end
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-teal-800 ${
                    isActive ? "bg-teal-800" : ""
                  }`
                }
              >
                {icon && (
                  <span className="text-lg">{React.createElement(icon)}</span>
                )}
                <span className="ml-3">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default DashboardSidebar;
