"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import { CheckLineIcon, CloseLineIcon } from "@/icons";

// Icons
const Icons = {
  Document: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Building: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Scale: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Currency: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  CreditCard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Truck: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Mail: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
};

// Styled Components
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

type Requisition = Record<string, unknown> & {
  id: number;
  requisitionTo?: string;
  requisitionFrom?: string;
  date?: string;
  description?: string;
  fundingAvailable?: string;
  financeDirector?: string;
  financeDate?: string;
  vendorRegistedName?: string;
  vendorTradingName?: string;
  vendorAddress?: string;
  vendorContactPerson?: string;
  vendorPhoneNumber?: string;
  vendorEmail?: string;
  contactPersonCapacity?: string;
  justification?: string;
  startDate?: string;
  endDate?: string;
  durationDays?: string;
  durationWeeks?: string;
  durationMonths?: string;
  durationYears?: string;
  isRenewable?: string;
  renewalWeeks?: string;
  renewalMonths?: string;
  renewalYears?: string;
  contractPrice?: string;
  vat?: string;
  totalContractPrice?: string;
  totalOnsignature?: string;
  downPayment?: string;
  balancePayment?: string;
  deliveryDays?: string;
  deliveryWeeks?: string;
  deliveryMonths?: string;
  deliveryNA?: string;
  penalties?: string;
  acceptanceConditions?: string;
  warrantyDays?: string;
  warrantyWeeks?: string;
  warrantyMonths?: string;
  warrantyNA?: string;
  serviceSupport?: string;
  specialIssues?: string;
  procurementComplied?: string;
  procurementManager?: string;
  procurementDate?: string;
  companySecretary?: string;
  secretaryDate?: string;
  requisitionStatus?: string;
  headOfDept?: string;
  headDate?: string;
  updatedBy?: string;
};

export default function CompanySecretaryViewForm({ requisition, onSubmit, submitting, error, onCancel }: {
  requisition: Requisition;
  onSubmit: (decision: "APPROVED" | "REJECTED", signaturePath?: string) => void;
  submitting?: boolean;
  error?: string | null;
  onCancel: () => void;
}) {
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | "">("");
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [signaturePath, setSignaturePath] = useState<string | null>(null);
  const [hodSignatureUrl, setHodSignatureUrl] = useState<string | null>(null);
  const [fdSignatureUrl, setFdSignatureUrl] = useState<string | null>(null);
  const [pmSignatureUrl, setPmSignatureUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const today = new Date().toISOString().split("T")[0];
  const readOnlyClass = "bg-gray-100 text-gray-700 cursor-not-allowed border-gray-200";
  const val = (k: keyof Requisition, fallback: string = "") => String(requisition?.[k] ?? fallback);
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  const displayDate = decision ? formatDate(today) : "";

  const getAccessToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  };

  const getEmail = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("email") || sessionStorage.getItem("email");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const email = getEmail();
    const token = getAccessToken();
    if (!email || !token) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`http://localhost:8080/api/v1/signature/upload/${email}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const path = await res.text();
        setSignaturePath(path);
        setSignatureUrl(`http://localhost:8080${path}`);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading signature:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch Current User Signature
  useEffect(() => {
    const fetchSignature = async () => {
      const token = getAccessToken();
      const email = getEmail();
      if (!email || !token) return;

      try {
        const res = await fetch(`http://localhost:8080/api/v1/signature/user/email/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const path = await res.text();
          if (path) {
            setSignaturePath(path);
            setSignatureUrl(`http://localhost:8080${path}`);
          }
        }
      } catch (error) {
        console.error("Failed to fetch signature:", error);
      }
    };

    fetchSignature();
  }, []);

  // Handle Saved Decision
  useEffect(() => {
    const savedSignature = requisition.companySecretary;
    if (savedSignature && savedSignature.startsWith("/api/v1/signature")) {
      // If signature path is saved, it means approved/rejected with signature
      if (!signaturePath) {
          setSignaturePath(savedSignature);
          setSignatureUrl(`http://localhost:8080${savedSignature}`);
      }
      // Infer decision from status if not set
      if (!decision) {
        setDecision(requisition.requisitionStatus?.includes("APPROVED") ? "APPROVED" : requisition.requisitionStatus?.includes("REJECTED") ? "REJECTED" : "");
      }
    } else if (savedSignature === "APPROVED" || savedSignature === "REJECTED") {
        if (!decision) setDecision(savedSignature);
    }
  }, [requisition, signaturePath, decision]);

  // Fetch HOD Signature
  useEffect(() => {
    if (requisition.headOfDept?.startsWith("/api/v1/signature")) {
      setHodSignatureUrl(`http://localhost:8080${requisition.headOfDept}`);
    }
  }, [requisition.headOfDept]);

  // Fetch Finance Director Signature
  useEffect(() => {
    if (requisition.financeDirector?.startsWith("/api/v1/signature")) {
      setFdSignatureUrl(`http://localhost:8080${requisition.financeDirector}`);
    }
  }, [requisition.financeDirector]);

  // Fetch Procurement Manager Signature
  useEffect(() => {
    if (requisition.procurementManager?.startsWith("/api/v1/signature")) {
      setPmSignatureUrl(`http://localhost:8080${requisition.procurementManager}`);
    }
  }, [requisition.procurementManager]);

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white border border-gray-200 shadow-2xl rounded-xl p-10 text-gray-800 font-sans">
      
      {/* HEADER */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
        <div className="flex justify-between items-start p-6 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex-1">
             <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-wider mb-1">
              Contract Requisition
            </h1>
            <p className="text-sm text-gray-500">Official Request Form (View Only)</p>
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
                  <Input readOnly name="requisitionTo" value={val("requisitionTo")} className={readOnlyClass + " w-full"} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Icons.Mail />
                </div>
                <span className="font-bold w-16 text-gray-900 uppercase text-xs tracking-wide">From:</span>
                <div className="flex-1">
                  <Input readOnly name="requisitionFrom" value={val("requisitionFrom")} className={readOnlyClass + " w-full"} />
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
                    value={formatDate(val("date", today))}
                    className="border-b border-gray-300 rounded-none bg-transparent px-0 w-full font-medium text-right cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100 text-blue-900 italic text-center">
            &quot;I hereby request the Legal Department to prepare the contract described below&quot;
          </div>
        </div>
      </div>

      {/* SECTION 1 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white mb-6">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="text-blue-600"><Icons.Document /></div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">1. Contract Description</h2>
        </div>
        <div className="p-6">
          <TextArea readOnly rows={3} value={val("description")} className={readOnlyClass + " w-full"} />
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white mb-6">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="text-blue-600"><Icons.Building /></div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">2. Details of Vendor / Supplier</h2>
        </div>
        <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
          <div className="text-gray-600 font-medium flex items-center">Registered Name</div>
          <div><Input readOnly value={val("vendorRegistedName")} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center">Trading Name</div>
          <div><Input readOnly value={val("vendorTradingName")} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center pt-2">Business Address</div>
          <div><TextArea readOnly rows={2} value={val("vendorAddress")} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center">Representative & Capacity</div>
          <div className="grid grid-cols-2 gap-3">
            <Input readOnly value={val("vendorContactPerson")} className={readOnlyClass + " w-full"} />
            <Input readOnly value={val("contactPersonCapacity")} placeholder="Capacity" className={readOnlyClass + " w-full"} />
          </div>
          
          <div className="text-gray-600 font-medium flex items-center">Contact Number</div>
          <div><Input readOnly value={val("vendorPhoneNumber")} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center">Email Address</div>
          <div><Input readOnly value={val("vendorEmail")} className={readOnlyClass + " w-full"} /></div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white mb-6">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="text-blue-600"><Icons.Scale /></div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">3. Justification of Contract</h2>
        </div>
        <div className="p-6">
          <TextArea readOnly rows={3} value={val("justification")} className={readOnlyClass + " w-full"} />
        </div>
      </div>

      {/* SECTION 4 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white mb-6">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="text-blue-600"><Icons.Calendar /></div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">4. Contract Duration</h2>
        </div>
        <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
          <div className="text-gray-600 font-medium flex items-center">Contract Start Date</div>
          <div><Input readOnly value={formatDate(val("startDate"))} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center">Duration</div>
          <div className="grid grid-cols-4 gap-2">
            <Input readOnly value={val("durationDays")} className={readOnlyClass + " w-full"} />
            <Input readOnly value={val("durationWeeks")} className={readOnlyClass + " w-full"} />
            <Input readOnly value={val("durationMonths")} className={readOnlyClass + " w-full"} />
            <Input readOnly value={val("durationYears")} className={readOnlyClass + " w-full"} />
          </div>
          
          <div className="text-gray-600 font-medium flex items-center">Contract End Date</div>
          <div><Input readOnly value={formatDate(val("endDate"))} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center">Subject to Renewal?</div>
          <div className="flex flex-wrap items-center gap-4 text-gray-700">
            <div className="flex gap-4">
               <label className="flex items-center gap-2"><input type="radio" disabled checked={val("isRenewable") === "YES"} /> Yes</label>
               <label className="flex items-center gap-2"><input type="radio" disabled checked={val("isRenewable", "NO") !== "YES"} /> No</label>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4 ml-2">
              <span className="text-xs font-semibold uppercase text-gray-500">For Further:</span>
              <Input readOnly value={val("renewalWeeks")} className={readOnlyClass + " w-16 text-center"} placeholder="Wks" />
              <Input readOnly value={val("renewalMonths")} className={readOnlyClass + " w-16 text-center"} placeholder="Mths" />
              <Input readOnly value={val("renewalYears")} className={readOnlyClass + " w-16 text-center"} placeholder="Yrs" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white mb-6">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="text-blue-600"><Icons.Currency /></div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">5. Value of Contract</h2>
        </div>
        <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
          <div className="text-gray-600 font-medium flex items-center">Contract Price</div>
          <div><Input readOnly value={val("contractPrice")} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center">VAT</div>
          <div><Input readOnly value={val("vat")} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-800 font-bold flex items-center">Total Contract Price</div>
          <div><Input readOnly value={val("totalContractPrice")} className={readOnlyClass + " w-full font-bold text-gray-900"} /></div>
        </div>
      </div>

      {/* SECTION 6 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white mb-6">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="text-blue-600"><Icons.CreditCard /></div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">6. Payment Terms</h2>
        </div>
        <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
          <div className="text-gray-600 font-medium flex items-center">On Signature</div>
          <div><Input readOnly value={val("totalOnsignature")} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center">Down Payment</div>
          <div><Input readOnly value={val("downPayment")} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center pt-2">Balance / Terms</div>
          <div><TextArea readOnly rows={2} value={val("balancePayment")} className={readOnlyClass + " w-full"} /></div>
        </div>
      </div>

      {/* SECTION 7 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white mb-6">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="text-blue-600"><Icons.Truck /></div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">7. Delivery Terms</h2>
        </div>
        <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
          <div className="text-gray-600 font-medium flex items-center">Delivery Period</div>
          <div className="flex flex-wrap gap-4 items-center">
            <Input readOnly value={val("deliveryDays")} className={readOnlyClass + " w-16 text-center"} placeholder="Days" />
            <Input readOnly value={val("deliveryWeeks")} className={readOnlyClass + " w-16 text-center"} placeholder="Wks" />
            <Input readOnly value={val("deliveryMonths")} className={readOnlyClass + " w-16 text-center"} placeholder="Mths" />
            <label className="flex items-center gap-2 text-gray-500 ml-2"><input type="radio" disabled checked={val("deliveryNA") === "YES"} /> N/A</label>
          </div>
          
          <div className="text-gray-600 font-medium flex items-center pt-2">Penalties</div>
          <div><TextArea readOnly rows={2} value={val("penalties")} className={readOnlyClass + " w-full"} /></div>
          
          <div className="text-gray-600 font-medium flex items-center pt-2">Acceptance Conditions</div>
          <div><TextArea readOnly rows={2} value={val("acceptanceConditions")} className={readOnlyClass + " w-full"} /></div>
        </div>
      </div>

      {/* SECTION 8 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white mb-6">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="text-blue-600"><Icons.Shield /></div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">8. Warranty Terms</h2>
        </div>
        <div className="p-6 grid grid-cols-[250px_1fr] gap-y-4 text-sm">
          <div className="text-gray-600 font-medium flex items-center">Warranty Period</div>
          <div className="flex flex-wrap gap-4 items-center">
            <Input readOnly value={val("warrantyDays")} className={readOnlyClass + " w-16 text-center"} placeholder="Days" />
            <Input readOnly value={val("warrantyWeeks")} className={readOnlyClass + " w-16 text-center"} placeholder="Wks" />
            <Input readOnly value={val("warrantyMonths")} className={readOnlyClass + " w-16 text-center"} placeholder="Mths" />
            <label className="flex items-center gap-2 text-gray-500 ml-2"><input type="radio" disabled checked={val("warrantyNA") === "YES"} /> N/A</label>
          </div>
          
          <div className="text-gray-600 font-medium flex items-center">Post-Warranty Support?</div>
          <div className="flex gap-6 text-gray-700">
            <label className="flex items-center gap-2"><input type="radio" disabled checked={val("serviceSupport") === "YES"} /> Yes</label>
            <label className="flex items-center gap-2"><input type="radio" disabled checked={val("serviceSupport") === "NO"} /> No</label>
            <label className="flex items-center gap-2"><input type="radio" disabled checked={val("serviceSupport") === "NA"} /> N/A</label>
          </div>
        </div>
      </div>

      {/* SECTION 9 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-white mb-6">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="text-blue-600"><Icons.Sparkles /></div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">9. Special Issues</h2>
        </div>
        <div className="p-6">
          <TextArea readOnly rows={3} value={val("specialIssues")} className={readOnlyClass + " w-full"} />
        </div>
      </div>

      {/* SECTION 10: ADMINISTRATIVE ISSUES */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white mb-6">
        <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">10. Administrative Issues</h2>
        </div>

        <div className="p-6 space-y-8 bg-gray-50/50">
          {/* FINANCE DIRECTOR (READ ONLY) */}
          <div className="flex justify-between items-end border-b border-gray-200 pb-6">
             <div className="text-gray-700 text-sm mb-1 font-medium flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               Funding for the contract price is available:
               <div className="flex gap-4 ml-4">
                 <span className={`px-2 py-1 rounded border text-xs ${val("fundingAvailable") === "YES" ? 'bg-blue-50 border-blue-200 font-bold text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                   Yes [ {val("fundingAvailable") === "YES" ? '✓' : '\u00A0'} ]
                 </span>
                 <span className={`px-2 py-1 rounded border text-xs ${val("fundingAvailable") === "NO" ? 'bg-red-50 border-red-200 font-bold text-red-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                   No [ {val("fundingAvailable") === "NO" ? 'X' : '\u00A0'} ]
                 </span>
               </div>
             </div>

             <div className="flex gap-10 text-center">
               <div className="flex flex-col items-center group relative">
                 <div className={`w-64 border-b-2 border-dotted mb-1 h-12 flex items-end justify-center relative ${fdSignatureUrl ? 'border-gray-400' : 'border-gray-300'}`}>
                   {fdSignatureUrl ? (
                     <Image src={fdSignatureUrl} alt="FD Signature" width={120} height={60} className="object-contain max-h-12 absolute bottom-0" />
                   ) : (
                     <div className="text-xs text-gray-400 italic pb-2">Not Signed</div>
                   )}
                 </div>
                 <div className="font-bold text-gray-500 text-xs uppercase tracking-wider mt-2">Finance Director</div>
               </div>
               <div className="flex flex-col items-center group">
                 <div className="w-32 border-b-2 border-dotted border-gray-400 mb-1 h-12 flex items-end justify-center font-mono text-sm font-bold text-gray-800">
                   {formatDate(val("financeDate"))}
                 </div>
                 <div className="font-bold text-gray-500 text-xs uppercase tracking-wider mt-2">Date</div>
               </div>
             </div>
          </div>

          {/* PROCUREMENT MANAGER (READ ONLY) */}
          <div className="flex justify-between items-end">
            <div className="text-gray-700 text-sm mb-1 font-medium flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               Procurement Procedures complied with:
               <div className="flex gap-4 ml-4">
                 <span className={`px-2 py-1 rounded border text-xs ${val("procurementComplied") === "YES" ? 'bg-blue-50 border-blue-200 font-bold text-blue-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                   Yes [ {val("procurementComplied") === "YES" ? '✓' : '\u00A0'} ]
                 </span>
                 <span className={`px-2 py-1 rounded border text-xs ${val("procurementComplied") === "NO" ? 'bg-red-50 border-red-200 font-bold text-red-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                   No [ {val("procurementComplied") === "NO" ? 'X' : '\u00A0'} ]
                 </span>
               </div>
            </div>
            
            <div className="flex gap-10 text-center">
              <div className="flex flex-col items-center group relative">
                <div className={`w-64 border-b-2 border-dotted mb-1 h-12 flex items-end justify-center relative ${pmSignatureUrl ? 'border-gray-400' : 'border-gray-300'}`}>
                   {pmSignatureUrl ? (
                     <Image src={pmSignatureUrl} alt="PM Signature" width={120} height={60} className="object-contain max-h-12 absolute bottom-0" />
                   ) : (
                     <span className="text-xs text-gray-400 italic pb-2">Not Signed</span>
                   )}
                </div>
                <div className="font-bold text-gray-500 text-xs uppercase tracking-wider mt-2">Procurement Manager</div>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-32 border-b-2 border-dotted border-gray-400 mb-1 h-12 flex items-end justify-center font-mono text-sm font-bold text-gray-800">
                  {formatDate(val("procurementDate"))}
                </div>
                <div className="font-bold text-gray-500 text-xs uppercase tracking-wider mt-2">Date</div>
              </div>
            </div>
          </div>
        </div>

        {/* HOD SIGNATURE (READ ONLY) */}
        <div className="border-t border-gray-200 p-8 bg-white">
          <div className="flex justify-between items-end px-4">
             <div className="flex flex-col items-center group relative">
               <div className={`w-64 border-b-2 border-dotted mb-1 h-12 flex items-end justify-center relative ${hodSignatureUrl ? 'border-gray-400' : 'border-gray-300'}`}>
                 {hodSignatureUrl ? (
                   <Image src={hodSignatureUrl} alt="HOD Signature" width={120} height={60} className="object-contain max-h-12 absolute bottom-0" />
                 ) : (
                   <div className="text-xs text-gray-400 italic pb-2">Not Signed</div>
                 )}
               </div>
               <div className="font-bold text-gray-500 text-xs uppercase tracking-wider mt-2">Head of Department</div>
             </div>
             <div className="flex flex-col items-center group">
               <div className="w-32 border-b-2 border-dotted border-gray-400 mb-1 h-12 flex items-end justify-center font-mono text-sm font-bold text-gray-800">
                 {formatDate(val("headDate"))}
               </div>
               <div className="font-bold text-gray-500 text-xs uppercase tracking-wider mt-2">Date</div>
             </div>
          </div>
        </div>

        {/* COMPANY SECRETARY (EDITABLE) */}
        <div className="p-8 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col gap-8">
            <div className="text-gray-700 text-sm font-medium flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500"></div>
               Received by Legal Department:
               <div className="flex gap-4 ml-4">
                 <label className={`cursor-pointer px-2 py-1 rounded border text-xs transition-all ${decision === 'APPROVED' ? 'bg-blue-50 border-blue-500 font-bold text-blue-700' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                   <input type="radio" className="hidden" name="secretaryDecision" value="APPROVED" checked={decision === 'APPROVED'} onChange={() => setDecision('APPROVED')} />
                   Approve [ {decision === 'APPROVED' ? '✓' : '\u00A0'} ]
                 </label>
                 <label className={`cursor-pointer px-2 py-1 rounded border text-xs transition-all ${decision === 'REJECTED' ? 'bg-red-50 border-red-500 font-bold text-red-700' : 'bg-white border-gray-200 hover:border-red-300'}`}>
                   <input type="radio" className="hidden" name="secretaryDecision" value="REJECTED" checked={decision === 'REJECTED'} onChange={() => setDecision('REJECTED')} />
                   Reject [ {decision === 'REJECTED' ? 'X' : '\u00A0'} ]
                 </label>
               </div>
            </div>
            
            <div className="flex justify-between items-end gap-10 text-center">
              <div className="flex flex-col items-center group relative">
                <div className={`w-64 border-b-2 border-dotted mb-1 h-12 flex items-end justify-center relative transition-all duration-300 rounded-lg ${!signatureUrl ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer' : 'border-gray-400'}`}>
                   {signatureUrl ? (
                     <div className="relative w-full h-full flex items-end justify-center">
                       <Image src={signatureUrl} alt="Company Secretary Signature" width={120} height={60} className="object-contain max-h-12 absolute bottom-0" />
                       <button 
                        onClick={(e) => { 
                          e.preventDefault();
                          setSignatureUrl(null); 
                          setSignaturePath(null); 
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 z-10"
                        title="Remove Signature"
                      >
                        <CloseLineIcon className="w-3 h-3" />
                      </button>
                     </div>
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
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-[10px] font-medium">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400 group-hover:text-blue-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                          </svg>
                          <span className="text-[10px] font-medium">Upload Signature</span>
                        </div>
                      )}
                    </label>
                   )}
                </div>
                <div className="font-bold text-gray-500 text-xs uppercase tracking-wider group-hover:text-blue-600 transition-colors mt-2">Company Secretary</div>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-32 border-b-2 border-dotted border-gray-400 mb-1 h-12 flex items-end justify-center font-mono text-sm font-bold text-gray-800">
                  {displayDate}
                </div>
                <div className="font-bold text-gray-500 text-xs uppercase tracking-wider mt-2">Date</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex gap-6 pt-6 border-t border-gray-100">
        <Button 
          size="sm" 
          variant="primary" 
          className={`flex-1 rounded-lg py-2 text-sm font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${(!decision || !signaturePath) ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200'}`}
          onClick={() => onSubmit(decision as "APPROVED" | "REJECTED", signaturePath || undefined)}
          disabled={!decision || !signaturePath || submitting}
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <CheckLineIcon className="w-4 h-4" />
              <span>Submit Decision</span>
            </>
          )}
        </Button>

        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1 rounded-lg text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 py-2 text-sm font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]" 
          onClick={onCancel}
          disabled={submitting}
        >
          <CloseLineIcon className="w-4 h-4" />
          <span>Cancel</span>
        </Button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

    </div>
  );
}
