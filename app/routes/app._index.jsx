import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Tooltip,
  InlineStack,
  Icon,
  TextField,
  Checkbox,
  DatePicker,
  Box,
  RadioButton,
  Button,
} from "@shopify/polaris";
import {
  AlertCircleIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { useState, useCallback, useEffect } from "react";

import { json, redirect } from "@remix-run/node";

//to submit the form data and also data validations
export async function action({ request }) {
  console.log("its working now.. ");
  const formData = await request.formData();

  const customizedTitle = String(formData.get("customizedTitle"));
  const productTitle = String(formData.get("productTitle"));
  const settingHeading = String(formData.get("settingHeading"));
  const settingDiscount = String(formData.get("settingDiscount"));
  const radioButton = String(formData.get("accounts"));
  const currentStatus = String(formData.get("currentStatus"));
  const startDate = String(formData.get("startDate"));

  const errors = {};

  if (customizedTitle.length > 0) {
    errors.customizedTitle = "title shout not be empty";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  // Redirect to dashboard if validation is successful
  return redirect("/dashboard");
}

export default function Index() {
  const submit = useSubmit();
  //to handle the data from input
  const [formData, setFormData] = useState({
    customizedTitle: "",
    productTitle: "",
    settingHeading: "",
    settingDiscount: "",
    radioButton: "ApplyToAll",
    currentStatus: false,
    startDate: {
      start: new Date("Wed Feb 19 2024 00:00:00 GMT-0500 (EST)"),
      end: new Date("Wed Feb 19 2024 00:00:00 GMT-0500 (EST)"),
    },
    endDate: {
      start: new Date(),
      end: new Date(),
    },
  });

  useEffect(() => {}, []);

  //state to handle validations error
  const [validationsError, setValidationsError] = useState({
    customizedTitleError: "",
    productTitleError: "",
    settingHeadingError: "",
    settingDiscountError: "",
    radioButtonError: "",
    currentStatus: "",
    date: "",
  });

  //to handle the start and date open&close
  const [handleBothCalender, setHandleBothCalender] = useState({
    openStartDate: false,
    openEndDate: false,
  });

  //to update which calender open and close
  const handleOpenCloseCalenders = useCallback((name, value) => {
    console.log("Updating:", name, "to", value);
    setHandleBothCalender((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // to handle the input from user
  const handleInputChange = useCallback((name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  //to handle the calender functionality
  const [{ month, year }, setDate] = useState({ month: 1, year: 2024 });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );

  //to update the dates in state
  const handleDateChange = (startDate) => {
    handleInputChange("startDate", {
      start: startDate.start,
      end: startDate.end,
    });
  };

  const handleEndDateChange = (endDate) => {
    handleInputChange("endDate", {
      start: endDate.start,
      end: endDate.end,
    });
  };

  //to change the date format
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  //handle validations conditions.
  function handleValidationsError() {
    const updatedErrors = {};

    // Validate customizedTitle
    if (formData.customizedTitle.length < 1) {
      updatedErrors.customizedTitleError =
        "Customized title should not be empty.";
    } else {
      updatedErrors.customizedTitleError = "";
    }
    // Validate product title
    if (formData.productTitle.length < 1) {
      updatedErrors.productTitleError = "Product title should not be empty.";
    } else {
      updatedErrors.productTitleError = "";
    }

    // Update the state by merging existing errors with new ones
    setValidationsError((prevState) => ({
      ...prevState,
      ...updatedErrors, // Add new errors without removing previous ones with the help of error object
    }));

    // Return true if there are any error messages
    return Object.values(updatedErrors).some((error) => error !== "");
  }

  function submitFormData() {
    if (!handleValidationsError()) {
      // here we can add the multiple conditions
      submit(formData, { method: "post", options: "just to check" });
      console.log("action function called successfully.");
    }
  }
  return (
    <Page
      title="Custom form"
      backAction={{ content: "Bac" }}>
      <Form method="post">
        <BlockStack gap="500">
          <InlineStack align="space-between">
            <InlineStack gap="100">
              <Icon source={ArrowLeftIcon} tone="base" />
              <Text variant="headingLg" as="h6">
                Donation Block
              </Text>
            </InlineStack>
            <Button onClick={submitFormData} variant="primary" type="submit">
              Create
            </Button>
          </InlineStack>
          <Layout>
            <Layout.Section>
              <BlockStack gap="400">
                <Card>
                  <BlockStack gap="300">
                    <InlineStack gap="150">
                      <Text variant="headingSm" as="h6">
                        Customized Title
                      </Text>
                      {validationsError.customizedTitleError}
                      <Text as="heading5xl" variant="headingMd"></Text>
                      <Tooltip active content="This order has shipping labels.">
                        <Icon source={AlertCircleIcon} tone="gray" />
                      </Tooltip>
                    </InlineStack>
                    <TextField
                      name="customizedTitle"
                      value={formData.customizedTitle}
                      onChange={(value) =>
                        handleInputChange("customizedTitle", value)
                      }
                      autoComplete="off"
                      placeholder="Ex. Hide COD when total cart price is 100$"
                      error={
                        validationsError.customizedTitleError.length === 0
                          ? ""
                          : validationsError.customizedTitleError
                      }
                    />
                    {/* create new card for product title and input */}
                    <Card>
                      <BlockStack gap="200">
                        <TextField
                          label="Product Title"
                          value={formData.productTitle}
                          onChange={(value) =>
                            handleInputChange("productTitle", value)
                          }
                          error={
                            validationsError.productTitleError.length === 0
                              ? ""
                              : validationsError.productTitleError
                          }
                          autoComplete="off"
                          placeholder="Enter Title"
                        />
                        <Text variant="headingXs" as="h6">
                          This title will display on checkout
                        </Text>
                      </BlockStack>
                    </Card>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="300">
                    <Text variant="headingSm" as="h6">
                      Donation Books Settings
                    </Text>
                    <Card>
                      <InlineStack gap="150">
                        <InlineStack gap="200">
                          <TextField
                            name="settingHeading"
                            value={formData.settingHeading}
                            onChange={(value) =>
                              handleInputChange("settingHeading", value)
                            }
                            error={""}
                            autoComplete="off"
                            placeholder="Enter Heading"
                          />
                          <TextField
                            name="settingDiscount"
                            value={formData.settingDiscount}
                            onChange={(value) =>
                              handleInputChange("settingDiscount", value)
                            }
                            error=""
                            autoComplete="off"
                            placeholder="Donation Block Text For Discount"
                          />
                        </InlineStack>
                      </InlineStack>
                    </Card>
                  </BlockStack>
                </Card>
                <Card>
                  <InlineStack gap="600">
                    <Box>
                      <RadioButton
                        label="Apply to all checkouts"
                        checked={formData.radioButton === "ApplyToAll"}
                        id="ApplyToAll"
                        name="accounts"
                        onChange={(_, newValue) =>
                          handleInputChange("radioButton", newValue)
                        }
                      />
                    </Box>
                    <Box>
                      <RadioButton
                        label="Apply only when rule pass"
                        id="ApplyOnlyRules"
                        name="accounts"
                        checked={formData.radioButton === "ApplyOnlyRules"}
                        onChange={(_, newValue) =>
                          handleInputChange("radioButton", newValue)
                        }
                      />
                    </Box>
                  </InlineStack>
                </Card>
              </BlockStack>
            </Layout.Section>
            <Layout.Section variant="oneThird">
              <BlockStack gap="500">
                <Card>
                  <BlockStack gap="400">
                    <Text variant="bodyMd" as="p">
                      This Donation Block Status is currently enabled.
                    </Text>
                    <Box>
                      <Button tone="critical" disabled>
                        Disable
                      </Button>
                    </Box>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="300">
                    <InlineStack gap="200">
                      <div>
                        <Icon source={CalendarIcon} tone="base" />
                      </div>
                      <Text variant="headingSm" as="h6">
                        Donation Books Settings
                      </Text>
                    </InlineStack>
                    <Checkbox
                      name="productTitle"
                      label="Set Start Date"
                      checked={handleBothCalender.openStartDate}
                      onChange={(newChecked) =>
                        handleOpenCloseCalenders("openStartDate", newChecked)
                      }
                    />
                    {handleBothCalender.openStartDate && (
                      <>
                        <DatePicker
                          name="startDate"
                          month={month}
                          year={year}
                          onChange={handleDateChange}
                          onMonthChange={handleMonthChange}
                          selected={formData.startDate}
                        />
                        <Box
                          style={{
                            width: "100%",
                            padding: "4px",
                            paddingLeft: "8px",
                            borderRadius: "12px",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          <Text variant="bodyXs" as="p">
                            {formatDateTime(
                              formData.startDate.start.toLocaleDateString(),
                            )}
                          </Text>
                        </Box>
                      </>
                    )}
                    <Checkbox
                      label="Set End Date"
                      checked={handleBothCalender.openEndDate}
                      onChange={(newChecked) =>
                        handleOpenCloseCalenders("openEndDate", newChecked)
                      }
                    />
                    {handleBothCalender.openEndDate && (
                      <>
                        <DatePicker
                          month={month}
                          year={year}
                          onChange={handleEndDateChange}
                          onMonthChange={handleMonthChange}
                          selected={formData.endDate}
                          disableDatesBefore={formData.startDate.start}
                        />
                        <Box
                          style={{
                            width: "100%",
                            padding: "4px",
                            paddingLeft: "8px",
                            borderRadius: "12px",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          <Text variant="bodyXs" as="p">
                            {formatDateTime(
                              formData.endDate.start.toLocaleDateString(),
                            )}
                          </Text>
                        </Box>
                      </>
                    )}
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="200"></BlockStack>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout>
        </BlockStack>
      </Form>
    </Page>
  );
}
