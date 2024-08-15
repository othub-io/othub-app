import React, { useEffect, useState } from "react";
import { Box, Textarea, Text } from "@chakra-ui/react";

const CopyPaste = ({ displayContent, form_error}) => {
  const [error, setError] = useState(null);
  useEffect(() => {
    displayContent();
  }, []);

  const handleTextInput = (e) => {
    try {
      if(e.target.value){
        const content = e.target.value;
        const parsedContent = JSON.parse(content);
        if (!parsedContent["@context"]) {
          setError("JSON has no Schema context.");
          displayContent('b');
          form_error(true)
        } else {
          setError();
          displayContent(e.target.value);
          form_error(false)
        }
      }else{
        setError();
        displayContent('a');
        form_error(true)
      }
      } catch (jsonError) {
        setError("Invalid JSON format");
        displayContent();
        form_error(true)
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
