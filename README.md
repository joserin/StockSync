# StockSync

StockSync es una aplicación de reconciliación de inventarios construida con Astro, React y Tailwind CSS. Permite comparar dos hojas de cálculo Excel para detectar productos nuevos, modificados, agotados o sin cambios, y exportar el resultado en un reporte descargable.

## 📌 Qué hace

- Carga un archivo Excel con extensión `.xlsx` o `.xls`
- Lee dos hojas obligatorias: `actual` y `antigua`
- Extrae automáticamente las columnas disponibles de la hoja `actual`
- Permite seleccionar la columna clave que identifica cada producto (por ejemplo, `CODIGO`)
- Compara los datos de ambas hojas y clasifica cada fila como:
  - `NUEVO`
  - `MODIFICADO`
  - `AGOTADO`
  - `SIN CAMBIOS`
- Muestra un resumen con totales y una vista previa de las primeras filas
- Genera un archivo Excel con el reporte final

## 🧩 Requisitos

- Node.js >= 22.12.0
- pnpm

## 🚀 Scripts disponibles

Usa los siguientes comandos desde la raíz del proyecto:

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## 🧪 Cómo usarlo

1. Ejecuta `pnpm install` para instalar dependencias.
2. Inicia la aplicación con `pnpm dev`.
3. Abre el navegador en `http://localhost:4321`.
4. Sube un archivo Excel que contenga las hojas `actual` y `antigua`.
5. Selecciona la columna identificadora.
6. Haz clic en `Procesar Comparación`.
7. Descarga el reporte final usando el botón `Descargar Reporte`.

## 📄 Formato del archivo Excel

- Hoja `actual`: datos actuales de inventario
- Hoja `antigua`: datos anteriores de inventario
- Ambas hojas deben compartir la misma cabecera
- En la hoja `actual`, la app detecta las columnas y permite elegir cuál se usa como llave

## 🧱 Tecnología usada

- Astro
- React
- Tailwind CSS
- SheetJS (`xlsx`)

## 🗂️ Estructura del proyecto

- `src/pages/index.astro` – página principal
- `src/components/ReconciliationManager.tsx` – lógica de UI principal
- `src/hooks/useReconciliation.ts` – comparación y exportación de datos
- `src/components/FileUploader.tsx` – carga de archivo y selección de columna
- `src/components/SummaryCards.tsx` – resumen de resultados
- `src/components/PreviewTable.tsx` – vista previa de la conciliación

## 💡 Notas

- El archivo debe contener exactamente las hojas `actual` y `antigua`.
- Si la hoja `actual` no tiene una columna `CODIGO`, selecciona la llave adecuada del listado.
- El reporte exportado incluye el estado de conciliación y los detalles de los cambios.
