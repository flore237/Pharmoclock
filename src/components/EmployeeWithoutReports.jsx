import React from 'react';
import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  Show,
  Skeleton,
  Text,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

function EmployeeWithoutReports(props) {
  return (
     <Container
            maxW="full"
            mt={5}
            px={0}
            background="white"
            p={{ base: 3, md: 5 }}
            rounded="md"
            boxShadow="md"
          >
            {/* <Flex
              w="full"
              justify="space-between"
              p={3}
              background="purple.400"
              color="white"
              fontWeight="bold"
            >
              {/* <Show above="md">
                <Text flex={1}>Nom</Text>
              </Show>
              <Text flex={1}>prenom</Text>
              <Text flex={1}>numero</Text>
              <Show above="md">
                <Text flex={1}>Adresse email</Text>
              </Show> */}
            {/* </Flex> */} 
            <Box>
              {/* {personnel

              .filter((personnel) =>{
                if(searchName == ""){
                  return personnel;
                }else if (personnel.data().firstName.toLowerCase().includes (searchName.toLowerCase()) || 
                personnel.data().lastName.toLowerCase().includes (searchName.toLowerCase()))
                  return personnel;
                }) */}
            

              {sortedPersonnel
              
               .filter((personnel) =>{
                if(searchName == ""){
                  return personnel;
                }else if (personnel.data().firstName.toLowerCase().includes (searchName.toLowerCase()) || 
                personnel.data().lastName.toLowerCase().includes (searchName.toLowerCase()))
                  return personnel;
                }) 
              // .slice(pagesVisited, pagesVisited + itemsPerPage)
              
              .map((personnel) => (
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
                        {personnel.data().isAdmin === "admin" && (
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
              ))
              //     .sort((a, b) =>{
              //     if(filterValues.group2 === "asc"){
              //   if(filterValues.group1 === "nom"){
              //      return a.lastName.localeCompare(b.lastName);
              //   }
              //   // else if (personnel.data().firstName.toLowerCase().includes (searchName.toLowerCase()))
              //   //   return personnel;
              //  }else if(filterValues.group2 === "desc"){
              //    if(filterValues.group1 === "nom"){
              //    return b.lastName.localeCompare(a.lastName);
              //   }

              //  }
              
              // })
              }
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

  )
}

export default EmployeeWithoutReports