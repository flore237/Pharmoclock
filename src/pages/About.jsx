import { Box, Heading } from "@chakra-ui/react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function About() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/signin" />;
  }
  return (
    <Box>
      <Heading>About</Heading>
    </Box>
  );
}
