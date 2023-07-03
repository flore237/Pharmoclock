import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { async } from "@firebase/util";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import AttendanceList from "../components/AttendanceList";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";

export default function PersonnelDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [presences, setPresences] = useState([]);
  const [isPending, setIsPending] = useState(false);

  const personnel = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
    const q = query(
      collection(db, "presences"),
      where("uid", "==", personnel.id),
      orderBy("heureArrivee", "desc"),
      limit(60)
    );
    const getPresences = async () => {
      const querySnapshot = await getDocs(q);
      setPresences(querySnapshot.docs);
      console.log(querySnapshot.docs);
      setIsPending(false);
    };
    getPresences();
  }, []);
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);
  return (
    <Box p={{ base: 4, md: 10 }} minH="100vh">
      <Flex align="center" gap={1}>
        <ArrowBackIcon
          boxSize={8}
          onClick={() => navigate(-1)}
          cursor="pointer"
          p={1}
        />
        <Heading>Profil</Heading>
      </Flex>
      <Container
        background="white"
        p={{ base: 3, md: 5 }}
        mt={3}
        boxShadow="md"
        rounded="md"
        maxW="container.xl"
      >
        <Text>
          <Text as="span" fontWeight="bold">
            Nom:
          </Text>{" "}
          {personnel.data().lastName}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">
            Prenom:
          </Text>{" "}
          {personnel.data().firstName}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">
            Email:
          </Text>{" "}
          {personnel.data().email}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">
            Numéro:
          </Text>{" "}
          {personnel.data().phoneNumber}
        </Text>
      </Container>
      <AttendanceList
        userData={personnel}
        presences={presences}
        isPending={isPending}
      />
    </Box>
  );
}

export const PersonnelDetailsLoader = async ({ params }) => {
  const { id } = params;
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  return docSnap;
};
