import React, { useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Flex,
  Spacer,
  useColorModeValue,
  Image,
  VStack,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Grid,
  GridItem,
  Divider,
  List,
  ListItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionText = motion(Text);

export default function FrontPage() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch any necessary data here
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Box w="100%">
      {/* Navbar */}
      <Flex
        as="nav"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        py={4}
        px={8}
        bg="#E2E8F0"
        position="fixed"
        top={0}
        left="50%"
        transform="translateX(-50%)"
        zIndex={1000}
        align="center"
      >
        <Flex>
          <Link
            to="hero"
            smooth={true}
            duration={500}
            offset={-100}
            mx={2}
            style={{ cursor: "pointer", color: tracColor, fontWeight: "bold" }}
          >
            Home
          </Link>
          <Link
            to="section1"
            smooth={true}
            duration={500}
            offset={-100}
            mx={2}
            style={{ cursor: "pointer", color: tracColor, fontWeight: "bold" }}
          >
            Services
          </Link>
          <Link
            to="section2"
            smooth={true}
            duration={500}
            offset={-100}
            mx={2}
            style={{ cursor: "pointer", color: tracColor, fontWeight: "bold" }}
          >
            FAQs
          </Link>
          <Link
            to="section3"
            smooth={true}
            duration={500}
            offset={-100}
            mx={2}
            style={{ cursor: "pointer", color: tracColor, fontWeight: "bold" }}
          >
            Founders
          </Link>
          <Link
            to="section4"
            smooth={true}
            duration={500}
            offset={-100}
            mx={2}
            style={{ cursor: "pointer", color: tracColor, fontWeight: "bold" }}
          >
            Roadmap
          </Link>
          <Link
            to="section5"
            smooth={true}
            duration={500}
            offset={-100}
            mx={2}
            style={{ cursor: "pointer", color: tracColor, fontWeight: "bold" }}
          >
            More Info
          </Link>
        </Flex>
        <Spacer />
        <Button colorScheme="teal" variant="outline">
          Sign Up
        </Button>
      </Flex>

      {/* Hero Section */}
      <Box
        id="hero"
        h="100vh"
        pt={20}
        w="100%"
        position="relative"
        bg="#E2E8F0"
      >
        <Image
          src="https://via.placeholder.com/1920x1080" // Replace with your image URL
          alt="Hero Banner"
          w="100%"
          h="100%"
          objectFit="cover"
          position="absolute"
          top={0}
          left={0}
        />
        <Box
          position="relative"
          zIndex={1}
          textAlign="center"
          top="50%"
          transform="translateY(-50%)"
        >
          <Text fontSize="4xl" fontWeight="bold" color={textColor}>
            Welcome to Our Website
          </Text>
          <Text fontSize="xl" color={textColor} mt={4}>
            We provide the best solutions for your business.
          </Text>
          <Button mt={8} colorScheme="teal" size="lg">
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Section 1: Services */}
      <MotionBox
        id="section1"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        bg="#E2E8F0"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        minH="100vh"
      >
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} alignItems="center">
          <GridItem>
            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
              Our Services
            </Text>
            <Text fontSize="lg" color={textColor} mt={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec dui sollicitudin tempus. Quisque malesuada consequat sapien, in malesuada libero cursus sit amet.
            </Text>
          </GridItem>
          <GridItem>
            <Image
              src="https://via.placeholder.com/600x400" // Replace with your image URL
              alt="Services Image"
              objectFit="cover"
              w="100%"
              h="100%"
            />
          </GridItem>
        </Grid>
      </MotionBox>

      {/* Section 2: FAQs */}
      <MotionBox
        id="section2"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        bg="#E2E8F0"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        minH="100vh"
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor} mb={6}>
          Frequently Asked Questions
        </Text>
        <VStack spacing={4} align="center">
          <Menu>
            <MenuButton as={Button} colorScheme="teal" variant="outline">
              What services do you offer?
            </MenuButton>
            <MenuList>
              <MenuItem>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet facilisis urna. Duis venenatis nulla eu lorem vulputate, vel consequat ligula facilisis.
              </MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} colorScheme="teal" variant="outline">
              How can I contact support?
            </MenuButton>
            <MenuList>
              <MenuItem>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vehicula dui at ex facilisis, a volutpat sapien volutpat.
              </MenuItem>
            </MenuList>
          </Menu>
          {/* Add more FAQs as needed */}
        </VStack>
      </MotionBox>

      {/* Section 3: Founders */}
      <MotionBox
        id="section3"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        bg="#E2E8F0"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        minH="100vh"
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor} mb={6}>
          Meet the Founders
        </Text>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={8}
          justifyItems="center"
        >
          <GridItem textAlign="center">
            <Avatar
              src="https://via.placeholder.com/200" // Replace with founder image URL
              name="Founder 1"
              size="2xl"
              mb={4}
            />
            <Text fontSize="xl" color={textColor}>
              Founder 1
            </Text>
            <Text color={textColor} mt={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a purus sed odio suscipit gravida.
            </Text>
          </GridItem>
          <GridItem textAlign="center">
            <Avatar
              src="https://via.placeholder.com/200" // Replace with founder image URL
              name="Founder 2"
              size="2xl"
              mb={4}
            />
            <Text fontSize="xl" color={textColor}>
              Founder 2
            </Text>
            <Text color={textColor} mt={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a purus sed odio suscipit gravida.
            </Text>
          </GridItem>
          <GridItem textAlign="center">
            <Avatar
              src="https://via.placeholder.com/200" // Replace with founder image URL
              name="Founder 3"
              size="2xl"
              mb={4}
            />
            <Text fontSize="xl" color={textColor}>
              Founder 3
            </Text>
            <Text color={textColor} mt={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a purus sed odio suscipit gravida.
            </Text>
          </GridItem>
        </Grid>
      </MotionBox>

      {/* Section 4: Roadmap */}
      <MotionBox
        id="section4"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        bg="#E2E8F0"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        minH="100vh"
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor} mb={6}>
          Our Roadmap
        </Text>
        <VStack spacing={8} align="stretch" maxW="800px" mx="auto">
          <HStack spacing={4} align="center">
            <Box w="24px" h="24px" borderRadius="full" bg={tracColor} />
            <Text fontSize="xl" color={textColor}>
              Milestone 1: Initial Launch
            </Text>
          </HStack>
          <HStack spacing={4} align="center">
            <Box w="24px" h="24px" borderRadius="full" bg={tracColor} />
            <Text fontSize="xl" color={textColor}>
              Milestone 2: User Feedback
            </Text>
          </HStack>
          <HStack spacing={4} align="center">
            <Box w="24px" h="24px" borderRadius="full" bg={tracColor} />
            <Text fontSize="xl" color={textColor}>
              Milestone 3: Feature Expansion
            </Text>
          </HStack>
          <HStack spacing={4} align="center">
            <Box w="24px" h="24px" borderRadius="full" bg={tracColor} />
            <Text fontSize="xl" color={textColor}>
              Milestone 4: Global Outreach
            </Text>
          </HStack>
          {/* Add more milestones as needed */}
        </VStack>
      </MotionBox>

      {/* Section 5: More Info */}
      <MotionBox
        id="section5"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        bg="#E2E8F0"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        minH="100vh"
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor} mb={6}>
          More Information
        </Text>
        <Text fontSize="lg" color={textColor} mt={4}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in lacus malesuada, faucibus sapien non, egestas orci. Sed ultrices erat eu lectus consequat fringilla.
        </Text>
      </MotionBox>

      {/* Section 6: Text and Video */}
      <MotionBox
        id="section6"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        bg="#E2E8F0"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        minH="100vh"
      >
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
          <GridItem>
            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
              Watch Our Video
            </Text>
            <Text fontSize="lg" color={textColor} mt={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel arcu ac ex condimentum luctus. Fusce pharetra est ut justo sodales, nec laoreet urna dictum.
            </Text>
          </GridItem>
          <GridItem>
            <Box
              as="video"
              controls
              w="100%"
              h="auto"
              maxH="400px"
              borderRadius="md"
              bg="black"
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </Box>
          </GridItem>
        </Grid>
      </MotionBox>

      {/* Section 7: Six Content Areas */}
      <MotionBox
        id="section7"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        bg="#E2E8F0"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        minH="100vh"
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor} mb={6}>
          Team Members
        </Text>
        <Grid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap={8}
          justifyItems="center"
        >
          <GridItem textAlign="center">
            <Avatar
              src="https://via.placeholder.com/100" // Replace with avatar image URL
              name="Team Member 1"
              size="xl"
              mb={4}
            />
            <Text fontSize="lg" color={textColor}>
              Team Member 1
            </Text>
          </GridItem>
          <GridItem textAlign="center">
            <Avatar
              src="https://via.placeholder.com/100" // Replace with avatar image URL
              name="Team Member 2"
              size="xl"
              mb={4}
            />
            <Text fontSize="lg" color={textColor}>
              Team Member 2
            </Text>
          </GridItem>
          <GridItem textAlign="center">
            <Avatar
              src="https://via.placeholder.com/100" // Replace with avatar image URL
              name="Team Member 3"
              size="xl"
              mb={4}
            />
            <Text fontSize="lg" color={textColor}>
              Team Member 3
            </Text>
          </GridItem>
          <GridItem textAlign="center">
            <Avatar
              src="https://via.placeholder.com/100" // Replace with avatar image URL
              name="Team Member 4"
              size="xl"
              mb={4}
            />
            <Text fontSize="lg" color={textColor}>
              Team Member 4
            </Text>
          </GridItem>
          <GridItem textAlign="center">
            <Avatar
              src="https://via.placeholder.com/100" // Replace with avatar image URL
              name="Team Member 5"
              size="xl"
              mb={4}
            />
            <Text fontSize="lg" color={textColor}>
              Team Member 5
            </Text>
          </GridItem>
          <GridItem textAlign="center">
            <Avatar
              src="https://via.placeholder.com/100" // Replace with avatar image URL
              name="Team Member 6"
              size="xl"
              mb={4}
            />
            <Text fontSize="lg" color={textColor}>
              Team Member 6
            </Text>
          </GridItem>
        </Grid>
      </MotionBox>

      {/* Footer */}
      <Box
        w="100%"
        py={8}
        mt={16}
        color={tracColor}
        textAlign="center"
      >
        <Text fontSize="xl" fontWeight="bold">
          © 2024 Othub. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}
