// src/hooks/useReconciliation.ts
import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import type { ReconciliationResult, Product, ReconciliationSummary, ReconciliationStatus } from '../env.d.ts';

export function useReconciliation() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ReconciliationResult | null>(null);
  const [keyColumn, setKeyColumn] = useState<string>('CODIGO');
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  // 1. Manejar la precarga del archivo y extracción de columnas cabecera
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setResults(null);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const actualSheet = workbook.Sheets['actual'];
        if (!actualSheet) {
          setError('No se encontró la hoja llamada "actual"');
          return;
        }
        
        // Leemos solo las cabeceras (header: 1 devuelve un array de arrays)
        const jsonData = XLSX.utils.sheet_to_json(actualSheet, { header: 1 }) as any[][];
        if (jsonData.length > 0) {
          const headers = jsonData[0].map(String);
          setAvailableColumns(headers);
          
          // Intentar pre-seleccionar CODIGO si existe en la lista
          if (headers.includes('CODIGO')) {
            setKeyColumn('CODIGO');
          } else {
            setKeyColumn(String(headers[0]));
          }
        }
      } catch (err) {
        setError('Error al leer el archivo para extraer las columnas.');
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  }, []);

  // 2. Procesar y comparar la lista 'actual' contra 'antigua'
  const compareLists = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const actualSheet = workbook.Sheets['actual'];
        const antiguaSheet = workbook.Sheets['antigua'];

        if (!actualSheet || !antiguaSheet) {
          setError('El archivo debe contener las hojas "actual" y "antigua"');
          setLoading(false);
          return;
        }

        const actualData = XLSX.utils.sheet_to_json(actualSheet) as Product[];
        const antiguaData = XLSX.utils.sheet_to_json(antiguaSheet) as Product[];

        // Indexar la lista antigua en un Map para búsquedas O(1)
        const antiguaMap = new Map<string, Product>();
        antiguaData.forEach(item => {
          const key = String(item[keyColumn] || '').trim();
          if (key) antiguaMap.set(key, item);
        });

        const finalData: Product[] = [];
        const summary: ReconciliationSummary = { new: 0, modified: 0, outOfStock: 0, unchanged: 0 };
        const processedKeys = new Set<string>();

        // Evaluar inserciones y modificaciones en la lista actual
        actualData.forEach(item => {
          const key = String(item[keyColumn] || '').trim();
          processedKeys.add(key);
          
          const oldItem = antiguaMap.get(key);
          let status: ReconciliationStatus = 'SIN CAMBIOS';
          let details = '';

          if (!oldItem) {
            status = 'NUEVO';
            summary.new++;
          } else {
            const changes: string[] = [];
            Object.keys(item).forEach(field => {
              if (field !== 'ESTADO_RECONCILIACION' && field !== 'DETALLES_CAMBIO' && String(item[field]) !== String(oldItem[field])) {
                changes.push(field);
              }
            });

            if (changes.length > 0) {
              status = 'MODIFICADO';
              details = `Cambios en: ${changes.join(', ')}`;
              summary.modified++;
            } else {
              summary.unchanged++;
            }
          }

          finalData.push({
            ...item,
            ESTADO_RECONCILIACION: status,
            DETALLES_CAMBIO: details
          });
        });

        // Evaluar productos que ya no figuran en la lista actual (Agotados)
        antiguaData.forEach(oldItem => {
          const key = String(oldItem[keyColumn] || '').trim();
          if (!processedKeys.has(key)) {
            finalData.push({
              ...oldItem,
              ESTADO_RECONCILIACION: 'AGOTADO',
              DETALLES_CAMBIO: 'No figura en lista actual'
            });
            summary.outOfStock++;
          }
        });

        setResults({ data: finalData, summary });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error procesando el archivo. Verifica que las hojas tengan cabeceras válidas.');
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  }, [file, keyColumn]);

  // 3. Generar y descargar el reporte Excel consolidado
  const downloadExcel = useCallback(() => {
    if (!results) return;
    
    const worksheet = XLSX.utils.json_to_sheet(results.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultado_Conciliacion");
    /*
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Conciliacion_${new Date().toISOString().split('T')[0]}.xlsx`);*/

    // Generar el buffer desde SheetJS igual que antes
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // --- Solución Nativa sin File-Saver ---
    // 1. Crear una URL local que apunte al objeto Blob en memoria
    const url = window.URL.createObjectURL(data);
    
    // 2. Crear un elemento <a> en memoria de forma invisible
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Conciliacion_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // 3. Añadirlo temporalmente al documento, hacer click y removerlo
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    
    // 4. Liberar la URL de la memoria para no causar memory leaks
    window.URL.revokeObjectURL(url);

  }, [results]);

  return {
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
  };
}