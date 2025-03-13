// import React, { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";

// const ProfilePage = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//   });
//   const [updateDetails, setUpdateDetails] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const { updateProfile, authUser, isUpdatingProfile } = useAuthStore();

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onload = async () => {
//       setSelectedImage(reader.result);
//       await updateProfile({ profilePic: reader.result });
//     };
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 md:p-8">
//       {/* Profile Header */}
//       <div className="mb-8 space-y-2">
//         <h1 className="text-4xl font-bold text-primary dark:text-white">
//           Profile
//         </h1>
//         <p className="text-base text-gray-500 dark:text-neutral-content">
//           Manage your account information
//         </p>
//       </div>

//       {/* Avatar Section */}
//       <div className="card bg-base-100 shadow-xl rounded-lg p-6 mb-8">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="avatar relative group">
//             <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
//               <img
//                 src={selectedImage || authUser?.profilePic || "avatar.png"}
//                 alt="Profile"
//                 className="rounded-full object-cover"
//               />
//             </div>
//             <label
//               htmlFor="avatar-upload"
//               className="btn btn-circle btn-sm absolute bottom-0 right-0 bg-base-300 border-0 hover:bg-base-200 transition-all"
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110 4.069V3a2 2 0 012-2h4a2 2 0 012 2v.896a2 2 0 001.664.89l.812 1.22A2 2 0 0121 7.07V19a2 2 0 01-2 2H5a2 2 0 01-2-2V7.07z"
//                 />
//               </svg>
//               <input
//                 type="file"
//                 id="avatar-upload"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 disabled={isUpdatingProfile}
//                 className="hidden"
//               />
//             </label>
//           </div>
//           <p className="text-sm text-center text-gray-500 dark:text-neutral-content">
//             {isUpdatingProfile
//               ? "Uploading..."
//               : "Click the camera icon to update your photo"}
//           </p>
//         </div>
//       </div>

//       {/* Profile Form */}
//       <div className="card bg-base-100 shadow-xl rounded-lg p-6 mb-8">
//         <h2 className="card-title text-primary mb-6">Profile Information</h2>
//         <form className="space-y-6">
//           {/* Full Name Section */}
//           <div className="form-control space-y-2">
//             <label
//               htmlFor="fullName"
//               className="label font-medium text-base-content"
//             >
//               Full Name
//             </label>
//             {updateDetails ? (
//               <input
//                 type="text"
//                 name="fullName"
//                 id="fullName"
//                 value={formData.fullName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, fullName: e.target.value })
//                 }
//                 className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="John Doe"
//                 required
//               />
//             ) : (
//               <div className="bg-base-200 p-3 rounded-md border border-base-300">
//                 {authUser?.fullName || "Not set"}
//               </div>
//             )}
//           </div>

//           {/* Email Section */}
//           <div className="form-control space-y-2">
//             <label
//               htmlFor="email"
//               className="label font-medium text-base-content"
//             >
//               Email Address
//             </label>
//             {updateDetails ? (
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="john@example.com"
//                 required
//               />
//             ) : (
//               <div className="bg-base-200 p-3 rounded-md border border-base-300">
//                 {authUser?.email || "Not set"}
//               </div>
//             )}
//           </div>

//           <div className="flex flex-wrap gap-4 md:gap-6">
//             {" "}
//             {/* Added flex-wrap and gap instead of space-x */}
//             {updateDetails && (
//               <button
//                 type="button"
//                 onClick={() => updateProfile(formData)}
//                 disabled={isUpdatingProfile}
//                 className="btn btn-primary flex-1 md:flex-none" // Added flex-1 for mobile responsiveness
//               >
//                 {isUpdatingProfile ? (
//                   <span className="loading loading-spinner"></span>
//                 ) : (
//                   "Update Profile"
//                 )}
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={() => setUpdateDetails(!updateDetails)}
//               disabled={isUpdatingProfile}
//               className={`btn flex-1 md:flex-none ${
//                 updateDetails ? "btn-outline" : "btn-secondary"
//               }`}
//             >
//               {updateDetails ? "Cancel" : "Edit Profile"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Account Information */}
//       <div className="card bg-base-100 shadow-xl rounded-lg p-6">
//         <h2 className="card-title text-primary mb-6">Account Details</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h3 className="text-sm text-base-content/70 mb-2">Member Since</h3>
//             <p className="text-base-content font-medium">
//               {authUser?.createdAt
//                 ? new Date(authUser.createdAt).toLocaleDateString()
//                 : "N/A"}
//             </p>
//           </div>
//           <div>
//             <h3 className="text-sm text-base-content/70 mb-2">
//               Account Status
//             </h3>
//             <span className="badge badge-success gap-2">
//               <span className="w-2 h-2 rounded-full bg-success"></span>
//               Active
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [updateDetails, setUpdateDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { updateProfile, authUser, isUpdatingProfile } = useAuthStore();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      setSelectedImage(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      {/* Profile Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold text-primary">Profile</h1>
        <p className="text-base-content/70">Manage your account information</p>
      </div>

      {/* Avatar Section */}
      <div className="card bg-base-100 shadow-xl rounded-lg p-6 mb-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="avatar relative">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={selectedImage || authUser?.profilePic || "avatar.png"}
                alt="Profile"
                className="rounded-full object-cover"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className="btn btn-circle btn-sm absolute bottom-0 right-0 bg-base-300 border-0 hover:bg-base-200 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110 4.069V3a2 2 0 012-2h4a2 2 0 012 2v.896a2 2 0 001.664.89l.812 1.22A2 2 0 0121 7.07V19a2 2 0 01-2 2H5a2 2 0 01-2-2V7.07z"
                />
              </svg>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-center text-base-content/70">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="card bg-base-100 shadow-xl rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-primary mb-6">
          Profile Information
        </h2>
        <form className="space-y-6">
          {/* Full Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Full Name</span>
            </label>
            {updateDetails ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
                required
              />
            ) : (
              <div className="bg-base-200 p-3 rounded-md border border-base-300">
                {authUser?.fullName || "Not set"}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">
                Email Address
              </span>
            </label>
            {updateDetails ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="john@example.com"
                required
              />
            ) : (
              <div className="bg-base-200 p-3 rounded-md border border-base-300">
                {authUser?.email || "Not set"}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {updateDetails && (
              <button
                type="button"
                onClick={() => updateProfile(formData)}
                disabled={isUpdatingProfile}
                className="btn btn-primary w-full md:w-auto"
              >
                {isUpdatingProfile ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Update Profile"
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setUpdateDetails(!updateDetails)}
              disabled={isUpdatingProfile}
              className={`btn w-full md:w-auto ${
                updateDetails ? "btn-outline" : "btn-secondary"
              }`}
            >
              {updateDetails ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </form>
      </div>

      {/* Account Information */}
      <div className="card bg-base-100 shadow-xl rounded-lg p-6">
        <h2 className="text-xl font-bold text-primary mb-6">Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Member Since</span>
            </label>
            <div className="bg-base-200 p-3 rounded-md border border-base-300">
              {authUser?.createdAt
                ? new Date(authUser.createdAt).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">
                Account Status
              </span>
            </label>
            <span className="badge ml-3 badge-success gap-2">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
