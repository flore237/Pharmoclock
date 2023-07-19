import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Container, Flex, Heading, Text,Badge,Show, Skeleton, } from "@chakra-ui/react";
import { async } from "@firebase/util";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams, Link } from "react-router-dom";
import AttendanceList from "../components/AttendanceList";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";

export default function GroupDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
//   const [presences, setPresences] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [personnel, setPersonnel] = useState([]);
  const group = useLoaderData();
  const navigate = useNavigate();



    console.log("personnel")
    console.log(personnel)

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
            group.data().personnels.map((group)=>{
                if(querySnapshot.docs){
                    let requete = querySnapshot.docs.filter((personnel, index) =>{
                        if(personnel.id === group.value){
                            EmployeesTable.push(personnel)
                        }
            
                    });
                setPersonnel(EmployeesTable)
                setIsPending(false);
                 }
             })
            };
        loadingCourse();
     }, []);


  return (
    <Box p={{ base: 4, md: 10 }} minH="100vh">
      <Flex align="center" gap={1}>
        <ArrowBackIcon
          boxSize={8}
          onClick={() => navigate(-1)}
          cursor="pointer"
          p={1}
        />
        <Heading>Details</Heading>
      </Flex>
      <Container
        background="white"
        p={{ base: 3, md: 5 }}
        mt={3}
        boxShadow="md"
        rounded="md"
        maxW="container.xl"
      >
        <Text>
          <Text as="span" fontWeight="bold">
            Nom:
          </Text>{" "}
          {group.data().name}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">
            Description:
          </Text>{" "}
          {group.data().description}
        </Text>
        {/* <Text>
          <Text as="span" fontWeight="bold">
            Email:
          </Text>{" "}
          {personnel.data().email}
        </Text>
        <Text>
          <Text as="span" fontWeight="bold">
            Numéro:
          </Text>{" "}
          {personnel.data().phoneNumber}
        </Text> */}
      </Container>
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
               <Text flex={1}>Nom</Text>
              
              <Show above="md">
                <Text flex={1}>Prenom</Text>
                </Show>
               <Show above="md">
                <Text flex={1}>Numero</Text>
                </Show>
              <Show above="md">
                <Text flex={1}>Adresse email</Text>
              </Show>
            </Flex>
            <Box>
           
              {personnel
              
            //    .filter((personnel) =>{
            //     if(searchName == ""){
            //       return personnel;
            //     }else if (personnel.data().firstName.toLowerCase().includes (searchName.toLowerCase()) || 
            //     personnel.data().lastName.toLowerCase().includes (searchName.toLowerCase()))
            //       return personnel;
            //     }) 
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
                    
                      <Text flex={1}>
                        {personnel.data().lastName}{" "}
                        {personnel.data().isAdmin === "admin" && (
                          <Badge colorScheme="purple" ml={1}>
                            Admin
                          </Badge>
                        )}
                      </Text>
                    <Show above="md">
                    <Text flex={1}>{personnel.data().firstName}</Text></Show>

                    
                    <Show above="md"><Text flex={1}>{personnel.data().phoneNumber}</Text></Show>
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
  );
}

export const GroupDetailsLoader = async ({ params }) => {
  const { id } = params;
  const docRef = doc(db, "groups", id);
  const docSnap = await getDoc(docRef);

  return docSnap;
};


