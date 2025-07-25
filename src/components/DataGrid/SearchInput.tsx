// components/DataGrid/Controls/SearchInput.tsx
import React from "react";
import { Input } from "@/components/ui/Input";

export default function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Input
      type="text"
      placeholder="🔍 Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-[200px] border-muted bg-background hover:border-ring focus:border-primary transition-all"
    />
  );
}
