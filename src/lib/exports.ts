import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { currency } from "./data";

export type InvoiceLine = { name: string; qty: number; price: number };
export type InvoiceData = {
  invoiceNo: string;
  date: string;
  business: { name: string; phone?: string | null; email?: string | null; address?: string | null; gstin?: string | null };
  customer: { name: string; phone?: string | null; address?: string | null };
  lines: InvoiceLine[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string | null;
  status?: string | null;
};

export function downloadInvoicePDF(inv: InvoiceData) {
  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();

  doc.setFontSize(20).setFont("helvetica", "bold").text(inv.business.name || "Invoice", 14, 18);
  doc.setFontSize(9).setFont("helvetica", "normal").setTextColor(110);
  const bizMeta = [inv.business.address, inv.business.phone, inv.business.email, inv.business.gstin ? `GSTIN: ${inv.business.gstin}` : null]
    .filter(Boolean).join(" · ");
  if (bizMeta) doc.text(bizMeta, 14, 24);

  doc.setFontSize(14).setFont("helvetica", "bold").setTextColor(0).text("TAX INVOICE", W - 14, 18, { align: "right" });
  doc.setFontSize(10).setFont("helvetica", "normal").setTextColor(80);
  doc.text(`Invoice: ${inv.invoiceNo}`, W - 14, 24, { align: "right" });
  doc.text(`Date: ${inv.date}`, W - 14, 30, { align: "right" });

  doc.setDrawColor(220).line(14, 36, W - 14, 36);

  doc.setFontSize(10).setTextColor(110).text("BILL TO", 14, 44);
  doc.setFontSize(11).setFont("helvetica", "bold").setTextColor(0).text(inv.customer.name || "Walk-in", 14, 50);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(80);
  const custMeta = [inv.customer.phone, inv.customer.address].filter(Boolean).join(" · ");
  if (custMeta) doc.text(custMeta, 14, 56);

  autoTable(doc, {
    startY: 64,
    head: [["#", "Item", "Qty", "Price", "Amount"]],
    body: inv.lines.map((l, i) => [String(i + 1), l.name, String(l.qty), currency(l.price), currency(l.qty * l.price)]),
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255 },
    columnStyles: { 0: { cellWidth: 10 }, 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" } },
  });

  const y = (doc as any).lastAutoTable.finalY + 8;
  const rightX = W - 14;
  const labelX = W - 70;
  doc.setFontSize(10).setTextColor(80);
  doc.text("Subtotal", labelX, y);     doc.text(currency(inv.subtotal), rightX, y, { align: "right" });
  doc.text("GST (18%)", labelX, y + 6); doc.text(currency(inv.tax), rightX, y + 6, { align: "right" });
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0);
  doc.text("Total", labelX, y + 14);    doc.text(currency(inv.total), rightX, y + 14, { align: "right" });

  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(110);
  if (inv.paymentMethod) doc.text(`Payment: ${inv.paymentMethod}${inv.status ? ` — ${inv.status}` : ""}`, 14, y + 14);
  doc.text("Thank you for your business.", 14, y + 28);

  doc.save(`${inv.invoiceNo}.pdf`);
}

export function downloadTablePDF(opts: { title: string; head: string[]; rows: (string | number)[][]; filename?: string }) {
  const doc = new jsPDF();
  doc.setFontSize(16).setFont("helvetica", "bold").text(opts.title, 14, 18);
  doc.setFontSize(9).setTextColor(110).text(new Date().toLocaleString(), 14, 24);
  autoTable(doc, {
    startY: 30,
    head: [opts.head],
    body: opts.rows.map(r => r.map(x => String(x))),
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255 },
  });
  doc.save((opts.filename || opts.title.replace(/\s+/g, "_")) + ".pdf");
}

export function downloadExcel(opts: { title: string; head: string[]; rows: (string | number)[][]; filename?: string }) {
  const ws = XLSX.utils.aoa_to_sheet([opts.head, ...opts.rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, opts.title.slice(0, 28) || "Report");
  XLSX.writeFile(wb, (opts.filename || opts.title.replace(/\s+/g, "_")) + ".xlsx");
}

export function downloadCSV(opts: { head: string[]; rows: (string | number)[][]; filename?: string }) {
  const esc = (v: any) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [opts.head.map(esc).join(","), ...opts.rows.map(r => r.map(esc).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = (opts.filename || "report") + ".csv"; a.click();
  URL.revokeObjectURL(url);
}
