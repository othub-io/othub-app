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

const EventForm = ({ displayContent, openPopUp, form_error, paranet }) => {
  const [nameError, setNameError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [sameAsError, setSameAsError] = useState(null);
  const [ualError, setUalError] = useState(null);
  const { eventFormData, setEventFormData } = useContext(AccountContext);

  useEffect(() => {
    if(paranet.paranetKnowledgeAssetUAL){
      eventFormData.isPartOf[0] = paranet.paranetKnowledgeAssetUAL
    }

    let hasError = false;
    const filteredFormData = Object.entries(eventFormData)
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
          key !== "description" || (key === "description" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "startDate" || (key === "startDate" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "endDate" || (key === "endDate" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "organizer" || (key === "organizer" && value && value.name !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "location" || (key === "location" && value && value.name !== "")
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
          hasError = true;
        } else if (key === "name" && value) {
          setNameError(null);
        }
  
        if (
          key === "image" &&
          !(isUrlValid(value) && value.startsWith("https://")) &&
          value !== ""
        ) {
          setImageError(`Invalid URL for ${key} field. Must use https.`);
          hasError = true;
        }
  
        if (
          !acc.hasOwnProperty("image") ||
          (key === "image" &&
            isUrlValid(value) &&
            value.startsWith("https://")) ||
          value === "" ||
          !value
        ) {
          setImageError(null);
        }
  
        if (key === "sameAs" && value.length > 0) {
          let validUrl = Object.values(value).every(
            (field) => isUrlValid(field) && field.startsWith("https://")
          );
  
          if (!validUrl) {
            setSameAsError(`Invalid URL for a ${key} field. Must use https.`);
            hasError = true;
          } else {
            setSameAsError(null);
          }
        } else {
          setSameAsError(null);
        }
  
        if (key === "isPartOf" && value.length > 0) {
          let validUal = Object.values(value).every((field) => {
            if (field && field !== "") {
              const segments = field.split(":");
              const argsString = JSON.stringify(
                segments.length === 3 ? segments[2] : segments[2] + segments[3]
              );
              const args = argsString.split("/");
  
              return args.length === 3;
            } else {
              return false;
            }
          });
  
          if (!validUal) {
            setUalError(`Invalid UAL for a ${key} field.`);
            hasError = true;
          } else {
            setUalError(null);
          }
        } else {
          setUalError(null);
        }
  
        return acc;
      }, {});
  
    form_error(hasError);
    displayContent(JSON.stringify(filteredFormData));
  }, [eventFormData, displayContent, form_error]);  

  const handleFormInput = (name, value) => {
    if (name === "location") {
      setEventFormData((prevFormData) => ({
        ...prevFormData,
        location: {
          ...prevFormData.location,
          name: value,
        },
      }));
    } else if (name === "organizer") {
      setEventFormData((prevFormData) => ({
        ...prevFormData,
        organizer: {
          ...prevFormData.organizer,
          name: value,
        },
      }));
    } else if (name === "address") {
      setEventFormData((prevFormData) => ({
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

      setEventFormData((prevFormData) => ({
        ...prevFormData,
        sameAs: updatedSameAs,
      }));
    } else if (name === "isPartOf") {
      const updatedIsPartOf = value.map((selectedValue) => {
        return selectedValue;
      });

      setEventFormData((prevFormData) => ({
        ...prevFormData,
        isPartOf: updatedIsPartOf,
      }));
    } else {
      setEventFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const PopUp = () => {
    openPopUp(eventFormData);
  };

  const addProfile = (e) => {
    e.preventDefault();
    setEventFormData((prevFormData) => ({
      ...prevFormData,
      sameAs: [...prevFormData.sameAs, ""],
    }));
  };

  const addUAL = (e) => {
    e.preventDefault();
    setEventFormData((prevFormData) => ({
      ...prevFormData,
      isPartOf: [...prevFormData.isPartOf, ""],
    }));
  };

  return (
    eventFormData && (
      <Box
        as="form"
        p={4}
        boxShadow="md"
        borderRadius="md"
        bg="white"
        overflow="auto"
      >
        {Object.keys(eventFormData).map((fieldName) => {
          const label =
            fieldName !== "@context" && fieldName !== "@type" ? fieldName : "";
          const fieldValue = eventFormData[fieldName];

          if (fieldName !== "@context" && fieldName !== "@type") {
            return (
              <FormControl key={fieldName} mb={4}>
                <FormLabel>
                  {label === "name"
                    ? "Event Name:"
                    : label === "image"
                    ? "Image URL:"
                    : label === "description"
                    ? "Description:"
                    : label === "startDate"
                    ? "Start Date:"
                    : label === "endDate"
                    ? "End Date:"
                    : label === "location"
                    ? "Location:"
                    : label === "organizer"
                    ? "Organizer:"
                    : label === "sameAs"
                    ? "Social Profiles:"
                    : label === "isPartOf"
                    ? "Related UALs:"
                    : label}
                </FormLabel>
                {fieldName === "sameAs" || fieldName === "isPartOf" ? (
                  <Stack spacing={2}>
                    <Flex justify="flex-start">
                      {fieldValue.length < 10 && (
                        <IconButton
                          icon={<AddIcon />}
                          onClick={fieldName === "sameAs" ? addProfile : addUAL}
                          size="sm"
                          aria-label="Add Field"
                          mr={2}
                        />
                      )}
                    </Flex>
                    {fieldValue.map((profileValue, index) => (
                      <Flex key={index} justify="space-between" align="center">
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
                          value={profileValue}
                          onChange={(e) => {
                            const newValue = [...fieldValue];
                            newValue[index] = e.target.value;
                            handleFormInput(fieldName, newValue);
                          }}
                          placeholder={`Enter ${label} ${
                            label === "isPartOf" ? "UAL" : "URL"
                          }`}
                          size="sm"
                          mr={2}
                        />
                      </Flex>
                    ))}
                  </Stack>
                ) : fieldName === "description" ? (
                  <Textarea
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  />
                ) : fieldName === "startDate" || fieldName === "endDate" ? (
                  <Flex w={{sm:"100%", lg:"50%"}}>
                    <Input
                      type="datetime-local"
                      value={fieldValue}
                      onChange={(e) =>
                        handleFormInput(fieldName, e.target.value)
                      }
                      _hover={{curser:"pointer"}}
                    />
                  </Flex>
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
                          mt="10px"
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
                          mt="10px"
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
                          mt="10px"
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
                          mt="10px"
                        />
                      </Box>
                    )}
                  </>
                ) : fieldName === "organizer" ? (
                  <Input
                    value={fieldValue.name}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  />
                ) : (
                  <Input
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                    placeholder={`Enter ${label}`}
                  />
                )}
                {fieldName === "name" && nameError && (
                  <Text color="red.500" mb={4}>
                    {nameError}
                  </Text>
                )}
                {fieldName === "image" && imageError && (
                  <Text color="red.500" mb={4}>
                    {imageError}
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
              </FormControl>
            );
          }
          return null;
        })}
      </Box>
    )
  );
};

export default EventForm;
