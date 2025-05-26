import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ManualReportForm from "./ManualReportForm";
import ExportToExcel from "./ExportToExcel";
import ExcelUploader from "./ExcelUploader";

const mockReports = [
  {
    id: 1,
    reportNumber: "R-001",
    contractor: "مقاول أ",
    createdAt: "2025-05-20",
    transferredAt: "2025-05-22",
    isPaid: false,
    days: 2,
    delay: 0,
  },
  {
    id: 2,
    reportNumber: "R-002",
    contractor: "مقاول ب",
    createdAt: "2025-05-18",
    transferredAt: "2025-05-19",
    isPaid: true,
    days: 1,
    delay: 3,
  },
];

export default function ReportsDashboard() {
  const [reports, setReports] = useState(mockReports);
  const [filter, setFilter] = useState({ contractor: "", search: "", isPaid: "" });
  const [showForm, setShowForm] = useState(false);

  const filteredReports = reports.filter((r) => {
    return (
      (filter.contractor === "" || r.contractor === filter.contractor) &&
      (filter.isPaid === "" || r.isPaid.toString() === filter.isPaid) &&
      (filter.search === "" || r.reportNumber.includes(filter.search))
    );
  });

  const columns = [
    { name: "رقم البلاغ", selector: (row) => row.reportNumber, sortable: true },
    { name: "المقاول", selector: (row) => row.contractor },
    { name: "تاريخ الإنشاء", selector: (row) => row.createdAt },
    { name: "تاريخ التحويل", selector: (row) => row.transferredAt },
    { name: "المدة (يوم)", selector: (row) => row.days },
    { name: "التأخير (يوم)", selector: (row) => row.delay },
    { name: "مسدد؟", cell: (row) => (row.isPaid ? "نعم" : "لا") },
    {
      name: "إجراء",
      cell: (row) => (!row.isPaid ? <Button onClick={() => markAsPaid(row.id)}>تسديد</Button> : null),
    },
  ];

  const markAsPaid = (id) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, isPaid: true } : r)));
  };

  const addReport = (newReport) => {
    const created = new Date(newReport.createdAt);
    const transferred = newReport.transferredAt ? new Date(newReport.transferredAt) : null;
    const days = transferred ? (transferred - created) / (1000 * 60 * 60 * 24) : null;
    const delay = transferred ? Math.max(0, Math.ceil((new Date() - transferred) / (1000 * 60 * 60 * 24)) - 4) : null;

    setReports((prev) => [
      ...prev,
      {
        ...newReport,
        id: prev.length + 1,
        days,
        delay,
      },
    ]);
    setShowForm(false);
  };

  return (
    <Card className="p-4">
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Input placeholder="بحث برقم البلاغ" value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })} className="w-full sm:w-64" />
          <Select onValueChange={(value) => setFilter({ ...filter, contractor: value })}>
            <SelectTrigger className="w-48"><SelectValue placeholder="اختر المقاول" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="مقاول أ">مقاول أ</SelectItem>
              <SelectItem value="مقاول ب">مقاول ب</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setFilter({ ...filter, isPaid: value })}>
            <SelectTrigger className="w-48"><SelectValue placeholder="حالة التسديد" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="true">مسدد</SelectItem>
              <SelectItem value="false">غير مسدد</SelectItem>
            </SelectContent>
          </Select>

          <ExportToExcel data={filteredReports} />
          <ExcelUploader onUpload={(uploaded) => setReports([...reports, ...uploaded])} />
          <Button onClick={() => setShowForm(true)}>إضافة بلاغ</Button>
        </div>
        <DataTable columns={columns} data={filteredReports} pagination highlightOnHover persistTableHead />
        {showForm && <ManualReportForm onSubmit={addReport} />}
      </CardContent>
    </Card>
  );
}
