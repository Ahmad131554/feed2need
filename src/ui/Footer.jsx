import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Grid: Responsive layout */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Logo + Contact */}
          <div className="space-y-4">
            <Logo />
            <div className="flex items-start text-sm text-gray-600">
              <FiMapPin className="mt-1 mr-2 text-emerald-500" />
              <p>
                Five Brothers Hostel
                <br />
                Comsats University
              </p>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiPhone className="mr-2 text-emerald-500" />
              <p>+92 3067881854</p>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <FiMail className="mr-2 text-emerald-500" />
              <p>Feed2Need@gmail.com</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="#"
                className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="rounded-full bg-pink-600 p-2 text-white hover:bg-pink-700"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Info Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              INFORMATION
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Contact us",
                "Terms & Conditions",
                "Privacy Policy",
                "Delivery Information",
                "Sellers",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-emerald-500">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              MY ACCOUNT
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {["My Account", "My Cart", "Login", "Wishlist", "Checkout"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-emerald-500">
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              OUR COMPANY
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Fruits",
                "Vegetables",
                "Meat",
                "Milk & Dairy",
                "Fresh Foods",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-emerald-500">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Times */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              OPENING TIME
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Mon - Fri: 8AM - 10PM",
                "Sat: 9AM - 8PM",
                "Sun: 2PM - 6PM",
                "We Work All Holidays",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center">
                  <FiClock className="mr-2 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-center text-sm text-gray-600">
            &copy; {currentYear} Feed2Need. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
