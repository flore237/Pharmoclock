import { ViewIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, Icon, Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardCard(props) {
  const navigate = useNavigate();
  return (
    <Box
      p={3}
      background="#fff"
      w="full"
      rounded="md"
      boxShadow="md"
      borderLeft="7px solid"
      borderLeftColor={props.colorScheme ? props.colorScheme : "blue.500"}
    >
      <Flex>
        <Icon
          as={props.icon}
          boxSize="10"
          color={props.colorScheme ? props.colorScheme : "blue.500"}
        />
        <Box w="full">
          <Text textAlign="center" w="full" fontSize="lg">
            {props.title}
          </Text>
          <Text textAlign="center" fontSize="xxx-large" fontWeight="bold">
            {props.number ? props.number : "0"}
          </Text>
        </Box>
      </Flex>
      <Button
        w="full"
        colorScheme="purple"
        background="purple.50"
        border="1px solid"
        borderColor="purple.500"
        rightIcon={
          <ViewIcon
            rounded="full"
            background="purple.500"
            color="white"
            p={1.5}
            boxSize={7}
          />
        }
        onClick={() => navigate(props.href)}
        variant="ghost"
        _hover={{
          background: "purple.100",
        }}
      >
        {props.buttonText ? props.buttonText : "Voir les details"}
      </Button>
    </Box>
  );
}
