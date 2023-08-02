import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Flex, Heading, Icon, Text, Tooltip } from "@chakra-ui/react";
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

//  const PersonnelDetails = forwardRef((props, ref) => {
 const PersonnelDetails = () => {

  const { id } = useParams();
  const { user,userData } = useContext(AuthContext);
  const [presences, setPresences] = useState([]);
  const [isPending, setIsPending] = useState(false);
  console.log("presences")
    console.log(presences)

  const personnel = useLoaderData();
  const navigate = useNavigate();

  const componentRef = useRef();
  // const ref = React.createRef();
  const options = {
    orientation: "landscape",
    // unit: 'mm',
    // format: 'a4',
  };

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
      setIsPending(false);
    };
    getPresences();
  }, []);
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);
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
        <AttendanceList
          userData={userData}
          presences={presences}
          isPending={isPending}
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

