import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function DashboardDayReport(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
 const { user, userData } = useContext(AuthContext);
 
  const handleClick = async (isReaded, uid) => {
    onOpen();
    if (!isReaded && (userData.isAdmin === "admin" || userData.isAdmin === "adjoint") && uid === user.uid) {
      await updateDoc(doc(db, "reports", props.id), {
        isReaded: true,
      });
    }
  };

  console.log(user)
  console.log("user.uid")
  console.log(props.uid)

  return (
    <Box
      background="white"
      p={2}
      rounded="md"
      border="1px solid"
      borderColor="gray.300"
      _hover={{
        boxShadow: "lg",
        border: "1px solid",
        borderColor: "purple.300",
        background: "purple.50",
      }}
      boxShadow="md"
      cursor="pointer"
      onClick={() => handleClick(props.isReaded, props.uid)}
    >
      <Flex align="center" justify="space-between">
        <Text fontWeight="bold">{props.name}</Text>
        {!props.isReaded && (userData.isAdmin === "admin" || userData.isAdmin === "adjoint") && props.uid === user.uid && (
          <Badge colorScheme="purple">Non lu</Badge>
        )}
      </Flex>

      <Text fontWeight="bold">
        Date:{" "}
        <Text as="span" fontWeight="normal" fontStyle="italic">
          {props.date} à {props.hour}
        </Text>
      </Text>
      <Text noOfLines={3}>
        <Text as="span" fontWeight="bold">
          Rapport:{" "}
        </Text>
        {props.body}
      </Text>
      {props.groupe &&
        <Text fontWeight="bold" color='blue.500'>
        Groupe:{" "}
        <Text as="span" fontWeight="normal" fontStyle="italic">
          {props.groupe}
        </Text>
      </Text>
      }
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ sm: "sm", md: "lg", base: "xs" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rapport</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">{props.name}</Text>
            <Text fontWeight="bold" mb={2}>
              Date:{" "}
              <Text as="span" fontWeight="normal">
                {props.date}
              </Text>
            </Text>
            <Text>{props.body}</Text>
            {props.difficulties && (
              <>
                <Text fontWeight="bold" mt={3}>
                  Difficultés rencontrées:
                </Text>
                <Text>{props.difficulties}</Text>
              </>
            )}

            <Flex justify="space-between" my={2}>
              <Flex>
                <Image src="/emoji_puff.png" w="40px" />
              </Flex>
              <Button colorScheme="purple" mr={3} onClick={onClose}>
                Fermer
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
