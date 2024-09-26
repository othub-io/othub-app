import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
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

const currencies = [
  { value: "", label: "None" },
  {
    label: "United States Dollar",
    value: "USD",
    symbol: "$",
  },
  {
    label: "Euro",
    value: "EUR",
    symbol: "€",
  },
  {
    label: "Japanese Yen",
    value: "JPY",
    symbol: "¥",
  },
  {
    label: "British Pound Sterling",
    value: "GBP",
    symbol: "£",
  },
  {
    label: "Australian Dollar",
    value: "AUD",
    symbol: "A$",
  },
  {
    label: "Canadian Dollar",
    value: "CAD",
    symbol: "CA$",
  },
  {
    label: "Swiss Franc",
    value: "CHF",
    symbol: "CHF",
  },
  {
    label: "Chinese Yuan",
    value: "CNY",
    symbol: "¥",
  },
  {
    label: "Swedish Krona",
    value: "SEK",
    symbol: "kr",
  },
  {
    label: "New Zealand Dollar",
    value: "NZD",
    symbol: "NZ$",
  },
  {
    label: "Mexican Peso",
    value: "MXN",
    symbol: "Mex$",
  },
  {
    label: "Singapore Dollar",
    value: "SGD",
    symbol: "S$",
  },
  {
    label: "Hong Kong Dollar",
    value: "HKD",
    symbol: "HK$",
  },
  {
    label: "Norwegian Krone",
    value: "NOK",
    symbol: "kr",
  },
  {
    label: "South Korean Won",
    value: "KRW",
    symbol: "₩",
  },
  {
    label: "Turkish Lira",
    value: "TRY",
    symbol: "₺",
  },
  {
    label: "Indian Rupee",
    value: "INR",
    symbol: "₹",
  },
  {
    label: "Brazilian Real",
    value: "BRL",
    symbol: "R$",
  },
  {
    label: "South African Rand",
    value: "ZAR",
    symbol: "R",
  },
  {
    label: "Russian Ruble",
    value: "RUB",
    symbol: "₽",
  },
  {
    label: "Bitcoin",
    value: "BTC",
    symbol: "₿",
  },
];

const offerOptions = [
  { value: "none", label: "None" },
  { value: "https://schema.org/Offer", label: "Offer" },
  { value: "https://schema.org/AggregateOffer", label: "Aggregate Offer" },
];

const availabilityOptions = [
  { value: "", label: "None" },
  { value: "https://schema.org/InStock", label: "In Stock" },
  { value: "https://schema.org/OutOfStock", label: "Out Of Stock" },
  { value: "https://schema.org/OnlineOnly", label: "Online Only" },
  { value: "https://schema.org/InStoreOnly", label: "In Store Only" },
  { value: "https://schema.org/PreOrder", label: "Pre-Order" },
  { value: "https://schema.org/PreSale", label: "Pre-Sale" },
  {
    value: "https://schema.org/LimitedAvailability",
    label: "Limited Availability",
  },
  { value: "https://schema.org/SoldOut", label: "Sold Out" },
  { value: "https://schema.org/Discontinued", label: "Discontinued" },
];

const conditionOptions = [
  { value: "", label: "None" },
  { value: "https://schema.org/NewCondition", label: "New" },
  { value: "https://schema.org/UsedCondition", label: "Used" },
  { value: "https://schema.org/RefurbishedCondition", label: "Refurbished" },
  { value: "https://schema.org/DamagedCondition", label: "Damaged" },
];

const isUrlValid = (url) => {
  // Simple URL validation, you can use a more sophisticated library if needed
  const urlPattern = /^https?:\/\/\S+$/;
  return urlPattern.test(url);
};

const customStyles = {
  container: (provided) => ({
    ...provided,
    width: "60%",
  }),
};

const Product = ({ displayContent, openPopUp, form_error, paranet }) => {
  const [nameError, setNameError] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [urlError, setUrlError] = useState(null);
  const [ratingError, setRatingError] = useState(null);
  const [offerPriceError, setOfferPriceError] = useState(null);
  const [offerUrlError, setOfferUrlError] = useState(null);
  const [ualError, setUalError] = useState(null);
  const { productFormData, setProductFormData } = useContext(AccountContext);

  useEffect(() => {
    if(paranet){
      productFormData.isPartOf[0] = paranet.paranetKnowledgeAssetUAL
    }

    let hasError = false;
    const filteredFormData = Object.entries(productFormData)
      .filter(
        ([key, value]) => key !== "image" || (key === "image" && value !== "")
      )
      .filter(
        ([key, value]) => key !== "url" || (key === "url" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "description" || (key === "description" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "isPartOf" || (key === "isPartOf" && value.length > 0)
      )
      .filter(
        ([key, value]) =>
          key !== "aggregateRating" ||
          (key === "aggregateRating" && value && value.ratingValue !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "jobTitle" || (key === "jobTitle" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "brand" || (key === "brand" && value && value.name !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "offers" ||
          (key === "offers" &&
            value !== "" &&
            value["@type"] !== "" &&
            value["@type"] !== "none")
      )
      .filter(
        ([key, value]) =>
          key !== "bestRating" || (key === "bestRating" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "worstRating" || (key === "worstRating" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "ratingCount" || (key === "ratingCount" && value !== "")
      )
      .filter(
        ([key, value]) =>
          key !== "review" || (key === "review" && value.length > 0)
      )
      .reduce((acc, [key, value]) => {
        // If 'location.name' is blank, remove the 'address' object
        if (key === "review" && Number(value.length) > 0) {
          acc[key] = value
            .filter((review) => review !== "") // Remove empty reviews
            .map((review) => {
              const {
                author,
                publisher,
                name,
                datePublished,
                ...restOfReview
              } = review;

              // Include name if not blank
              if (name && name.trim() !== "") {
                restOfReview.name = name;
              }

              // Include datePublished if not blank
              if (datePublished) {
                restOfReview.datePublished = datePublished;
              }

              // Include author if name is not blank
              if (author && author.name && author.name.trim() !== "") {
                restOfReview.author = author;
              }

              // Include publisher if name is not blank
              if (publisher && publisher.name && publisher.name.trim() !== "") {
                restOfReview.publisher = publisher;
              }

              return restOfReview;
            });
        } else {
          acc[key] = value;
        }

        if (key === "offers" && value["@type"] === "none") {
          // Exclude the offers key entirely
          return acc;
        }

        if (key === "offers" && value["@type"] === "https://schema.org/Offer") {
          const {
            lowPrice,
            highPrice,
            offerCount,
            ...offerFields // Exclude lowPrice and highPrice
          } = value;

          if (
            !(isUrlValid(value.url) && value.url.startsWith("https://")) &&
            value.url !== ""
          ) {
            setOfferUrlError(`Invalid URL for offer. Must use https.`);
            hasError = true;
          } else if (
            (isUrlValid(value.url) && value.url.startsWith("https://")) ||
            value.url === ""
          ) {
            setOfferUrlError();
          }

          if (value.price !== "" && !Number(value.price)) {
            setOfferPriceError(
              `Invalid offer price for an ${key} field. Must be a number.`
            );
            hasError = true;
          } else {
            setOfferPriceError();
          }

          acc[key] = {
            "@type": "https://schema.org/Offer",
            ...offerFields,
          };
        } else if (
          key === "offers" &&
          value["@type"] === "https://schema.org/AggregateOffer"
        ) {
          const {
            price,
            priceValidUntil,
            availability,
            itemCondition,
            ...offerFields // Exclude lowPrice and highPrice
          } = value;

          if (
            !(isUrlValid(value.url) && value.url.startsWith("https://")) &&
            value.url !== ""
          ) {
            setOfferUrlError(`Invalid URL for offer. Must use https.`);
            hasError = true;
          } else if (
            (isUrlValid(value.url) && value.url.startsWith("https://")) ||
            value.url === ""
          ) {
            setOfferUrlError();
          }

          if (
            (value.lowPrice !== "" && !Number(value.lowPrice)) ||
            (value.highPrice !== "" && !Number(value.highPrice)) ||
            (value.offerCount !== "" && !Number(value.offerCount))
          ) {
            setOfferPriceError(
              `Invalid offer price or offer count for an ${key} field. Must be a number.`
            );
            hasError = true;
          } else {
            setOfferPriceError();
          }

          acc[key] = {
            "@type": "https://schema.org/AggregateOffer",
            ...offerFields,
          };
        }

        if (key === "name" && value === "") {
          setNameError(`Name Required.`);
          hasError = true;
        } else if (key === "name" && value) {
          setNameError();
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
          setImageError();
        }

        if (
          key === "url" &&
          !(isUrlValid(value) && value.startsWith("https://")) &&
          value !== ""
        ) {
          setUrlError(`Invalid URL for ${key} field. Must use https.`);
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
          setUrlError();
        }

        if (key === "aggregateRating") {
          let onlyNumbers = Object.values(value).every(
            (field) =>
              field === "AggregateRating" || field === "" || Number(field)
          );

          if (!onlyNumbers) {
            setRatingError(`Rating for an ${key} field. Must be a number.`);
            hasError = true;
          } else {
            setRatingError();
          }
        } else {
          setRatingError();
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
            hasError = true;
          } else {
            setUalError();
          }
        } else {
          setUalError();
        }

        return acc;
      }, {});

    form_error(hasError);
    displayContent(JSON.stringify(filteredFormData));
  }, [productFormData, displayContent]);

  const handleFormInput = (name, value) => {
    if (name === "brand") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        brand: {
          ...prevFormData.brand,
          name: value,
        },
      }));
    } else if (name === "offers") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          "@type": value,
        },
      }));
    } else if (name === "url") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        url: value,
      }));
    } else if (name === "offer-url") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          url: value,
        },
      }));
    } else if (name === "priceCurrency") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          priceCurrency: value,
        },
      }));
    } else if (name === "price") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          price: value,
        },
      }));
    } else if (name === "availability") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          availability: value,
        },
      }));
    } else if (name === "itemCondition") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          itemCondition: value,
        },
      }));
    } else if (name === "lowPrice") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          lowPrice: value,
        },
      }));
    } else if (name === "highPrice") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          highPrice: value,
        },
      }));
    } else if (name === "offerCount") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          offerCount: value,
        },
      }));
    } else if (name === "priceValidUntil") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        offers: {
          ...prevFormData.offers,
          priceValidUntil: value,
        },
      }));
    } else if (name === "aggregateRating") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        aggregateRating: {
          ...prevFormData.aggregateRating,
          ratingValue: value,
        },
      }));
    } else if (name === "bestRating") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        aggregateRating: {
          ...prevFormData.aggregateRating,
          bestRating: value,
        },
      }));
    } else if (name === "worstRating") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        aggregateRating: {
          ...prevFormData.aggregateRating,
          worstRating: value,
        },
      }));
    } else if (name === "ratingCount") {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        aggregateRating: {
          ...prevFormData.aggregateRating,
          ratingCount: value,
        },
      }));
    } else if (name === "review") {
      if (value.length >= 0) {
        const updatedReview = value.map((selectedValue) => {
          return selectedValue;
        });

        setProductFormData((prevFormData) => ({
          ...prevFormData,
          review: updatedReview,
        }));
      }
    } else {
      setProductFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const PopUp = () => {
    openPopUp(productFormData);
  };

  const addReview = (e) => {
    e.preventDefault();
    setProductFormData((prevFormData) => {
      const updatedReview = [
        ...prevFormData.review,
        {
          "@type": "Review",
          name: "",
          reviewBody: "",
          datePublished: "",
          author: {
            "@type": "Person",
            name: "",
          },
          publisher: {
            "@type": "Organization",
            name: "",
          },
        },
      ];

      return {
        ...prevFormData,
        review: updatedReview,
      };
    });
  };

  const addUAL = (e) => {
    e.preventDefault();
    setProductFormData((prevFormData) => ({
      ...prevFormData,
      isPartOf: [...prevFormData.isPartOf, ""],
    }));
  };

  return (
    productFormData && (
      <Box
        as="form"
        p={4}
        boxShadow="md"
        borderRadius="md"
        bg="white"
        overflow="auto"
      >
        {Object.keys(productFormData).map((fieldName) => {
          const label =
            fieldName !== "@context" && fieldName !== "@type" ? fieldName : "";
          const fieldValue = productFormData[fieldName];

          if (fieldName !== "@context" && fieldName !== "@type") {
            return (
              <FormControl key={fieldName} mb={4}>
                <FormLabel>
                  {label === "name"
                    ? "Product Name:"
                    : label === "image"
                    ? "Image URL:"
                    : label === "url"
                    ? "URL:"
                    : label === "description"
                    ? "Description:"
                    : label === "brand"
                    ? "Brand:"
                    : label === "offers"
                    ? "Offer:"
                    : label === "isPartOf"
                    ? "Related UALs:"
                    : label === "aggregateRating"
                    ? "Aggregate Rating:"
                    : label === "review"
                    ? "Reviews:"
                    : label}
                </FormLabel>
                {fieldName === "offers" ? (
                  <Stack spacing={2}>
                    <Flex justify="flex-start">
                      <Select
                        name={fieldName}
                        value={offerOptions.find(
                          (option) => option.value === fieldValue
                        )}
                        onChange={(selectedOption) => {
                          const selectedValue = selectedOption
                            ? selectedOption.value
                            : "none";
                          handleFormInput(fieldName, selectedValue);
                        }}
                        options={offerOptions}
                        styles={customStyles}
                      />
                    </Flex>
                    {fieldValue["@type"] === "https://schema.org/Offer" && ( // Show the address input only if location name has a value
                      <Box
                        p={4}
                        boxShadow="md"
                        borderRadius="md"
                        bg="white"
                        overflow="auto"
                      >
                        <Stack spacing={2}>
                          <Stack spacing={2}>
                            <Flex justify="flex-start">
                              <FormLabel>URL:</FormLabel>
                              <Input
                                type="text"
                                name={"url"}
                                value={fieldValue.url}
                                onChange={(e) =>
                                  handleFormInput("offer-url", e.target.value)
                                }
                              />
                            </Flex>
                          </Stack>
                          <Stack spacing={2}>
                            <Flex justify="flex-start" mt="10px">
                              <FormLabel>Currency:</FormLabel>
                              <Select
                                name={`priceCurrency`}
                                value={currencies.find(
                                  (option) => option.value === fieldValue
                                )}
                                onChange={(selectedValue) =>
                                  handleFormInput(
                                    `priceCurrency`,
                                    selectedValue.value
                                  )
                                }
                                options={currencies}
                                className="currency-select"
                                styles={customStyles}
                              />
                            </Flex>
                          </Stack>
                          <Stack spacing={2}>
                            <Flex justify="flex-start" mt="10px" w={{sm:"100%", lg:"50%"}}>
                              <FormLabel>Price:</FormLabel>
                              <Input
                                type="text"
                                name={"price"}
                                value={fieldValue.price}
                                onChange={(e) =>
                                  handleFormInput(`price`, e.target.value)
                                }
                                placeholder="0.00"
                              />
                            </Flex>
                          </Stack>
                          <Stack spacing={2}>
                            <Flex justify="flex-start" mt="10px" w={{sm:"100%", lg:"50%"}}>
                              <FormLabel>Offer Valid Until:</FormLabel>
                              <Input
                                type="datetime-local"
                                value={fieldValue.priceValidUntil}
                                onChange={(e) =>
                                  handleFormInput(
                                    `priceValidUntil`,
                                    e.target.value
                                  )
                                }
                                _hover={{ curser: "pointer" }}
                              />
                            </Flex>
                          </Stack>
                          <Stack spacing={2}>
                            <Flex justify="flex-start" mt="10px">
                              <FormLabel>Availability:</FormLabel>
                              <Select
                                name={`availability`}
                                value={availabilityOptions.find(
                                  (option) => option.value === fieldValue
                                )}
                                onChange={(selectedValue) =>
                                  handleFormInput(
                                    `availability`,
                                    selectedValue.value
                                  )
                                }
                                options={availabilityOptions}
                                styles={customStyles}
                              />
                            </Flex>
                          </Stack>
                          <Stack spacing={2}>
                            <Flex justify="flex-start" mt="10px">
                              <FormLabel>Condition:</FormLabel>
                              <Select
                                name={`itemCondition`}
                                value={conditionOptions.find(
                                  (option) => option.value === fieldValue
                                )}
                                onChange={(selectedValue) =>
                                  handleFormInput(
                                    `itemCondition`,
                                    selectedValue.value
                                  )
                                }
                                options={conditionOptions}
                                styles={customStyles}
                              />
                            </Flex>
                          </Stack>
                        </Stack>
                      </Box>
                    )}
                    {fieldValue["@type"] ===
                      "https://schema.org/AggregateOffer" && (
                      <Box
                        p={4}
                        boxShadow="md"
                        borderRadius="md"
                        bg="white"
                        overflow="auto"
                      >
                        <Stack spacing={2}>
                          <Flex justify="flex-start">
                            <FormLabel>URL:</FormLabel>
                            <Input
                              type="text"
                              name={"url"}
                              value={fieldValue.url}
                              onChange={(e) =>
                                handleFormInput("offer-url", e.target.value)
                              }
                            />
                          </Flex>
                        </Stack>
                        <Stack spacing={2}>
                          <Flex justify="flex-start" mt="10px">
                            <FormLabel>Currency:</FormLabel>
                            <Select
                              name={`priceCurrency`}
                              value={currencies.find(
                                (option) => option.value === fieldValue
                              )}
                              onChange={(selectedValue) =>
                                handleFormInput(
                                  `priceCurrency`,
                                  selectedValue.value
                                )
                              }
                              options={currencies}
                              className="currency-select"
                              styles={customStyles}
                            />
                          </Flex>
                        </Stack>
                        <Stack spacing={2}>
                          <Flex justify="flex-start" mt="10px" w="30%">
                            <FormLabel>Low Price:</FormLabel>
                            <Input
                              type="text"
                              name={"lowPrice"}
                              value={fieldValue.lowPrice}
                              onChange={(e) =>
                                handleFormInput(`lowPrice`, e.target.value)
                              }
                              placeholder="0.00"
                            />
                          </Flex>
                        </Stack>
                        <Stack spacing={2}>
                          <Flex justify="flex-start" mt="10px" w="30%">
                            <FormLabel>High Price:</FormLabel>
                            <Input
                              type="text"
                              name={"highPrice"}
                              value={fieldValue.highPrice}
                              onChange={(e) =>
                                handleFormInput(`highPrice`, e.target.value)
                              }
                              placeholder="0.00"
                            />
                          </Flex>
                        </Stack>
                        <Stack spacing={2}>
                          <Flex justify="flex-start" mt="10px" w="30%">
                            <FormLabel>Number of Offers:</FormLabel>
                            <Input
                              type="text"
                              name={"offerCount"}
                              value={fieldValue.offerCount}
                              onChange={(e) =>
                                handleFormInput(`offerCount`, e.target.value)
                              }
                              placeholder="0"
                            />
                          </Flex>
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                ) : fieldName === "brand" ? (
                  <Stack spacing={2} mt="10px">
                    <Flex justify="flex-start">
                      <Input
                        type="text"
                        name={fieldName}
                        value={fieldValue.name}
                        onChange={(e) =>
                          handleFormInput(fieldName, e.target.value)
                        }
                      />
                    </Flex>
                  </Stack>
                ) : fieldName === "aggregateRating" ? (
                  <Stack spacing={2} mt="10px">
                    <Flex justify="flex-start" w={{sm:"100%", lg:"50%"}}>
                      <Input
                        type="text"
                        name={fieldName}
                        value={fieldValue.name}
                        onChange={(e) =>
                          handleFormInput(fieldName, e.target.value)
                        }
                      />
                    </Flex>
                    {fieldValue.ratingValue && ( // Show the address input only if location name has a value
                      <Box
                        p={4}
                        borderRadius="md"
                        bg="white"
                        overflow="auto"
                      >
                        <Stack spacing={2}>
                          <Flex justify="space-between">
                            <Flex w="30%">
                              <Input
                                type="text"
                                name="bestRating"
                                value={fieldValue.bestRating}
                                onChange={(e) =>
                                  handleFormInput("bestRating", e.target.value)
                                }
                                placeholder="best rating"
                              />
                            </Flex>
                            <Flex w="30%">
                              <Input
                                type="text"
                                name="worstRating"
                                value={fieldValue.worstRating}
                                onChange={(e) =>
                                  handleFormInput("worstRating", e.target.value)
                                }
                                placeholder="worst rating"
                              />
                            </Flex>
                            <Flex w="30%">
                              <Input
                                type="text"
                                name="ratingCount"
                                value={fieldValue.ratingCount}
                                onChange={(e) =>
                                  handleFormInput("ratingCount", e.target.value)
                                }
                                placeholder="rating count"
                              />
                            </Flex>
                          </Flex>
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                ) : fieldName === "review" ? (
                  <Stack spacing={2}>
                    <Flex justify="flex-start">
                      {fieldValue.length < 10 && (
                        <IconButton
                          icon={<AddIcon />}
                          onClick={addReview}
                          aria-label="Add Related Review"
                        />
                      )}
                    </Flex>
                    <Stack spacing={2}>
                      {fieldValue.map((review, index) => (
                        <Flex key={index} align="center">
                          <IconButton
                            icon={<CloseIcon />}
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedReview = [...fieldValue];
                              updatedReview.splice(index, 1);
                              handleFormInput(fieldName, updatedReview, index);
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
                            w="80%"
                          >
                            <Stack spacing={2}>
                              <Flex justify="flex-start">
                                <FormLabel>Name:</FormLabel>
                                <Input
                                  type="text"
                                  value={review.name}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const updatedReview = [...fieldValue];
                                    updatedReview[index].name = e.target.value;
                                    handleFormInput(
                                      fieldName,
                                      updatedReview,
                                      index
                                    );
                                  }}
                                />
                              </Flex>
                            </Stack>
                            <Stack spacing={2}>
                              <Flex justify="flex-start" mt="20px" w={{sm:"100%", lg:"50%"}}>
                                <FormLabel>Publish Date:</FormLabel>
                                <Input
                                type="datetime-local"
                                value={fieldValue.priceValidUntil}
                                  onChange={(e) => {
                                    const updatedReview = [...fieldValue];
                                    updatedReview[index].datePublished = e.target.value;
                                    handleFormInput(
                                      fieldName,
                                      updatedReview,
                                      index
                                    );
                                  }}
                                  _hover={{ curser: "pointer" }}
                                />
                              </Flex>
                            </Stack>
                            <Stack spacing={2}>
                              <Flex justify="flex-start" mt="20px">
                                <FormLabel>Author:</FormLabel>
                                <Input
                                  type="text"
                                  name={`author`}
                                  value={review.author.name}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const updatedReview = [...fieldValue];
                                    updatedReview[index].author.name =
                                      e.target.value;
                                    handleFormInput(
                                      fieldName,
                                      updatedReview,
                                      index
                                    );
                                  }}
                                />
                              </Flex>
                            </Stack>
                            <Stack spacing={2}>
                              <Flex justify="flex-start" mt="20px">
                                <FormLabel>Publisher:</FormLabel>
                                <Input
                                  type="text"
                                  name={`publisher`}
                                  value={review.publisher.name}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const updatedReview = [...fieldValue];
                                    updatedReview[index].publisher.name =
                                      e.target.value;
                                    handleFormInput(
                                      fieldName,
                                      updatedReview,
                                      index
                                    );
                                  }}
                                />
                              </Flex>
                            </Stack>
                            <Stack spacing={2}>
                              <Flex justify="flex-start" mt="20px">
                                <FormLabel>Review Text:</FormLabel>
                                <Textarea
                                  type="text"
                                  name={`reviewBody`}
                                  value={review.reviewBody}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    const updatedReview = [...fieldValue];
                                    updatedReview[index].reviewBody =
                                      e.target.value;
                                    handleFormInput(
                                      fieldName,
                                      updatedReview,
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
                ) : fieldName === "isPartOf" ? (
                  <Stack spacing={2}>
                    <Flex justify="flex-start">
                      {fieldValue.length < 10 && (
                        <IconButton
                          icon={<AddIcon />}
                          onClick={addUAL}
                          aria-label={`Add UAL`}
                        />
                      )}
                    </Flex>
                    <Stack spacing={2}>
                      {fieldValue.map((value, index) => (
                        <Flex key={index} align="center">
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
                            placeholder={"ual"}
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
                {fieldName === "aggregateRating" && ratingError && (
                  <Text color="red.500" mb={4}>
                    {ratingError}
                  </Text>
                )}
                {fieldName === "offer" && offerPriceError && (
                  <Text color="red.500" mb={4}>
                    {offerPriceError}
                  </Text>
                )}
                {fieldName === "image" && offerUrlError && (
                  <Text color="red.500" mb={4}>
                    {offerUrlError}
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
                {fieldName === "url" && urlError && (
                  <Text color="red.500" mb={4}>
                    {urlError}
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

export default Product;
