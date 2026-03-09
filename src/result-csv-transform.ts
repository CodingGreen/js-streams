import { transform } from "stream-transform";
import type { ProcessedRow } from "./types.js";

export const createResultCsvTransform = (userId: string) =>
  transform((row: ProcessedRow, callback) => {
    if (row.type !== "VALID") {
      callback(null, null);
      return;
    }

    const { prices, itemId } = row;

    const newRows = prices.map(({ externalSystemName, valueWithTax }) => ({
      fk_item_id: itemId,
      external_system_name: externalSystemName,
      value_with_tax: valueWithTax,
      create_user_id: userId,
      update_user_id: userId,
    }));

    callback(null, ...newRows);
  });
