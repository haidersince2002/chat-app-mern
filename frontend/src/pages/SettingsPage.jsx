import React from "react";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-base-content/70">
          Manage your application preferences
        </p>
      </div>

      {/* Account Settings */}
      <div className="card bg-base-100 shadow-xl rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-primary mb-6">
          Account Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Language</span>
            </label>
            <select className="select select-bordered w-full">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Time Zone</span>
            </label>
            <select className="select select-bordered w-full">
              <option>UTC+0</option>
              <option>UTC+1</option>
              <option>UTC+2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card bg-base-100 shadow-xl rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-primary mb-6">Notifications</h2>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-base-content">
                Email Notifications
              </span>
              <input type="checkbox" className="toggle toggle-primary" />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-base-content">
                Push Notifications
              </span>
              <input type="checkbox" className="toggle toggle-primary" />
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card bg-base-100 shadow-xl rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-primary mb-6">Security</h2>
        <div className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">
                Two-Factor Authentication
              </span>
            </label>
            <div className="flex items-center gap-4">
              <input type="checkbox" className="toggle toggle-primary" />
              <span className="text-base-content/70">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="btn btn-primary flex-1 md:flex-none">
          Save Changes
        </button>
        <button className="btn btn-secondary flex-1 md:flex-none">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
