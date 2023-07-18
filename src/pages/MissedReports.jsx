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


export default function MissedReports() {
  const { user, userData } = useContext(AuthContext);
  const [personnel, setPersonnel] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [date, setDate] = useState();
  const [reportNone, setReportNone] = useState();
  const [searchName, setSearchName] = useState("");

  let { state } = useLocation();
      // console.log(state)

  const handleChangeName = (e) => {
    setSearchName(e.target.value);
  };

  const handleChange = () => {

    setIsPending(true);
    const getEmployeesWithoutReports = async () => {
      try {
        // Récupérer tous les employés de la collection "users"
        const querySnapshot = await getDocs(collection(db, "users"));
        const userIds = querySnapshot.docs.map((doc) => doc.id);
        // Récupérer les employés qui n'ont pas de rapport pour la date spécifiée
        const employeesWithoutReports = [];
        if(date){
          for (const userId of userIds){
            const q = query(
              collection(db, "reports"),
              where('uid', '==', userId),
            );
            const reportsSnapshot = await getDocs(q);
            let sortedMyReport = reportsSnapshot.docs.filter((doc)=>
              doc.data().createdAt.toDate().toISOString().split("T")[0] === date)

              if (sortedMyReport.length === 0) {
                let userDocId = querySnapshot.docs.filter((doc) => {
                  if(doc.id === userId){
                    employeesWithoutReports.push(doc)
                  }
                  return null;

                });
              }
          }
          setReportNone(employeesWithoutReports)
          setIsPending(false);
          return employeesWithoutReports;

        }else{
          setReportNone()
          setIsPending(false);
        }

      }catch (error) {
        console.error('Erreur lors de la récupération des employés sans rapport:', error);
        return [];
      }};

    getEmployeesWithoutReports();

  };



  useEffect(() => {
    if(state){
      setDate(state)
      handleChange();
    }
  }, [state]);




  return (
     <>
      {userData && (
        <Box p={{ base: 3, md: 10 }} minH="100vh" w='full'>
          <Heading>Rapports journaliers manqués</Heading>
          <Flex justify={'space-between'} mt={'7'} w='full'>
            <Flex  w='500px' >
              <Text textAlign={'center'} mr={'3'} mt={2} color={"purple.500"}>Choisir une date : </Text>
              <Input
                type="date"
                value={date}
                w={'200px'}
                onChange={(event) => setDate(event.target.value)}
                />
                <Button color="purple.500" ml={3} 
                onClick={handleChange}
                ><Icon as={FiSearch} /></Button>

            </Flex>
            <InputGroup width="300px">
                <InputRightElement
                  children={<Icon as={FiSearch} />}
                  cursor="pointer"
                />
                <Input
                  placeholder="Rechercher un employé"
                  variant="flushed"
                  onChange={handleChangeName}
                />
            </InputGroup>
          </Flex>
          <Container
            maxW="full"
            mt={5}
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
              <Text flex={1}>prenom</Text>
              <Text flex={1}>numero</Text>
              <Show above="md">
                <Text flex={1}>Adresse email</Text>
              </Show>
            </Flex>
        
            <Box>
                {!reportNone && !isPending &&
                <Text textAlign={'center'} mt={'3'}>Aucun(s) employé(s) pour cette date</Text>}

                {reportNone && !isPending &&
                  reportNone

                 .filter((personnel) =>{
                    if(searchName == ""){
                      return personnel;
                    }else if (personnel.data().lastName.toLowerCase().includes (searchName.toLowerCase()) || personnel.data().firstName.toLowerCase().includes (searchName.toLowerCase()) )
                      return personnel;
                  }) 
                  .map((personnel,index) => (
                  <Flex
                    w="full"
                    justify="space-between"
                    p={3}
                    key={index}
                    // _hover={{
                    //   background: "gray.100",
                    // }}
                    borderBottom="1px solid"
                    borderBottomColor="gray.300"
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
                )
                
              )
             
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
