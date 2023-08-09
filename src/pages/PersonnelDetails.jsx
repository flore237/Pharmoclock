import { ArrowBackIcon } from "@chakra-ui/icons";
import { 
  Box, 
  Button, 
  Collapse, 
  Container, 
  Flex, Heading, 
  Icon, 
  Input, 
  Switch, 
  Text, 
  Tooltip,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,

} from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';

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
import React, {forwardRef, useContext, useEffect, useState, useRef } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import AttendanceList from "../components/AttendanceList";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";
import { TfiFilter, TfiPrinter } from "react-icons/tfi";
import ReactToPrint from "react-to-print";
import ReactToPdf from "react-to-pdf";
import "../styles/globals.css";
import { AiOutlineClose } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";


//  const PersonnelDetails = forwardRef((props, ref) => {
 const PersonnelDetails = () => {

  const { id } = useParams();
  const { user,userData } = useContext(AuthContext);
  const [presences, setPresences] = useState([]);
  const [initialFilterPresences, setInitialFilterPresences] = useState([]);
  const [dateDebut, setDateDebut] = useState();
  const [dateFin, setDateFin] = useState();
  const [isPending, setIsPending] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const [myFilterPrecences, setMyFilterPresences] = useState([])
  let sortedMyPresences = [...presences]

//  const [filterPresenceValues, SetfilterPresenceValues] = useState[{state1: 'all', state2:"all"}]
  console.log("presences")
  console.log(presences)
  console.log(sortedMyPresences);
  const personnel = useLoaderData();
  const navigate = useNavigate();

  const componentRef = useRef();
  // const ref = React.createRef();
  const options = {
    orientation: "landscape",
    // unit: 'mm',
    // format: 'a4',
    center: true,
    marginLeft: "auto",
    marginRight: "auto"
  };
//scrooll du tri
 const groupeName = [1, 2, 3]
  const MAX_OPTIONS = 5; // Changer cette valeur pour ajuster le nombre maximal d'options

  const isScrollable = groupeName.length > MAX_OPTIONS;

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }

    const q = query(
      collection(db, "presences"),
      where("uid", "==", personnel.id),
      orderBy("heureArrivee", "desc"),
      limit(60)
    );


    const getPresences = async () => {
      const querySnapshot = await getDocs(q);
      setPresences(querySnapshot.docs);
      console.log(querySnapshot.docs);
      console.log(sortedMyPresences);
      setIsPending(false);
    };
    getPresences();
  }, []);


  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);


// fonction qui permet de filtrer pour une periode de date
  const handleApplyFilters =  () => {
      // const querySnapshot = await getDocs(q);
      console.log(presences);
      console.log(sortedMyPresences);
      const dateFinTemp = new Date(dateFin)
      console.log(dateFinTemp);
      // .toLocaleDateString("fr-FR", {
      //   weekday: "long",
      //   day: "numeric",
      //   month: "long",

      // })
      const dateDebutTemp = new Date(dateDebut)
      // .toLocaleDateString("fr-FR", {
      //   weekday: "long",
      //   day: "numeric",
      //   month: "long",
      // })
    if(dateDebut && dateFin){
      let finalPresences = sortedMyPresences
        .filter((presence) => {
          const createdAt = presence.data().heureArrivee.toDate()
          // .toLocaleDateString("fr-FR", {
          //   weekday: "long",
          //   day: "numeric",
          //   month: "long",
          // })
          console.log("created at", createdAt); 
           return createdAt >= dateDebutTemp && createdAt <= dateFinTemp;
      });
     setPresences(finalPresences)
     console.log("resultats final", finalPresences);
    }
  };

 

console.log(sortedMyPresences);
console.log(presences);

  const handleReset = async() => {
    const q = query(
      collection(db, "presences"),
      where("uid", "==", personnel.id),
      orderBy("heureArrivee", "desc"),
      limit(60)
    );

    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs);
    setPresences(querySnapshot.docs);
  };

  return (
    <Box p={{ base: 4, md: 10 }} minH="100vh">
      <Flex align="center" gap={1}>
        <ArrowBackIcon
          boxSize={8}
          onClick={() => navigate(-1)}
          cursor="pointer"
          p={1}
        />
        <Heading>Profil</Heading>
      </Flex>
      <Box width={"full"}> 
        <Flex  gap={2} align={"center"} justifyContent={"right"}>
       
          <ReactToPrint
            trigger={() => (
                <Icon
                  as={TfiPrinter}
                  boxSize="20px"
                  alignItems={"center"}
                  _hover={{ color: "gray.400" }}
                />
            )}
            content={() => componentRef.current}
            documentTitle="Presences de l'employé"
            pageStyle="print"
          />
          <ReactToPdf
            targetRef={componentRef}
            filename="Presences de l'employé"
            options={options}
            // y={10}
            // p={0}
          >
            {({ toPdf }) => (
              <Tooltip 
                label="Télecharger ses presences" 
                fontSize={"11px"}  
                placement='top'
              > 
                <Button
                  bg={"blackAlpha.100"}
                  onClick={toPdf}
                  border="1px"
                  // width={"1px"}
                  fontSize={"9px"}
                  size={"xs"}
                  _hover={{ background: "gray.400" }}
                  //  p={0}
                >
                  PDF
                </Button>
              </Tooltip>
            )}
          </ReactToPdf>
        </Flex>
      </Box>
      <Box ref={componentRef}> 
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
            {personnel.data().lastName}
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">
              Prenom:
            </Text>{" "}
            {personnel.data().firstName}
          </Text>
          <Text>
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
          </Text>
        </Container>
        <Box mt={5} display="flex" ml={{base: 6, md:6}}>
          {/* <FormLab htmlFor="difficulty">
            As tu rencontré des difficulté ?
          </FormLabel> */}
          <Switch
            colorScheme="purple"
            size="sm"
            id="search"
            onChange={onToggle}
          />
        </Box>
        <Collapse in={isOpen} animateOpacity width="full" >
          <Box 
            display={{ md:"flex"}} 
            gap={12} 
            flexDirection={{base: "column", md:"row"}}  
            justifyContent={"center"} 
          > 
            <Box width={{base: 248, md:380}}>
              <Flex justifyContent={"left"}>
                <Input
                  type="date"
                  placeholder="jj/mm/aaaa"
                  variant="flushed"
                  onChange={(event) => setDateDebut(event.target.value)}
                />
                <Text textAlign={'center'} mx={3} mt={2} fontWeight={'bold'} color={"purple.500"}>à </Text>
                <Input
                  type="date"
                  placeholder="jj/mm/aaaa"
                  variant="flushed"
                  onChange={(event) => setDateFin(event.target.value)}
                />
                <Button 
                  color="purple.500" 
                  ml={3} 
                  onClick={handleApplyFilters}
                >
                  <Icon as={FiSearch} 
                  />
                </Button> 
                <Button color="red.500" ml={3} 
                  onClick={handleReset}
                >
                  <Icon as={AiOutlineClose} />
                </Button>
              </Flex>
              </Box>
              <Box width={{base: 150, md:250}} mt={{base:4, md:0}}>
                 <Menu>
                  <MenuButton px={4} py={2} borderBottom='md' borderBottomWidth='1px' w='240px' > 
                    -- Trier par -- <ChevronDownIcon />
                  </MenuButton>
                  <MenuList minWidth='240px' maxH={isScrollable ? "20rem" : undefined} overflowY={isScrollable ? "scroll" : undefined}>
                    <MenuOptionGroup title='Options' type='radio'
                    //  onChange={(value) => onFilterValueChange('group1', value)}
                    >
                      <MenuItemOption value='all'>Tout</MenuItemOption>
                      <MenuItemOption value='Lu'>présences</MenuItemOption>
                      <MenuItemOption value='NLu'>Abscences</MenuItemOption>
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
            </Box>
          </Box>
        </Collapse>
        <AttendanceList
          userData={userData}
          presences={presences}
          isPending={isPending}
          // handleReset={handleReset}
          // handleApplyFilters={handleApplyFilters}
        />
      </Box>
    </Box>
  );
}
export const PersonnelDetailsLoader = async ({ params }) => {
  const { id } = params;
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  return docSnap;
};

export default PersonnelDetails;

