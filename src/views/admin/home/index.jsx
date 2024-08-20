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
import Science1 from "../../../..//src/assets/img/Science1.png";
import Science2 from "../../../..//src/assets/img/Science2.png";
import Science3 from "../../../..//src/assets/img/Science3.png";
import Science4 from "../../../..//src/assets/img/Science4.png";
import Card from "components/card/Card.js";

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
    <Box w="100%" justifyContent="center">
      <Flex
        as="nav"
        w={{ base: "100%", md: "100%" }}
        mx="auto"
        py={4}
        px={8}
        position="fixed"
        top={0}
        left="50%"
        transform="translateX(-50%)"
        zIndex={1000}
        align="center"
        pl={{ lg: "20%", sm: "5%" }}
        pr={{ lg: "20%", sm: "5%" }}
        bg="white"
        boxShadow="md"
      >
        <Flex w={{ sm: "80%", lg: "50%" }} color={tracColor} fontSize="lg">
          <Text mr={{ sm: "10px", lg: "30px" }}>
            <Link
              to="section1"
              smooth={true}
              duration={500}
              offset={-100}
              mx={2}
              style={{
                cursor: "pointer",
                color: tracColor,
                fontWeight: "bold",
              }}
            >
              Services
            </Link>
          </Text>
          <Text mr={{ sm: "10px", lg: "30px" }}>
            <Link
              to="section2"
              smooth={true}
              duration={500}
              offset={-100}
              mx={2}
              style={{
                cursor: "pointer",
                color: tracColor,
                fontWeight: "bold",
              }}
            >
              Roadmap
            </Link>
          </Text>
          {/* <Text mr={{ sm: "10px", lg: "30px" }}>
            <Link
              to="section3"
              smooth={true}
              duration={500}
              offset={-100}
              mx={2}
              style={{
                cursor: "pointer",
                color: tracColor,
                fontWeight: "bold",
              }}
            >
              Founders
            </Link>
          </Text> */}
          <Text mr={{ sm: "10px", lg: "30px" }}>
            <Link
              to="section4"
              smooth={true}
              duration={500}
              offset={-100}
              mx={2}
              style={{
                cursor: "pointer",
                color: tracColor,
                fontWeight: "bold",
              }}
            >
              FAQs
            </Link>
          </Text>
        </Flex>

        <Spacer />
        <Button color={tracColor} border={"solid 1px"} bg="none">
          Overview
        </Button>
      </Flex>

      {/* Hero Section */}
      <Box h="100vh" pt={{ sm: "55%", lg: "15%" }} w="90%" ml="5%">
        <Box
          position="relative"
          zIndex={1}
          textAlign="center"
          transform="translateY(-50%)"
        >
          <Flex justifyContent="center" pt={{ sm: "65%", lg: "20%" }}>
            <Avatar
              src={`${process.env.REACT_APP_API_HOST}/images?src=OTHub-Logo.png`}
              bg="#FFFFFF"
              w="150px"
              h="150px"
              boxShadow="md"
            />
          </Flex>
          <Flex justifyContent="center">
            <Text
              fontSize="75px"
              fontWeight="bold"
              color={tracColor}
              justifyContent="center"
            >
              othub.io
            </Text>
          </Flex>
          <Text fontSize="4xl" fontWeight="bold" color={textColor} mt="-10px">
            Discover the Power of Decentralized Knowledge.
          </Text>
          <Text fontSize="xl" color={textColor}>
            Tooling and Analytics for the Origintrail Decentralized Knowledge
            Graph.
          </Text>
          <Flex mt="30px" justifyContent="center">
            <Button
              color={tracColor}
              border={"solid 1px"}
              bg="none"
              mr="10px"
              px="50px"
            >
              Publish
            </Button>
            <Button
              color={tracColor}
              border={"solid 1px"}
              bg="none"
              ml="10px"
              px="50px"
            >
              Explore
            </Button>
          </Flex>
        </Box>
      </Box>

      {/* Section 1: Services */}
      <Box
        w="100%"
        h={{sm: "100px", lg: "400px"}}
        bg="blue"
        bgSize="cover"
        bgImage={Science2}
        bgAttachment="fixed"
        bgPos="10% 60%"
        pos="relative"
        bgRepeat="no-repeat"
      ></Box>
      <MotionBox
        id="section1"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        h="900px"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={8}
          alignItems="center"
        >
          <GridItem>
            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
              Our Services
            </Text>
            <Text fontSize="lg" color={textColor} mt={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              non urna nec dui sollicitudin tempus. Quisque malesuada consequat
              sapien, in malesuada libero cursus sit amet.
            </Text>
          </GridItem>
          <GridItem>
            <Card
              w="100%"
              h="1100px"
              mt="-100px"
              boxShadow="xl"
              backgroundColor="#FFFFFF"
              zIndex={1000}
            >
              
            </Card>
          </GridItem>
        </Grid>
      </MotionBox>

      <Box
        w="100%"
        h={{sm: "100px", lg: "400px"}}
        bg="blue"
        bgSize="cover"
        bgImage={Science1}
        bgAttachment="fixed"
        bgPos="10% 30%"
        pos="relative"
        bgRepeat="no-repeat"
      ></Box>
      {/* Section 4: Roadmap */}
      <MotionBox
        id="section4"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
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
      <Box
        w="100%"
        h={{sm: "100px", lg: "400px"}}
        bg="blue"
        bgSize="cover"
        bgImage={Science4}
        bgAttachment="fixed"
        bgPos="10% 80%"
        pos="relative"
        bgRepeat="no-repeat"
      ></Box>
      {/* Section 2: FAQs */}
      <MotionBox
        id="section2"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        minH="100vh"
        mt="40px"
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
                amet facilisis urna. Duis venenatis nulla eu lorem vulputate,
                vel consequat ligula facilisis.
              </MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} colorScheme="teal" variant="outline">
              How can I contact support?
            </MenuButton>
            <MenuList>
              <MenuItem>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                vehicula dui at ex facilisis, a volutpat sapien volutpat.
              </MenuItem>
            </MenuList>
          </Menu>
          {/* Add more FAQs as needed */}
        </VStack>
      </MotionBox>

      <Box
        w="100%"
        h={{sm: "100px", lg: "400px"}}
        bg="blue"
        bgSize="cover"
        bgImage={Science3}
        bgAttachment="fixed"
        bgPos="10% 80%"
        pos="relative"
        bgRepeat="no-repeat"
      ></Box>

      {/* Section 7: Six Content Areas */}
      <MotionBox
        id="section7"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
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
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
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
      <Box w="100%" py={8} mt={16} color={tracColor} textAlign="center">
        <Text fontSize="xl" fontWeight="bold">
          © 2024 OTHub, LLC. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}
