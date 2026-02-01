"use client";

import React, { useTransition, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";

// Local components with rounded edges and modern styling
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className = "", ...rest } = props;
  return (
    <input 
      className={`px-3 py-2 rounded-md outline-none border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${className}`} 
      {...rest} 
    />
  );
};

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const { className = "", ...rest } = props;
  return (
    <textarea 
      className={`px-3 py-2 rounded-md outline-none border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${className}`} 
      {...rest} 
    />
  );
};

// Icons as components for cleanliness
const Icons = {
  Document: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Building: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Scale: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Currency: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  CreditCard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Truck: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, // Using Info icon style for simplicity or actual truck
  TruckReal: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Send: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Mail: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
};

export default function RequisitionForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Date and Duration State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState({ days: "", weeks: "", months: "", years: "" });
  
  // Contract Value State
  const [contractPrice, setContractPrice] = useState("");
  const [vat, setVat] = useState("");
  const totalContractPrice = ((parseFloat(contractPrice) || 0) + (parseFloat(vat) || 0)).toFixed(2);
  
  // Calculate duration whenever dates change
  useEffect(() => {
    if (startDate && endDate && endDate >= startDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setDuration({
        days: `${diffDays} Days`,
        weeks: `${(diffDays / 7).toFixed(1).replace(/\.0$/, '')} Weeks`,
        months: `${(diffDays / 30.44).toFixed(1).replace(/\.0$/, '')} Months`,
        years: `${(diffDays / 365.25).toFixed(1).replace(/\.0$/, '')} Years`
      });
    } else {
      setDuration({ days: "", weeks: "", months: "", years: "" });
    }
  }, [startDate, endDate]);

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().split("T")[0];
  const formattedToday = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  };

  const getEmail = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("email") || sessionStorage.getItem("email");
  };

  useEffect(() => {
    const fetchSignature = async () => {
      const email = getEmail();
      const token = getAccessToken();
      if (!email || !token) return;

      try {
        const res = await fetch(`http://localhost:8080/api/v1/signature/user/email/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const relativeUrl = await res.text();
          setSignatureUrl(`http://localhost:8080${relativeUrl}`);
        }
      } catch (error) {
        console.error("Failed to fetch signature:", error);
      }
    };

    fetchSignature();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const email = getEmail();
    const token = getAccessToken();
    if (!email || !token) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`http://localhost:8080/api/v1/signature/upload/${email}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const relativeUrl = await res.text();
        setSignatureUrl(`http://localhost:8080${relativeUrl}`);
      } else {
        console.error("Failed to upload signature");
      }
    } catch (error) {
      console.error("Error uploading signature:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const values: Record<string, string> = {};
    fd.forEach((v, k) => {
      values[k] = String(v);
    });

    values.headDate = today;
    values.date = today;
    if (values.headOfDept === "APPROVED") {
      values.requisitionStatus = "SUBMITTED";
    } else if (values.headOfDept === "REJECTED") {
      values.requisitionStatus = "HOD_REJECTED";
    } else {
      values.requisitionStatus = "SUBMITTED";
    }

    if (!values.isRenewable) values.isRenewable = "NO";
    if (!values.deliveryNA) values.deliveryNA = "NO";
    if (!values.warrantyNA) values.warrantyNA = "NO";
    if (!values.serviceSupport) values.serviceSupport = "NO";
    if (!values.fundingAvailable) values.fundingAvailable = "NO";
    if (!values.procurementComplied) values.procurementComplied = "NO";

    startTransition(async () => {
      try {
        const accessToken = getAccessToken();
        if (!accessToken) {
          throw new Error("User is not authenticated");
        }

        const res = await fetch("http://localhost:8080/api/v1/requisitions/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to create requisition: ${text}`);
        }

        formRef.current?.reset();
        setShowSuccessModal(true);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Submission failed");
        }
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white border border-gray-200 shadow-2xl rounded-xl p-10 text-gray-800 font-sans print:shadow-none print:border-none print:p-0">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {/* HEADER */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="flex justify-between items-start p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex-1">
                 <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Contract Requisition
                </h1>
                <p className="text-sm text-gray-500">Official Request Form</p>
              </div>
              <Image src="/images/powertel.png" alt="PowerTel Logo" width={140} height={70} className="object-contain" />
            </div>
            
            <div className="p-8 text-sm text-gray-700 space-y-5 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Icons.User />
                    </div>
                    <span className="font-bold w-16 text-gray-900 uppercase text-xs tracking-wide">TO:</span>
                    <div className="flex-1">
                      <Input name="requisitionTo" className="w-full border-gray-200" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Icons.Mail />
                    </div>
                    <span className="font-bold w-16 text-gray-900 uppercase text-xs tracking-wide">From:</span>
                    <div className="flex-1">
                      <Input name="requisitionFrom" className="w-full border-gray-200" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-end justify-end">
                   <div className="flex items-center gap-3 w-full max-w-xs">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Icons.Calendar />
                    </div>
                    <span className="font-bold w-16 text-gray-900 uppercase text-xs tracking-wide">Date:</span>
                    <div className="flex-1">
                      <Input 
                        type="text" 
                        readOnly 
                        name="date"
                        defaultValue={formattedToday}
                        className="border-b border-gray-300 rounded-none bg-transparent px-0 w-full font-medium text-right" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100 text-blue-900 italic text-center">
                "I hereby request the Legal Department to prepare the contract described below"
              </div>
            </div>
          </div>

          {/* SECTION 1 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="text-blue-600"><Icons.Document /></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">1. Contract Description</h2>
            </div>
            <div className="p-6">
              <TextArea name="description" rows={3} placeholder="Enter detailed description of the contract..." className="w-full border-gray-200" />
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="text-blue-600"><Icons.Building /></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">2. Details of Vendor / Supplier</h2>
            </div>
            <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
              <div className="text-gray-600 font-medium flex items-center">Registered Name</div>
              <div><Input name="vendorRegistedName" className="w-full border-gray-200" /></div>
              
              <div className="text-gray-600 font-medium flex items-center">Trading Name</div>
              <div><Input name="vendorTradingName" className="w-full border-gray-200" /></div>
              
              <div className="text-gray-600 font-medium flex items-center pt-2">Business Address</div>
              <div><TextArea name="vendorAddress" rows={2} className="w-full border-gray-200" /></div>
              
              <div className="text-gray-600 font-medium flex items-center">Representative & Capacity</div>
              <div className="grid grid-cols-2 gap-3">
                <Input name="vendorContactPerson" placeholder="Name" className="w-full border-gray-200" />
                <Input name="contactPersonCapacity" placeholder="Capacity" className="w-full border-gray-200" />
              </div>
              
              <div className="text-gray-600 font-medium flex items-center">Contact Number</div>
              <div><Input name="contactNumber" className="w-full border-gray-200" /></div>
              
              <div className="text-gray-600 font-medium flex items-center">Email Address</div>
              <div><Input name="vendorEmail" className="w-full border-gray-200" /></div>
            </div>
          </div>

          {/* SECTION 3 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="text-blue-600"><Icons.Scale /></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">3. Justification of Contract</h2>
            </div>
            <div className="p-6">
              <TextArea name="justification" rows={3} placeholder="Provide reason or business justification..." className="w-full border-gray-200" />
            </div>
          </div>

          {/* SECTION 4 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="text-blue-600"><Icons.Calendar /></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">4. Contract Duration</h2>
            </div>
            <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
              <div className="text-gray-600 font-medium flex items-center">Contract Start Date</div>
              <div>
                <DatePicker 
                  name="startDate" 
                  className="w-full border-gray-200" 
                  onChange={(dates) => setStartDate(dates[0] || null)}
                />
              </div>
              
              <div className="text-gray-600 font-medium flex items-center">Duration</div>
              <div className="grid grid-cols-4 gap-2">
                <Input 
                  name="durationDays" 
                  placeholder="Days" 
                  className="w-full border-gray-200 bg-gray-100 cursor-not-allowed text-gray-700" 
                  value={duration.days} 
                  readOnly
                  tabIndex={-1}
                />
                <Input 
                  name="durationWeeks" 
                  placeholder="Weeks" 
                  className="w-full border-gray-200 bg-gray-100 cursor-not-allowed text-gray-700" 
                  value={duration.weeks} 
                  readOnly
                  tabIndex={-1}
                />
                <Input 
                  name="durationMonths" 
                  placeholder="Months" 
                  className="w-full border-gray-200 bg-gray-100 cursor-not-allowed text-gray-700" 
                  value={duration.months} 
                  readOnly
                  tabIndex={-1}
                />
                <Input 
                  name="durationYears" 
                  placeholder="Years" 
                  className="w-full border-gray-200 bg-gray-100 cursor-not-allowed text-gray-700" 
                  value={duration.years} 
                  readOnly
                  tabIndex={-1}
                />
              </div>
              
              <div className="text-gray-600 font-medium flex items-center">Contract End Date</div>
              <div>
                <DatePicker 
                  name="endDate" 
                  className="w-full border-gray-200" 
                  onChange={(dates) => setEndDate(dates[0] || null)}
                />
              </div>
              
              <div className="text-gray-600 font-medium flex items-center">Subject to Renewal?</div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors bg-gray-50 px-3 py-1 rounded-md border border-gray-200"><input type="radio" name="isRenewable" value="YES" /> Yes</label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors bg-gray-50 px-3 py-1 rounded-md border border-gray-200"><input type="radio" name="isRenewable" value="NO" defaultChecked /> No</label>
                </div>
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  <span className="text-gray-500 italic text-xs">If yes, for a further:</span>
                  <Input name="renewalWeeks" placeholder="Wks" className="w-16 border-gray-200 text-center" />
                  <Input name="renewalMonths" placeholder="Mths" className="w-16 border-gray-200 text-center" />
                  <Input name="renewalYears" placeholder="Yrs" className="w-16 border-gray-200 text-center" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="text-blue-600"><Icons.Currency /></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">5. Value of Contract</h2>
            </div>
            <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
              <div className="text-gray-600 font-medium flex items-center">Contract Price</div>
              <div>
                <Input 
                  name="contractPrice" 
                  placeholder="0.00" 
                  className="w-full border-gray-200 font-mono" 
                  type="number"
                  step="0.01"
                  min="0"
                  value={contractPrice}
                  onChange={(e) => setContractPrice(e.target.value)}
                />
              </div>
              
              <div className="text-gray-600 font-medium flex items-center">VAT (or other taxes)</div>
              <div>
                <Input 
                  name="vat" 
                  placeholder="0.00" 
                  className="w-full border-gray-200 font-mono" 
                  type="number"
                  step="0.01"
                  min="0"
                  value={vat}
                  onChange={(e) => setVat(e.target.value)}
                />
              </div>
              
              <div className="text-gray-900 font-bold flex items-center">Total Contract Price</div>
              <div>
                <Input 
                  name="totalContractPrice" 
                  placeholder="0.00" 
                  className="w-full border-blue-200 bg-blue-50 font-bold font-mono text-blue-900 cursor-not-allowed" 
                  value={totalContractPrice === "0.00" && !contractPrice && !vat ? "" : totalContractPrice}
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>

          {/* SECTION 6 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="text-blue-600"><Icons.CreditCard /></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">6. Payment Terms</h2>
            </div>
            <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
              <div className="text-gray-600 font-medium flex items-center pt-2">Full Payment on Signature</div>
              <div className="space-y-3">
                <Input name="totalOnsignature" placeholder="US$" className="w-full border-gray-200" />
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-md border border-gray-100">
                  <span className="font-semibold text-gray-700">Monthly:</span>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600"><input type="radio" name="totalOnsignatureMonthly" value="YES" /> Yes</label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600"><input type="radio" name="totalOnsignatureMonthly" value="NO" /> No</label>
                </div>
              </div>
              
              <div className="text-gray-600 font-medium flex items-center">Down Payment</div>
              <div><Input name="downPayment" placeholder="$0.00 or %" className="w-full border-gray-200" /></div>
              
              <div className="text-gray-600 font-medium flex items-center pt-2">Balance & Payment Period</div>
              <div><TextArea name="balancePayment" rows={2} className="w-full border-gray-200" /></div>
            </div>
          </div>

          {/* SECTION 7 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="text-blue-600"><Icons.TruckReal /></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">7. Delivery Terms</h2>
            </div>
            <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
              <div className="text-gray-600 font-medium flex items-center">Delivery Period</div>
              <div className="flex flex-wrap gap-3 items-center">
                <Input name="deliveryDays" placeholder="Days" className="w-20 border-gray-200 text-center" />
                <Input name="deliveryWeeks" placeholder="Weeks" className="w-20 border-gray-200 text-center" />
                <Input name="deliveryMonths" placeholder="Months" className="w-20 border-gray-200 text-center" />
                <label className="flex items-center gap-2 ml-4 cursor-pointer hover:text-blue-600 bg-gray-50 px-3 py-2 rounded-md border border-gray-200"><input type="radio" name="deliveryNA" value="YES" /> N/A</label>
              </div>
              
              <div className="text-gray-600 font-medium flex items-center pt-2">Late Delivery Penalties</div>
              <div><TextArea name="penalties" rows={2} className="w-full border-gray-200" /></div>
              
              <div className="text-gray-600 font-medium flex items-center pt-2">Acceptance Conditions</div>
              <div><TextArea name="acceptanceConditions" rows={2} className="w-full border-gray-200" /></div>
            </div>
          </div>

          {/* SECTION 8 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="text-blue-600"><Icons.Shield /></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">8. Warranty Terms</h2>
            </div>
            <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
              <div className="text-gray-600 font-medium flex items-center">Warranty Period</div>
              <div className="flex flex-wrap gap-3 items-center">
                <Input name="warrantyDays" placeholder="Days" className="w-20 border-gray-200 text-center" />
                <Input name="warrantyWeeks" placeholder="Weeks" className="w-20 border-gray-200 text-center" />
                <Input name="warrantyMonths" placeholder="Months" className="w-20 border-gray-200 text-center" />
                <label className="flex items-center gap-2 ml-4 cursor-pointer hover:text-blue-600 bg-gray-50 px-3 py-2 rounded-md border border-gray-200"><input type="radio" name="warrantyNA" value="YES" /> N/A</label>
              </div>
              
              <div className="text-gray-600 font-medium flex items-center">Post-Warranty Support?</div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 bg-gray-50 px-3 py-2 rounded-md border border-gray-200"><input type="radio" name="serviceSupport" value="YES" /> Yes</label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 bg-gray-50 px-3 py-2 rounded-md border border-gray-200"><input type="radio" name="serviceSupport" value="NO" defaultChecked /> No</label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 bg-gray-50 px-3 py-2 rounded-md border border-gray-200"><input type="radio" name="serviceSupport" value="NA" /> N/A</label>
              </div>
            </div>
          </div>

          {/* SECTION 9 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="text-blue-600"><Icons.Sparkles /></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">9. Other Special Issues</h2>
            </div>
            <div className="p-6">
              <TextArea name="specialIssues" rows={3} placeholder="Specify any other special issues..." className="w-full border-gray-200" />
            </div>
          </div>

          {/* SECTION 10 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
            <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">10. Administrative Issues</h2>
            </div>
            <div className="p-6 space-y-8 bg-gray-50/50">
              
              {/* Funding Section */}
              <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                <div className="text-gray-700 text-sm mb-1 font-medium flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   Funding for the contract price is available: 
                   <div className="flex gap-4 ml-4">
                     <span className="bg-white px-2 py-1 rounded border border-gray-200 text-xs">Yes [ &nbsp; ]</span> 
                     <span className="bg-white px-2 py-1 rounded border border-gray-200 text-xs">No [ &nbsp; ]</span>
                   </div>
                </div>
                
                <div className="flex gap-10 text-center">
                  <div className="flex flex-col items-center group">
                    <div className="w-64 border-b-2 border-dotted border-gray-400 mb-1 group-hover:border-blue-600 transition-colors"></div>
                    <div className="font-bold text-gray-500 text-xs uppercase tracking-wider group-hover:text-blue-600 transition-colors">Finance Director</div>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="w-32 border-b-2 border-dotted border-gray-400 mb-1 group-hover:border-blue-600 transition-colors"></div>
                    <div className="font-bold text-gray-500 text-xs uppercase tracking-wider group-hover:text-blue-600 transition-colors">Date</div>
                  </div>
                </div>
              </div>

              {/* Procurement Section */}
              <div className="flex justify-between items-end">
                <div className="text-gray-700 text-sm mb-1 font-medium flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   Procurement Procedures complied with: 
                   <div className="flex gap-4 ml-4">
                     <span className="bg-white px-2 py-1 rounded border border-gray-200 text-xs">Yes [ &nbsp; ]</span> 
                     <span className="bg-white px-2 py-1 rounded border border-gray-200 text-xs">No [ &nbsp; ]</span>
                   </div>
                </div>
                
                <div className="flex gap-10 text-center">
                  <div className="flex flex-col items-center group">
                    <div className="w-64 border-b-2 border-dotted border-gray-400 mb-1 group-hover:border-blue-600 transition-colors"></div>
                    <div className="font-bold text-gray-500 text-xs uppercase tracking-wider group-hover:text-blue-600 transition-colors">Procurement Manager</div>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="w-32 border-b-2 border-dotted border-gray-400 mb-1 group-hover:border-blue-600 transition-colors"></div>
                    <div className="font-bold text-gray-500 text-xs uppercase tracking-wider group-hover:text-blue-600 transition-colors">Date</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Head of Department (Dropdown & auto-date) */}
          <div className="border-t border-gray-200 p-8 bg-white">
            <input type="hidden" name="headOfDept" value="APPROVED" />
            <input type="hidden" name="headDate" value={today} />
    
            <div className="flex justify-between items-end px-4">
              <div className="flex flex-col items-center relative group">
                <div className={`w-80 border-b-2 border-dotted mb-1 h-16 flex items-end justify-center relative transition-all duration-300 rounded-lg ${!signatureUrl ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer' : 'border-black'}`}>
                  {signatureUrl ? (
                    <Image 
                      src={signatureUrl} 
                      alt="Head of Department Signature" 
                      width={140} 
                      height={70} 
                      className="absolute bottom-1 object-contain max-h-14"
                    />
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full pb-1">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      {isUploading ? (
                        <div className="flex items-center gap-2 text-blue-600 animate-pulse">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-xs font-medium">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400 group-hover:text-blue-600 transition-colors print:hidden">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                          </svg>
                          <span className="text-sm font-medium">Upload Signature</span>
                        </div>
                      )}
                    </label>
                  )}
                </div>
                <div className="font-bold text-black text-xs uppercase tracking-wider mt-2">Head of Department</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-48 text-center border-b-2 border-dotted border-black mb-1 text-black font-semibold pb-1 font-mono text-lg">
                  {formattedToday}
                </div>
                <div className="font-bold text-black text-xs uppercase tracking-wider mt-2">Date</div>
              </div>
            </div>
          </div>

            {/* Legal Department (Read-only) */}
            <div className="p-8 bg-gray-50 border-t border-gray-200">
              <p className="font-bold text-gray-700 uppercase text-xs tracking-wide mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Received by Legal Department:
              </p>
              <div className="grid grid-cols-2 gap-12 text-sm text-gray-600 px-10">
                <div className="flex flex-col group">
                  <div className="w-full border-b border-gray-400 border-dashed mb-2 group-hover:border-gray-600 transition-colors"></div>
                  <div className="font-bold text-xs uppercase tracking-wider text-center">Company Secretary</div>
                </div>
                <div className="flex flex-col group">
                  <div className="w-full border-b border-gray-400 border-dashed mb-2 group-hover:border-gray-600 transition-colors"></div>
                  <div className="font-bold text-xs uppercase tracking-wider text-center">Date</div>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>}

          <div className="pt-6 print:hidden">
            <Button disabled={isPending} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg transition-all hover:shadow-xl active:scale-[0.99] flex items-center justify-center gap-3" type="submit">
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Icons.Send />
                  Submit Requisition
                </>
              )}
            </Button>
          </div>
        </form>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center transform transition-all scale-100 border border-gray-100">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Requisition Submitted!</h2>
            <p className="mb-8 text-gray-500">Your requisition has been successfully created and sent for processing.</p>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/requisitions/submitted");
              }}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl shadow-md transition-all hover:shadow-lg"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      )}


    </div>
  );
}
