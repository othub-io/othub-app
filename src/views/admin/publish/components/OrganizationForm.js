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

const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "50%",
  }),
};

const customStyles2 = {
  container: (provided) => ({
    ...provided,
    width: '100%',
    zIndex: 1000
  }),
};

const customStyles3 = {
  container: (provided) => ({
    ...provided,
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
      marginBottom: '10px',
    },
  }),
};

const Organization = ({ displayContent, openPopUp, form_error, paranet }) => {
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
    if(paranet.paranetKnowledgeAssetUAL){
      organizationFormData.isPartOf[0] = paranet.paranetKnowledgeAssetUAL
    }

    let hasError = false;
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
          hasError = true;
        } else if (key === "@type" && value) {
          setTypeError();
        }

        if (key === "name" && value === "") {
          setNameError(`Name Required.`);
          hasError = true;
        } else if (key === "name" && value) {
          setNameError();
        }

        if (
          key === "logo" &&
          !(isUrlValid(value) && value.startsWith("https://")) &&
          value !== ""
        ) {
          setLogoError(`Invalid URL for ${key} field. Must use https.`);
          hasError = true;
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
        }

        if (
          key === "url" &&
          !(isUrlValid(value) && value.startsWith("https://")) &&
          value !== ""
        ) {
          setImageError(`Invalid URL for ${key} field. Must use https.`);
          hasError = true;
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
        }

        if (key === "isPartOf" && value.length > 0) {
          let validUal = Object.values(value).every((field) => {
            if (field && field !== "") {
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
            hasError = true;
          } else {
            setUalError();
          }
        } else {
          setUalError();
        }

        if (key === "sameAs" && value.length > 0) {
          let validUrl = Object.values(value).every(
            (field) => isUrlValid(field) && field.startsWith("https://")
          );

          if (!validUrl) {
            setSameAsError(`Invalid URL for a ${key} field. Must use https.`);
            hasError = true;
          } else {
            setSameAsError();
          }
        } else {
          setSameAsError();
        }

        return acc;
      }, {});

    form_error(hasError);
    displayContent(JSON.stringify(filteredFormData));
  }, [organizationFormData, displayContent, form_error]);

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
    } else if (name === "sameAs") {
      const updatedSameAs = value.map((selectedValue) => {
        return selectedValue;
      });

      setOrganizationFormData((prevFormData) => ({
        ...prevFormData,
        sameAs: updatedSameAs,
      }));
    } else if (name === "isPartOf") {
      const updatedIsPartOf = value.map((selectedValue) => {
        return selectedValue;
      });

      setOrganizationFormData((prevFormData) => ({
        ...prevFormData,
        isPartOf: updatedIsPartOf,
      }));
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
                    <Flex justify="flex-start" w="100%">
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
                        styles={customStyles}
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
                            size="sm"
                            aria-label="Remove Field"
                            onClick={() => {
                              const newValue = [...fieldValue];
                              newValue.splice(index, 1);
                              handleFormInput(fieldName, newValue);
                            }}
                          />
                          <Box
                            p={4}
                            boxShadow="md"
                            borderRadius="md"
                            bg="white"
                            overflow="auto"
                            w={{sm:"100%", lg:"50%"}}
                            h="200px"
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
                                  styles={customStyles2}
                                />
                              </Flex>
                            </Stack>
                            <Stack spacing={2}>
                              <Flex justify="flex-start" mt="20px">
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
                                  styles={customStyles3}
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
                            size="sm"
                            aria-label="Remove Field"
                            onClick={() => {
                              const newValue = [...fieldValue];
                              newValue.splice(index, 1);
                              handleFormInput(fieldName, newValue);
                            }}
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
