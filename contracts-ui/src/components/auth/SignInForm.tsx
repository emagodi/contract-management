"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Authentication failed");
      } else {
        const data = await res.json();
        const storage = isChecked ? localStorage : sessionStorage;
        try {
          storage.setItem("auth", "true");
          if (data?.access_token) storage.setItem("access_token", data.access_token);
          if (data?.refresh_token) storage.setItem("refresh_token", data.refresh_token);
          if (data?.token_type) storage.setItem("token_type", data.token_type);
          if (data?.roles) storage.setItem("roles", JSON.stringify(data.roles));
          storage.setItem("email", data?.email || email);
          if (data?.firstname) storage.setItem("firstname", data.firstname);
          if (data?.lastname) storage.setItem("lastname", data.lastname);
          if (data?.id) storage.setItem("user_id", String(data.id));
          try {
            storage.setItem("user", JSON.stringify(data));
          } catch {}
        } catch {}
        router.push("/");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-12">
      <div className="flex flex-col items-center justify-center mb-8">
        <Link href="/" className="mb-6 inline-block">
           <Image
            src="/images/powertel.png"
            alt="Powertel Logo"
            width={180}
            height={50}
            className="dark:invert"
            style={{ width: "auto", height: "auto", maxHeight: "60px" }}
          />
        </Link>
        <h1 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          We missed you! Please enter your details.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <Label className="mb-2 block font-medium text-gray-700 dark:text-gray-400">
              Username or Email
            </Label>
            <Input 
              placeholder="admin@powertel.co.zw" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-3 px-4"
            />
          </div>
          <div>
            <Label className="mb-2 block font-medium text-gray-700 dark:text-gray-400">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg py-3 px-4"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeCloseIcon className="w-5 h-5" />
                )}
              </span>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium transition-colors" 
              disabled={loading} 
              type="submit"
            >
              Sign in
            </Button>
          </div>
          
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
