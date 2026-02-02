"use client";

import React, { useEffect, useState, useCallback } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CompanySecretaryViewForm from "@/components/requisition/CompanySecretaryViewForm";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { CheckLineIcon, CloseLineIcon, BoxIconLine, CalenderIcon } from "@/icons";

type Requisition = {
  id: number;
  requisitionFrom?: string;
  requisitionTo?: string;
  requisitionStatus?: string;
  contractPrice?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export default function CompanySecretaryViewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewOnly = searchParams.get("viewOnly") === "true";
  const idParam = params?.id as string | undefined;
  const [item, setItem] = useState<Requisition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [pendingSignaturePath, setPendingSignaturePath] = useState<string | undefined>(undefined);

  const getAccessToken = () => {
    if (typeof window === "undefined") return "";
    const fromLocal = localStorage.getItem("access_token");
    const fromSession = sessionStorage.getItem("access_token");
    return (fromLocal || fromSession || "").trim();
  };

  const authHeaders = useCallback((): HeadersInit => {
    const token = getAccessToken();
    const headers: Record<string, string> = { accept: "*/*" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!idParam) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/requisitions/${idParam}`, { headers: authHeaders() });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load requisition");
        }
        const data = await res.json();
        setItem(data as Requisition);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error loading requisition");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idParam, authHeaders]);

  const openConfirm = (decision: "APPROVED" | "REJECTED", signaturePath?: string) => {
    setPendingDecision(decision);
    setPendingSignaturePath(signaturePath);
    setConfirmOpen(true);
  };

  const submitDecision = async () => {
    if (!item || !pendingDecision) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const status = pendingDecision === "APPROVED" ? "COMPANYSECRETARY_APPROVED" : "COMPANYSECRETARY_REJECTED";
      const today = new Date().toISOString().split("T")[0];
      const payload = {
        ...item,
        requisitionStatus: status,
        companySecretary: pendingSignaturePath || pendingDecision,
        secretaryDate: today,
      } as Record<string, unknown>;
      const res = await fetch(`/api/requisitions/${item.id}/update`, {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit action");
      }
      setConfirmOpen(false);
      setSuccessOpen(true);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Error submitting action");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="View Requisition" />
      {loading ? (
        <div className="p-5">Loading...</div>
      ) : error ? (
        <div className="p-5 text-red-600">{error}</div>
      ) : !item ? (
        <div className="p-5">No requisition found</div>
      ) : (
        <CompanySecretaryViewForm 
          requisition={item} 
          submitting={submitting} 
          error={submitError} 
          onSubmit={openConfirm} 
          onCancel={() => router.push("/requisitions/secretary")}
          viewOnly={viewOnly}
        />
      )}

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} className="max-w-[500px] p-0 overflow-hidden rounded-2xl">
        <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 shadow-sm">
            <BoxIconLine className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Confirm Decision</h3>
            {item && <p className="text-sm text-gray-500">Requisition #{item.id}</p>}
          </div>
        </div>
        
        <div className="p-8">
          {pendingDecision && (
            <div className={`flex items-center justify-center gap-2 mb-8 p-3 rounded-lg border ${
              pendingDecision === "APPROVED" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                : "bg-red-50 border-red-100 text-red-700"
            }`}>
              {pendingDecision === "APPROVED" ? (
                <>
                  <CheckLineIcon className="w-5 h-5" />
                  <span className="font-bold">Requisition Approved</span>
                </>
              ) : (
                <>
                  <CloseLineIcon className="w-5 h-5" />
                  <span className="font-bold">Requisition Rejected</span>
                </>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-6 text-sm text-gray-900 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Decision</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 font-semibold shadow-sm">
                 {pendingDecision === "APPROVED" ? (
                    <span className="text-emerald-700">APPROVED</span>
                 ) : (
                    <span className="text-red-700">REJECTED</span>
                 )}
              </div>
              <div className="text-xs text-gray-400 pl-1">Company Secretary</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 font-semibold shadow-sm">
                <CalenderIcon className="w-4 h-4 text-gray-400" />
                <span>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
              <div className="text-xs text-gray-400 pl-1">Signing Date</div>
            </div>
          </div>
          
          {submitError && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <CloseLineIcon className="w-4 h-4 shrink-0" />
              {submitError}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <button 
              className="flex-1 rounded-xl px-4 py-3 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 font-semibold transition-colors" 
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </button>
            <button 
              className={`flex-1 rounded-xl px-4 py-3 text-white font-semibold shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                submitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : pendingDecision === "APPROVED" 
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" 
                    : "bg-red-600 hover:bg-red-700 shadow-red-200"
              }`}
              onClick={submitDecision} 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckLineIcon className="w-5 h-5" />
                  <span>Confirm Decision</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={successOpen} onClose={() => setSuccessOpen(false)} className="max-w-[520px] p-6 lg:p-10">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-emerald-800">Decision Saved</h3>
          {item && pendingDecision && (
            <p className="text-sm text-gray-700 mb-4">Requisition #{item.id} set to {pendingDecision === "APPROVED" ? "COMPANYSECRETARY_APPROVED" : "COMPANYSECRETARY_REJECTED"}</p>
          )}
          <div className="mt-2 flex justify-end gap-3">
            <button className="rounded-full px-4 py-2 text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={() => setSuccessOpen(false)}>Close</button>
            <button className="rounded-full px-4 py-2 text-white bg-sky-600 hover:bg-sky-700" onClick={() => router.push("/requisitions/secretary")}>Go to Queue</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}