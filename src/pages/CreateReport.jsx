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
  Tooltip,
  IconButton,
  Input,
  Icon,
} from "@chakra-ui/react";
import {CloseIcon} from "@chakra-ui/icons"
import { addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { db, storage } from "../firebase/config";
import { Select as Selects } from "chakra-react-select";
import { Flex } from "@chakra-ui/layout";
import {FaPaperclip, FaTimes} from "react-icons/fa";
import {ref, getDownloadURL, uploadBytes  } from "firebase/storage";

export default function CreateReport() {
  const [report, setReport] = useState("");
  const [title, setTitle] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { user, userData } = useContext(AuthContext);
  const [hasDifficulty, setHasDifficulty] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const [difficulty, setDifficulty] = useState("");
  const [group, setGroup] = useState([]);
  const [option, setOption] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [attachment, setAttachment] = useState([]);
  const [isUploading, setIsUpLoading] = useState(false)
  console.log("option")
  console.log(option)

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    // setAttachment(file);
    // if (file) {
    //   // setAttachment([...attachment, file]);
    //   setAttachment(file);

    // }
    if (files.length > 0) {
      // Convert FileList to an array
      const fileList = Array.from(files);
      setAttachment([...attachment, ...fileList]);
    }
  };

  const handleAttachmentButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = attachment.filter((_, i) => i !== index);
    setAttachment(updatedAttachments);
  };

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
    try 
    {
      setIsUpLoading(true);
      let downloadURL

      if (attachment.length > 0) {
        for (const file of attachment) {
          const imageRef = ref(storage, `attachments/${file.name}`);
          await uploadBytes(imageRef, file);
           downloadURL = await getDownloadURL(imageRef);
          // Handle the uploaded file's downloadURL as needed
        }
      }
      
      if(userData.groupId){

   group.map((group)=>
   {
      const create = async () => {
      const docRef = await addDoc(collection(db, "reports"), {
      uid: user.uid,
      userFirstName: userData.firstName,
      userLastName: userData.lastName,
      title: title,
      report: report,
      difficulty: difficulty,
      createdAt: serverTimestamp(),
      isReaded: false,
      groupeId: group.value,
      groupName: group.label,
      attachment: downloadURL,
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
      report: report,
      difficulty: difficulty,
      createdAt: serverTimestamp(),
      isReaded: false,
      attachment: downloadURL,
    });
   }
  // }
  } catch (error) {
    console.error("Erreur lors de la création du rapport : ", error);
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
    navigate("/reports")
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
    <Box 
      p={userData.isAdmin === "admin" ? { base: 4, md: 10 } : ""} 
      minH="100vh" 
      pb={{base:3, md:0}}
    >
      <Heading>Rédiger un rapport</Heading>
      <Text fontWeight="bold" mt={5} mb={3}>
          Ce qui a été fait aujourd'hui:
      </Text>
      <Box 
        as="form" 
        onSubmit={handleSubmit} 
        bg={"white"} 
        p={{base:3, md:5}} 
        rounded={"md"}
        width={{base:"320px", md:"800px"}}
      >
        <Input 
          variant='flushed' 
          placeholder='[Titre du document]'  
          p={4}
          onChange={(e) => setTitle(e.target.value)}
        />
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
          placeholder="[Contenu]"
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
        <Box> 
          <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
          />
          {/* {attachment && <Text mt={2}>Fichier sélectionné : {attachment.name}</Text>}
           */}
           {attachment.length > 0 && (
          <Box mt={2}>
            <Text>Fichiers sélectionnés :</Text>
            {/* <Box  mb={"3px"}>  */}
              {attachment.map((file, index) => (
                <Text key={index}>
                  {file.name}
                  <Tooltip label="Supprimer la piece jointe" fontSize={"12px"} placement='right'>
                  <Icon 
                    ml={"10px"}
                    boxSize={2}
                    as = {CloseIcon}
                    aria-label="Supprimer la pièce jointe"
                    onClick={() => handleRemoveAttachment(index)}
                  />
                  </Tooltip>
                </Text>
              ))}
            {/* </Box> */}
          </Box>
           )}
          <Tooltip label="Joindre des fichiers" placement='right' fontSize={"12px"}>
            <IconButton 
              aria-label='Search database' 
              icon={<FaPaperclip />}
              onClick={handleAttachmentButtonClick}
            />
          </Tooltip>
        </Box>
          
        <Box > 
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
    </Box>
  );
}
