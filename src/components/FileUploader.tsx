// src/components/FileUploader.tsx
import React from 'react';

interface FileUploaderProps {
  file: File | null;
  availableColumns: string[];
  keyColumn: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyColumnChange: (value: string) => void;
}

export default function FileUploader({
  file,
  availableColumns,
  keyColumn,
  onFileUpload,
  onKeyColumnChange
}: FileUploaderProps) {
  return (
    <div className="space-y-4">
      {/* Zona de Arrastre / Entrada de Archivo */}
      <div className="relative group">
        <input 
          type="file" 
          accept=".xlsx, .xls"
          onChange={onFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
          file 
            ? 'border-[#5A5A40] bg-[#5A5A40]/5' 
            : 'border-[#141414]/20 group-hover:border-[#141414]/40 bg-gray-50'
        }`}>
          <div className="text-3xl mb-1 select-none">
            {file ? '📄' : '📥'}
          </div>
          <p className="text-sm font-medium text-[#141414]">
            {file ? file.name : 'Arrastra tu archivo Excel aquí'}
          </p>
          <p className="text-xs text-[#141414]/40 mt-1">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'o haz clic para explorar tus carpetas'}
          </p>
        </div>
      </div>

      {/* Selector Dinámico de Columna Identificadora */}
      {availableColumns.length > 0 && (
        <div className="bg-gray-50 p-2 rounded-2xl border border-[#141414]/5 space-y-2 animate-fadeIn">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#141414]/60">
            Columna Identificadora (Llave)
          </label>
          <div className="relative">
            <select
              value={keyColumn}
              onChange={(e) => onKeyColumnChange(e.target.value)}
              className="w-full bg-white border border-[#141414]/10 rounded-xl px-4 py-2.5 text-sm font-medium appearance-none focus:outline-none focus:border-[#5A5A40] focus:ring-1 focus:ring-[#5A5A40] cursor-pointer"
            >
              {availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs opacity-50">
              ▼
            </div>
          </div>
          <p className="text-[11px] text-[#141414]/50">
            Se usará esta columna para cruzar y buscar los productos entre ambas listas.
          </p>
        </div>
      )}
    </div>
  );
}