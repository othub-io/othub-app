import React, { useEffect, useState } from "react";
import { Box, Textarea, Text } from "@chakra-ui/react";

const CopyPaste = ({ displayContent}) => {
  const [error, setError] = useState(null);
  useEffect(() => {
    displayContent("");
  }, [displayContent]);

  const handleTextInput = (e) => {
    try {
      if(e.target.value){
        const content = e.target.value;
        const parsedContent = JSON.parse(content);
        if (!parsedContent["@context"]) {
          setError("JSON has no Schema context.");
          displayContent();
        } else {
          setError();
          displayContent(e.target.value);
        }
      }else{
        setError();
        displayContent();
      }
      } catch (jsonError) {
        setError("Invalid JSON format");
        displayContent();
      }
  };

  return (
    <Box as="copypaste" p={4} boxShadow="md" borderRadius="md" bg="white" overflow="auto" height="100%">
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
      <Textarea
        onChange={handleTextInput}
        resize="none"
        height="95%"
      />
    </Box>
  );
};

export default CopyPaste;
