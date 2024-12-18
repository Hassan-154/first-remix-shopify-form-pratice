// variantTitleRadio.js
const variantTitleRadio = [
  {
    id: 1,
    option: "Do NOT append (default)",
    description: "All t-shirts would be exported as 't-shirt'.",
  },
  {
    id: 2,
    option: "Append variant's title",
    description:
      "T-shirt title would be exported as 't-shirt [variant title from Shopify admin]'.",
  },
  {
    id: 3,
    option: "Prepend variant's title",
    description:
      "T-shirt title would be exported as '[variant title from Shopify admin] t-shirt'.",
  },
  {
    id: 4,
    option: "Append options",
    description:
      "T-shirt title would be exported as 't-shirt red S' and 't-shirt white M'.",
  },
  {
    id: 5,
    option: "Append variant's SKU",
    description: "T-shirt title would be exported as 't-shirt SKU-CODE'.",
  },
  {
    id: 6,
    option: "Append custom text",
    description:
      "T-shirt title would be exported as 't-shirt (your custom text)'.",
    customTextInput: "Enter below",
  },
];

export default variantTitleRadio;
