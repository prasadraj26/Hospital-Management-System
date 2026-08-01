import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PasswordChangeModal = ({ isOpen, onClose, userId, userRole }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "New passwords do not match!",
      });
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Password must be at least 6 characters long!",
      });
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = userRole === 'doctor' 
        ? 'http://localhost:4451/api/doctor/change-password'
        : 'http://localhost:4451/api/nurse/change-password';

      await axios.put(endpoint, {
        userId,
        currentPassword,
        newPassword
      });

      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Password changed successfully!",
      });

      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: error.response?.data?.error || "Failed to change password!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              required
              minLength={6}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-navy-100 hover:bg-navy-200 text-navy-800 font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`font-medium py-2 px-4 rounded-lg transition-all duration-200 ${
                isLoading 
                  ? 'bg-navy-200 cursor-not-allowed text-navy-400' 
                  : 'bg-navy-700 hover:bg-navy-600 text-white'
              }`}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
