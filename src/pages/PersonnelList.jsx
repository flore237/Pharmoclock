import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Show,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";

export default function PersonnelList() {
  const { user, userData } = useContext(AuthContext);
  const [personnel, setPersonnel] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("aaaaa");
    if (!user) {
      console.log("aaaaa");
      navigate("/");
    }
  }, [user]);
  useEffect(() => {
    if (userData && !userData.isAdmin) {
      navigate("/");
    }
  }, [userData]);
  useEffect(() => {
    setIsPending(true);
    const getPersonnel = async (q) => {
      const querySnapshot = await getDocs(collection(db, "users"));
      console.log(querySnapshot.docs[0].data());
      setPersonnel(querySnapshot.docs);
      setIsPending(false);
    };
    getPersonnel();
  }, []);

  return (
    <>
      {userData && (
        <Box p={{ base: 3, md: 10 }} minH="100vh">
          <Heading>Liste du personnel</Heading>
          <Container
            maxW="full"
            mt={5}
            px={0}
            background="white"
            p={{ base: 3, md: 5 }}
            rounded="md"
            boxShadow="md"
          >
            <Flex
              w="full"
              justify="space-between"
              p={3}
              background="purple.400"
              color="white"
              fontWeight="bold"
            >
              <Show above="md">
                <Text flex={1}>Nom</Text>
              </Show>
              <Text flex={1}>prenom</Text>
              <Text flex={1}>numero</Text>
              <Show above="md">
                <Text flex={1}>Adresse email</Text>
              </Show>
            </Flex>
            <Box>
              {personnel.map((personnel) => (
                <Link key={personnel.id} to={personnel.id.toString()}>
                  <Flex
                    w="full"
                    justify="space-between"
                    p={3}
                    _hover={{
                      background: "gray.100",
                    }}
                    borderBottom="1px solid"
                    borderBottomColor="gray.300"
                    cursor="pointer"
                  >
                    <Show above="md">
                      <Text flex={1}>
                        {personnel.data().lastName}{" "}
                        {personnel.data().isAdmin && (
                          <Badge colorScheme="purple" ml={1}>
                            Admin
                          </Badge>
                        )}
                      </Text>
                    </Show>
                    <Text flex={1}>{personnel.data().firstName}</Text>
                    <Text flex={1}>{personnel.data().phoneNumber}</Text>
                    <Show above="md">
                      <Text flex={1}>{personnel.data().email}</Text>
                    </Show>
                  </Flex>
                </Link>
              ))}
              {isPending && (
                <Flex direction="column" gap={3} mt={3}>
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                  <Skeleton height="40px" />
                </Flex>
              )}
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
}
