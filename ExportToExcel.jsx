import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

export default function ExportToExcel({ data, filename = "التقارير.xlsx" }) {
  const handleExport = () => {
    const exportData = data.map((row) => ({
      "رقم البلاغ": row.reportNumber,
      "المقاول": row.contractor,
      "تاريخ الإنشاء": row.createdAt,
      "تاريخ التحويل": row.transferredAt,
      "المدة (يوم)": row.days,
      "التأخير (يوم)": row.delay,
      "مسدد؟": row.isPaid ? "نعم" : "لا",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "التقارير");
    XLSX.writeFile(workbook, filename);
  };

  return <Button onClick={handleExport}>تصدير Excel</Button>;
}
