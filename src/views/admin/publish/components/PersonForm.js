import React, { useState, useEffect, useContext } from "react";
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
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import { AccountContext } from "../../../../AccountContext";

const isUrlValid = (url) => {
  const urlPattern = /^https?:\/\/\S+$/;
  return urlPattern.test(url);
};

const Person = ({ displayContent, openPopUp }) => {
  const { form_error, setFormError } = useContext(AccountContext);
  const [nameError, setNameError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [sameAsError, setSameAsError] = useState(null);
  const [ualError, setUalError] = useState(null);
  const [formData, setFormData] = useState({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "",
    image: "",
    description: "",
    location: {
      "@type": "Place",
      name: "",
      address: {
        "@type": "PostalAddress",
        streetAddress: "",
        addressLocality: "",
        postalCode: "",
        addressCountry: "",
      },
    },
    jobTitle: "",
    worksFor: {
      "@type": "Organization",
      name: "",
    },
    relatedTo: {
      "@type": "Person",
      name: [],
    },
    isPartOf: [],
  });

  useEffect(() => {
    const filteredFormData = Object.entries(formData)
      .filter(
        ([key, value]) => key !== "image" || (key === "image" && value !== "")
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
          key !== "relatedTo" || (key === "relatedTo" && value.name.length > 0)
      )
      .filter(
        ([key, value]) =>
          key !== "description" || (key === "description" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "jobTitle" || (key === "jobTitle" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "worksFor" ||
          (key === "worksFor" && value && value.name !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "location" ||
          (key === "location" && value && value.name !== "")
      )
      .reduce((acc, [key, value]) => {
        if (key === "location" && value && value.name !== "") {
          let isAddressNotBlank = Object.values(value.address).some(
            (field) =>
              field !== "PostalAddress" &&
              field !== "Place" &&
              field !== "Organization" &&
              field !== ""
          );

          if (isAddressNotBlank) {
            acc[key] = value;
          } else {
            const { address, ...restOfLocation } = value;
            acc[key] = restOfLocation;
          }
        } else {
          acc[key] = value;
        }

        if (key === "name" && value === "") {
          setNameError(`Name Required.`);
        } else if (key === "name" && value) {
          setNameError();
        }

        if (
          key === "image" &&
          !(isUrlValid(value) && value.startsWith("https://")) &&
          value !== ""
        ) {
          setImageError(`Invalid URL for ${key} field. Must use https.`);
        }

        if (!acc.hasOwnProperty("image") || (key === "image" && isUrlValid(value) && value.startsWith("https://")) || (value === "" || !value)) {
          setImageError();
        }

        if (key === "sameAs" && value.length > 0) {
          let validUrl = Object.values(value).every(
            (field) => isUrlValid(field) && field.startsWith("https://")
          );

          if (!validUrl) {
            setSameAsError(`Invalid URL for a ${key} field. Must use https.`);
          } else {
            setSameAsError();
          }
        } else {
          setSameAsError();
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
          } else {
            setUalError();
          }
        } else {
          setUalError();
        }

        return acc;
      }, {});

    displayContent(JSON.stringify(filteredFormData));
  }, [formData, displayContent]);

  const handleFormInput = (name, value) => {
    if (name === "location") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: {
          ...prevFormData.location,
          name: value,
        },
      }));
    } else if (name === "worksFor") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        worksFor: {
          ...prevFormData.worksFor,
          name: value,
        },
      }));
    } else if (name === "address") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        location: {
          ...prevFormData.location,
          address: {
            ...prevFormData.location.address,
            streetAddress: value.streetAddress || "",
            addressLocality: value.addressLocality || "",
            postalCode: value.postalCode || "",
            addressCountry: value.addressCountry || "",
          },
        },
      }));
    } else if (name === "sameAs") {
      const updatedSameAs = value.map((selectedValue) => {
        return selectedValue;
      });

      setFormData((prevFormData) => ({
        ...prevFormData,
        sameAs: updatedSameAs,
      }));
    } else if (name === "relatedTo") {
      if (value.length >= 0) {
        const updatedRelatedTo = value.map((selectedValue) => {
          return selectedValue;
        });

        setFormData((prevFormData) => ({
          ...prevFormData,
          relatedTo: {
            ...prevFormData.relatedTo,
            name: updatedRelatedTo,
          },
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const PopUp = () => {
    openPopUp(formData);
  };

  const addProfile = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      sameAs: [...prevFormData.sameAs, ""],
    }));
  };

  const addUAL = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      isPartOf: [...prevFormData.isPartOf, ""],
    }));
  };

  const addPerson = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      relatedTo: {
        ...prevFormData.relatedTo,
        name: [...prevFormData.relatedTo.name, ""],
      },
    }));
  };

  return (
    formData && (
      <Box as="form" p={4} boxShadow="md" borderRadius="md" bg="white" overflow="auto">
        {Object.keys(formData).map((fieldName) => {
          const label =
            fieldName !== "@context" && fieldName !== "@type" ? fieldName : "";
          const fieldValue = formData[fieldName];

          if (fieldName !== "@context" && fieldName !== "@type") {
            return (
              <FormControl key={fieldName} mb={4}>
                <FormLabel>
                  {label === "name"
                    ? "Full Name:"
                    : label === "image"
                    ? "Image URL:"
                    : label === "description"
                    ? "Description:"
                    : label === "location"
                    ? "Location:"
                    : label === "worksFor"
                    ? "Employer:"
                    : label === "relatedTo"
                    ? "Related To:"
                    : label === "sameAs"
                    ? "Social Profiles:"
                    : label === "isPartOf"
                    ? "Related UALs:"
                    : label === "jobTitle"
                    ? "Occupation:"
                    : label}
                </FormLabel>
                {fieldName === "sameAs" || fieldName === "isPartOf" ? (
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
                              : null
                          }
                          aria-label={`Add ${fieldName}`}
                        />
                      )}
                    </Flex>
                    <Stack spacing={2}>
                      {fieldValue.map((value, index) => (
                        <Flex key={index} align="center">
                          <IconButton
                            icon={<CloseIcon />}
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
                                ? "URL"
                                : fieldName === "isPartOf"
                                ? "UAL"
                                : ""
                            }
                            value={value}
                            onChange={(e) => {
                              const updatedSameAs = [...fieldValue];
                              updatedSameAs[index] = e.target.value;
                              handleFormInput(fieldName, updatedSameAs, index);
                            }}
                          />
                        </Flex>
                      ))}
                    </Stack>
                  </Stack>
                ) : fieldName === "relatedTo" ? (
                  <Stack spacing={2}>
                    <Flex justify="flex-start">
                      {fieldValue.name.length < 10 && (
                        <IconButton
                          icon={<AddIcon />}
                          onClick={addPerson}
                          aria-label="Add Related Person"
                        />
                      )}
                    </Flex>
                    <Stack spacing={2}>
                      {fieldValue.name.map((value, index) => (
                        <Flex key={index} align="center">
                          <IconButton
                            icon={<CloseIcon />}
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedRelatedTo = [
                                ...fieldValue.name,
                              ];
                              updatedRelatedTo.splice(index, 1);
                              handleFormInput(
                                fieldName,
                                updatedRelatedTo,
                                index
                              );
                            }}
                            aria-label="Remove"
                            mr={2}
                          />
                          <Input
                            type="text"
                            placeholder="Name"
                            value={value}
                            onChange={(e) => {
                              const updatedSameAs = [...fieldValue.name];
                              updatedSameAs[index] = e.target.value;
                              handleFormInput(fieldName, updatedSameAs, index);
                            }}
                          />
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
                ) : fieldName === "location" ? (
                  <>
                    <Input
                      type="text"
                      name={fieldName}
                      value={fieldValue.name}
                      onChange={(e) =>
                        handleFormInput(fieldName, e.target.value)
                      }
                    />
                    {fieldValue.name && (
                      <Box mt={2}>
                        <FormLabel>Address:</FormLabel>
                        <Input
                          type="text"
                          name="address.streetAddress"
                          value={fieldValue.address.streetAddress}
                          onChange={(e) =>
                            handleFormInput("address", {
                              ...fieldValue.address,
                              streetAddress: e.target.value,
                            })
                          }
                          placeholder="Enter Street Address"
                        />
                        <Input
                          type="text"
                          name="address.addressLocality"
                          value={fieldValue.address.addressLocality}
                          onChange={(e) =>
                            handleFormInput("address", {
                              ...fieldValue.address,
                              addressLocality: e.target.value,
                            })
                          }
                          placeholder="Enter Locality"
                        />
                        <Input
                          type="text"
                          name="address.postalCode"
                          value={fieldValue.address.postalCode}
                          onChange={(e) =>
                            handleFormInput("address", {
                              ...fieldValue.address,
                              postalCode: e.target.value,
                            })
                          }
                          placeholder="Enter Postal Code"
                        />
                        <Input
                          type="text"
                          name="address.addressCountry"
                          value={fieldValue.address.addressCountry}
                          onChange={(e) =>
                            handleFormInput("address", {
                              ...fieldValue.address,
                              addressCountry: e.target.value,
                            })
                          }
                          placeholder="Enter Country"
                        />
                      </Box>
                    )}
                  </>
                ) : fieldName === "worksFor" ? (
                  <Input
                    type="text"
                    name={fieldName}
                    value={fieldValue.name}
                    onChange={(e) =>
                      handleFormInput(fieldName, e.target.value)
                    }
                  />
                ) : (
                  <Input
                    type="text"
                    name={fieldName}
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  />
                )}
              </FormControl>
            );
          }

          return null;
        })}
        {imageError && (
          <Text color="red.500" mb={4}>
            {imageError}
          </Text>
        )}
        {sameAsError && (
          <Text color="red.500" mb={4}>
            {sameAsError}
          </Text>
        )}
        {ualError && (
          <Text color="red.500" mb={4}>
            {ualError}
          </Text>
        )}
        {nameError && (
          <Text color="red.500" mb={4}>
            {nameError}
          </Text>
        )}
        {!nameError && !imageError && !sameAsError && !ualError && (
          <Flex justify="center">
            <Button colorScheme="teal" onClick={PopUp}>
              Publish
            </Button>
          </Flex>
        )}
      </Box>
    )
  );
};

export default Person;
