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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider, 
} from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";
import { FiSearch, FiEdit } from "react-icons/fi";
import FilterProductEmployee from "../components/FilterProductEmployee";

export default function PersonnelList() {
  const { user, userData } = useContext(AuthContext);
  const [personnel, setPersonnel] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [filterValues, setFilterValues] = useState({ group1: 'nom', group2: 'asc' });
  const sortedPersonnel = [...personnel];
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchName(e.target.value);
  };

  const admins = sortedPersonnel.filter((personne) => personne.data().isAdmin === true);
  console.log(admins)

    const onFilterValueChange = (group, value) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [group]: value
    }));

  };
  console.log(filterValues);

          if(filterValues.group2 === "asc"){
                if(filterValues.group1 === "nom"){
                   sortedPersonnel.sort((a, b) => a.data().lastName.localeCompare(b.data().lastName));
                }else if (filterValues.group1 === "Admin"){
                  admins.sort((a, b) => a.data().lastName.localeCompare(b.data().lastName));
                }
                // else if (personnel.data().firstName.toLowerCase().includes (searchName.toLowerCase()))
                //   return personnel;
               }else if(filterValues.group2 === "desc"){
                 if(filterValues.group1 === "nom"){
                  sortedPersonnel.sort((a, b) => b.data().lastName.localeCompare(a.data().lastName));
                }else if (filterValues.group1 === "Admin"){
                  admins.sort((a, b) => b.data().lastName.localeCompare(a.data().lastName));
                }

               }



//   const onFilterValueSelected=(filterValue)=>{
// console.log(filterValue);
//   }

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
          <Flex
            mt='3'
            justify="space-between">
            <InputGroup width="400px">
            <InputRightElement
              children={<Icon as={FiSearch} />}
              cursor="pointer"
            />
            <Input
              placeholder="Rechercher un employé"
              variant="flushed"
              onChange={handleChange}
            />
          </InputGroup>

          <FilterProductEmployee fonction={onFilterValueChange} filterValue={filterValues}  />
          </Flex>
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
        </Box>
      )}
    </>
  );
}
