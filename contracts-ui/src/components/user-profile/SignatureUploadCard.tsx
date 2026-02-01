"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { PencilIcon, TrashBinIcon } from "@/icons";

export default function SignatureUploadCard() {
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const getStorageItem = (key: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  };

  useEffect(() => {
    const storedEmail = getStorageItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      fetchSignature(storedEmail);
    }
  }, []);

  const fetchSignature = async (userEmail: string) => {
    try {
      const token = getStorageItem("access_token");
      const res = await fetch(`http://localhost:8080/api/v1/signature/user/email/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const url = await res.text();
        // The backend returns a relative path like /api/v1/signature/file/1
        // We need to prepend the backend host
        setSignatureUrl(`http://localhost:8080${url}`);
      } else {
        setSignatureUrl(null);
      }
    } catch (error) {
      console.error("Error fetching signature:", error);
      setSignatureUrl(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !email) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const token = getStorageItem("access_token");
      const res = await fetch(`http://localhost:8080/api/v1/signature/upload/${email}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        await fetchSignature(email);
      } else {
        alert("Failed to upload signature");
      }
    } catch (error) {
      console.error("Error uploading signature:", error);
      alert("Error uploading signature");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!email) return;
    if (!confirm("Are you sure you want to delete your signature?")) return;

    try {
      const token = getStorageItem("access_token");
      const res = await fetch(`http://localhost:8080/api/v1/signature/email/${email}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSignatureUrl(null);
      } else {
        alert("Failed to delete signature");
      }
    } catch (error) {
      console.error("Error deleting signature:", error);
      alert("Error deleting signature");
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-xl dark:border-gray-800 mt-4 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg dark:bg-purple-900/20 dark:text-purple-400">
            <PencilIcon />
          </div>
          <h4 className="text-base font-bold text-gray-800 dark:text-white/90">
            Digital Signature
          </h4>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-2xl">
          Upload your digital signature to be used on contracts and requisitions.
        </p>

        <div className="mt-2 p-3 rounded-xl border border-gray-100 bg-gray-50/50 dark:bg-gray-800/30 dark:border-gray-700">
          {signatureUrl ? (
            <div className="flex flex-row items-center gap-4">
              <div className="relative border border-gray-200 border-dashed rounded-lg p-2 bg-white dark:bg-gray-800 dark:border-gray-600 min-w-[120px] flex items-center justify-center h-16">
                <Image 
                  src={signatureUrl} 
                  alt="User Signature" 
                  width={100}
                  height={50}
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-1 right-1">
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleDelete}
                className="flex items-center justify-center gap-1.5 bg-white text-red-600 hover:bg-red-50 border border-red-200 shadow-sm hover:shadow dark:bg-gray-800 dark:border-red-900/50 dark:hover:bg-red-900/20 py-1.5 px-3 rounded-lg transition-all duration-200 text-xs h-9"
                variant="outline"
              >
                <TrashBinIcon />
                Remove
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <div className="relative group">
                <label 
                  htmlFor="dropzone-file" 
                  className={`flex flex-row items-center justify-center w-full h-16 border border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-800 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-gray-700 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="flex flex-row items-center gap-3 px-4">
                    <div className="p-1.5 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors duration-300 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-blue-900/30">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-gray-600 dark:text-gray-300"><span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">PNG, JPG or GIF (Max. 2MB)</p>
                    </div>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-lg backdrop-blur-sm">
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs font-medium text-blue-600">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
