import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { collection, getDoc, getDocs, deleteDoc, doc,updateDoc  } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";
import { useLoaderData, useNavigate, useParams, Link } from "react-router-dom";
import { Select as Selects } from "chakra-react-select";

export default function AddStaff() {
  const { user, userData } = useContext(AuthContext);
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [group, setGroup] = useState([]);
  const [option, setOption] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const UserUpdate = useLoaderData();

  // if (!user) {


  console.log(group)
  //   return <Navigate to="/signin" />;
  // }
  useEffect(() => {
    // console.log("aaaaa");
    if (!user) {
      // console.log("aaaaa");
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (userData && userData.isAdmin  !== "admin") {
      navigate("/");
    }
  }, [userData]);

    useEffect(() => {
    // console.log("aaaaa");
    if (UserUpdate) {
      setName(UserUpdate.data().lastName)
      setFirstName(UserUpdate.data().firstName)
      setEmail(UserUpdate.data().email)
      setPhoneNumber(UserUpdate.data().phoneNumber)
      setIsAdmin(UserUpdate.data().isAdmin)
      if(UserUpdate.data().affectedGroup){
        setGroup(UserUpdate.data().affectedGroup)
      }
     
     
    }
  }, []);

      useEffect(() => {

        const EmployeesTable = [];
        const loadingCourse = async (q) => {
          const querySnapshot = await getDocs(collection(db, "groups"));
          if(querySnapshot.docs){
            console.log("querySnapshot.docs")
            console.log(querySnapshot.docs)
            querySnapshot.docs.map((group, index) => {
              EmployeesTable.push({
                label: group.data().name,
                value: group.id,
              });
            });
            setOption(EmployeesTable)
          }
        };
        loadingCourse();
      }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if(UserUpdate){
    try {
      setError(null);
      setIsloading(true);
      const res =   await updateDoc(doc(db, "users", UserUpdate.id), {
        email: email,
        firstName: firstName,
        lastName : name,
        phoneNumber: phoneNumber,
        isAdmin : isAdmin,
        affectedGroup : group
      });
      console.log(res)
                    
      toast({
        title: "Utilisateur modifié avec succès",
        // description: "Veuillez vous reconnecter à votre compte",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setEmail("");
      // setPassword("")
      setName("");
      setFirstName("");
      // navigate("personnel")
      // console.log(res);
      setIsloading(false);
    } catch (error) {
      // console.log(error);
      if (error.code === "auth/invalid-email") {
        setError("Votre adresse email est invalide");
      }
      setIsloading(false);
    }

    }else{
    // console.log({ email, password, firstName, name, phoneNumber, isAdmin });

    try {
      setError(null);
      setIsloading(true);
      const res = await signup(
        email,
        password,
        firstName,
        name,
        phoneNumber,
        isAdmin,
        group,
      );
      toast({
        title: "Utilisateur créé avec succès",
        description: "Veuillez vous reconnecter à votre compte",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setEmail("");
      setPassword("");
      setName("");
      setFirstName("");
      // navigate("personnel")
      // console.log(res);
      setIsloading(false);
    } catch (error) {
      // console.log(error);
      if (error.code === "auth/weak-password") {
        setError("Votre mot de passe doit être supérieur à 6 caractères");
      }
      if (error.code === "auth/invalid-email") {
        setError("Votre adresse email est invalide");
      }
      setIsloading(false);
    }
  }
  };

  return (
    <Box p={{ base: 4, md: 10 }} minH="100vh">
      {UserUpdate ? 
      <Heading mb={5}>Modifier un employé</Heading>
      :
      <Heading mb={5}>Ajouter un employé</Heading>
      }
      
      {userData && (
        <Box
          as="form"
          onSubmit={handleSubmit}
          background="white"
          p={5}
          rounded="md"
          boxShadow="md"
        >
          <Flex gap={5} mb={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <FormControl>
              <FormLabel>Nom</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Prenom</FormLabel>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </FormControl>
          </Flex>
          <Flex gap={5} mb={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Numero</FormLabel>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </FormControl>
          </Flex>
          <Flex gap={5} mb={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
            {UserUpdate ? ""
            
          :    <FormControl>
              <FormLabel>Mot de passe</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>}
         
            <FormControl>
              <FormLabel>Statut</FormLabel>
              <Select
                onChange={(e) => {
                  if (e.target.value === "admin") {
                    setIsAdmin("admin");
                  } else if (e.target.value === "employe") {
                    setIsAdmin("employe");
                  }else{
                    setIsAdmin("adjoint");
                  }
                }}
                value={isAdmin}
              >
                <option value={"employe"}>Employé</option>
                <option value={"admin"}>Administrateur</option>
                <option value={"adjoint"}>Adjoint</option>
              </Select>
            </FormControl>
          </Flex>
          {isAdmin === "adjoint" &&
            <Flex gap={5} mb={3} flexWrap={{ base: "wrap", md: "nowrap" }}>
            <FormControl>
              <FormLabel>Groupe(s) a la charge</FormLabel>
                <Selects
                    isMulti
                    name="selectedCourse"
                    value={group}
                    onChange={setGroup}
                    placeholder="Selectionner des group"
                    options={option}
                    isRequired
                  >
                      
                  </Selects>
            </FormControl>
   
          </Flex>
          }

          {isLoading && (
            <Button
              mt={2}
              colorScheme="purple"
              isLoading
              loadingText="Submitting"
            >
              Ajouter
            </Button>
          )}
          {!isLoading && !UserUpdate && (
            <Button mt={2} colorScheme="purple" type="submit">
              Ajouter
            </Button>
          )}
            {!isLoading && UserUpdate && (
            <Button mt={2} colorScheme="purple" type="submit">
              Modifier
            </Button>
          )}
          {error && <Text>{error}</Text>}
        </Box>
      )}
    </Box>
  );
}

export const UserLoader = async ({ params }) => {
  const { id } = params;
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  return docSnap;
};
