"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { 
  UserIcon, 
  LockIcon, 
  PencilIcon, 
  UserCircleIcon,
  CheckCircleIcon,
  MailIcon
} from "@/icons";

// Local Phone Icon since it's missing from exports
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19.92C22.0011 20.1986 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.4019C21.1468 21.5902 20.9046 21.7336 20.6411 21.8227C20.3776 21.9118 20.0987 21.9448 19.822 21.919C16.7428 21.585 13.789 20.526 11.19 18.78C8.77382 17.1378 6.7092 15.0279 5.09998 12.56C3.39519 9.90795 2.37877 6.90159 2.08998 3.77998C2.06434 3.50466 2.09708 3.2272 2.18608 2.96547C2.27508 2.70374 2.41838 2.46356 2.60677 2.26053C2.79516 2.0575 3.02452 1.89626 3.27993 1.78726C3.53535 1.67826 3.81116 1.62394 4.08998 1.62998H7.08998C7.56294 1.62646 8.02008 1.8009 8.37703 2.12117C8.73398 2.44145 8.96811 2.88755 9.03598 3.37998C9.16283 4.34148 9.39766 5.28483 9.73598 6.18998C9.87058 6.54921 9.89965 6.93888 9.81977 7.31343C9.73989 7.68798 9.55432 8.03175 9.28498 8.30398L7.50998 10.08C9.5015 13.6738 12.4262 16.5915 16.02 18.58L17.8 16.81C18.0732 16.5398 18.4183 16.3533 18.7942 16.2731C19.1701 16.1929 19.561 16.2223 19.921 16.358C20.8242 16.6968 21.7656 16.932 22.725 17.059C23.2235 17.1287 23.6735 17.3702 23.9918 17.7388C24.3101 18.1074 24.4754 18.578 24.456 19.064L24.46 19.08L22 16.92Z" fill="currentColor"/>
  </svg>
);

const BadgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V8.3L12 4.3V11.99Z" fill="currentColor"/>
  </svg>
);

// Local components with rounded edges and modern styling matching RequisitionForm
const Input = (props: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) => {
  const { className = "", icon, ...rest } = props;
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input 
        className={`w-full ${icon ? 'pl-10' : 'px-3'} py-2.5 rounded-xl outline-none border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:border-gray-700 ${className}`} 
        {...rest} 
      />
    </div>
  );
};

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    phone: "",
  });

  // Edit form state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const getStorageItem = (key: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  };

  const fetchUserData = async () => {
    const userId = getStorageItem("user_id");
    if (!userId) return;

    try {
      const token = getStorageItem("access_token");
      const res = await fetch(`http://localhost:8080/api/v1/auth/user/id/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUserData({
          id: String(data.id),
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          role: data.role || "",
          phone: data.phone || "Not set",
        });
        setFormData({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!formData.password) {
      alert("Password is required to update profile.");
      return;
    }

    setLoading(true);
    try {
      const token = getStorageItem("access_token");
      const userId = userData.id;
      
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: userData.role, // Send back the existing role
      };

      const res = await fetch(`http://localhost:8080/api/v1/auth/update/id/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUserData(prev => ({
          ...prev,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          email: updatedUser.email,
          phone: updatedUser.phone || prev.phone,
        }));
        
        // Update local storage
        localStorage.setItem("firstname", updatedUser.firstname);
        localStorage.setItem("lastname", updatedUser.lastname);
        localStorage.setItem("email", updatedUser.email);
        
        alert("Profile updated successfully!");
        closeModal();
      } else {
        const errorText = await res.text();
        alert(`Failed to update profile: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
            <UserCircleIcon />
          </div>
          <h4 className="text-base font-bold text-gray-800 dark:text-white/90">
            Personal Information
          </h4>
        </div>

        <button
          onClick={openModal}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <PencilIcon />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-blue-100 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800">
          <div className="text-gray-400">
            <UserIcon />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Full Name</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {userData.firstname} {userData.lastname}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-blue-100 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800">
          <div className="text-gray-400">
            <MailIcon />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Email Address</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white break-all">
              {userData.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-blue-100 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800">
          <div className="text-gray-400">
            <PhoneIcon />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Phone Number</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {userData.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-blue-100 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800">
          <div className="text-gray-400">
            <BadgeIcon />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Role</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {userData.role}
              </p>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10 shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <UserCircleIcon />
                </div>
                Edit Profile
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 pl-12">
                Update your personal details and security settings.
              </p>
            </div>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</Label>
                <Input 
                  type="text" 
                  icon={<UserIcon />}
                  value={formData.firstname}
                  onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                  placeholder="Enter first name"
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</Label>
                <Input 
                  type="text" 
                  icon={<UserIcon />}
                  value={formData.lastname}
                  onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                  placeholder="Enter last name"
                />
              </div>

              <div className="col-span-2">
                <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input 
                  type="email" 
                  icon={<MailIcon />}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@company.com"
                />
              </div>

              <div className="col-span-2">
                <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</Label>
                <Input 
                  type="text" 
                  icon={<PhoneIcon />}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="col-span-2 p-4 rounded-xl bg-yellow-50 border border-yellow-100 dark:bg-yellow-900/10 dark:border-yellow-900/30">
                <h6 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
                  <LockIcon />
                  Security Verification
                </h6>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">New Password (or Current)</Label>
                    <Input 
                      type="password" 
                      icon={<LockIcon />}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Required to save changes"
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-xs font-medium text-gray-600 dark:text-gray-400">Confirm Password</Label>
                    <Input 
                      type="password" 
                      icon={<CheckCircleIcon />}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="Confirm password"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-6 border-t border-gray-100 dark:border-gray-800 justify-end">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={closeModal} 
                type="button"
                className="px-6 rounded-xl hover:bg-gray-100 border-gray-200"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave} 
                disabled={loading}
                className="px-6 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none"
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
