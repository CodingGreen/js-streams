import { transform } from "stream-transform";
import type { ProcessedRow } from "./types.js";

export const createErrorCsvTransform = () =>
  transform((row: ProcessedRow) => {
    if (row.type !== "HEADER") {
      return [...row.rawRow, row.errors.join("; ")];
    }

    return [...row.rawRow, "Errors"];
  });
