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
import { AccountContext } from "../../../../AccountContext";
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const FileUpload = ({ selectedFile, openPopUp }) => {
  const [assetContent, setAssetContent] = useState(null);
  const [selectFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const reader = new FileReader();
  const { format } = useContext(AccountContext);

  useEffect(() => {
    async function fetchData() {
      try {
        selectedFile(null);
        setAssetContent(null);
        setSelectedFile(null);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [format]);

  reader.onload = (event) => {
    try {
      const content = event.target.result;
      const parsedContent = JSON.parse(content);
      if (!parsedContent["@context"]) {
        setError("File has no Schema context.");
      } else {
        setError();
        setAssetContent(content);
        selectedFile(content);
      }
    } catch (jsonError) {
      setError("Invalid JSON format. Please upload a valid JSON file.");
    }
  };

  const handleFileChange = (event) => {
    try {
      selectedFile(null);
      setAssetContent(null);
      setSelectedFile(null);
      setError(null);

      const file = event.target.files[0];

      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const parsedContent = JSON.parse(content);

          if (!parsedContent["@context"]) {
            setError("File has no Schema context.");
          } else {
            setAssetContent(content);
            selectedFile(content);
          }
        } catch (jsonError) {
          setError("Invalid JSON format. Please upload a valid JSON file.");
        }
      };

      setSelectedFile(file);

      // Read the file as text
      file !== null ? reader.readAsText(file) : setAssetContent(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const PopUp = () => {
    openPopUp(selectFile);
  };

  return (
    <Box>
      <Flex justifyContent="center" alignItems="center" mt="20vh">
        <input type="file" accept=".json" onChange={handleFileChange} />
      </Flex>
      <Flex justifyContent="center" alignItems="center" mt="20px">
        {selectFile && (
          <Text
            color="#11047A"
            fontSize={{
              base: "xl",
              md: "lg",
              lg: "lg",
              xl: "lg",
              "2xl": "md",
              "3xl": "lg",
            }}
            mb="5px"
            fontWeight="bold"
            me="14px"
          >
            Selected file: {selectFile.name}
          </Text>
        )}
      </Flex>
      <Flex justifyContent="center" alignItems="center" >
        {selectFile && (
          <Text
            color="#11047A"
            fontSize={{
              base: "xl",
              md: "lg",
              lg: "lg",
              xl: "lg",
              "2xl": "md",
              "3xl": "lg",
            }}
            mb="5px"
            fontWeight="bold"
            me="14px"
          >
            {formatBytes(selectFile.size)}
          </Text>
        )}
      </Flex>
      <Flex justifyContent="center" alignItems="center" mt="20px">
          <Text
            color="red.500"
            fontSize={{
              base: "xl",
              md: "lg",
              lg: "lg",
              xl: "lg",
              "2xl": "md",
              "3xl": "lg",
            }}
            mb="5px"
            fontWeight="bold"
            me="14px"
          >
            {error && `Invalid Json: ${error}`}
          </Text>
        </Flex>
    </Box>
  );
};

export default FileUpload;
