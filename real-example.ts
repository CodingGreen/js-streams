import { parse, stringify } from "csv";
import { createReadStream, createWriteStream } from "node:fs";
import { createInputCsvProcessorTransform } from "./src/input-csv-processor.js";
import { createResultCsvTransform } from "./src/result-csv-transform.js";
import { createErrorCsvTransform } from "./src/error-csv-transform.js";
import { createOutputDirectory } from "./src/create-output-directory.js";

createOutputDirectory();

const userId = "example_user_id";

const fileStream = createReadStream("./output/products.csv");

const csvParser = parse({ trim: true });

const inputCsvProcessorTransform = createInputCsvProcessorTransform();
const resultCsvTransform = createResultCsvTransform(userId);
const errorCsvTransform = createErrorCsvTransform();

const resultCsvWriter = stringify({ header: true });
const errorCsvWriter = stringify();

const resultCsvOutputStream = createWriteStream("./output/result.csv");
const errorCsvOutputStream = createWriteStream("./output/errors.csv");

fileStream.pipe(csvParser);
csvParser.pipe(inputCsvProcessorTransform);

inputCsvProcessorTransform.pipe(resultCsvTransform);
resultCsvTransform.pipe(resultCsvWriter);
resultCsvWriter.pipe(resultCsvOutputStream);

inputCsvProcessorTransform.pipe(errorCsvTransform);
errorCsvTransform.pipe(errorCsvWriter);
errorCsvWriter.pipe(errorCsvOutputStream);
