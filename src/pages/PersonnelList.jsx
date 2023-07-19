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
  Tooltip,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
  Button,

} from "@chakra-ui/react";
import { collection, getDocs, deleteDoc, doc,onSnapshot,query  } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";
import { FiSearch, FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import FilterProductEmployee from "../components/FilterProductEmployee";
import { Center } from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import { useToast } from "@chakra-ui/react";
import { BiDetail, BiSolidUserDetail } from "react-icons/bi";
import { CgDetailsMore } from "react-icons/cg";

export default function PersonnelList() {
  const { user, userData } = useContext(AuthContext);
  const [personnel, setPersonnel] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [filterValues, setFilterValues] = useState({ group1: 'nom', group2: 'asc' });
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const cancelRef = React.useRef();
  let sortedPersonnel = [...personnel];
  const navigate = useNavigate();



    //pagination
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 5;
  const pagesVisited = pageNumber * itemsPerPage;
  const pageCount = Math.ceil(personnel.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };



  // barre de recherche
  const handleChange = (e) => {
    setSearchName(e.target.value);
  };



  // const admins = sortedPersonnel.filter((personne) => personne.data().isAdmin === true);
  // console.log(admins)

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
                  sortedPersonnel = sortedPersonnel
                  .filter(personnel => personnel.data().isAdmin === "admin")
                  .sort((a, b) => a.data().lastName.localeCompare(b.data().lastName));
                }else if (filterValues.group1 === "Employee"){
                  sortedPersonnel = sortedPersonnel
                  .filter(personnel => personnel.data().isAdmin === "employe")
                  .sort((a, b) => a.data().lastName.localeCompare(b.data().lastName));
                }else{
                  sortedPersonnel = sortedPersonnel
                  .filter(personnel => personnel.data().isAdmin === "adjoint")
                  .sort((a, b) => a.data().lastName.localeCompare(b.data().lastName));
                }
                //else{
                //   sortedPersonnel = sortedPersonnel
                //   .filter(personnel => personnel.data().isAdmin === intermediaire)
                //   .sort((a, b) => a.data().lastName.localeCompare(b.data().lastName));
                // }
                // else if (personnel.data().firstName.toLowerCase().includes (searchName.toLowerCase()))
                //   return personnel;
               }else if(filterValues.group2 === "desc"){
                 if(filterValues.group1 === "nom"){
                  sortedPersonnel.sort((a, b) => b.data().lastName.localeCompare(a.data().lastName));
               }else if (filterValues.group1 === "Admin"){
                  sortedPersonnel = sortedPersonnel
                  .filter(personnel => personnel.data().isAdmin === "admin")
                  .sort((a, b) => b.data().lastName.localeCompare(a.data().lastName));
                }else if (filterValues.group1 === "Employee"){
                  sortedPersonnel = sortedPersonnel
                  .filter(personnel => personnel.data().isAdmin === "employe")
                  .sort((a, b) => b.data().lastName.localeCompare(a.data().lastName));
                }else{
                  sortedPersonnel = sortedPersonnel
                  .filter(personnel => personnel.data().isAdmin === "adjoint")
                  .sort((a, b) => b.data().lastName.localeCompare(a.data().lastName));
                }
                // else{
                //   sortedPersonnel = sortedPersonnel
                //   .filter(personnel => personnel.data().isAdmin === intermediaire)
                //   .sort((a, b) => b.data().lastName.localeCompare(a.data().lastName));
                // }

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
    if (userData && userData.isAdmin !== "admin") {
      navigate("/");
    }
  }, [userData]);
  useEffect(() => {
    setIsPending(true);
    const getPersonnel = async () => {
        const q = query(
        collection(db, "users"),
        // limit(50)
      );

          const querySnapshot = onSnapshot(q, (snapshot) => {
                setPersonnel(snapshot.docs);
                setIsPending(false);
            });
    };
    getPersonnel();
  }, []);
  

  return (
    <>
      {userData && (
        <Box p={{ base: 3, md: 10 }} minH="100vh">
          <Heading>Liste du personnel</Heading>
          <Flex
            mt='5'
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
              {/* <Text flex={1}>numero</Text> */}
              <Show above="md">
                <Text flex={1}>Adresse email</Text>
              </Show>
                 <Show above="md">
                <Text flex={1}></Text>
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
              // .slice(pagesVisited, pagesVisited + itemsPerPage)
              
              .map((personnel) => (
                  <PersonnelElement personnel={personnel} index={personnel.id} />
                 
                
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
               
              {sortedPersonnel && !isPending &&  
    
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
          }
        </Box>
      )}
    </>
  );
}

const PersonnelElement = ({ personnel, index }) => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const toast = useToast();
    const [isPending, setIsPending] = useState(false);
  // const {
  //   isOpen: isOpenEditSeection,
  //   onOpen: OnOpenEditSection,
  //   onClose: OnCloseEditSection,
  // } = useDisclosure();
  const cancelRef = React.useRef();


   //supprimer personnel

  const removePersonnel = (id) => {
    if(id){

  
      console.log("id")
      console.log(id)
    setIsPending(true)
       const removeUsers = async () => {
      await deleteDoc(doc(db, "users", id));
    };
  

    //   const getPersonnel = async () => {
    //         const q = query(
    //     collection(db, "users"),
    //     // limit(50)
    //   );
    


    // };
      removeUsers();
    // getPersonnel();
  };
    toast({
      title: "Suppression du cyle.",
      description: "Suppresion reussit.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Flex
                    w="full"
                    justify="space-between"
                    p={3}
                  key={index}
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
                    {/* <Text flex={1}>{personnel.data().phoneNumber}</Text> */}
                    <Show above="md">
                      <Text flex={1}>{personnel.data().email}</Text>
                    </Show>
                    <Show above="md" >
                      <Flex flex={1} gap={3} mt={1} margin="0 auto">
                          {/* <Tooltip
                          label="Détails"
                          hasArrow
                          placement="top"
                          >
                            <Link key={personnel.id} to={personnel.id.toString()}>
                              <Icon
                                as={BiSolidUserDetail}
                                boxSize="18px"
                                 mt='1px'
                                  _hover={{
                                    background: "gray.100",
                                  }}
                                rounded="full"
                                color='purple.400'
                                // _hover={{ background: "red.100" }}
                              />
                            </Link>

                          </Tooltip> */}
                           <Link key={personnel.id} to={personnel.id.toString()}>
                            <Text textDecoration={'underline'}>Détails</Text>
                            </Link>
                            <Tooltip
                          label="Modifier"
                          hasArrow
                          placement="top"
                          >
                            <Link key={personnel.id} to={`/addstaff/${personnel.id.toString()}`}>
                              <Icon
                                as={FiEdit}
                                boxSize="17px"
                                // p="3"
                                  _hover={{
                                    background: "gray.100",
                                  }}
                                rounded="full"
                                // _hover={{ background: "red.100" }}
                              />
                            </Link>
                          </Tooltip>
                           <Icon
                              as={MdDelete}
                              boxSize="18px"
                              mt='1px'
                              // colors={'red.200'}
                              rounded="full"
                              color="red.400"
                              // _hover={{ background: "blue.100" }}
                              onClick={onToggle}
                              
                            />
                      </Flex>
                      <Box>
                          <AlertDialog
                            isOpen={isOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={onClose}
                            isCentered
                          >
                            <AlertDialogOverlay
                            // alignSelf={"center"}
                            >
                              <AlertDialogContent width={"380px"}>
                                <AlertDialogHeader
                                  fontSize="lg"
                                  fontWeight="bold"
                                  textAlign={"center"}
                                >
                                 Confirmation de suppression
                                </AlertDialogHeader>
                                <AlertDialogCloseButton />
                                <AlertDialogBody textAlign={"center"}>
                                Voulez-vous supprimer cet employé?
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                  <Button
                                    ref={cancelRef}
                                    onClick={onClose}
                                    colorScheme="red"
                                  >
                                    Annulez
                                  </Button>
                                  <Button
                                    colorScheme="green"
                                    onClick={() => removePersonnel(personnel.id.toString())}
                                    ml={3}
                                  >
                                    Supprimer
                                  </Button>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialogOverlay>
                          </AlertDialog>
                          {/* </Box> */}
                          {/* </Box> */}
                        </Box>
                    </Show>
                    
                  </Flex>

  );
};
