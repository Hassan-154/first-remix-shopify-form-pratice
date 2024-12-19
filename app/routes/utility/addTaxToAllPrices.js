// allProductsOrSome.js
const addTaxToAllPrices = [
  {
    id: 1,
    option: "Use Global Settings (default)",
  },
  {
    id: 2,
    option: "Do NOT add tax prices",
  },
  {
    id: 3,
    option: "Do add tax to prices - set tax rate below",
    inputTypes: [
      {
        id: 1,
        title:
          "Tax rate percentage (example: if the tax rate ois 20%, enter 22)",
          para: "TaxRatePercentage"
      },
      {
        id: 2,
        title:
          "Round & format prices to this number of decimal places (default 2)",
          para: "roundAndFormat"
      },
    ],
  },
];

export default addTaxToAllPrices;
