import { existsSync, mkdirSync } from "node:fs";

const outputFolder = "output";

export const createOutputDirectory = () => {
  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder);
  }
};
