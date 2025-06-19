import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Logo from "./Logo";
import PageNavigation from "./PageNavigation";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) fetchProfile(session.user.id);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
      setIsCheckingAuth(false);
      if (session?.user) fetchProfile(session.user.id);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("customer_profiles")
      .select("username")
      .eq("id", userId)
      .single();
    if (!error && data) setProfile(data);
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 w-full bg-emerald-500 shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        {/* Full nav shown on md+ */}
        <div className="hidden flex-1 md:flex md:justify-center">
          <PageNavigation />
        </div>

        {/* Right section */}
        <div className="ml-auto flex items-center space-x-3 sm:space-x-4">
          <NavLink
            to="/cart"
            className="transition-colors hover:text-emerald-200"
          >
            <FiShoppingCart className="h-6 w-6" />
          </NavLink>

          {!isCheckingAuth && (
            <button
              onClick={() =>
                navigate(isLoggedIn ? "/profile/orders" : "/login")
              }
              className="transition-colors hover:text-emerald-200"
            >
              {isLoggedIn && profile?.username ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 shadow">
                  {getInitials(profile.username)}
                </div>
              ) : (
                <div className="rounded-full bg-gray-200 p-1">
                  <FiUser className="h-5 w-5 text-gray-600" />
                </div>
              )}
            </button>
          )}

          <NavLink
            to="/seller-auth"
            className="hidden rounded-full bg-white px-4 py-1 text-sm font-semibold text-emerald-500 hover:bg-emerald-100 md:block"
          >
            Become a Seller
          </NavLink>

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none md:hidden"
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="bg-emerald-600 px-4 pt-4 pb-6 md:hidden">
          <nav className="flex flex-col space-y-4 text-base font-medium">
            <NavLink to="/" className="text-white hover:text-emerald-200">
              Home
            </NavLink>
            <NavLink to="/shop" className="text-white hover:text-emerald-200">
              Shop
            </NavLink>
            <NavLink
              to="/products"
              className="text-white hover:text-emerald-200"
            >
              Products
            </NavLink>
            <NavLink
              to="/contact"
              className="text-white hover:text-emerald-200"
            >
              Contact
            </NavLink>
            <NavLink to="/pages" className="text-white hover:text-emerald-200">
              Pages
            </NavLink>
            <NavLink
              to="/seller-auth"
              className="mt-4 block rounded-full bg-white px-5 py-2 text-center text-sm font-semibold text-emerald-500 hover:bg-emerald-100"
            >
              Become a Seller
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
