// src/components/ReconciliationManager.tsx
import React from 'react';
import { useReconciliation } from '../hooks/useReconciliation';
import FileUploader from './FileUploader.tsx';
import SummaryCards from './SummaryCards.tsx';
import PreviewTable from './PreviewTable.tsx';

interface ReconciliationManagerProps {
  instructions?: React.ReactNode; // Para capturar el slot de Astro si es necesario
}

export default function ReconciliationManager({ instructions }: ReconciliationManagerProps) {
  const {
    file,
    loading,
    error,
    results,
    keyColumn,
    availableColumns,
    setKeyColumn,
    handleFileUpload,
    compareLists,
    downloadExcel
  } = useReconciliation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* COLUMNA IZQUIERDA: Controladores de Carga e Instrucciones */}
      <div className="lg:col-span-4 space-y-4">
        <section className="bg-white rounded-3xl p-3 shadow-sm border border-[#141414]/5">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            Carga de Datos
          </h2>
          
          <div className="space-y-4">
            {/* Componente especializado para la subida de archivos */}
            <FileUploader 
              file={file}
              availableColumns={availableColumns}
              keyColumn={keyColumn}
              onFileUpload={handleFileUpload}
              onKeyColumnChange={setKeyColumn}
            />

            {/* Botón de Acción Principal */}
            <button 
              onClick={compareLists}
              disabled={!file || loading}
              className="w-full bg-[#141414] hover:bg-[#2A2A2A] disabled:bg-[#141414]/20 text-white py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Procesar Comparación"
              )}
            </button>
          </div>

          {/* Manejo de Errores sin librerías externas */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <span className="font-bold select-none mt-0.5">⚠️</span>
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* Renderizado de las instrucciones estáticas heredadas de Astro */}
        {instructions}
      </div>

      {/* COLUMNA DERECHA: Resultados de la Reconciliación */}
      <div className="lg:col-span-8">
        {results ? (
          <div className="space-y-3 opacity-100 transition-opacity duration-300">
            
            {/* Header interno de resultados con botón de descarga integrado */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/40 p-2 rounded-2xl border border-[#141414]/5">
              <div>
                <h3 className="font-bold text-sm text-[#141414]/80">Análisis Consolidado listo</h3>
                <p className="text-xs text-[#141414]/50">Ya puedes exportar el reporte a Excel.</p>
              </div>
              <button 
                onClick={downloadExcel}
                className="flex items-center justify-center gap-2 bg-[#5A5A40] hover:bg-[#4A4A30] text-white px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-xl active:scale-95 font-medium text-sm cursor-pointer"
              >
                 Descargar Reporte
              </button>
            </header>

            {/* Componente Atómico: Tarjetas de Resumen */}
            <SummaryCards summary={results.summary} />

            {/* Componente Atómico: Tabla con Previsualización */}
            <PreviewTable data={results.data} keyColumn={keyColumn} />

          </div>
        ) : (
          /* Estado Vacío / Inicial */
          <div className="h-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-6 text-2xl text-[#141414]/20 select-none">
              🔍
            </div>
            <h3 className="text-xl font-bold mb-2">Listo para comparar</h3>
            <p className="text-[#141414]/50 max-w-md text-sm🗂️">
              Carga un archivo Excel con las hojas "actual" y "antigua" para comenzar el análisis de inventario.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}