import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Flex h="100vh" justify="center" align="center">
      <Box>
        <Heading textAlign="center" mb={3}>
          Page introuvable
        </Heading>
        <Text>
          <Text as="span" color="purple.500" textDecoration="underline">
            <Link to="/">Cliquez ici</Link>
          </Text>{" "}
          pour retourner à la page d'accueil
        </Text>
      </Box>
    </Flex>
  );
}
