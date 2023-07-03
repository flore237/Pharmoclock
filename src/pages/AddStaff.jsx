import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Navigate, redirect, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function AddStaff() {
  const { user, userData } = useContext(AuthContext);
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // if (!user) {
  //   return <Navigate to="/signin" />;
  // }
  useEffect(() => {
    // console.log("aaaaa");
    if (!user) {
      // console.log("aaaaa");
      navigate("/");
    }
  }, [user]);
  useEffect(() => {
    if (userData && !userData.isAdmin) {
      navigate("/");
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({ email, password, firstName, name, phoneNumber, isAdmin });

    try {
      setError(null);
      setIsloading(true);
      const res = await signup(
        email,
        password,
        firstName,
        name,
        phoneNumber,
        isAdmin
      );
      toast({
        title: "Utilisateur créé avec succès",
        description: "Veuillez vous reconnecter à votre compte",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setEmail("");
      setPassword("");
      setName("");
      setFirstName("");
      // console.log(res);
      setIsloading(false);
    } catch (error) {
      // console.log(error);
      if (error.code === "auth/weak-password") {
        setError("Votre mot de passe doit être supérieur à 6 caractères");
      }
      if (error.code === "auth/invalid-email") {
        setError("Votre adresse email est invalide");
      }
      setIsloading(false);
    }
  };

  return (
    <Box p={{ base: 4, md: 10 }} minH="100vh">
      <Heading mb={5}>Ajouter un employé</Heading>
      {userData && (
        <Box
          as="form"
          onSubmit={handleSubmit}
          background="white"
          p={5}
          rounded="md"
          boxShadow="md"
        >
          <Flex gap={5} mb={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Prenom</FormLabel>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </FormControl>
          </Flex>
          <Flex gap={5} mb={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Numero</FormLabel>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </FormControl>
          </Flex>
          <Flex gap={5} mb={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <FormControl>
              <FormLabel>Mot de passe</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Statut</FormLabel>
              <Select
                onChange={(e) => {
                  if (e.target.value == "true") {
                    setIsAdmin(true);
                  } else {
                    setIsAdmin(false);
                  }
                }}
                value={isAdmin}
              >
                <option value={false}>Employé</option>
                <option value={true}>Administrateur</option>
              </Select>
            </FormControl>
          </Flex>

          {isLoading && (
            <Button
              mt={2}
              colorScheme="purple"
              isLoading
              loadingText="Submitting"
            >
              Ajouter
            </Button>
          )}
          {!isLoading && (
            <Button mt={2} colorScheme="purple" type="submit">
              Ajouter
            </Button>
          )}
          {error && <Text>{error}</Text>}
        </Box>
      )}
    </Box>
  );
}
