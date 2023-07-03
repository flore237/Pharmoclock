import {
  Box,
  Button,
  Collapse,
  Fade,
  FormLabel,
  Heading,
  Switch,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";

export default function CreateReport() {
  const [report, setReport] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { user, userData } = useContext(AuthContext);
  const [hasDifficulty, setHasDifficulty] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const [difficulty, setDifficulty] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    // console.log(
    //   user.uid,
    //   userData.firstName,
    //   userData.lastName,
    //   report,
    //   difficulty,
    //   serverTimestamp()
    // );
    const docRef = await addDoc(collection(db, "reports"), {
      uid: user.uid,
      userFirstName: userData.firstName,
      userLastName: userData.lastName,
      report: report,
      difficulty: difficulty,
      createdAt: serverTimestamp(),
      isReaded: false,
    });
    setIsPending(false);
    toast({
      title: "Rapport envoyé",
      description: "Votre rapport a été envoyé avec succès",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    setReport("");
    setDifficulty("");
    // console.log(docRef);
  };
  return (
    <Box p={userData.isAdmin ? { base: 4, md: 10 } : ""} minH="100vh">
      <Heading>Rédiger un rapport</Heading>
      <Box as="form" onSubmit={handleSubmit}>
        <Text fontWeight="bold" mt={5}>
          Ce qui a été fait aujourd'hui:
        </Text>
        <Textarea
          required
          mt={2}
          background="white"
          size="xl"
          autoFocus
          value={report}
          onChange={(e) => setReport(e.target.value)}
          minH="180px"
          rounded="md"
          boxShadow="md"
          maxLength={500}
          p={4}
        />
        <Box mt={5} display="flex">
          <FormLabel htmlFor="difficulty">
            As tu rencontré des difficulté ?
          </FormLabel>
          <Switch
            colorScheme="purple"
            size="lg"
            id="difficulty"
            onChange={onToggle}
          />
        </Box>

        <Collapse in={isOpen} animateOpacity>
          <Box>
            <Text fontWeight="bold" mt={2}>
              Difficultés rencontrées:
            </Text>
            <Textarea
              mt={2}
              background="white"
              size="xl"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              minH="180px"
              rounded="md"
              boxShadow="md"
              maxLength={400}
              p={4}
            />
          </Box>
        </Collapse>
        <Button
          marginRight="auto"
          mt={3}
          type="submit"
          colorScheme="purple"
          isLoading={isPending}
        >
          Envoyer
        </Button>
      </Box>
    </Box>
  );
}
