import {
  Box,
  Flex,
  Image,
  Icon,
  IconButton,
  Hide,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/authContext";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { FiLogOut, FiUsers } from "react-icons/fi";
import {
  AiOutlineFileAdd,
  AiOutlineHome,
  AiOutlineUserAdd,
  AiOutlineFileExclamation,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { LiaUsersSolid } from "react-icons/lia";
import { TbReportAnalytics } from "react-icons/tb";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function AdminLayout() {
  const { user, userData } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, []);
  const logout = async () => {
    console.log(userData.todayPresenceId);
    await updateDoc(doc(db, "presences", userData.todayPresenceId), {
      heureDepart: serverTimestamp(),
    });
    console.log(
      "Modifier la presence d'aujourdhui pour ajouter l'heure de départ"
    );
    try {
      await signOut(auth);
    } catch (error) {
      alert("Pour certaines raison vous ne pouvez vous déconnecter");
    }
  };
  return (
    <Box height="full" minH="100vh">
      {userData && (
        <Box
          background="#f7f7fb"
          borderBottom="1px solid"
          borderBottomColor="gray.300"
          boxShadow="sm"
        >
          <Flex
            h="full"
            height={{ md: "99.9vh" }}
            direction={{ base: "column", md: "row" }}
          >
            <Hide above="md">
              <Flex
                w="full"
                background="purple.500"
                justify="space-between"
                align="center"
              >
                <Link to="/">
                  <Image src="/white_logo.png" w="80px" my={1} />
                </Link>
                <Box p={2} ref={btnRef} onClick={onOpen}>
                  <HamburgerIcon boxSize={7} color="white" />
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
                          Tableau de bord
                        </Box>
                        <Box
                          py={2}
                          onClick={() => {
                            navigate("/addstaff");
                            onClose();
                          }}
                          borderBottom="1px solid"
                          borderBottomColor="gray.400"
                        >
                          Créer un employé
                        </Box>
                        <Box
                          py={2}
                          onClick={() => {
                            navigate("/personnel");
                            onClose();
                          }}
                          borderBottom="1px solid"
                          borderBottomColor="gray.400"
                        >
                          Liste des employés
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
                          Liste des rapports
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
                          onClick={() => {
                            navigate("/missedreport");
                            onClose();
                          }}
                          borderBottom="1px solid"
                          borderBottomColor="gray.400"
                        >
                          Rapports journaliers manqués
                        </Box>
                         <Box
                          py={2}
                          onClick={() => {
                            navigate("/employeegroup");
                            onClose();
                          }}
                          borderBottom="1px solid"
                          borderBottomColor="gray.400"
                        >
                          Gérer les groupes d'employés
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
              </Flex>
            </Hide>
            <Hide below="md">
              <Flex
                w="102px"
                background="purple.500"
                direction="column"
                align="center"
                h="100vh"
              >
                <Link to="/">
                  <Image src="/white_logo.png" w="100px" mt={5} />
                </Link>
                <Flex mt={14} gap={3} direction="column" h="full">
                  <Tooltip label="Tableau de bord" hasArrow placement="right">
                    <NavLink to="/">
                      <IconButton
                        size="md"
                        icon={<Icon boxSize={6} as={AiOutlineHome} />}
                      />
                    </NavLink>
                  </Tooltip>
                  <Tooltip
                    label="Ajouter un employé"
                    hasArrow
                    placement="right"
                  >
                    {userData.isAdmin === "admin" && (
                      <Link to="/addstaff">
                        <IconButton
                          size="md"
                          icon={<Icon boxSize={6} as={AiOutlineUserAdd} />}
                        />
                      </Link>
                    )}
                  </Tooltip>
                  <Tooltip
                    label="Liste du personnel"
                    hasArrow
                    placement="right"
                  >
                    {userData.isAdmin === "admin" && (
                      <NavLink to="/personnel">
                        <IconButton
                          size="md"
                          icon={<Icon boxSize={6} as={FiUsers} />}
                        />
                      </NavLink>
                    )}
                  </Tooltip>
                  <Tooltip
                    label="Liste des rapports"
                    hasArrow
                    placement="right"
                  >
                    {userData.isAdmin === "admin" && (
                      <NavLink to="/reports">
                        <IconButton
                          size="md"
                          icon={<Icon boxSize={6} as={TbReportAnalytics} />}
                        />
                      </NavLink>
                    )}
                  </Tooltip>
                  <Tooltip
                    label="Rédiger un rapport"
                    hasArrow
                    placement="right"
                  >
                    {userData.isAdmin === "admin" && (
                      <NavLink to="/createreport">
                        <IconButton
                          size="md"
                          icon={<Icon boxSize={6} as={AiOutlineFileAdd} />}
                        />
                      </NavLink>
                    )}
                  </Tooltip>
                   <Tooltip
                    label="Rapports journaliers manqués"
                    hasArrow
                    placement="right"
                  >
                    {userData.isAdmin === "admin" && (
                      <NavLink to="/missedreport">
                        <IconButton
                          size="md"
                          icon={<Icon boxSize={6} as={AiOutlineFileExclamation} />}
                        />
                      </NavLink>
                    )}
                  </Tooltip>
                    <Tooltip
                    label="Gérer les groupes d'employés"
                    hasArrow
                    placement="right"
                  >
                    {userData.isAdmin === "admin" && (
                      <NavLink to="/employeegroup">
                        <IconButton
                          size="md"
                          icon={<Icon boxSize={6} as={LiaUsersSolid} />}
                        />
                      </NavLink>
                    )}
                  </Tooltip>

                  {user && (
                    <IconButton
                      mt="auto"
                      mb={5}
                      size="lg"
                      w="min"
                      onClick={logout}
                      icon={<FiLogOut />}
                    />
                  )}
                </Flex>
              </Flex>
            </Hide>

            <Box w="full" overflowY="auto">
              <Outlet />
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
