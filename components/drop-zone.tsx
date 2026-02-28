"use client";

import { useCallback, useState, type DragEvent, type ReactNode } from "react";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  children: ReactNode;
}

export function DropZone({
  onFile,
  accept,
  maxSizeMB = 5,
  children,
}: DropZoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items?.length) setDragging(true);
  }, []);

  const handleDragOut = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      if (file.size > maxSizeMB * 1024 * 1024) return;

      if (accept) {
        const exts = accept.split(",").map((s) => s.trim().toLowerCase());
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        if (!exts.includes(ext) && !exts.includes(file.type)) return;
      }

      onFile(file);
    },
    [onFile, accept, maxSizeMB],
  );

  return (
    <div
      className="relative"
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {children}
      {dragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/5">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Upload className="h-5 w-5" />
            <span>Drop file here</span>
          </div>
        </div>
      )}
    </div>
  );
}
