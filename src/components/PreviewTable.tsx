// src/components/PreviewTable.tsx
import React from 'react';
import type { Product, ReconciliationStatus } from '../env.d.ts';

interface PreviewTableProps {
  data: Product[];
  keyColumn: string;
}

export default function PreviewTable({ data, keyColumn }: PreviewTableProps) {
  // Limitar visualización por rendimiento del navegador
  const previewData = data.slice(0, 20);

  // Extraer nombres de cabeceras dinámicas omitiendo las columnas internas de control
  /*
  const headers = Object.keys(data[0] || {}).filter(
    (h) => h !== 'ESTADO_RECONCILIACION' && h !== 'DETALLES_CAMBIO'
  );*/

  const getStatusBadgeClass = (status: ReconciliationStatus) => {
    switch (status) {
      case 'NUEVO': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MODIFICADO': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'AGOTADO': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#141414]/5 shadow-sm overflow-hidden">
      <header className="px-4 py-2 border-b border-[#141414]/5 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-base">Vista Previa de Cambios</h3>
        <p className="text-xs text-[#141414]/40 mt-0.5">
            Mostrando las primeras {previewData.length} filas de {data.length} totales analizadas.
        </p>
      </header>

      <div className="max-h-96 overflow-y-auto overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
            <tr className="bg-gray-50 text-[#141414]/60 text-xs font-bold uppercase tracking-wider border-b border-[#141414]/5">
              <th className="py-3 px-6">Estado</th>
              <th className="py-3 px-4 bg-gray-50">Descripción ({keyColumn})</th>
              <th className="py-3 px-6">Detalles del Ajuste</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141414]/5 font-medium">
            {previewData.map((row, index) => {
              const status = row['ESTADO_RECONCILIACION'] as ReconciliationStatus;
              return (
                <tr 
                  key={index} 
                  className={`hover:bg-gray-50/80 transition-colors ${
                    status === 'AGOTADO' ? 'bg-rose-50/30 text-[#141414]/60 italic' : ''
                  }`}
                >
                  {/* Badge de Estado */}
                  <td className="py-3 px-6 whitespace-nowrap">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(status)}`}>
                      {status}
                    </span>
                  </td>

                  {/* Valor de la Llave Primaria */}
                  <td className="py-3 px-4 font-mono font-bold text-xs text-[#141414]/80 whitespace-nowrap">
                    {String(row[keyColumn] || '-')}
                  </td>

                  {/* Detalles del Cambio en formato de texto descriptivo */}
                  <td className="py-3 px-6 whitespace-nowrap text-xs font-normal text-amber-700">
                    {row['DETALLES_CAMBIO'] || (
                      <span className="text-[#141414]/30 font-light">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}