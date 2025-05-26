import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

export default function ExcelUploader({ onUpload }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);
      const formatted = json.map((row, index) => ({
        id: Date.now() + index,
        reportNumber: row["رقم البلاغ"],
        contractor: row["المقاول"],
        createdAt: row["تاريخ الإنشاء"],
        transferredAt: row["تاريخ التحويل"],
        days: row["المدة (يوم)"],
        delay: row["التأخير (يوم)"],
        isPaid: row["مسدد؟"] === "نعم",
      }));
      onUpload(formatted);
    };
    reader.readAsBinaryString(file);
  };

  return <input type="file" accept=".xlsx, .xls" onChange={handleFile} />;
}
