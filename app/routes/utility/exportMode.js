const exportMode = [
  {
    id: 1,
    option: "Export all variants of a product",
  },
  {
    id: 2,
    option: "Export only one variant of a product",
    exportMode: [
      {
        id: 1,
        option: "Export first variant of a product(default)",
      },
      {
        id: 2,
        option: "Export only one variant of product",
      },
    ],
  },
];

export default exportMode;
