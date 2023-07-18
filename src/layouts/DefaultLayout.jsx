import { Box, Button, Container, Flex, Heading, Image } from "@chakra-ui/react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { async } from "@firebase/util";
import { auth, db } from "../firebase/config";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";

export default function DefaultLayout() {
  const { user, userData } = useContext(AuthContext);
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
    <>
      {userData && userData.isAdmin === "admin" && <AdminLayout />}
      {userData && userData.isAdmin  !== "admin" && <UserLayout />}
    </>
    // <Box background="#f7f7fb" height="full" minH="100vh">
    //   {userData && (
    //     <Box
    //       background="white"
    //       borderBottom="1px solid"
    //       borderBottomColor="gray.300"
    //       boxShadow="sm"
    //     >
    //       <Container maxW="container.xl" as="header" py={3}>
    //         <Flex align="center" justify="space-between">
    //           <Link to="/">
    //             <Image src="/logo.png" w="230px" />
    //           </Link>
    //           <Flex gap={5} align="center">
    //             <NavLink to="/">Home</NavLink>
    //             {userData.isAdmin && (
    //               <NavLink to="/personnel">Personnel</NavLink>
    //             )}
    //             {/* <NavLink to="/about">About</NavLink> */}
    //             {userData.isAdmin && (
    //               <Link to="/addstaff">
    //                 <Button colorScheme="purple">Ajouter employé</Button>
    //               </Link>
    //             )}
    //             {user && (
    //               <Button colorScheme="red" onClick={logout}>
    //                 Se deconnecter
    //               </Button>
    //             )}
    //           </Flex>
    //         </Flex>
    //       </Container>
    //     </Box>
    //   )}
    //   <Container maxW="container.xl" as="header" mt={5}>
    //     <Outlet />
    //   </Container>
    // </Box>
  );
}
