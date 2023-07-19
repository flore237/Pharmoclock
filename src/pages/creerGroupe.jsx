import {
  Center,
  Heading,
  Divider,
  Input,
  NumberInput,
  FormControl,
  FormLabel,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Flex,
  Hide,
  InputGroup,
  InputRightAddon,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Avatar,
  Textarea,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  InputRightElement,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
   updateDoc,
     doc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";
import { FiSearch, FiEdit } from "react-icons/fi";
import FilterProductEmployee from "../components/FilterProductEmployee";
import ReactPaginate from "react-paginate";
import { AiOutlineClose, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { CheckIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { IoIosAdd } from "react-icons/io";
import { Select as Selects } from "chakra-react-select";
import { Show } from "@chakra-ui/media-query";


export default function CreerGroupe() {
    const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
    const [name, setName] = useState("");
    const { user, userData } = useContext(AuthContext);
    const [isPending, setIsPending] = useState(false);
    const [description, setDescription] = useState("");
    const [employees, setEmloyees] = useState([]);
    const [groupID, setGroupID] = useState([]);
    const [option, setOption] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();

    const cancelRef = useRef();




      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);

        const docRef = await addDoc(collection(db, "groups"), {
          name: name,
          description: description,
          personnels: employees
        });


        //recupere le groupe qu'on vient de creer
        const q = doc(db, "groups", docRef.id);
        const docSnap = await getDoc(q);

        //recupere tout les users
        const querySnapshot = await getDocs(collection(db, "users"));

        //on mappe le tableau des employes se trouvant dans le group quon vient de creer 
        docSnap.data().personnels.map((group)=>{
            //si il ya des users
          if(querySnapshot.docs){
            //on filtre les users
            let requete = querySnapshot.docs.filter((personnel, index) =>{
              //on verifie que l'id d'user est egal a lid qui se trouve dans le tableau d'employes dans le groupe
              // qu'on vient de creer
              if(personnel.id === group.value){
                  // on verifie si le champsgroupId existe dans users
                if(personnel.data().groupId){
                  //si oui on recuperele tableau groupId et on lui ajoute lid du groupe
                  //auquel on vient d'affecter l'utilisateur
                  const tableId = personnel.data().groupId;
                  tableId.push(docSnap.id)
                    const getUser = async (userId) => {
                      await updateDoc(doc(db, "users", personnel.id), {
                        groupId: tableId,
                      });
                    }
                  getUser();
                }else{
                  //sinon on ajoute le champs groupId et on lui affecte l'id du groupe
                  //auquel on vient d'affecter l'utilisateur
                  const tableId = [];
                  tableId.push(docSnap.id)
                    const getUser = async (userId) => {
                      await updateDoc(doc(db, "users", personnel.id), {
                        groupId: tableId,
                      });
                              
                      }
                    getUser();
                }   
              }
            });
            // setPersonnel(EmployeesTable)
            setIsPending(false);
          }
        })
      
        console.log("docSnap")
        console.log(docSnap.data())  
          
        setIsPending(false);
        toast({
          title: "Groupe créé",
          description: "Le groupe a été créé avec succès",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setName("")
        setDescription("")
        onClose();
        // console.log(docRef);
      };
  
      useEffect(() => {
        if (!user) {
          navigate("/signin");
        }
      }, [user]);

      useEffect(() => {
        setIsPending(true);
        const EmployeesTable = [];
        const loadingCourse = async (q) => {
          const querySnapshot = await getDocs(collection(db, "users"));
          if(querySnapshot.docs){
            querySnapshot.docs.map((personnel, index) => {
              EmployeesTable.push({
                label: personnel.data().firstName + " " + personnel.data().lastName,
                value: personnel.id,
              });
            });
            setOption(EmployeesTable)
            setIsPending(false);
          }
        };
        loadingCourse();
      }, []);

  

  return (
     <Center>
      <Box>
        <Box>
          <Show below='md'>
            <IconButton 
            rounded={"full"}
            background="purple.400"
            color="white"
            icon={<IoIosAdd size="30px" />}
            onClick={onOpen}
            
            />

          </Show>
          <Hide below='md'>

          <Button
            ml={["20px", "50px", "100px", "600px"]}
            rightIcon={<Icon as={IoIosAdd} boxSize="20px" />}
            onClick={onOpen}
          >
            Ajouter un groupe
          </Button></Hide>
        </Box>
        <Box>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            closeOnOverlayClick={false}
            size="2xl"
            // p={{ base: 4, md: 10 }}
          >
            <AlertDialogOverlay>
              <AlertDialogContent 

                width={['90%', '80%', '70%', '100%']}
                maxWidth="500px"
                mx="auto"
                my="auto"
            >
                <Box as={"form"} 
                onSubmit={handleSubmit}
                >
                  <Heading
                    p="1em"
                    textAlign="center"
                    bg={'black'}
                    bgClip="text"
                    fontSize={"30px"}
                  >
                    Ajouter un groupe
                  </Heading>
                  <Box mx="30px" pb={"15px"}>
                    <Divider />
                  </Box>
                  <Box width={['90%', '80%', '70%', '100%']}
                maxWidth="350px"  textAlign="center" gap={200} margin="0 auto">

                    <Flex pb={"10px"}>
                        <FormControl>
                            <FormLabel>Nom</FormLabel>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                        </FormControl>
                    </Flex>

                    <Flex pb={"10px"}>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                                <Textarea
                                    required
                                    mt={2}
                                    background="white"
                                    size="md"
                                    autoFocus
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)}
                                    minH="90px"
                                    rounded="md"
                                    boxShadow="md"
                                    maxLength={500}
                                    placeholder="Decrivez Brievement le groupe ici..."
                                    p={4}
                                    />
                        </FormControl>
                    </Flex>

                    <Flex pb={"10px"}>
                      <FormControl mt={"10px"}>
                          <FormLabel>Liste des employés</FormLabel>
                          <Selects
                            isMulti
                            name="selectedCourse"
                            value={employees}
                            onChange={setEmloyees}
                            placeholder="Selectionner des employés"
                            options={option}
                            isRequired
                          >
                      
                          </Selects>
                        </FormControl>
                    </Flex>
            
                  </Box>

                  <Box mx="30px" pt="0px" pb={"15px"} mt='3'>
                    <Divider />
                  </Box>
                  <Center mb="6">
                  <Button
                      type="submit"
                      colorScheme="red"
                      variant="solid"
                      mx="auto"
                      my="auto"
                      onClick={onClose}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      leftIcon={<CheckIcon />}
                      colorScheme="purple"
                      variant="solid"
                      mx="auto"
                      my="auto"
                    >
                      Enregistrer
                    </Button>
                  </Center>
                </Box>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      </Box>
    </Center>

  )
}
