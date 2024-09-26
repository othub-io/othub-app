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

const CommentForm = ({ displayContent, openPopUp, form_error, paranet }) => {
  const [titleError, setTitleError] = useState(null);
  const [textError, setTextError] = useState(null);
  const [ualError, setUalError] = useState(null);
  const { commentFormData, setCommentFormData } = useContext(AccountContext);

  useEffect(() => {
    if(paranet){
      commentFormData.isPartOf[0] = paranet.paranetKnowledgeAssetUAL
    }

    let hasError = false;
    const filteredFormData = Object.entries(commentFormData)
      .filter(
        ([key, value]) =>
          key !== "isPartOf" || (key === "isPartOf" && value.length > 0)
      )
      .filter(
        ([key, value]) => key !== "about" || (key === "about" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "author" || (key === "author" && value && value.name !== "")
      )
      .reduce((acc, [key, value]) => {
        if (key === "title" && value === "") {
          setTitleError(`Title Required.`);
          hasError = true;
        } else if (key === "title" && value) {
          setTitleError(null);
        }

        if (key === "text" && value === "") {
          setTextError(`Comment Required.`);
          hasError = true;
        } else if (key === "text" && value) {
          setTextError(null);
        }

        if (key === "isPartOf" && value.length > 0) {
          let validUal = Object.values(value).every((field) => {
            if (field !== "") {
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
            setUalError(`Invalid UAL for ${key} field.`);
            hasError = true;
          } else {
            setUalError(null);
          }
        } else {
          setUalError(null);
        }

        // Add the key-value pair to acc if valid
        acc[key] = value;
        return acc;
      }, {});

    form_error(hasError);
    console.log(filteredFormData);
    displayContent(JSON.stringify(filteredFormData));
  }, [commentFormData, displayContent, form_error, paranet]);

  const handleFormInput = (name, value) => {
    if (name === "isPartOf") {
      const updatedIsPartOf = value.map((selectedValue) => {
        return selectedValue;
      });

      setCommentFormData((prevFormData) => ({
        ...prevFormData,
        isPartOf: updatedIsPartOf,
      }));
    } else if (name === "author") {
      setCommentFormData((prevFormData) => ({
        ...prevFormData,
        author: {
          ...prevFormData.author,
          name: value,
        },
      }));
    } else {
      setCommentFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const addUAL = (e) => {
    e.preventDefault();
    setCommentFormData((prevFormData) => ({
      ...prevFormData,
      relatedTo: [...prevFormData.relatedTo, ""],
    }));
  };

  return (
    commentFormData && (
      <Box
        as="form"
        p={4}
        boxShadow="md"
        borderRadius="md"
        bg="white"
        overflow="auto"
      >
        {Object.keys(commentFormData).map((fieldName) => {
          const label =
            fieldName !== "@context" && fieldName !== "@type" ? fieldName : "";
          const fieldValue = commentFormData[fieldName];

          if (fieldName !== "@context" && fieldName !== "@type") {
            return (
              <FormControl key={fieldName} mb={4}>
                <FormLabel>
                  {label === "title"
                    ? "Title:"
                    : label === "about"
                    ? "About:"
                    : label === "text"
                    ? "Comment:"
                    : label === "author"
                    ? "Author:"
                    : label === "isPartOf"
                    ? "Part of:"
                    : label}
                </FormLabel>
                {fieldName === "isPartOf" ? (
                  <Stack spacing={2}>
                    <Flex justify="flex-start">
                      {fieldValue.length < 10 && (
                        <IconButton
                          icon={<AddIcon />}
                          onClick={addUAL}
                          size="sm"
                          aria-label="Add Field"
                          mr={2}
                        />
                      )}
                    </Flex>
                    {fieldValue.map((ualValue, index) => (
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
                          value={ualValue}
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
                ) : fieldName === "text" ? (
                  <Textarea
                    value={fieldValue}
                    onChange={(e) => handleFormInput(fieldName, e.target.value)}
                  />
                ) : fieldName === "author" ? (
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
                {fieldName === "title" && titleError && (
                  <Text color="red.500" mb={4}>
                    {titleError}
                  </Text>
                )}
                {fieldName === "text" && textError && (
                  <Text color="red.500" mb={4}>
                    {textError}
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

export default CommentForm;
