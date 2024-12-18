// allProductsOrSome.js
const allProductsOrSome = [
  {
    id: 1,
    option: "All Products",
  },
  {
    id: 2,
    option: "Exclude Collections",
    collections: [
      {
        title: "Title 1",
        checked: false,
      },
      {
        title: "Title 2",
        checked: false,
      },
      {
        title: "Title 3",
        checked: false,
      },
    ],
  },
  {
    id: 3,
    option: "Products from selected collection",
    collections: [
      {
        title: "Title 1",
        checked: false,
      },
      {
        title: "Title 2",
        checked: false,
      },
      {
        title: "Title 3",
        checked: false,
      },
    ],
  },
];

export default allProductsOrSome;
