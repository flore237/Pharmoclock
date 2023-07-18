import {
  Box,
  Button,
  Collapse,
  Fade,
  FormLabel,
  Heading,
  Switch,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";
import { Select as Selects } from "chakra-react-select";
import { Flex } from "@chakra-ui/layout";


export default function CreateReport() {
  const [report, setReport] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { user, userData } = useContext(AuthContext);
  const [hasDifficulty, setHasDifficulty] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const [difficulty, setDifficulty] = useState("");
  const [group, setGroup] = useState([]);
  const [option, setOption] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  console.log("option")
  console.log(option)

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    // console.log(
    //   user.uid,
    //   userData.firstName,
    //   userData.lastName,
    //   report,
    //   difficulty,
    //   serverTimestamp()
    // );
    if(userData.groupId){

   group.map((group)=>
   {
      const create = async () => {
      const docRef = await addDoc(collection(db, "reports"), {
      uid: user.uid,
      userFirstName: userData.firstName,
      userLastName: userData.lastName,
      report: report,
      difficulty: difficulty,
      createdAt: serverTimestamp(),
      isReaded: false,
      groupeId: group.value,
      groupName: group.label,
    });
  }
create();
   }
   )


     }else{
   
    const docRef = await addDoc(collection(db, "reports"), {
      uid: user.uid,
      userFirstName: userData.firstName,
      userLastName: userData.lastName,
      report: report,
      difficulty: difficulty,
      createdAt: serverTimestamp(),
      isReaded: false,
    });

     }
    // console.log(docRef)
    setIsPending(false);
    toast({
      title: "Rapport envoyé",
      description: "Votre rapport a été envoyé avec succès",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    setReport("");
    setDifficulty("");
    // console.log(docRef);
  };

        useEffect(() => {

        const EmployeesTable = [];
        const loadingCourse = async (q) => {
          const querySnapshot = await getDocs(collection(db, "groups"));
          if(userData.groupId){
              userData.groupId.forEach((id)=>{
                querySnapshot.docs.filter((groupe)=>{
                    if(groupe.id === id){
                 EmployeesTable.push({
                label: groupe.data().name,
                value: groupe.id,
              });

                    }
                })
                setOption(EmployeesTable)
            
            }
              )


          }
          // if(querySnapshot.docs){
          //   console.log("querySnapshot.docs")
          //   console.log(querySnapshot.docs)
          //   querySnapshot.docs.map((group, index) => {
          //     EmployeesTable.push({
          //       label: group.data().name,
          //       value: group.id,
          //     });
          //   });
          //   setOption(EmployeesTable)
          // }
        };
        loadingCourse();
      }, []);
  return (
    <Box p={userData.isAdmin === "admin" ? { base: 4, md: 10 } : ""} minH="100vh">
      <Heading>Rédiger un rapport</Heading>
      <Box as="form" onSubmit={handleSubmit}>
        <Text fontWeight="bold" mt={5}>
          Ce qui a été fait aujourd'hui:
        </Text>
        <Textarea
          required
          mt={2}
          background="white"
          size="xl"
          autoFocus
          value={report}
          onChange={(e) => setReport(e.target.value)}
          minH="180px"
          rounded="md"
          boxShadow="md"
          maxLength={500}
          p={4}
        />
        <Box mt={5} display="flex">
          <FormLabel htmlFor="difficulty">
            As tu rencontré des difficulté ?
          </FormLabel>
          <Switch
            colorScheme="purple"
            size="lg"
            id="difficulty"
            onChange={onToggle}
          />
        </Box>

        <Collapse in={isOpen} animateOpacity>
          <Box>
            <Text fontWeight="bold" mt={2}>
              Difficultés rencontrées:
            </Text>
            <Textarea
              mt={2}
              background="white"
              size="xl"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              minH="180px"
              rounded="md"
              boxShadow="md"
              maxLength={400}
              p={4}
            />
          </Box>
        </Collapse>
{userData.groupId &&
            <Box gap={5} mb={3} mt={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
        
              <FormLabel fontWeight={"bold"}>Groupe(s)</FormLabel>
                <Selects
                    isMulti
                    name="selectedCourse"
                    value={group}
                    onChange={setGroup}
                    placeholder="Selectionner le groupe"
                    options={option}
                    isRequired
                  >
                      
                  </Selects>
    
   
          </Box>
}

        <Button
          marginRight="auto"
          mt={3}
          type="submit"
          colorScheme="purple"
          isLoading={isPending}
        >
          Envoyer
        </Button>
      </Box>
    </Box>
  );
}
