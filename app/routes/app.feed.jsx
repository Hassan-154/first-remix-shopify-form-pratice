import {
  Page,
  BlockStack,
  Card,
  TextField,
  Box,
  Text,
  RadioButton,
  Select,
  Button,
  InlineGrid,
  Tag,
  LegacyStack,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import variantTitleRadioData from "./utility/variantTitleRadio";
import allProductsOrSomeData from "./utility/allProductsOrSome";
import { customLabelSelect } from "./utility/customLabels";
import addTaxToAllPricesData from "./utility/addTaxToAllPrices";
import useCompareAtPriceData from "./utility/useCompareAtPrice";
import exportModeData from "./utility/exportMode";

export default function Feed() {
  // to handle all the data related to this component
  const [productFeed, setProductFeed] = useState({
    feedName: "",
    storeCurrencyType: "MNX",
    appendCurrencyOptions: "Do Not append.",
    allProductsOrSome: {
      option: "All Products",
    },
    featuredCustomLabels: {
      option: "",
    },
    featuredProductsTags: ["tag1", "tag2"],
    variantTitleOption: "Do NOT append (default)",
    useCompareAtPriceOption: "Use both",
    variantTitleCustomOption: "",
    exportModeOption: "Export all variants of a product",
    exportOnlyModeType: "Export first variant of a product(default)",
    customLabels: {
      customLabel0: "",
      customLabel1: "",
      customLabel2: "",
      customLabel3: "",
      customLabel4: "",
    },
    customNumbers: {
      customNumber0: "",
      customNumber1: "",
      customNumber2: "",
      customNumber3: "",
      customNumber4: "",
    },
    excludeOptionsSize: "",
    shippingLabel: "",
    addTaxToAllPrices: "Use Global Settings (default)",
    TaxRatePercentage: "",
    roundAndFormat: "",
  });

  //state to handle validations error
  const [validationsError, setValidationsError] = useState({
    feedNameError: "",
  });

  // to take input of tags from user
  const [takeTagsInput, setTakeTagsInput] = useState();

  console.log("productFeedData: ", productFeed);

  //to update data in first level state
  const handleInputChange = useCallback((name, value) => {
    setProductFeed((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  //to update data related to product collection
  const handleInputCollection = useCallback(
    (dataFromJSon, category, optionName) => {
      if (category === "remove") {
        console.log("now remove can work.", dataFromJSon);

        setProductFeed((prev) => ({
          ...prev,
          [optionName]: {
            ...prev[optionName],
            productsCollections:
              prev[optionName].productsCollections.filter(
                (product) => product.id !== dataFromJSon,
              ),
          },
        }));
      } else {
        setProductFeed((prev) => {
          const { productsCollections, ...rest } = prev[category];
          return {
            ...prev,
            [category]: {
              ...rest,
              option: optionName,
            },
          };
        });

        const found = dataFromJSon.find((item) => item.option === optionName);

        if (found && "collection" in found) {
          selectProductsFromResources(category);
        }
      }
    },
    [],
  );

  //to handle store currency multiSelect option
  const storeCurrencyOptions = [
    { label: "MNX", value: "MNX" },
    { label: "PKR", value: "PKR" },
  ];

  //handle validations conditions.
  function handleValidationsError() {
    const updatedErrors = {};

    // Validate customizedTitle
    if (productFeed.feedName.length < 1) {
      updatedErrors.feedNameError = "Name is required.";
    } else {
      updatedErrors.feedNameError = "";
    }

    setValidationsError((prevState) => ({
      ...prevState,
      ...updatedErrors,
    }));

    return Object.values(updatedErrors).some((error) => error !== "");
  }

  // to handle the data submission
  function submitFormData() {
    if (!handleValidationsError()) {
      // here we can add the multiple conditions
      // submit({productFeed}, { method: "post", options: "" });
      console.log("action function called successfully.");
    } else {
      console.log("please complete all the requirements to submit the data.");
    }
  }

  // to remove the tags
  const removeTag = useCallback((tag) => {
    setProductFeed((prev) => ({
      ...prev,
      featuredProductsTags: prev.featuredProductsTags.filter(
        (currentTag) => currentTag !== tag,
      ),
    }));
  }, []);

  // to handle labels and names
  const handleNumberAndLabel = useCallback((type, innerType, index, value) => {
    console.log(
      "type",
      type,
      "innerType",
      innerType,
      "index",
      index,
      "value",
      value,
    );

    setProductFeed((prevFeed) => ({
      ...prevFeed,
      [type]: {
        ...prevFeed[type],
        [`${innerType}${index}`]: value,
      },
    }));
  }, []);

  // to handle the resource picker
  async function selectProductsFromResources(category) {
    try {
      console.log("resource-picker function called.");
      const products = await window.shopify.resourcePicker({
        type: "collection",
        multiple: true,
      });
      setProductFeed((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          productsCollections: products,
        },
      }));
      console.log(products);
    } catch (error) {
      console.error("Error selecting products:", error);
    }
  }

  return (
    <Page
      backAction={{ content: "Products", url: "#" }}
      title="Update Product Feed"
      compactTitle
    >
      <BlockStack gap="500">
        <Card>
          <Button>click to check resource-picker</Button>
          <BlockStack gap="500">
            <TextField
              label="Feed Name"
              name="feedName"
              value={productFeed.feedName}
              onChange={(value) => handleInputChange("feedName", value)}
              autoComplete="off"
              placeholder="Product Feed Name"
              error={
                validationsError.feedNameError.length === 0
                  ? ""
                  : validationsError.feedNameError
              }
            />
            <Select
              label="Store Currency"
              options={storeCurrencyOptions}
              onChange={(value) =>
                handleInputChange("storeCurrencyType", value)
              }
              value={productFeed.storeCurrencyType}
            />
            <Box>
              <BlockStack gap="100">
                <Text variant="headingSm" as="h6">
                  Append Currency parameter to product URL
                </Text>
                <RadioButton
                  label="Do Not append. (default, example: my-store.com/products/my-product)"
                  id="Do Not append."
                  name="appendCurrencyOptions"
                  checked={
                    productFeed.appendCurrencyOptions === "Do Not append."
                  }
                  onChange={(_, newValue) =>
                    handleInputChange("appendCurrencyOptions", newValue)
                  }
                />
                <RadioButton
                  label="Do append. (example: my-store.com/products/my-product?currency=USD)"
                  id="Do append."
                  name="appendCurrencyOptions"
                  checked={productFeed.appendCurrencyOptions === "Do append."}
                  onChange={(_, newValue) =>
                    handleInputChange("appendCurrencyOptions", newValue)
                  }
                />
              </BlockStack>
            </Box>
          </BlockStack>
        </Card>
        <Card>
          {/* all products or some of them */}
          <BlockStack gap="150">
            <Text variant="headingSm" as="h6">
              All Products or some of them?
            </Text>
            <Box>
              {allProductsOrSomeData.map((productsItems, id) => (
                <BlockStack key={id}>
                  <RadioButton
                    key={id}
                    label={productsItems.option}
                    id={productsItems.option}
                    name=""
                    checked={
                      productFeed.allProductsOrSome.option ===
                      productsItems.option
                    }
                    onChange={(_, optionName) =>
                      handleInputCollection(
                        allProductsOrSomeData,
                        "allProductsOrSome",
                        optionName,
                      )
                    }
                  />
                </BlockStack>
              ))}
            </Box>
            <Box>
              {productFeed.allProductsOrSome.productsCollections && (
                <LegacyStack spacing="tight">
                  {productFeed.allProductsOrSome.productsCollections.map(
                    (option, index) => (
                      <Tag
                        key={index}
                        onRemove={() =>
                          handleInputCollection(option.id, "remove", "allProductsOrSome")
                        }
                      >
                        {option.title}
                      </Tag>
                    ),
                  )}
                </LegacyStack>
              )}
            </Box>
          </BlockStack>
        </Card>
        <Card>
          {/* Export Mode under development */}
          <InlineGrid columns={2}>
            <BlockStack gap="150">
              <Text variant="headingSm" as="h6">
                Export Mode
              </Text>
              {exportModeData.map((productsItems, id) => (
                <BlockStack key={id}>
                  <RadioButton
                    key={id}
                    label={productsItems.option}
                    id={productsItems.option}
                    name=""
                    checked={
                      productFeed.exportModeOption === productsItems.option
                    }
                    onChange={(_, newValue) =>
                      handleInputChange("exportModeOption", newValue)
                    }
                  />
                </BlockStack>
              ))}
            </BlockStack>

            {productFeed.exportModeOption ===
              "Export only one variant of a product" && (
              <BlockStack gap="150">
                <Text variant="headingSm" as="h6">
                  Export Mode
                </Text>

                <BlockStack gap="150">
                  {exportModeData[1].exportMode?.map((productsItems, id) => (
                    <BlockStack key={id}>
                      <RadioButton
                        label={productsItems.option}
                        id={productsItems.option}
                        name=""
                        checked={
                          productFeed.exportOnlyModeType ===
                          productsItems.option
                        }
                        onChange={(_, newValue) =>
                          handleInputChange("exportOnlyModeType", newValue)
                        }
                      />
                    </BlockStack>
                  ))}
                </BlockStack>
              </BlockStack>
            )}
          </InlineGrid>
        </Card>
        <Card>
          {/* Use 'Compare at' price */}
          <BlockStack gap="150">
            <Text variant="headingSm" as="h6">
              Use 'Compare at' price
            </Text>
            <Box>
              {useCompareAtPriceData.map((productsItems, id) => (
                <BlockStack key={id}>
                  <RadioButton
                    key={id}
                    label={`${productsItems.option} ${productsItems.description}`}
                    id={productsItems.option}
                    name=""
                    checked={
                      productFeed.useCompareAtPriceOption ===
                      productsItems.option
                    }
                    onChange={(_, newValue) =>
                      handleInputChange("useCompareAtPriceOption", newValue)
                    }
                  />
                </BlockStack>
              ))}
            </Box>
            {/* add search-bar and checkBox */}
            <Box></Box>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text fontWeight="semibold" variant="headingXm" as="h6">
              Custom Labels
            </Text>
            <InlineGrid columns={2} gap="400">
              {Array.from({ length: 5 }, (_, index) => index).map((index) => (
                <Select
                  key={index}
                  label={`Custom Label ${index}`}
                  options={customLabelSelect}
                  placeholder={`Custom Label ${index}`}
                  onChange={(value) =>
                    handleNumberAndLabel(
                      "customLabels",
                      "customLabel",
                      index,
                      value,
                    )
                  }
                  value={productFeed.customLabels[`customLabel${index}`]}
                />
              ))}
            </InlineGrid>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text fontWeight="semibold" variant="headingXm" as="h6">
              Custom Numbers
            </Text>
            <InlineGrid columns={2} gap="400">
              {Array.from({ length: 5 }, (_, index) => index).map((index) => (
                <Select
                  key={index}
                  label={`Custom Numbers ${index}`}
                  options={customLabelSelect}
                  placeholder={`Custom Numbers ${index}`}
                  value={productFeed.customNumbers[`customNumber${index}`]}
                />
              ))}
            </InlineGrid>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h6">
              Featured collection on custom labels
            </Text>

            <div
              onClick={() =>
                selectProductsFromResources("featuredCustomLabels")
              }
            >
              <TextField
                name="feedName"
                value={takeTagsInput}
                onChange={(value) => setTakeTagsInput(value)}
                autoComplete="off"
                placeholder="Search Collection"
              />
            </div>

            {/* show conditional tags here */}
            <Box>
              {productFeed.featuredCustomLabels.productsCollections && (
                <LegacyStack spacing="tight">
                  {productFeed.featuredCustomLabels.productsCollections.map(
                    (option, index) => (
                      <Tag
                        key={index}
                        onRemove={() =>
                          handleInputCollection(option.id, "remove", "featuredCustomLabels" )
                        }
                      >
                        {option.title}
                      </Tag>
                    ),
                  )}
                </LegacyStack>
              )}
            </Box>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h6">
              Featured Products tags on custom labels (Press enter after you
              type tag)
            </Text>
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  console.log("new tag added.");
                  //push the new tag into state
                  if (takeTagsInput) {
                    setProductFeed((prev) => ({
                      ...prev,
                      featuredProductsTags: [
                        ...prev.featuredProductsTags,
                        takeTagsInput,
                      ],
                    }));
                    setTakeTagsInput("");
                  }
                }
              }}
            >
              <TextField
                name="feedName"
                value={takeTagsInput}
                onChange={(value) => setTakeTagsInput(value)}
                autoComplete="off"
                placeholder="Enter Featured Products Tags"

                // error={
                //   validationsError.feedNameError.length === 0
                //     ? ""
                //     : validationsError.feedNameError
                // }
              />
            </div>
            {/* show conditional tags here */}
            <LegacyStack spacing="tight">
              {productFeed.featuredProductsTags.map((option, index) => (
                <Tag key={index} onRemove={() => removeTag(option)}>
                  {option}
                </Tag>
              ))}
            </LegacyStack>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h6">
              Variant Title
            </Text>
            {/* map the radio button content */}
            <Box>
              {variantTitleRadioData.map((variantItems, id) => (
                <BlockStack key={id}>
                  <RadioButton
                    key={id}
                    label={`${variantItems.option} - ${variantItems.description}`}
                    id={variantItems.option}
                    name="variantTitleOption"
                    checked={
                      productFeed.variantTitleOption === variantItems.option
                    }
                    onChange={(_, newValue) =>
                      handleInputChange("variantTitleOption", newValue)
                    }
                  />
                  {variantItems.option === "Append custom text" &&
                    productFeed.variantTitleOption === "Append custom text" && (
                      <InlineGrid columns={2}>
                        <TextField
                          label="Custom text to append"
                          name="customTextForAppend"
                          value={productFeed.variantTitleCustomOption}
                          onChange={(value) =>
                            handleInputChange("variantTitleCustomOption", value)
                          }
                          autoComplete="off"
                          placeholder="Custom text "
                        />
                      </InlineGrid>
                    )}
                </BlockStack>
              ))}
            </Box>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h6">
              Exclude options ( such as size) from the generated variant titles
              ( above).
            </Text>
            <TextField
              name=""
              value={productFeed.excludeOptionsSize}
              onChange={(value) =>
                handleInputChange("excludeOptionsSize", value)
              }
              autoComplete="off"
              placeholder="Text to exclude"
              // error={
              //   validationsError.feedNameError.length === 0
              //     ? ""
              //     : validationsError.feedNameError
              // }
            />
            <Text variant="headingSm" as="h6">
              Shipping Label (applies to all products feed)
            </Text>

            <TextField
              name="shippingLabel"
              value={productFeed.shippingLabel}
              onChange={(value) => handleInputChange("shippingLabel", value)}
              autoComplete="off"
              placeholder="Shipping label"
              // error={
              //   validationsError.feedNameError.length === 0
              //     ? ""
              //     : validationsError.feedNameError
              // }
            />
          </BlockStack>
        </Card>
        <Card>
          {/* all products or some of them */}
          <BlockStack gap="150">
            <Text variant="headingSm" as="h6">
              Add tax to all prices - override global Settings
            </Text>
            <Box>
              {addTaxToAllPricesData.map((productsItems, id) => (
                <BlockStack key={id}>
                  <RadioButton
                    label={productsItems.option}
                    id={productsItems.option}
                    name=""
                    checked={
                      productFeed.addTaxToAllPrices === productsItems.option
                    }
                    onChange={(_, newValue) =>
                      handleInputChange("addTaxToAllPrices", newValue)
                    }
                  />
                  {productsItems.inputTypes &&
                    productFeed.addTaxToAllPrices ===
                      "Do add tax to prices - set tax rate below" && (
                      <InlineGrid columns={2} gap={400}>
                        {productsItems.inputTypes.map((typeList, id) => (
                          <InlineGrid key={id}>
                            <Text variant="headingSm" as="h6">
                              {typeList.title}
                            </Text>
                            <TextField
                              type="number"
                              name=""
                              value={productFeed[typeList.para]}
                              onChange={(value) =>
                                handleInputChange(typeList.para, value)
                              }
                              autoComplete="off"
                              placeholder=""
                            />
                          </InlineGrid>
                        ))}
                      </InlineGrid>
                    )}
                </BlockStack>
              ))}
            </Box>

            {/* add search-bar and checkBox */}
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200"></BlockStack>
        </Card>
        <Box>
          <Button onClick={submitFormData} variant="primary">
            Save them
          </Button>
        </Box>
      </BlockStack>
    </Page>
  );
}
