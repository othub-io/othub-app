import React from "react";
import {
  Box,
  VStack,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepSeparator,
  StepNumber,
  StepIcon,
  useSteps,
  useColorModeValue
} from "@chakra-ui/react";

const Roadmap = () => {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const tracColor = useColorModeValue("brand.900", "blue"); // Use a fallback Chakra color name

  const steps = [
    {
      title: "Rebirth Phase",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec dui sollicitudin tempus. Quisque malesuada consequat sapien, in malesuada lib Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec dui sollicitudin tempus. Quisque malesuada consequat sapien, in malesuada libero cursus sit amet.",
    },
    { title: "Refinement Phase", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec dui sollicitudin tempus. Quisque malesuada consequat sapien, in malesuada lib Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec dui sollicitudin tempus. Quisque malesuada consequat sapien, in malesuada libero cursus sit amet." },
    { title: "Render Phase", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec dui sollicitudin tempus. Quisque malesuada consequat sapien, in malesuada lib Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec dui sollicitudin tempus. Quisque malesuada consequat sapien, in malesuada libero cursus sit amet." },
    { title: "Phase 4", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec dui sollicitudin tempus. Quisque malesuada consequat sapien, in malesuada lib Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec dui sollicitudin tempus. Quisque malesuada consequat sapien, in malesuada libero cursus sit amet." },
  ];

  const { activeStep } = useSteps({
    index: 2, // You can set the current step here
    count: steps.length,
  });

  return (
    <Box w="100%" p={4}>
      <Stepper
        size="lg"
        index={activeStep}
        orientation="vertical"
        gap="0"
        colorScheme="green" // Ensure tracColor is a valid color scheme
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <VStack align="start" ml={4} spacing={4} h="185px">
              <StepTitle fontSize="2xl">{step.title}</StepTitle>
              <StepDescription color="gray.600" textAlign="left">
                {step.description}
              </StepDescription>
            </VStack>

            <StepSeparator
                borderColor={activeStep > index ? tracColor : "gray.300"}
              />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default Roadmap;
