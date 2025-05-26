import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ManualReportForm({ onSubmit }) {
  const [form, setForm] = useState({
    reportNumber: "",
    contractor: "",
    createdAt: "",
    transferredAt: "",
    isPaid: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input name="reportNumber" placeholder="رقم البلاغ" onChange={handleChange} required />
      <Input name="contractor" placeholder="اسم المقاول" onChange={handleChange} required />
      <Input name="createdAt" type="date" placeholder="تاريخ الإنشاء" onChange={handleChange} required />
      <Input name="transferredAt" type="date" placeholder="تاريخ التحويل" onChange={handleChange} />
      <Button type="submit">إضافة</Button>
    </form>
  );
}
