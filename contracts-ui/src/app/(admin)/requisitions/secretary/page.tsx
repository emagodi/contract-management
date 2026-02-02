"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { Modal } from "@/components/ui/modal";
import { 
  EyeIcon, DocsIcon, ArrowUpIcon,
  UserIcon, CalenderIcon, DollarLineIcon, InfoIcon, BoltIcon
} from "@/icons";
import { useRouter } from "next/navigation";

const SearchIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-5 h-5"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

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

type Attachment = {
  id: number;
  fileName: string;
  contentType?: string;
  size?: number;
  uploadedAt?: string;
  createdBy?: string;
  updatedBy?: string;
};

export default function CompanySecretaryQueuePage() {
  const [items, setItems] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<"createdAt" | "id">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentsPage, setAttachmentsPage] = useState(1);
  const [attachmentsTotalPages, setAttachmentsTotalPages] = useState(1);
  const [attachmentsForReqId, setAttachmentsForReqId] = useState<number | null>(null);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [attachmentsError, setAttachmentsError] = useState<string | null>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/requisitions/by-status?status=PROCUREMENTMANAGER_APPROVED`;
        const res = await fetch(url, { headers: authHeaders() });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load requisitions");
        }
        const data = await res.json();
        const list: Requisition[] = Array.isArray(data) ? data : [];
        setItems(list);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authHeaders]);

  const sortedItems = useMemo(() => {
    const toTime = (v?: string) => {
      const t = v ? Date.parse(v) : NaN;
      return isNaN(t) ? 0 : t;
    };
    
    let arr = [...items];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      arr = arr.filter(i => 
        String(i.requisitionTo || "").toLowerCase().includes(lower) ||
        String(i.requisitionFrom || "").toLowerCase().includes(lower) ||
        String(i.contractPrice || "").toLowerCase().includes(lower) ||
        String(i.id).includes(lower)
      );
    }

    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "createdAt") cmp = toTime(a.createdAt) - toTime(b.createdAt);
      else cmp = Number(a.id) - Number(b.id);
      return sortDir === "desc" ? -cmp : cmp;
    });
    return arr;
  }, [items, sortKey, sortDir, searchTerm]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(sortedItems.length / pageSize)), [sortedItems.length, pageSize]);
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, currentPage, pageSize]);

  const openAttachments = async (reqId: number) => {
    setAttachmentsOpen(true);
    setAttachmentsForReqId(reqId);
    setAttachmentsPage(1);
    await loadAttachments(reqId, 1);
  };

  const loadAttachments = async (reqId: number, page: number) => {
    setAttachmentsLoading(true);
    setAttachmentsError(null);
    try {
      const size = 10;
      const url = `/api/attachments/requisition/${reqId}?page=${page - 1}&size=${size}`;
      const res = await fetch(url, { headers: authHeaders() });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load attachments");
      }
      const data = await res.json();
      const content: Attachment[] = data?.content || [];
      setAttachments(content);
      const totalPagesFromServer = typeof data?.totalPages === "number" ? data.totalPages : 1;
      setAttachmentsTotalPages(totalPagesFromServer);
    } catch (e: unknown) {
      setAttachmentsError(e instanceof Error ? e.message : "Error loading attachments");
    } finally {
      setAttachmentsLoading(false);
    }
  };

  const triggerUpload = (reqId: number) => {
    const input = document.getElementById(`cs-file-upload-${reqId}`) as HTMLInputElement | null;
    input?.click();
  };

  const uploadFiles = async (reqId: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const url = `/api/requisitions/${reqId}/upload`;
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
    if (!res.ok) {
      const text = await res.text();
      alert(text || "Upload failed");
      return;
    }
    if (attachmentsOpen && attachmentsForReqId === reqId) await loadAttachments(reqId, attachmentsPage);
    alert("Upload successful");
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Pending Requisitions" showTitle={false} />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-theme-xs dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/[0.05] gap-4">
          <div>
            <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">PENDING REQUISITIONS</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-full sm:w-64 transition-shadow"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-700 text-xs font-medium focus:outline-none hover:border-gray-300 transition-colors cursor-pointer"
                title="Rows per page"
              >
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
              </select>
              
              <div className="w-px h-4 bg-gray-300 mx-1"></div>

              <select
                value={`${sortKey}_${sortDir}`}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split("_") as ["createdAt" | "id", "asc" | "desc"];
                  setSortKey(key);
                  setSortDir(dir);
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-700 text-xs font-medium focus:outline-none hover:border-gray-300 transition-colors cursor-pointer"
                title="Sort order"
              >
                <option value="createdAt_desc">Newest First</option>
                <option value="createdAt_asc">Oldest First</option>
                <option value="id_desc">ID High-Low</option>
                <option value="id_asc">ID Low-High</option>
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-emerald-100 bg-emerald-50 dark:border-white/[0.05] dark:bg-white/[0.03]">
                  <TableCell isHeader className="px-5 py-3 font-medium text-emerald-800 text-start text-xs dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <InfoIcon className="w-3.5 h-3.5" /> ID
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-emerald-800 text-start text-xs dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5" /> From
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-emerald-800 text-start text-xs dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5" /> To
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-emerald-800 text-start text-xs dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalenderIcon className="w-3.5 h-3.5" /> Start
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-emerald-800 text-start text-xs dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalenderIcon className="w-3.5 h-3.5" /> End
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-emerald-800 text-start text-xs dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <DollarLineIcon className="w-3.5 h-3.5" /> Price
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-emerald-800 text-center text-xs dark:text-gray-400">
                    <div className="flex items-center justify-center gap-1">
                      <DocsIcon className="w-3.5 h-3.5" /> Attachments
                    </div>
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-emerald-800 text-start text-xs dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <BoltIcon className="w-3.5 h-3.5" /> Actions
                    </div>
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="px-5 py-8 text-center text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="px-5 py-8 text-center text-red-600">{error}</TableCell>
                  </TableRow>
                ) : pagedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="px-5 py-8 text-center text-gray-500">No requisitions found.</TableCell>
                  </TableRow>
                ) : (
                  pagedItems.map((r) => (
                    <TableRow key={r.id} className="hover:bg-blue-50/50 transition-colors group border-b border-gray-50 last:border-none">
                      <TableCell className="px-5 py-3 text-start font-mono text-gray-600 text-xs">{r.id}</TableCell>
                      <TableCell className="px-5 py-3 text-start font-medium text-gray-800 text-xs">{String(r.requisitionFrom || "-")}</TableCell>
                      <TableCell className="px-5 py-3 text-start font-medium text-gray-800 text-xs">{String(r.requisitionTo || "-")}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-gray-600 text-xs">{formatDate(r.startDate)}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-gray-600 text-xs">{formatDate(r.endDate)}</TableCell>
                      <TableCell className="px-5 py-3 text-start font-mono text-gray-700 text-xs">{String(r.contractPrice || "-")}</TableCell>
                      <TableCell className="px-5 py-3 text-center">
                        <button 
                          onClick={() => openAttachments(r.id)} 
                          className="p-1 rounded-md text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors focus:outline-none focus:ring-1 focus:ring-green-200 inline-flex items-center justify-center"
                          title="View Attachments"
                        >
                          <DocsIcon className="w-4 h-4" />
                        </button>
                      </TableCell>
                      <TableCell className="px-5 py-3 text-start">
                        <div className="flex items-center gap-2 opacity-100 transition-opacity">
                          <button 
                            onClick={() => router.push(`/requisitions/secretary/${r.id}`)} 
                            className="p-1 rounded-md text-sky-600 hover:bg-sky-50 hover:text-sky-700 transition-colors focus:outline-none focus:ring-1 focus:ring-sky-200"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => triggerUpload(r.id)} 
                            className="p-1 rounded-md text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-colors focus:outline-none focus:ring-1 focus:ring-orange-200"
                            title="Upload Signature"
                          >
                            <ArrowUpIcon className="w-4 h-4" />
                          </button>
                          <input id={`cs-file-upload-${r.id}`} type="file" multiple className="hidden" onChange={(e) => uploadFiles(r.id, e.target.files)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))} />
        </div>
      </div>

      <Modal isOpen={attachmentsOpen} onClose={() => setAttachmentsOpen(false)} className="max-w-[900px] p-6 lg:p-10">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-800"><DocsIcon /> Attachments</h3>
          {attachmentsError && <p className="text-red-600 mb-3 text-sm">{attachmentsError}</p>}
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[700px]">
              <Table>
                <TableHeader className="border-y border-gray-100 dark:border-white/[0.05] bg-gray-50">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">File Name</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Created By</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Updated By</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {attachmentsLoading ? (
                    <TableRow>
                      <TableCell className="px-5 py-4" colSpan={4}>Loading...</TableCell>
                    </TableRow>
                  ) : attachments.length === 0 ? (
                    <TableRow>
                      <TableCell className="px-5 py-4" colSpan={4}>No attachments</TableCell>
                    </TableRow>
                  ) : (
                    attachments.map((a) => (
                      <TableRow key={a.id} className="hover:bg-blue-50/50 transition-colors">
                        <TableCell className="px-5 py-4 text-start">{a.id}</TableCell>
                        <TableCell className="px-5 py-4 text-start">{a.fileName}</TableCell>
                        <TableCell className="px-5 py-4 text-start">{String(a.createdBy || "-")}</TableCell>
                        <TableCell className="px-5 py-4 text-start">{String(a.updatedBy || "-")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {attachmentsPage} of {attachmentsTotalPages}</div>
            <Pagination currentPage={attachmentsPage} totalPages={attachmentsTotalPages} onPageChange={async (p) => {
              if (!attachmentsForReqId) return;
              const newPage = Math.max(1, Math.min(attachmentsTotalPages, p));
              setAttachmentsPage(newPage);
              await loadAttachments(attachmentsForReqId, newPage);
            }} />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button size="sm" variant="outline" className="rounded-full text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={() => setAttachmentsOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
