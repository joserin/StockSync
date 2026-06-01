// src/types/env.d.ts

export interface Product {
  [key: string]: any;
}

export interface ReconciliationSummary {
  new: number;
  modified: number;
  outOfStock: number;
  unchanged: number;
}

export interface ReconciliationResult {
  data: Product[];
  summary: ReconciliationSummary;
}

export type ReconciliationStatus = 'NUEVO' | 'MODIFICADO' | 'AGOTADO' | 'SIN CAMBIOS';