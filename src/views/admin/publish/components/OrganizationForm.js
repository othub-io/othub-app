import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { format, isValidPhoneNumber } from "libphonenumber-js";
import { AccountContext } from "../../../../AccountContext";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

const orgOptions = [
  { value: "Organization", label: "Organization" },
  { value: "Airline", label: "Airline" },
  { value: "Consortium", label: "Consortium" },
  { value: "Corporation", label: "Corporation" },
  { value: "EducationalOrganization", label: "EducationalOrganization" },
  { value: "FundingScheme", label: "FundingScheme" },
  { value: "GovernmentOrganization", label: "GovernmentOrganization" },
  { value: "LibrarySystem", label: "LibrarySystem" },
  { value: "MedicalOrganization", label: "MedicalOrganization" },
  { value: "NGO", label: "NGO" },
  { value: "NewsMediaOrganization", label: "NewsMediaOrganization" },
  { value: "PerformingGroup", label: "PerformingGroup" },
  { value: "Project", label: "Project" },
  { value: "SportsOrganization", label: "SportsOrganization" },
  { value: "WorkersUnion", label: "WorkersUnion" },
];

const contactOptions = [
  { value: "Customer Service", label: "Customer Service" },
  { value: "Technical Support", label: "Technical Support" },
  { value: "Billing Support", label: "Billing Support" },
  { value: "Bill Payment", label: "Bill Payment" },
  { value: "Sales", label: "Sales" },
  { value: "Reservations", label: "Reservations" },
  { value: "Credit Card Support", label: "Credit Card Support" },
  { value: "Emergency", label: "Emergency" },
  { value: "Baggage Tracking", label: "Baggage Tracking" },
  { value: "Roadside Assistance", label: "Roadside Assistance" },
  { value: "Package Tracking", label: "Package Tracking" },
];

const isUrlValid = (url) => {
  // Simple URL validation, you can use a more sophisticated library if needed
  const urlPattern = /^https?:\/\/\S+$/;
  return urlPattern.test(url);
};

const Organization = ({ displayContent, openPopUp, form_error }) => {
  const [nameError, setNameError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [logoError, setLogoError] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [telephoneError, setTelephoneError] = useState(null);
  const [sameAsError, setSameAsError] = useState(null);
  const [ualError, setUalError] = useState(null);
  const { organizationFormData, setOrganizationFormData } =
    useContext(AccountContext);

  useEffect(() => {
    const filteredFormData = Object.entries(organizationFormData)
      .filter(
        ([key, value]) => key !== "logo" || (key === "logo" && value !== "")
      )
      .filter(
        ([key, value]) => key !== "url" || (key === "url" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "alternativeName" ||
          (key === "alternativeName" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "description" || (key === "description" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "sameAs" || (key === "sameAs" && value.length > 0)
      )
      .filter(
        ([key, value]) =>
          key !== "isPartOf" || (key === "isPartOf" && value.length > 0)
      )
      .filter(
        ([key, value]) =>
          key !== "contactPoint" || (key === "contactPoint" && value.length > 0)
      )
      .reduce((acc, [key, value]) => {
        if (key === "contactPoint" && value.length > 0) {
          acc[key] = value
            .filter((contact) => contact !== "") // Remove empty reviews
            .map((contact) => {
              if (contact.telephone) {
                if (!isValidPhoneNumber(contact.telephone)) {
                  setTelephoneError(
                    `Invalid telephone number for a ${key} field.`
                  );
                  form_error(true);
                } else {
                  setTelephoneError();
                  form_error(false);
                }
              } else {
                setTelephoneError();
                form_error(false);
              }
            });
          acc[key] = value;
        } else {
          acc[key] = value;
        }

        if (key === "@type" && value === "") {
          setTypeError(`Type Required.`);
          form_error(true);
        } else if (key === "@type" && value) {
          setTypeError();
          form_error(false);
        }

        if (key === "name" && value === "") {
          setNameError(`Name Required.`);
          form_error(true);
        } else if (key === "name" && value) {
          setNameError();
          form_error(false);
        }

        if (
          key === "logo" &&
          !(isUrlValid(value) && value.startsWith("https://")) &&
          value !== ""
        ) {
          setLogoError(`Invalid URL for ${key} field. Must use https.`);
          form_error(true);
        }

        if (
          !acc.hasOwnProperty("logo") ||
          (key === "logo" &&
            isUrlValid(value) &&
            value.startsWith("https://")) ||
          value === "" ||
          !value
        ) {
          setLogoError();
          form_error(false);
        }

        if (
          key === "url" &&
          !(isUrlValid(value) && value.startsWith("https://")) &&
          value !== ""
        ) {
          setImageError(`Invalid URL for ${key} field. Must use https.`);
          form_error(true);
        }

        if (
          !acc.hasOwnProperty("url") ||
          (key === "url" &&
            isUrlValid(value) &&
            value.startsWith("https://")) ||
          value === "" ||
          !value
        ) {
          setImageError();
          form_error(false);
        }

        if (key === "isPartOf" && value.length > 0) {
          let validUal = Object.values(value).every((field) => {
            if (field !== "") {
              const segments = field.split(":");
              const argsString = JSON.stringify(
                segments.length === 3 ? segments[2] : segments[2] + segments[3]
              );
              const args = argsString.split("/");

              return args.length !== 3 ? false : true;
            } else {
              return false;
            }
          });

          if (!validUal) {
            setUalError(`Invalid UAL for a ${key} field.`);
            form_error(true);
          } else {
            setUalError();
            form_error(false);
          }
        } else {
          setUalError();
          form_error(false);
        }

        if (key === "sameAs" && value.length > 0) {
          let validUrl = Object.values(value).every(
            (field) => isUrlValid(field) && field.startsWith("https://")
          );

          if (!validUrl) {
            setSameAsError(`Invalid URL for a ${key} field. Must use https.`);
            form_error(true);
          } else {
            setSameAsError();
            form_error(false);
          }
        } else {
          setSameAsError();
          form_error(false);
        }

        return acc;
      }, {});

    displayContent(JSON.stringify(filteredFormData));
  }, [organizationFormData, displayContent]);

  const handleFormInput = (name, value) => {
    if (name === "contactPoint") {
      if (value.length >= 0) {
        const updatedContactPoint = value.map((selectedValue) => {
          return selectedValue;
        });

        setOrganizationFormData((prevFormData) => ({
          ...prevFormData,
          contactPoint: updatedContactPoint,
        }));
      }
    } else {
      setOrganizationFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const PopUp = () => {
    openPopUp(organizationFormData);
  };

  const addContact = (e) => {
    e.preventDefault();
    setOrganizationFormData((prevFormData) => {
      const updatedContact = [
        ...prevFormData.contactPoint,
        {
          "@type": "ContactPoint",
          telephone: "",
          contactType: "",
        },
      ];

      return {
        ...prevFormData,
        contactPoint: updatedContact,
      };
    });
  };

  const addUAL = (e) => {
    e.preventDefault();
    setOrganizationFormData((prevFormData) => ({
      ...prevFormData,
      isPartOf: [...prevFormData.isPartOf, ""],
    }));
  };

  const addProfile = (e) => {
    e.preventDefault();
    setOrganizationFormData((prevFormData) => ({
      ...prevFormData,
      sameAs: [...prevFormData.sameAs, ""],
    }));
  };

  return (
    organizationFormData && (
      <Box
        as="form"
        p={4}
        boxShadow="md"
        borderRadius="md"
        bg="white"
        overflow="auto"
      >
        {Object.keys(organizationFormData).map((fieldName) => {
          const label =
            fieldName !== "@context" && fieldName !== "@type" ? fieldName : "";
          const fieldValue = organizationFormData[fieldName];

          if (fieldName !== "@context") {
            return (
              <FormControl key={fieldName} mb={4}>
                <FormLabel>
                  {label === "name"
                    ? "Organization Name:"
                    : label === "alternativeName"
                    ? "Alternate Name:"
                    : label === "url"
                    ? "URL:"
                    : label === "logo"
                    ? "Logo:"
                    : label === "description"
                    ? "Description:"
                    : label === "isPartOf"
                    ? "Related UALs:"
                    : label === "sameAs"
                    ? "Social Profiles:"
                    : label === "contactPoint"
                    ? "Point of Contact:"
                    : label}
                </FormLabel>
                {fieldName === "@type" ? (
                  <Stack spacing={2}>
                    <Flex justify="flex-start">
                      <FormLabel>Specific Type:</FormLabel>
                      <Select
                        name={fieldName}
                        value={orgOptions.find(
                          (option) => option.value === fieldValue
                        )}
                        onChange={(selectedOption) => {
                          const selectedValue = selectedOption
                            ? selectedOption.value
                            : "none";
                          handleFormInput(fieldName, selectedValue);
                        }}
                        options={orgOptions}
                      />
                    </Flex>
                  </Stack>
                ) : fieldName === "contactPoint" ? (
                  <Stack spacing={2}>
                    <Flex justify="flex-start">
                      {fieldValue.length < 10 && (
                        <IconButton
                          icon={<AddIcon />}
                          onClick={addContact}
                          aria-label="Add Contact"
                        />
                      )}
                    </Flex>
                    <Stack spacing={2}>
                      {fieldValue.map((contact, index) => (
                        <Flex key={index} align="center">
                          <IconButton
                            icon={<CloseIcon />}
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedContact = [...fieldValue];
                              updatedContact.splice(index, 1);
                              handleFormInput(fieldName, updatedContact, index);
                            }}
                            aria-label="Remove"
                            mr={2}
                          />
                          <Box
                            p={4}
                            boxShadow="md"
                            borderRadius="md"
                            bg="white"
                            overflow="auto"
                          >
                            <Stack spacing={2}>
                              <Flex justify="flex-start">
                                <FormLabel>Contact Type:</FormLabel>
                                <Select
                                  name={fieldName}
                                  value={contactOptions.find(
                                    (option) => option.value === fieldValue
                                  )}
                                  onChange={(selectedOption) => {
                                    const updatedContact = [...fieldValue];
                                    updatedContact[index].contactType =
                                      selectedOption.value;
                                    handleFormInput(
                                      fieldName,
                                      updatedContact,
                                      index
                                    );
                                  }}
                                  options={contactOptions}
                                />
                              </Flex>
                            </Stack>
                            <Stack spacing={2}>
                              <Flex justify="flex-start">
                                <FormLabel>Telephone:</FormLabel>
                                <PhoneInput
                                  placeholder="Enter phone number"
                                  value={contact.telephone}
                                  onChange={(value) => {
                                    const updatedContact = [...fieldValue];
                                    updatedContact[index].telephone = value;
                                    handleFormInput(
                                      fieldName,
                                      updatedContact,
                                      index
                                    );
                                  }}
                                />
                              </Flex>
                            </Stack>
                          </Box>
                        </Flex>
                      ))}
                    </Stack>
                  </Stack>
                ) : fieldName === "description" ? (
                  <Textarea
                    name={fieldName}
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  />
                ) : fieldName === "sameAs" || fieldName === "isPartOf" ? (
                  <Stack spacing={2}>
                    <Flex justify="flex-start">
                      {fieldValue.length < 10 && (
                        <IconButton
                          icon={<AddIcon />}
                          onClick={
                            fieldName === "sameAs"
                              ? addProfile
                              : fieldName === "isPartOf"
                              ? addUAL
                              : ""
                          }
                        />
                      )}
                    </Flex>
                    <Stack spacing={2}>
                      {fieldValue.map((value, index) => (
                        <Flex justify="flex-start">
                          <IconButton
                            icon={<CloseIcon />}
                            value={value}
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedSameAs = [...fieldValue];
                              updatedSameAs.splice(index, 1);
                              handleFormInput(fieldName, updatedSameAs, index);
                            }}
                            aria-label="Remove"
                            mr={2}
                          />
                          <Input
                            type="text"
                            placeholder={
                              fieldName === "sameAs"
                                ? "url"
                                : fieldName === "isPartOf"
                                ? "ual"
                                : ""
                            }
                            onChange={(e) => {
                              e.preventDefault();
                              const updatedSameAs = [...fieldValue];
                              updatedSameAs[index] = e.target.value;
                              handleFormInput(fieldName, updatedSameAs, index);
                            }}
                          />
                        </Flex>
                      ))}
                    </Stack>
                  </Stack>
                ) : (
                  <Input
                    type="text"
                    name={fieldName}
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  />
                )}
                {fieldName === "image" && imageError && (
                  <Text color="red.500" mb={4}>
                    {imageError}
                  </Text>
                )}
                {fieldName === "@type" && typeError && (
                  <Text color="red.500" mb={4}>
                    {typeError}
                  </Text>
                )}
                {fieldName === "sameAs" && sameAsError && (
                  <Text color="red.500" mb={4}>
                    {sameAsError}
                  </Text>
                )}
                {fieldName === "isPartOf" && ualError && (
                  <Text color="red.500" mb={4}>
                    {ualError}
                  </Text>
                )}
                {fieldName === "name" && nameError && (
                  <Text color="red.500" mb={4}>
                    {nameError}
                  </Text>
                )}
                {fieldName === "contactPoint" && telephoneError && (
                  <Text color="red.500" mb={4}>
                    {telephoneError}
                  </Text>
                )}
                {fieldName === "logo" && logoError && (
                  <Text color="red.500" mb={4}>
                    {logoError}
                  </Text>
                )}
              </FormControl>
            );
          }

          return null; // Render nothing if the field is blank
        })}
      </Box>
    )
  );
};

export default Organization;
