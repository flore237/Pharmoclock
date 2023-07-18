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
  Button,

} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";
import { FiSearch, FiEdit } from "react-icons/fi";
import FilterProductEmployee from "../components/FilterProductEmployee";
import { Center } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import { AiOutlineClose, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import CreerGroupe from "./creerGroupe";

function EmployeeGroup() {

  const { user, userData } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
    const [searchName, setSearchName] = useState("");


      // barre de recherche
  const handleChange = (e) => {
    setSearchName(e.target.value);
  };


    useEffect(() => {
        const getMyGroups = async () => {

        const q = query(
            collection(db, "groups"),
            limit(50)
        );
        setIsPending(true);
            try {
            const querySnapshot = onSnapshot(q, (snapshot) => {
                setGroups(snapshot.docs);
                setIsPending(false);
            });
            } catch (error) {
            // console.log(error.message);
            setIsPending(false);
            setError(true);
            }
        
        };
        getMyGroups();
     }, []);

  return ( 
    <>
    {userData && (
        <Box p={{ base: 3, md: 10 }} minH="100vh" w='full'>
          <Heading>Groupe d'employés</Heading>
      <Flex justify={'space-between'} mt={'7'} w='full'>
       
         <InputGroup width="300px">
            <InputRightElement
              children={<Icon as={FiSearch} />}
              cursor="pointer"
            />
            <Input
              placeholder="Rechercher un groupe"
              variant="flushed"
              onChange={handleChange}
            />
          </InputGroup>
          <CreerGroupe />
          </Flex>
          <Container
            maxW="full"
            mt={7}
            background="white"
            p={{ base: 3, md: 5 }}
            
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

              <Show above="md">
                <Text flex={1}>Description</Text>
              </Show>
            </Flex>
        
            <Box>
                {!groups && !isPending &&
                
                <Text textAlign={'center'} mt={'3'}>Aucun(s) groupe(s) ajouté(s)</Text>}
            

                {groups && !isPending &&

                groups

                 .filter((group) =>{
                if(searchName == ""){
                  return group;
                }else if (group.data().name.toLowerCase().includes (searchName.toLowerCase()))
                  return group;
                }) 
              .map((group,index) => (
                <Link key={group.id} to={group.id}>
                    <Flex
                        w="full"
                        justify="space-between"
                        p={3}
                        key={index}
                        _hover={{
                          background: "gray.100",
                        }}
                        borderBottom="1px solid"
                        borderBottomColor="gray.300"
                        cursor="pointer"
                    >
                        <Show above="md">
                            <Text flex={1}>
                                {group.data().name}{" "}
                            </Text>
                        </Show>
                        <Show above="md">
                            <Text flex={1}>
                                {group.data().description}
                            </Text>
                        </Show>
                    </Flex>
                </Link>
                ))}
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
              {/* {sortedPersonnel && !isPending &&  
    
         <Center mt='5'>
       
            <ReactPaginate 
              previousLabel={"<<"}
              nextLabel={">>"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </Center>
          } */}
        </Box>
      )}
    </>
  )
}

export default EmployeeGroup