import { parse, transform } from "csv";
import { createReadStream } from "node:fs";

const readStream = createReadStream("./data/example.csv");

const parser = parse({ columns: true });

const transformer = transform((record) => JSON.stringify(record) + "\n");

readStream.pipe(parser).pipe(transformer).pipe(process.stdout);
