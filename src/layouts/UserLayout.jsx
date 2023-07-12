import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Image,
  Show,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { async } from "@firebase/util";
import { auth, db } from "../firebase/config";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function UserLayout() {
  const { user, userData } = useContext(AuthContext);
  const [disconnecting, setDisconnecting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const navigate = useNavigate();

const logout = async () => {
  setDisconnecting(true);
  console.log(userData.todayPresenceId);

  if (userData.todayPresenceId) { // Vérifie si la propriété existe
    await updateDoc(doc(db, "presences", userData.todayPresenceId), {
      heureDepart: serverTimestamp(),
    });
    console.log("Modifier la presence d'aujourd'hui pour ajouter l'heure de départ");
  }

  try {
    await signOut(auth);
    setDisconnecting(false);
  } catch (error) {
    alert("Pour certaines raison vous ne pouvez vous déconnecter");
    setDisconnecting(false);
  }
};
  return (
    <Box background="#f7f7fb" height="full" minH="100vh">
      {userData && (
        <Box
          background="white"
          borderBottom="1px solid"
          borderBottomColor="gray.300"
          boxShadow="sm"
        >
          <Container maxW="container.xl" as="header" py={3}>
            <Flex align="center" justify="space-between">
              <Link to="/">
                <Show above="md">
                  <Image src="/logo.png" w="230px" />
                </Show>
                <Show below="md">
                  <Image src="/logo_ori.png" w="55px" />
                </Show>
              </Link>
              <Show above="md">
                <Flex gap={5} align="center">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/createreport">Rédiger</NavLink>
                  <NavLink to="/reports">Rapports</NavLink>
                  {/* {userData.isAdmin && (
                  <NavLink to="/personnel">Personnel</NavLink>
                )} */}
                  {/* <NavLink to="/about">About</NavLink> */}
                  {/* {userData.isAdmin && (
                  <Link to="/addstaff">
                    <Button colorScheme="purple">Ajouter employé</Button>
                  </Link>
                )} */}
                  {user && (
                    <Button
                      colorScheme="red"
                      onClick={logout}
                      isLoading={disconnecting}
                      loadingText="Déconnexion"
                    >
                      Se deconnecter
                    </Button>
                  )}
                </Flex>
              </Show>
              <Show below="md">
                <Box p={2} ref={btnRef} onClick={onOpen}>
                  <HamburgerIcon boxSize={7} />
                </Box>
                <Drawer
                  isOpen={isOpen}
                  placement="left"
                  onClose={onClose}
                  finalFocusRef={btnRef}
                >
                  <DrawerOverlay />
                  <DrawerContent background="purple.500" color="white">
                    <DrawerCloseButton />
                    <DrawerHeader>
                      <Box
                        onClick={() => {
                          navigate("/");
                          onClose();
                        }}
                        maxW="100px"
                      >
                        <Image src="/white_logo.png" w="80px" />
                      </Box>
                    </DrawerHeader>

                    <DrawerBody>
                      <Flex direction="column">
                        <Box
                          py={2}
                          onClick={() => {
                            navigate("/");
                            onClose();
                          }}
                          borderBottom="1px solid"
                          borderBottomColor="gray.400"
                        >
                          Home
                        </Box>
                        <Box
                          py={2}
                          onClick={() => {
                            navigate("/reports");
                            onClose();
                          }}
                          borderBottom="1px solid"
                          borderBottomColor="gray.400"
                        >
                          Liste des mes rapports
                        </Box>
                        <Box
                          py={2}
                          onClick={() => {
                            navigate("/createreport");
                            onClose();
                          }}
                          borderBottom="1px solid"
                          borderBottomColor="gray.400"
                        >
                          Créer un rapport
                        </Box>
                        <Box
                          py={2}
                          onClick={logout}
                          borderBottom="1px solid"
                          borderBottomColor="gray.400"
                        >
                          Se déconnecter
                        </Box>
                      </Flex>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </Show>
            </Flex>
          </Container>
        </Box>
      )}
      <Container maxW="container.xl" as="header" mt={5}>
        <Outlet />
      </Container>
    </Box>
  );
}
