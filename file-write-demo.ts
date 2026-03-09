import { faker } from "@faker-js/faker";
import { createOutputDirectory } from "./src/create-output-directory.js";

createOutputDirectory();

const NUMBER_OF_RECORDS = 20;

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

// Create CSV writer

// Create write stream

// Connect streams

for (let i = 0; i < NUMBER_OF_RECORDS; i++) {
  const productWithPricing = createProductWithPricing();
  // Write to CSV
}
