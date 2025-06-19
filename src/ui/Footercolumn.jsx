import React from "react";

const FooterColumn = ({ title, children }) => {
  return (
    <div>
      <h3 className="mb-4 font-bold text-gray-800">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
};

export default FooterColumn;
