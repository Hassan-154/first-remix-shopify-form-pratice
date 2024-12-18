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
  Listbox,
  Combobox,
  Icon,
  TextContainer,
  LegacyStack,
  AutoSelection,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useMemo } from "react";
import { useActionData, useSubmit } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import variantTitleRadioData from "./utility/variantTitleRadio";
import allProductsOrSomeData from "./utility/allProductsOrSome";

export async function action({ request }) {
  console.log("its working now.. ");
  const formData = await request.formData();

  // const customizedTitle = String(formData.get("customizedTitle"));
  // Redirect to dashboard if validation is successful
  // return redirect("/dashboard");
}

export default function Feed() {
  // to handle all the data related to this component
  const [productFeed, setProductFeed] = useState({
    feedName: "",
    storeCurrencyType: "MNX",
    appendCurrencyOptions: "Do Not append.",
    featuredProductsTags: {},
  });

  //state to handle validations error
  const [validationsError, setValidationsError] = useState({
    feedNameError: "",
  });

  console.log("productFeedData: ", productFeed);

  //to update data in state
  const handleInputChange = useCallback((name, value) => {
    setProductFeed((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const submit = useSubmit();

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
      submit(productFeed, { method: "post", options: "" });
      console.log("action function called successfully.");
    } else {
      console.log("please complete all the requirements to submit the data.");
    }
  }

  const deselectedOptions = useMemo(
    () => [
      { value: "rustic", label: "Rustic" },
      { value: "antique", label: "Antique" },
      { value: "vinyl", label: "Vinyl" },
      { value: "vintage", label: "Vintage" },
      { value: "refurbished", label: "Refurbished" },
    ],
    [],
  );

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  const escapeSpecialRegExCharacters = useCallback(
    (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    [],
  );

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions, escapeSpecialRegExCharacters],
  );

  const updateSelection = useCallback(
    (selected) => {
      if (selectedOptions.includes(selected)) {
        setSelectedOptions(
          selectedOptions.filter((option) => option !== selected),
        );
      } else {
        setSelectedOptions([...selectedOptions, selected]);
      }

      updateText("");
    },
    [selectedOptions, updateText],
  );

  const removeTag = useCallback(
    (tag) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
    },
    [selectedOptions],
  );

  const tagsMarkup = selectedOptions.map((option) => (
    <Tag key={`option-${option}`} onRemove={removeTag(option)}>
      {option}
    </Tag>
  ));

  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
          const { label, value } = option;

          return (
            <Listbox.Option
              key={`${value}`}
              value={value}
              selected={selectedOptions.includes(value)}
              accessibilityLabel={label}
            >
              {label}
            </Listbox.Option>
          );
        })
      : null;

  return (
    <Page
      backAction={{ content: "Products", url: "#" }}
      title="Update Product Feed"
      compactTitle
    >
      <BlockStack gap="500">
        <Card>
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
                    name="appendCurrencyOptions"
                    checked={
                      productFeed.appendCurrencyOptions === productsItems.option
                    }
                    onChange={(_, newValue) =>
                      handleInputChange("appendCurrencyOptions", newValue)
                    }
                  />
                  {/* add here conditional  With multi-select and manual selection */}
  
                </BlockStack>
              ))}
                              <div style={{height: '225px'}}>
      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchIcon} />}
            onChange={updateText}
            label="Search tags"
            labelHidden
            value={inputValue}
            placeholder="Search tags"
            autoComplete="off"
          />
        }
      >
        {optionsMarkup ? (
          <Listbox
            autoSelection={AutoSelection.None}
            onSelect={updateSelection}
          >
            {optionsMarkup}
          </Listbox>
        ) : null}
      </Combobox>
      <TextContainer>
        <LegacyStack>{tagsMarkup}</LegacyStack>
      </TextContainer>
    </div>
            </Box>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text fontWeight="semibold" variant="headingXm" as="h6">
              Custom Labels
            </Text>
            <InlineGrid columns={2} gap="400">
              <Box>
                <BlockStack gap="300">
                  <Select
                    label="Custom Label 0"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                  <Select
                    label="Custom Label 1"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                  <Select
                    label="Custom Label 2"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                </BlockStack>
              </Box>
              <Box>
                <BlockStack gap="300">
                  <Select
                    label="Custom Label 3"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                  <Select
                    label="Custom Label 4"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                </BlockStack>
              </Box>
            </InlineGrid>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text fontWeight="semibold" variant="headingXm" as="h6">
              Custom Numbers
            </Text>
            <InlineGrid columns={2} gap="400">
              <Box>
                <BlockStack gap="300">
                  <Select
                    label="Custom Label 0"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                  <Select
                    label="Custom Label 1"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                  <Select
                    label="Custom Label 2"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                </BlockStack>
              </Box>
              <Box>
                <BlockStack gap="300">
                  <Select
                    label="Custom Label 3"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                  <Select
                    label="Custom Label 4"
                    options={storeCurrencyOptions}
                    onChange={(value) =>
                      handleInputChange("storeCurrencyType", value)
                    }
                    value={productFeed.storeCurrencyType}
                  />
                </BlockStack>
              </Box>
            </InlineGrid>
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h6">
              Featured Products tags on custom labels (Press enter after you
              type tag)
            </Text>
            <TextField
              name="feedName"
              value={productFeed.feedName}
              onChange={(value) => handleInputChange("feedName", value)}
              autoComplete="off"
              placeholder="Enter Featured Products Tags"
              error={
                validationsError.feedNameError.length === 0
                  ? ""
                  : validationsError.feedNameError
              }
            />
            {/* show conditional tags here */}
            {}
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h6">
              Variant Title
            </Text>
            <TextField
              name="feedName"
              value={productFeed.feedName}
              onChange={(value) => handleInputChange("feedName", value)}
              autoComplete="off"
              placeholder="Text to exclude"
              error={
                validationsError.feedNameError.length === 0
                  ? ""
                  : validationsError.feedNameError
              }
            />
            <Text variant="headingSm" as="h6">
              Shipping Label (applies to all products feed)
            </Text>

            <TextField
              name="feedName"
              value={productFeed.feedName}
              onChange={(value) => handleInputChange("feedName", value)}
              autoComplete="off"
              placeholder="Shipping label"
              error={
                validationsError.feedNameError.length === 0
                  ? ""
                  : validationsError.feedNameError
              }
            />
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200">
            <Text variant="headingSm" as="h6">
              Variant Title
            </Text>
            {/* map the radio button content */}
            <Box>
              <Box>
                {variantTitleRadioData.map((variantItems, id) => (
                  <BlockStack key={id}>
                    <RadioButton
                      key={id}
                      label={`${variantItems.option} - ${variantItems.description}`}
                      id={variantItems.option}
                      name="appendCurrencyOptions"
                      checked={
                        productFeed.appendCurrencyOptions ===
                        variantItems.option
                      }
                      onChange={(_, newValue) =>
                        handleInputChange("appendCurrencyOptions", newValue)
                      }
                    />
                  </BlockStack>
                ))}
              </Box>
            </Box>
          </BlockStack>
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
