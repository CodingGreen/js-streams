import { transform } from "csv";
import z from "zod";
import type { PriceInfo, ProcessedRow } from "./types.js";

export const getInvalidPriceError = (externalSystemName: string) =>
  `Invalid ${externalSystemName} price format`;

// Matches any number with up to two decimal places
const priceRegex = /^\d*\.?\d?\d?$/;
const priceParser = z.string().regex(priceRegex);

const DEFAULT_PRICE_COLUMN_INDEX = 2;

const idColumnSchema = z.uuid("Product ID is invalid");

const validatePrices = (sanitisedData: (string | null)[], externalSystemNames: string[]) => {
  const priceErrors: string[] = [];
  const priceCells = sanitisedData.slice(DEFAULT_PRICE_COLUMN_INDEX);

  const emptyAccumulator: PriceInfo[] = [];
  const presentAndEmptyPrices = priceCells.reduce((accumulator, value, index) => {
    const priceParseResult = priceParser.nullable().safeParse(value);

    if (!priceParseResult.success) {
      priceErrors.push(getInvalidPriceError(externalSystemNames[index]!));
      return accumulator;
    }

    return [
      ...accumulator,
      {
        valueWithTax: priceParseResult.data,
        externalSystemName: externalSystemNames[index] || null,
      },
    ];
  }, emptyAccumulator);

  const prices = presentAndEmptyPrices;

  return { prices, priceErrors };
};

const validateRow = (sanitisedData: (string | null)[]) => {
  const idCell = sanitisedData[0];

  const idParseResult = idColumnSchema.safeParse(idCell);

  if (!idParseResult.success)
    return {
      type: "INVALID" as const,
      rowErrors: idParseResult.error.issues.map((issue) => issue.message),
    };

  return {
    type: "VALID" as const,
    rowErrors: [],
    itemId: idParseResult.data,
  };
};

export const createInputCsvProcessorTransform = () => {
  let firstRow = true;
  let externalSystemNames: string[] = [];

  return transform((data: string[]): ProcessedRow => {
    if (firstRow) {
      // Extract external system names from the headings row
      externalSystemNames = data.slice(DEFAULT_PRICE_COLUMN_INDEX);

      firstRow = false;
      return { type: "HEADER", rawRow: data };
    }

    const sanitisedData = data.map((value) => value || null);

    const { prices, priceErrors } = validatePrices(sanitisedData, externalSystemNames);

    const rowValidationResult = validateRow(sanitisedData);

    const totalErrors = [...priceErrors, ...rowValidationResult.rowErrors];

    if (rowValidationResult.type === "VALID") {
      const { itemId } = rowValidationResult;

      return {
        type: "VALID",
        rawRow: data,
        itemId,
        prices,
        errors: totalErrors,
      };
    }

    return {
      type: "INVALID",
      rawRow: data,
      errors: totalErrors,
    };
  });
};
