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
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
              minLength={6}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-2 px-4 rounded ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
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
