import React, { useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Flex,
  Spacer,
  useColorModeValue,
  Avatar,
  Grid,
  GridItem,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import Science1 from "../../../..//src/assets/img/Science1.png";
import Science2 from "../../../..//src/assets/img/Science2.png";
import Science3 from "../../../..//src/assets/img/Science3.png";
import Science4 from "../../../..//src/assets/img/Science4.png";
import Card from "components/card/Card.js";
import Roadmap from "views/admin/home/components/Roadmap";
import {
  MdBarChart,
  MdStars,
  MdApi,
  MdOutlineConstruction,
  MdAccountBalanceWallet,
} from "react-icons/md";

const MotionBox = motion(Box);
const MotionText = motion(Text);

export default function FrontPage() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const tracColor = useColorModeValue("brand.900", "white");
  const textColorSecondary = "gray.400";

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
        zIndex={100}
        align="center"
        pl={{ lg: "20%", sm: "5%" }}
        pr={{ lg: "20%", sm: "5%" }}
        bg="white"
        boxShadow="lg"
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
          <Text mr={{ sm: "10px", lg: "30px" }}>
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
              About
            </Link>
          </Text>
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
        <Button color={tracColor} border={"solid 1px"} bg="none" px="35px" onClick={() => (window.location.href = "/overview")}>
          App
        </Button>
      </Flex>

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
              onClick={() => (window.location.href = "/my-othub/publish")}
            >
              Publish
            </Button>
            <Button
              color={tracColor}
              border={"solid 1px"}
              bg="none"
              ml="10px"
              px="50px"
              onClick={() => (window.location.href = "/knowledge")}
            >
              Explore
            </Button>
          </Flex>
        </Box>
      </Box>

      <Box
        w="100%"
        h={{ sm: "100px", lg: "400px" }}
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
        h="725px"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={8}
          alignItems="center"
        >
          <GridItem>
            <Box
              h="725px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              mt="-200px"
            >
              <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                Our Services
              </Text>
              <Text fontSize="lg" color={textColor} mt={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                non urna nec dui sollicitudin tempus. Quisque malesuada
                consequat sapien, in malesuada libero cursus sit amet.
              </Text>
            </Box>
          </GridItem>
          <GridItem>
            <Card
              w="100%"
              h="850px"
              mt="-100px"
              boxShadow="lg"
              backgroundColor="#FFFFFF"
              zIndex={50}
            >
              <Flex
                direction="column"
                justifyContent="space-between"
                h="100%" // Ensure Flex takes up the full height of the Card
                p={10}
              >
                <Flex textAlign="left">
                  <Icon
                    as={MdOutlineConstruction}
                    width="80px"
                    height="80px"
                    color={tracColor}
                  />
                  <Text
                    fontSize="30px"
                    mt="auto"
                    mb="auto"
                    ml="20px"
                    color={textColor}
                    fontWeight="bold"
                  >
                    Real World Asset Creation Tools
                    <Text
                      fontSize="20px"
                      fontWeight="400"
                      color={textColorSecondary}
                      mt="-10px"
                    >
                      for Creators and Explorers
                    </Text>
                  </Text>
                </Flex>

                <Flex textAlign="left">
                  <Icon
                    as={MdAccountBalanceWallet}
                    width="80px"
                    height="80px"
                    color={tracColor}
                  />
                  <Text
                    fontSize="30px"
                    mt="auto"
                    mb="auto"
                    ml="20px"
                    color={textColor}
                    fontWeight="bold"
                  >
                    Delegated Staking Services
                    <Text
                      fontSize="20"
                      fontWeight="400"
                      color={textColorSecondary}
                      mt="-10px"
                    >
                      Hosted by OTHub
                    </Text>
                  </Text>
                </Flex>

                <Flex textAlign="left">
                  <Icon
                    as={MdBarChart}
                    width="80px"
                    height="80px"
                    color={tracColor}
                  />
                  <Text
                    fontSize="30px"
                    mt="auto"
                    mb="auto"
                    ml="20px"
                    color={textColor}
                    fontWeight="bold"
                  >
                    OriginTrail Network Analytics
                    <Text
                      fontSize="20"
                      fontWeight="400"
                      color={textColorSecondary}
                      mt="-10px"
                    >
                      with Multichain Support
                    </Text>
                  </Text>
                </Flex>

                <Flex textAlign="left">
                  <Icon
                    as={MdStars}
                    width="80px"
                    height="80px"
                    color={tracColor}
                  />
                  <Text
                    fontSize="30px"
                    mt="auto"
                    mb="auto"
                    ml="20px"
                    color={textColor}
                    fontWeight="bold"
                  >
                    Personalized User Experience
                    <Text
                      fontSize="20"
                      fontWeight="400"
                      color={textColorSecondary}
                      mt="-10px"
                    >
                      for Creators and Node Operators
                    </Text>
                  </Text>
                </Flex>

                <Flex textAlign="left">
                  <Icon
                    as={MdApi}
                    width="80px"
                    height="80px"
                    color={tracColor}
                  />
                  <Text
                    fontSize="30px"
                    mt="auto"
                    mb="auto"
                    ml="20px"
                    color={textColor}
                    fontWeight="bold"
                  >
                    Free Open Source API
                    <Text
                      fontSize="20"
                      fontWeight="400"
                      color={textColorSecondary}
                      mt="-10px"
                    >
                      for RWA Creation and Analytics
                    </Text>
                  </Text>
                </Flex>
              </Flex>
            </Card>
          </GridItem>
        </Grid>
      </MotionBox>

      <Box
        w="100%"
        h={{ sm: "100px", lg: "400px" }}
        bg="blue"
        bgSize="cover"
        bgImage={Science1}
        bgAttachment="fixed"
        bgPos="10% 30%"
        pos="relative"
        bgRepeat="no-repeat"
      ></Box>

      <MotionBox
        id="section2"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        h="725px"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={8}
          alignItems="center"
        >
          <GridItem>
            <Card
              w="100%"
              h="850px"
              mt="-100px"
              boxShadow="lg"
              backgroundColor="#FFFFFF"
              zIndex={50}
              p={8}
            >
              <Roadmap />
            </Card>
          </GridItem>

          <GridItem>
            <Box
              h="725px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              mt="-200px"
            >
              <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                Our Roadmap
              </Text>
              <Text fontSize="lg" color={textColor} mt={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                non urna nec dui sollicitudin tempus. Quisque malesuada
                consequat sapien, in malesuada libero cursus sit amet.
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </MotionBox>
      <Box
        w="100%"
        h={{ sm: "100px", lg: "400px" }}
        bg="blue"
        bgSize="cover"
        bgImage={Science4}
        bgAttachment="fixed"
        bgPos="10% 80%"
        pos="relative"
        bgRepeat="no-repeat"
      ></Box>
      <MotionBox
        id="section3"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        h="725px"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={8}
          alignItems="center"
        >
          <GridItem>
            <Box
              h="725px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              mt="-200px"
            >
              <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                About OTHub
              </Text>
              <Text fontSize="lg" color={textColor} mt={4}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                non urna nec dui sollicitudin tempus. Quisque malesuada
                consequat sapien, in malesuada libero cursus sit amet.
              </Text>
            </Box>
          </GridItem>
          <GridItem>
            <Card
              w="100%"
              h="850px"
              mt="-100px"
              boxShadow="lg"
              backgroundColor="#FFFFFF"
              zIndex={50}
            >
              <Grid templateColumns="repeat(2, 1fr)" gap={6} p={4} pt={10}>
                {[
                  {
                    name: "CosmiCloud",
                    title: "Web Developer",
                    description: " ",
                  },
                  { name: "Dmitry", title: "Data Engineer", description: "" },
                  { name: "BRX", title: "Community Manager", description: "" },
                  {
                    name: "Luke Skinner",
                    title: "Founding Advisor",
                    description: "",
                  },
                ].map((user, index) => (
                  <Card
                    key={index}
                    boxShadow="md"
                    p={4}
                    borderRadius="md"
                    h="350px"
                  >
                    <Box textAlign="center">
                      <Avatar size="xl" mb={4} boxShadow="md" />
                      <Text fontSize="lg" fontWeight="bold">
                        {user.name}
                      </Text>
                      <Text>{user.title}</Text>
                      <Text>{user.description}</Text>
                    </Box>
                  </Card>
                ))}
              </Grid>
            </Card>
          </GridItem>
        </Grid>
      </MotionBox>

      <Box
        w="100%"
        h={{ sm: "100px", lg: "400px" }}
        bg="blue"
        bgSize="cover"
        bgImage={Science3}
        bgAttachment="fixed"
        bgPos="10% 80%"
        pos="relative"
        bgRepeat="no-repeat"
      ></Box>

      <MotionBox
        id="section4"
        w={{ base: "100%", md: "80%" }}
        mx="auto"
        textAlign="center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        p={8}
        minH="300px"
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor} mb={6}>
          FAQ
        </Text>

        <VStack spacing={4} w="60%" ml="auto" mr="auto">
          <Menu w="100%">
            <MenuButton as={Button} w="100%" textAlign="left" h="50px">
              Question 1
            </MenuButton>
            <MenuList>
              <MenuItem>Answer to question 1</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} w="full" textAlign="left" h="50px">
              Question 2
            </MenuButton>
            <MenuList>
              <MenuItem>Answer to question 2</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} w="full" textAlign="left" h="50px">
              Question 3
            </MenuButton>
            <MenuList>
              <MenuItem>Answer to question 3</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} w="full" textAlign="left" h="50px">
              Question 4
            </MenuButton>
            <MenuList>
              <MenuItem>Answer to question 4</MenuItem>
            </MenuList>
          </Menu>
        </VStack>
      </MotionBox>

      <Box w="100%" py={8} mt={16} color={tracColor} textAlign="center">
        <Text fontSize="xl" fontWeight="bold">
          © 2024 OTHub, LLC. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}
