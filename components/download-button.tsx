"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  text: string;
  filename?: string;
}

export function DownloadButton({ text, filename = "output.txt" }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
      <Download className="h-4 w-4" />
    </Button>
  );
}
