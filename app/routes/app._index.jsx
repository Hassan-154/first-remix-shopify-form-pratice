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
import { useState, useCallback } from "react";

export default function Index() {
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

  //console state data
  console.log("formData: ", formData);

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

  return (
    <Page>
      {/* <TitleBar title="Donation Block">
        <button variant="primary">Create</button>
      </TitleBar> */}
      <BlockStack gap="500">
        <InlineStack align="space-between">
          <InlineStack gap="100">
            <Icon source={ArrowLeftIcon} tone="base" />
            <Text variant="headingLg" as="h6">
              Donation Block
            </Text>
          </InlineStack>
          <Button variant="primary">Create</Button>
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
                    <Text as="heading5xl" variant="headingMd"></Text>
                    <Tooltip active content="This order has shipping labels.">
                      <Icon source={AlertCircleIcon} tone="gray" />
                    </Tooltip>
                  </InlineStack>
                  <TextField
                    value={formData.customizedTitle}
                    onChange={(value) =>
                      handleInputChange("customizedTitle", value)
                    }
                    autoComplete="off"
                    placeholder="Ex. Hide COD when total cart price is 100$"
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
                        error=""
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
                          value={formData.settingHeading}
                          onChange={(value) =>
                            handleInputChange("settingHeading", value)
                          }
                          error=""
                          autoComplete="off"
                          placeholder="Enter Heading"
                        />
                        <TextField
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
                    label="Set Start Date"
                    checked={handleBothCalender.openStartDate}
                    onChange={(newChecked) =>
                      handleOpenCloseCalenders("openStartDate", newChecked)
                    }
                  />
                  {handleBothCalender.openStartDate && (
                    <>
                      <DatePicker
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
    </Page>
  );
}
