# JS Streams

Some simple examples of using Node.js streams.

## Requirements

- Node v24
- npm

## Getting started

- Install dependencies using `npm install`

## Examples

1. `simple-example.ts` - This is a very basic example that reads for a file and pipes the output to standard out.
2. `generate-csv.ts` - A more realistic example that generates product objects and writes them to a CSV. Also gives an example of handling back pressure.
3. `real-example.ts` - A stripped down version of some real code I wrote recently. I've taken error handling ect. out to demonstrate the core pipes and transforms.

## Running the examples

Simply use tsx to run the examples using the following command:

```sh
npx tsx <file-path>
```
