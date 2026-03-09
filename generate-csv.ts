import { createWriteStream } from "node:fs";
import { faker } from "@faker-js/faker";
import { stringify } from "csv";
import { createOutputDirectory } from "./src/create-output-directory.js";

createOutputDirectory();

const NUMBER_OF_RECORDS = 200000;

const createProductWithPricing = () => ({
  productId: faker.string.uuid(),
  productName: faker.food.dish(),
  defaultPrice: faker.commerce.price({ max: 20 }),
  deliverooPrice: faker.commerce.price({ max: 25 }),
});

const columnsConfig = [
  { key: "productId", header: "Product ID" },
  { key: "productName", header: "Product Name" },
  { key: "defaultPrice", header: "Default Price" },
  { key: "deliverooPrice", header: "Deliveroo Price" },
];

const csvWriter = stringify({
  header: true,
  columns: columnsConfig,
});

const writeFileStream = createWriteStream("./output/products.csv");

csvWriter.pipe(writeFileStream);

for (let i = 0; i < NUMBER_OF_RECORDS; i++) {
  if (i % 100000 === 0) {
    console.log(`Generated ${i} records`);
  }

  const productWithPricing = createProductWithPricing();
  const shouldContinue = csvWriter.write(productWithPricing);

  if (!shouldContinue) {
    await new Promise<void>((resolve) => csvWriter.once("drain", resolve));
  }
}
