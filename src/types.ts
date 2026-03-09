export interface PriceInfo {
  valueWithTax: string | null;
  externalSystemName: string | null;
}

interface HeaderRow {
  type: "HEADER";
  rawRow: string[];
}

interface InvalidRow {
  type: "INVALID";
  rawRow: string[];
  errors: string[];
}

interface ValidRow {
  type: "VALID";
  rawRow: string[];
  itemId: string;
  errors: string[];
  prices: PriceInfo[];
}

export type ProcessedRow = HeaderRow | ValidRow | InvalidRow;
