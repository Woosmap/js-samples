![Test](https://github.com/woosmap/js-samples/workflows/Test/badge.svg)
![Release](https://github.com/woosmap/js-samples/workflows/Release/badge.svg)

# Woosmap JavaScript Samples

This repository contains sample projects demonstrating the usage and capabilities of the [Woosmap Map JS API](https://developers.woosmap.com/products/map-api/get-started/).

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation

1. Clone this repository.
2. Navigate to the project directory.
3. Install the dependencies with `npm install`.

### Building the Project

Run `npm run build` to build all targets and update the `dist/` folder.

Targets built for each sample include:
    - `app` - to run the sample using a bundler (vite). Useful for local development and open on codesandbox/stackblitz.
    - `docs` - for highlighting code in <https://developers.woosmap.com>
    - `ìframe`- optimized and bundled rendered html/js for embedding in developers.woosmap.com
    - `jsfiddle` - to open the sample on jsfiddle.
    - `highlight` - to highlight the code on <https://demo.woosmap.com/js-samples/> using Prism.js

## Testing

1. Run `npm test` to execute tests.
2. Optionally, you can fix lint issues by running `npm run lint` and `npm run format`.

## Running the Samples

Start a server with all samples using `npm start`. You can then access the samples in your web browser.

## Exploring the Samples

All samples can also be explored online at <https://demo.woosmap.com/js-samples/>.

## Additional Resources

- [Woosmap Map JS API Documentation](https://developers.woosmap.com/products/map-api/get-started/)
- [Woosmap Map JS API Reference Documentation](https://developers.woosmap.com/products/map-api/reference/1.4/)
- [Woosmap Map Typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/woosmap.map) - Install with `npm install --save-dev @types/woosmap.map`
