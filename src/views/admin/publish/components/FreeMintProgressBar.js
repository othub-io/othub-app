import React from 'react';
import { Box, Progress, Text, useColorModeValue } from '@chakra-ui/react';

const stages = ["PENDING", "PROCESSING", "CREATED", "COMPLETE"];

const ProgressBar = ({ progress }) => {
  const progressIndex = stages.indexOf(progress);
  const progressValue = ((progressIndex + 1) / stages.length) * 100;
  const tracColor = useColorModeValue("brand.900", "white");

  return (progressValue &&
    <Box width="100%" p={4} boxShadow="md" borderRadius="md">
      <Text fontWeight="bold" fontSize="lg" color={tracColor} textAlign="center" mb="20px">
        {progress === 'COMPLETE' ? "Congratulations! Your asset has been created!" : "Please be patient while your asset is created!"}
      </Text>
      <Progress 
        value={progressValue} 
        size="lg" 
        w="90%" 
        hasStripe 
        isAnimated 
        sx={{
          transition: 'value 0.6s ease-in-out',
          '& > div:first-of-type': {
            backgroundColor: tracColor,
          }
        }}
        backgroundColor="gray.200"
        ml="5%"
      />
      <Box display="flex" justifyContent="space-between" mt={2} width="90%" ml="5%">
        {stages.map((stage, index) => (
          <Text key={index} fontSize="sm" color={index <= progressIndex ? tracColor : 'gray.100'} fontWeight="bold">
            {stage.charAt(0).toUpperCase() + stage.slice(1)}
          </Text>
        ))}
      </Box>
    </Box>
  );
};

export default ProgressBar;
