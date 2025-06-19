import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Logo from "./Logo";

function FooterInfoColumn() {
  return (
    <div className="pr-4">
      {/* <div className="mb-4 flex items-center">
        <div className="rounded bg-black p-1">
          <div className="text-white">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M2 4a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 8.586V4zm5.5 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                <path d="M16.5 2A2.5 2.5 0 0 1 19 4.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 13.5V11h1v2.5A1.5 1.5 0 0 0 7.5 15h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 16.5 3h-9A1.5 1.5 0 0 0 6 4.5V7H5V4.5A2.5 2.5 0 0 1 7.5 2h9z" />
              </svg>
            </span>
          </div>
        </div>
        <div className="ml-2">
          <h2 className="text-lg font-bold">Feed 2</h2>
          <p className="text-xs">Need</p>
        </div>
      </div> */}
      <Logo />

      <div className="mb-4 flex items-start text-gray-600">
        <FiMapPin className="mt-1 mr-2 h-5 w-5 text-emerald-500" />
        <div>
          <p>Five Brothers Hostel</p>
          <p>Comsats University</p>
        </div>
      </div>

      <div className="mb-4 flex items-center text-gray-600">
        <FiPhone className="mr-2 h-5 w-5 text-emerald-500" />
        <p>+923067881854</p>
      </div>

      <div className="mb-4 flex items-center text-gray-600">
        <FiMail className="mr-2 h-5 w-5 text-emerald-500" />
        <p>Feed2Need@gmail.com</p>
      </div>

      {/* Social Media Links */}
      <div className="mt-6 flex space-x-3">
        <a
          href="#"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
        >
          <FaFacebookF size={16} />
        </a>
        <a
          href="#"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-600 p-2 text-white hover:bg-pink-700"
        >
          <FaInstagram size={16} />
        </a>
        <a
          href="#"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          <FaLinkedinIn size={16} />
        </a>
      </div>
    </div>
  );
}

export default FooterInfoColumn;
