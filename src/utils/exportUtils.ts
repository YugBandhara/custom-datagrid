// src/utils/exportUtils.ts

export const exportCSV = (data: any[], filename = "data.csv") => {
    if (!data.length) return;
  
    const csv = [
      Object.keys(data[0]).join(","), // Header row
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");
  
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export const exportJSON = (data: any[], filename = "data.json") => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  export const openPrintWindow = (rowData: any) => {
    const encodedData = encodeURIComponent(JSON.stringify(rowData));
    const printUrl = `/print?data=${encodedData}`;
    window.open(printUrl, "_blank");
  };
  