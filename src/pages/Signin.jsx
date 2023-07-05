import { Box, Center, Heading, Hide, Text, useToast } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  useColorModeValue,
  VStack,
  Checkbox,
  Link,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Signin() {
  const { signin, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  const handleForgotPassword = () => {
    toast({
      title: "Mot de passe oublié ?",
      description:
        "Si vous avez oublié votre mot de passe veuiller contacter l'administrateur",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(email, password);
    try {
      setError(null);
      setIsloading(true);
      const res = await signin(email, password);
      // console.log(res);
      toast({
        title: "Connexion réussie",
        description: "Vous avez été connecté avec succès",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setIsloading(false);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError("Utilisateur introuvable");
      }
      toast({
        title: "Connexion échouée",
        description: "Adresse email ou mot de passe incorrect",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setIsloading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      background={{ base: "purple.500", md: "white" }}
      direction={{ base: "column", md: "row" }}
    >
      <Hide below="md">
        <Flex w="50%">
          <Image
            alt="Cover image"
            objectFit="cover"
            src="https://img.freepik.com/premium-vector/login-illustration_123815-21.jpg?w=2000"
            h={"100vh"}
          />
        </Flex>
      </Hide>
      <Hide above="md">
        <Center mt={10}>
          <Image src="./white_logo.png" w="150px" />
        </Center>
      </Hide>

      <Flex
        direction="column"
        w={{ base: "100%", md: "50%" }}
        justify="center"
        align="center"
      >
        <Heading
          fontSize="2xl"
          color={{ base: "white", md: "black" }}
          my={{ base: 6, md: 0 }}
        >
          Connexion
        </Heading>
        <Box
          mx={{ base: 2, md: "" }}
          as="form"
          rounded="lg"
          boxShadow="lg"
          p={{ base: 5, sm: 10 }}
          onSubmit={handleSubmit}
          bg="white"
        >
          <Box>
            <FormControl id="email" mb={2}>
              <FormLabel>Email</FormLabel>
              <Input
                rounded="md"
                type="email"
                focusBorderColor="purple.500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" mb={2}>
              <FormLabel>Mot de passe</FormLabel>
               <InputGroup>
              <Input
               type={showPassword ? 'text' : 'password'}
                rounded="md"
                focusBorderColor="purple.500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>

            </FormControl>
          </Box>
          <Box>
            <Flex gap={3} my={3}>
              <Checkbox colorScheme="purple" size="md">
                Se souvenir de moi
              </Checkbox>
              <Link
                fontSize={{ base: "md", sm: "md" }}
                onClick={handleForgotPassword}
              >
                Mot de passe oublié?
              </Link>
            </Flex>
            <Button
              colorScheme="purple"
              w="100%"
              type="submit"
              isLoading={isLoading}
              loadingText="Connexion"
            >
              Se connecter
            </Button>
          </Box>
          {error && <Text>{error}</Text>}
        </Box>
        {/* <Stack spacing={4}>
          <Stack align="center">
            <Heading fontSize="2xl" color={{ base: "white", md: "black" }}>
              Connexion
            </Heading>
          </Stack>
          <VStack
            as="form"
            spacing={8}
            boxSize={{ base: "xs", sm: "sm", md: "md" }}
            h="max-content !important"
            bg={useColorModeValue("white", "gray.700")}
            rounded="lg"
            boxShadow="lg"
            p={{ base: 5, sm: 10 }}
            onSubmit={handleSubmit}
          >
            <VStack spacing={4} w="100%">
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  rounded="md"
                  type="email"
                  focusBorderColor="purple.500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Mot de passe</FormLabel>
                <Input
                  rounded="md"
                  type="password"
                  focusBorderColor="purple.500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </VStack>
            <VStack w="100%">
              <Stack direction="row" justify="space-between" w="100%">
                <Checkbox colorScheme="purple" size="md">
                  Se souvenir de moi
                </Checkbox>
                <Link
                  fontSize={{ base: "md", sm: "md" }}
                  onClick={handleForgotPassword}
                >
                  Mot de passe oublié?
                </Link>
              </Stack>
              <Button
                colorScheme="purple"
                w="100%"
                type="submit"
                isLoading={isLoading}
                loadingText="Connexion"
              >
                Se connecter
              </Button>
            </VStack>
            {error && <Text>{error}</Text>}
          </VStack>
        </Stack> */}
      </Flex>
    </Flex>
  );
}
