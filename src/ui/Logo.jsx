import { Link } from "react-router";
import { IoBag } from "react-icons/io5";

function Logo() {
  return (
    <Link to="/">
      <div className="flex items-center space-x-2">
        <div className="rounded bg-white p-1">
          <span className="flex items-center font-bold text-emerald-500">
            <IoBag className="text-xl" />
          </span>
        </div>
        <div className="leading-tight text-white">
          <h1 className="text-base font-bold uppercase sm:text-lg">Feed 2</h1>
          <p className="text-xs uppercase sm:text-sm">Need</p>
        </div>
      </div>
    </Link>
  );
}

export default Logo;
