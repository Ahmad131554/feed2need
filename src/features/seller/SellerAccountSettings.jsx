import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { NavLink } from "react-router";

function SellerAccountSettings() {
  const [image, setImage] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-semibold">Account Settings</h2>
      <p className="mb-6 text-lg text-gray-600">Update your account details</p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-6 shadow-lg"
      >
        {/* Image Upload Section */}
        <div className="flex flex-col">
          <label htmlFor="image" className="text-lg font-medium text-gray-700">
            Profile Picture
          </label>
          <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
            <input
              id="image"
              type="file"
              accept="image/*"
              value={image ? image : ""}
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="flex cursor-pointer items-center space-x-2 text-green-500"
            >
              <FiUpload size={24} />
              <span>Upload Image</span>
            </label>
          </div>
        </div>

        {/* Business Name */}
        <div className="flex flex-col">
          <label
            htmlFor="businessName"
            className="text-lg font-medium text-gray-700"
          >
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your business name"
            required
          />
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col">
            <label
              htmlFor="firstName"
              className="text-lg font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="lastName"
              className="text-lg font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col">
            <label
              htmlFor="contactNumber"
              className="text-lg font-medium text-gray-700"
            >
              Contact Number
            </label>
            <input
              id="contactNumber"
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your contact number"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        {/* Password Update Section */}
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-lg font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter your current password"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="newPassword"
            className="text-lg font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter a new password"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-start">
          <NavLink to="/seller">
            <button
              type="submit"
              className="transform rounded-lg bg-green-600 px-8 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-green-700"
            >
              Save Changes
            </button>
          </NavLink>
        </div>
      </form>
    </div>
  );
}

export default SellerAccountSettings;
