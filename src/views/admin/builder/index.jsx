/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AccountContext } from "../../../AccountContext";
import Card from "components/card/Card.js";
import KeyRecord from "views/admin/builder/components/KeyRecord";
import APIActivity from "views/admin/builder/components/APIActivity";
import Loading from "components/effects/Loading";
import {
  Box,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Grid,
  Text,
  Flex,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/builder/variables/activityColumns";
import { MdEdit, MdArrowCircleLeft } from "react-icons/md";

const queryParameters = new URLSearchParams(window.location.search);
const provided_txn_id = queryParameters.get("txn_id");

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

export default function Build() {
  const blockchain = localStorage.getItem("blockchain");
  const account = localStorage.getItem("account");
  const {
    isCreateAppOpen,
    setCreateAppPopup,
    data,
    setData,
    setAppIndex,
    app_index,
    connected_blockchain,
  } = useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const [isOpenDeleteKey, setIsDeleteKey] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [limit, setLimit] = useState("3");
  const [asset_count, setAssetCount] = useState(false);
  const [user_count, setUserCount] = useState(false);
  const [appInfo, setAppInfo] = useState("");
  const [txnInfo, setTxnInfo] = useState("");
  const [keyInfo, setKeyInfo] = useState("");
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [create_app, setCreateApp] = useState(false);
  const [isDeleteApp, setIsDeleteApp] = useState(false);
  const [isEditAppOpen, setOpenEditApp] = useState(false);
  const [filterForm, setFilterForm] = useState({
    app_description: 100,
    website: null,
    github: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/app/info`,
          { account: localStorage.getItem("account") },
          config
        );
        setAppInfo(response.data.result[0]);

        if (response.data.result.length > 0) {
          let app_form = {
            app_description: response.data.result[0].app_description,
            website: response.data.result[0].website,
            github: response.data.result[0].github,
          };
          setFilterForm(app_form);

          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/txns/info`,
            { app_name: response.data.result[0].app_name,
              limit: 100000 },
            config
          );

          let create_txns = response.data.result.filter(
            (obj) =>
              (obj.request === "Create" ||
                obj.request === "Create-n-Transfer") &&
              obj.progress === "COMPLETE"
          );
          setAssetCount(create_txns.length);

          const publishers = Array.from(
            new Set(create_txns.map((obj) => obj.approver))
          );
          setUserCount(publishers.length);

          setTxnInfo(response.data.result);

          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/keys/info`,
            {},
            config
          );

          setKeyInfo(response.data.result);

          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/user/info`,
            { },
            {
              headers: {
                "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
              },
            }
          );
  
          setUsers(response.data.result)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account, connected_blockchain]);

  const handleFilterInput = (e) => {
    const { name, value } = e.target;
    setFilterForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFilterChange = (name, value) => {
    setFilterForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const openCreateAppPopup = () => {
    setCreateAppPopup(true);
  };

  const closeCreateAppPopup = () => {
    setCreateAppPopup(false);
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };

  const submitApp = async (e) => {
    e.preventDefault();
    try {
      const request_data = {
        network: blockchain,
        app_name: e.target.app_name.value,
        app_description: e.target.app_description.value,
        alias: e.target.alias.value,
        website: e.target.website.value,
        github: e.target.github.value,
        key_count: 1,
      };

      await axios.post(
        `${process.env.REACT_APP_API_HOST}/app/create`,
        request_data,
        config
      );

      let response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/app/info`,
        { account: account },
        config
      );
      setAppInfo(response.data.result[0]);

      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/keys/info`,
        {},
        config
      );

      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/user/info`,
        { },
        {
          headers: {
            "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
          },
        }
      );

      setUsers(response.data.result)

      setKeyInfo(response.data.result);
      setCreateApp(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openPopupDeleteApp = (app_name) => {
    setInputValue(app_name);
    setIsDeleteApp(true);
  };

  const openPopupDeleteKey = (api_key) => {
    setInputValue(api_key);
    setIsDeleteKey(true);
  };

  const closePopupDeleteKey = () => {
    setIsDeleteKey(false);
  };

  const openEditApp = (app_name) => {
    setInputValue(app_name);
    setOpenEditApp(true);
  };

  const closePopupDeleteApp = () => {
    setIsDeleteApp(false);
  };

  const closeEditApp = () => {
    setOpenEditApp(false);
  };

  const handleDeleteApp = async (e) => {
    e.preventDefault();
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        try {
          await axios.post(
            `${process.env.REACT_APP_API_HOST}/app/delete`,
            {},
            config
          );
          setAppInfo("");
          setTxnInfo("");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
      setIsDeleteApp(false);
      setInputValue("");
    } catch (error) {
      console.error(error); // Handle the error case
    }
  };

  const handleCreateKey = async () => {
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        await axios.post(
          `${process.env.REACT_APP_API_HOST}/keys/create`,
          {},
          config
        );

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/keys/info`,
          {},
          config
        );
        setKeyInfo(response.data.result);
      };

      fetchData();
    } catch (error) {
      console.error(error); // Handle the error case
    }
  };

  const handleDeleteKey = async (isOpenDeleteKey) => {
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        try {
          const request_data = {
            api_key: isOpenDeleteKey,
          };
          await axios.post(
            `${process.env.REACT_APP_API_HOST}/keys/delete`,
            request_data,
            config
          );

          let response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/keys/info`,
            {},
            config
          );
          setKeyInfo(response.data.result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
      setIsDeleteKey(false);
      setInputValue("");
    } catch (error) {
      console.error(error); // Handle the error case
    }
  };

  const handleEditApp = async () => {
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        try {
          const request_data = {
            app_description: filterForm.app_description,
            website: filterForm.website,
            github: filterForm.github,
            account: account,
          };
          await axios.post(
            `${process.env.REACT_APP_API_HOST}/app/edit`,
            request_data,
            config
          );

          let response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/app/info`,
            { account: account },
            config
          );
          setAppInfo(response.data.result[0]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      setLoading(true);
      fetchData();
      setOpenEditApp(false);
      setLoading(false);
    } catch (error) {
      console.error(error); // Handle the error case
    }
  };

  if (!account) {
    return (
      <Box pt={{ base: "230px", md: "160px", lg: "160px", xl: "80px" }}>
        <Flex justify="center" align="center" height="100%">
          <Text
            textAlign="center"
            color="#11047A"
            fontSize="20px"
            fontWeight="500"
          >
            Please sign in to start building!
          </Text>
        </Flex>
      </Box>
    );
  }

  if (isOpenDeleteKey) {
    return (
      <Flex
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(226,232,240, 0.5)"
        justifyContent="center"
        alignItems="center"
        zIndex="1000"
      >
        <Card
          bg="white"
          p="6"
          boxShadow="lg"
          borderRadius="md"
          width={{ base: "90%", md: "60%", lg: "40%" }}
          maxWidth="500px"
          height="300px" // Adjusted height for taller card
          position="relative"
        >
          <Flex position="absolute" top="2" right="2">
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="5px"
              py="5px"
              onClick={() => closePopupDeleteKey()}
            >
              X
            </Button>
          </Flex>
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            textAlign="center"
            mt="20px"
          >
            <Text mb="4" color={tracColor} fontSize="lg">
              {`Are you sure you want to delete this key?`}
            </Text>
            <Text mb="4" color={tracColor} fontSize="md" fontWeight="bold">
              {`${isOpenDeleteKey}`}
            </Text>
            <Button
              type="submit"
              color={tracColor}
              border={"solid 1px"}
              mb="4"
              width="full"
              _hover={{ color: "red" }}
              mt="20px"
              onClick={() => handleDeleteKey(isOpenDeleteKey)}
            >
              Yes, delete this API key
            </Button>
          </Flex>
        </Card>
      </Flex>
    );
  }

  if (create_app) {
    return (
      <Box pt={{ base: "230px", md: "160px", lg: "160px", xl: "80px" }}>
        <Card ml="35%" w="30%" textAlign="center" boxShadow="md">
          <CloseButton
            onClick={() => setCreateApp(false)}
            position="absolute"
            right={4}
            top={4}
          />
          <form onSubmit={submitApp}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>App Name</FormLabel>
                <Input type="text" name="app_name" maxLength="20" />
              </FormControl>
              <FormControl>
                <FormLabel>App Description</FormLabel>
                <Textarea name="app_description" maxLength="255" />
              </FormControl>
              <FormControl>
                <FormLabel>Built by</FormLabel>
                <Input type="text" name="alias" maxLength="50" />
              </FormControl>
              <FormControl>
                <FormLabel>Project Website</FormLabel>
                <Input type="text" name="website" maxLength="50" />
              </FormControl>
              <FormControl>
                <FormLabel>Github Repo</FormLabel>
                <Input type="text" name="github" maxLength="50" />
              </FormControl>
              <Button
                type="submit"
                color={tracColor}
                border={"solid 1px"}
                mb="4"
                width="full"
              >
                Create
              </Button>
            </Stack>
          </form>
        </Card>
      </Box>
    );
  }

  if (account && !txnInfo && !appInfo) {
    return (
      <Box pt={{ base: "230px", md: "160px", lg: "160px", xl: "80px" }}>
        <Flex justify="center" align="center" height="100%">
          <Text
            textAlign="center"
            color="#11047A"
            fontSize="20px"
            fontWeight="500"
          >
            Create an app to start building!
          </Text>
        </Flex>
        <Flex justify="center" align="center" height="100%" mt="50px">
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={() => setCreateApp(true)}
            boxShadow="md"
          >
            Create App
          </Button>
        </Flex>
      </Box>
    );
  }

  return (
    account && (
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        bg="none"
        mt="40px"
      >
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "2fr 2fr",
          }}
          templateRows={{
            base: "repeat(3, 1fr)",
            lg: "1fr",
          }}
          gap={{ base: "20px", xl: "20px" }}
          h="500px"
          mb="20px"
          mt="20px"
        >
          {isEditAppOpen && (
            <Card boxShadow="md">
              <Flex>
                <Text
                  fontSize="26px"
                  color={textColor}
                  fontWeight="bold"
                  h="50px"
                >
                  Edit App
                </Text>
                <Button
                  bg="none"
                  border="solid"
                  borderColor={tracColor}
                  borderWidth="2px"
                  color={tracColor}
                  right="14px"
                  borderRadius="5px"
                  pl="10px"
                  pr="10px"
                  w="90px"
                  h="36px"
                  mb="10px"
                  ml="auto"
                  onClick={() => {
                    setOpenEditApp(false);
                  }}
                >
                  <Icon
                    transition="0.2s linear"
                    w="20px"
                    h="20px"
                    mr="5px"
                    as={MdArrowCircleLeft}
                    color={tracColor}
                  />
                  Back
                </Button>
              </Flex>
              <Box px="22px" pb="20px">
                <FormControl mb={4}>
                  <FormLabel>
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
                      fontWeight="bold"
                      me="14px"
                    >
                      App Descrption
                    </Text>
                  </FormLabel>
                  <Textarea
                    h="100px"
                    name="app_description"
                    value={filterForm.app_description}
                    onChange={handleFilterInput}
                    placeholder="Enter description"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>
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
                      fontWeight="bold"
                      me="14px"
                    >
                      Website
                    </Text>
                  </FormLabel>
                  <Input
                    name="website"
                    value={filterForm.website}
                    onChange={handleFilterInput}
                    placeholder="Enter website url"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>
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
                      fontWeight="bold"
                      me="14px"
                    >
                      Github
                    </Text>
                  </FormLabel>
                  <Input
                    name="github"
                    value={filterForm.github}
                    onChange={handleFilterInput}
                    placeholder="Enter github url"
                  />
                </FormControl>

                <Flex h="40px" mt="30px">
                  {!loading ? (
                    <Button
                      color={tracColor}
                      border={"solid 1px"}
                      mb="4"
                      width="full"
                      onClick={() => handleEditApp()}
                      h="40px"
                    >
                      Save
                    </Button>
                  ) : (
                    <Flex justifyContent="center">
                      <Stack>
                        <Spinner
                          thickness="2px"
                          speed="0.65s"
                          emptyColor="gray.200"
                          color={tracColor}
                          size="md"
                          ml="auto"
                          mr="auto"
                        />
                        <Text fontSize="md" color={tracColor}>
                          Saving...
                        </Text>
                      </Stack>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Card>
          )}

          {!isEditAppOpen && (
            <Card boxShadow="md">
              <Flex>
                <Text
                  fontSize="26px"
                  color={tracColor}
                  fontWeight="bold"
                  h="50px"
                >
                  {appInfo.app_name}
                </Text>
                <Icon
                  as={MdEdit}
                  color={tracColor}
                  w="30px"
                  h="30px"
                  onClick={() => setOpenEditApp(true)}
                  ml="auto"
                  mr="20px"
                  _hover={{ cursor: "pointer" }}
                />
              </Flex>
              <Text fontSize={{ sm: "md", lg: "xl" }} color={textColor}>
                Description:
              </Text>
              <Text
                fontSize={{ sm: "md", lg: "xl" }}
                color={tracColor}
                fontWeight="bold"
                h="70px"
                overflow="auto"
                ml="10px"
              >
                {appInfo.app_description}
              </Text>
              <Text fontSize={{ sm: "md", lg: "xl" }} color={textColor}>
                Web Page:
              </Text>
              <Text
                fontSize={{ sm: "md", lg: "xl" }}
                color={tracColor}
                fontWeight="bold"
                ml="10px"
              >
                {appInfo.website}
              </Text>
              <Text fontSize={{ sm: "md", lg: "xl" }} color={textColor}>
                Github:
              </Text>
              <Text
                fontSize={{ sm: "md", lg: "xl" }}
                color={tracColor}
                fontWeight="bold"
                ml="10px"
              >
                {appInfo.github}
              </Text>
              <Card boxShadow="md" h="150px" w="100%" mt="auto" mb="20px">
                <Flex justifyContent="space-between" mt="auto" mb="auto">
                  <Flex flex="1" justifyContent="center" alignItems="center">
                    <Stack spacing={2} align="center">
                      <Text
                        fontSize="26px"
                        color={tracColor}
                        fontWeight="bold"
                      >{`${txnInfo.length}`}</Text>
                      <Text
                        color={textColorSecondary}
                        fontSize="md"
                        fontWeight="500"
                      >{`Requests`}</Text>
                    </Stack>
                  </Flex>
                  <Flex flex="1" justifyContent="center" alignItems="center">
                    <Stack spacing={2} align="center">
                      <Text
                        fontSize="26px"
                        color={tracColor}
                        fontWeight="bold"
                      >{`${asset_count}`}</Text>
                      <Text
                        color={textColorSecondary}
                        fontSize="md"
                        fontWeight="500"
                      >{`Assets Created`}</Text>
                    </Stack>
                  </Flex>
                  <Flex flex="1" justifyContent="center" alignItems="center">
                    <Stack spacing={2} align="center">
                      <Text
                        fontSize="26px"
                        color={tracColor}
                        fontWeight="bold"
                      >{`${user_count}`}</Text>
                      <Text
                        color={textColorSecondary}
                        fontSize="md"
                        fontWeight="500"
                      >{`Publishers`}</Text>
                    </Stack>
                  </Flex>
                </Flex>
              </Card>
            </Card>
          )}

          <Card boxShadow="md" pt="20px">
            {keyInfo && keyInfo.length > 0 && (
              <SimpleGrid columns="1" gap="20px">
                <Box>
                  <Flex justify="space-between" align="center">
                    <Flex w="40%" justify="flex-start">
                      <Text fontSize="26px" color={textColor} fontWeight="bold">
                        {`API Keys`}
                      </Text>
                    </Flex>
                    <Flex w="40%" justify="flex-end" mr="20px">
                      {keyInfo.length !== 3 && (
                        <Button
                          variant="darkBrand"
                          color="white"
                          fontSize="lg"
                          fontWeight="500"
                          onClick={() => handleCreateKey()}
                        >
                          Add Key
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Box>

                {keyInfo.map((key, index) => (
                  <KeyRecord
                    key={index}
                    api_key={key.api_key}
                    setIsDeleteKey={setIsDeleteKey}
                  />
                ))}
              </SimpleGrid>
            )}
          </Card>
        </Grid>
        {/* level 2 */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "4fr",
          }}
          templateRows={{
            base: "repeat(3, 1fr)",
            lg: "1fr",
          }}
          gap={{ base: "20px", xl: "20px" }}
          h="900px"
          mb="20px"
        >
          <Card boxShadow="md" overflow="auto" h="860px">
            {txnInfo && users ? (
              <APIActivity columnsData={columnsDataComplex} txnInfo={txnInfo} users={users}/>
            ) : (
              <Loading />
            )}
          </Card>
        </Grid>
      </Card>
    )
  );
}
