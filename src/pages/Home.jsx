import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Icon,
  Skeleton,
  Grid,
  Hide,
   Badge,
  Show,
  Button
} from "@chakra-ui/react";
import { async } from "@firebase/util";
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
import { Fragment, useContext, useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";
import { TbReportAnalytics } from "react-icons/tb";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import AttendanceList from "../components/AttendanceList";
import DashboardCard from "../components/DashboardCard";
import DashboardDayReport from "../components/DashboardDayReport";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";
import { BsCalendarMonth } from "react-icons/bs";
import { ViewIcon } from "@chakra-ui/icons";

export default function Home() {
  const { user, userData, setUserData } = useContext(AuthContext);
  const today = new Date();
  const [presences, setPresences] = useState([]);
  const [reports, setReports] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [employeNumber, setEmployeNumber] = useState(null);
  const [employeList, setEmployeList] = useState([]);
  const [adminNumber, setAdminNumber] = useState(null);
  const [reportsNumber, setReportsNumber] = useState(null);
  const [monthReports, setMonthReports] = useState(null);
  const [reportNone, setReportNone] = useState();
  const employeesWithoutReports = [];
  // const [userIds, setUserIds] = useState([]);
  const [date, setDate] = useState("");
  let i = 0;
  const lorem100 =
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus provident enim, reprehenderit voluptatem sapiente accusantium non harum fugit repudiandae exercitationem ex tempore nesciunt quis sequi. Inventore debitis exercitationem sunt hic, laudantium modi, maxime placeat earum amet eos quos molestias facilis, harum voluptatum assumenda dolores quisquam quam. Enim praesentium facere officia minima dolore vel, cum neque ducimus placeat aliquid eum quisquam sed aliquam officiis labore iure perspiciatis earum recusandae provident animi. Atque aut saepe odio labore inventore enim id tempora qui vitae tenetur, ea autem nostrum maxime rerum laboriosam cupiditate sapiente! Ad odio ullam laboriosam id, maiores doloremque eligendi. Deserunt, officia?";
  // const [userData, setUserData] = useState(null);

  // console.log("--------->userIds")
  //   console.log(userIds)
  const navigate = useNavigate();
  // if (!user) {
  //   return <Navigate to="/signin" />;



        console.log("--------->>>>>>>>")
    console.log(reportNone)


  useEffect(() => {
    const getUser = async (userId) => {
      const docSnap = await getDoc(doc(db, "users", userId));
      setUserData(docSnap.data());
      if (docSnap.data().isAdmin) {
        const querySnapshot = await getDocs(collection(db, "users"));
        // console.log(querySnapshot.docs);
        const adminNumber = querySnapshot.docs.filter(
          (person) => person.data().isAdmin
        );
        // console.log(adminNumber.length);
        setAdminNumber(adminNumber.length);
        setEmployeNumber(querySnapshot.docs.length);
        setEmployeList(querySnapshot.docs)
      }
    };
    if (!user) {
      // console.log("aaaa");
      navigate("/signin");
    } else {
      getUser(user.uid);
    }
  }, [user]);
  useEffect(() => {
  

    const date = new Date();
    
    const q = query(
      collection(db, "presences"),
      where("uid", "==", user && user.uid),
      orderBy("heureArrivee", "desc"),
      limit(60)
    );
    const getLastReports = async () => {
      setIsPending(true);
      const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
      const querySnapshot = onSnapshot(q, (snapshot) => {
        setReports(snapshot.docs);
        // console.log(snapshot.docs[0].data().createdAt.toDate().getMonth());
        const notReadedReport = snapshot.docs.filter(
          (report) => report.data().isReaded === false
        );
        //faire une verification ici il yaune erreur inconnue
        const monthReports = snapshot.docs.filter(
          (report) =>
            report.data().createdAt.toDate().getMonth() === date.getMonth()
        );
        setMonthReports(monthReports.length);
        setReportsNumber(notReadedReport.length);
      });




  }
   

const getEmployeesWithoutReports = async () => {
   setIsPending(true);
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    // Récupérer tous les employés de la collection "users"
    // const usersSnapshot = await db.collection('users').get();
    const userIds = querySnapshot.docs.map((doc) => doc.id);
    

    // Récupérer les employés qui n'ont pas de rapport pour la date spécifiée
    const employeesWithoutReports = [];
  
   
    const currentDate = new Date();
    const isoTimestamp = currentDate.toISOString();

     for (const userId of userIds) {
 
      const q = query(
        collection(db, "reports"),
        where('uid', '==', userId),
      );

      const reportsSnapshot = await getDocs(q);

          let sortedMyReport = reportsSnapshot.docs.filter((doc)=>

         doc.data().createdAt.toDate().toISOString().split("T")[0] === currentDate.toISOString().split("T")[0]
         )

      if (sortedMyReport.length === 0) {
        let userDocId = querySnapshot.docs.filter((doc) => {
   if(doc.id === userId){
employeesWithoutReports.push(doc)
        }
        return null;

        }
     
        
        );
 

      }
    }
setReportNone(employeesWithoutReports)
setIsPending(false);


    return employeesWithoutReports;

     

  } catch (error) {
    console.error('Erreur lors de la récupération des employés sans rapport:', error);
    return [];
  }

};








    const getPresences = async () => {
      const querySnapshot = onSnapshot(q, (snapshot) => {
        setPresences(snapshot.docs);
      });
      // console.log(
      //   querySnapshot.docs[0].data().heureArrivee.toDate().toString()
      // );

      setIsPending(false);
    };
    getLastReports();
    getPresences(q);
    getEmployeesWithoutReports();
  }, []);
// console.log("reportNone")

// console.log(reportNone)

  return (
    <Box minH="100vh">
      {user && userData && (
        <Box p={userData.isAdmin ? { md: 10, base: 4 } : ""}>
          <Heading fontWeight="bold">
            Bonjour{" "}
            <Text as="span" color="purple.500">
              {userData.firstName} !
            </Text>
          </Heading>
          {userData.isAdmin && (
            <Text fontSize="xl" mt={2}>
              Bienvenue sur ton Tableau de bord. Tu es un{" "}
              <Text as="span" color="purple.600">
                administrateur
              </Text>
            </Text>
          )}
          {!userData.isAdmin && (
            <Text fontSize="xl" mt={2}>
              Bienvenue sur ton espace de présences. Tu es un{" "}
              <Text as="span" color="purple.600">
                employé
              </Text>
            </Text>
          )}
          {!userData.isAdmin && presences && (
            <AttendanceList
              userData={userData}
              presences={presences}
              isPending={isPending}
            />
          )}
          {userData.isAdmin && (
            <Box>
              <Grid
                gap={6}
                w="full"
                mt={7}
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(1, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
              >
                <DashboardCard
                  number={employeNumber ? employeNumber : "0"}
                  title="Personnel"
                  colorScheme="yellow.500"
                  href="/personnel"
                  buttonText="Voir mes employés"
                  icon={FiUsers}
                />
                <DashboardCard
                  number={reportsNumber ? reportsNumber : "0"}
                  title="Rapports non lus"
                  colorScheme="blue.500"
                  icon={TbReportAnalytics}
                  buttonText="Voir les rapports"
                  href="/reports"
                />
                <DashboardCard
                  number={adminNumber ? adminNumber : "0"}
                  colorScheme="red.500"
                  title="Administrateurs"
                  href="/personnel"
                  buttonText="Voir les admins"
                  icon={RiAdminLine}
                />
                <DashboardCard
                  number={monthReports ? monthReports : "0"}
                  colorScheme="orange.500"
                  icon={BsCalendarMonth}
                  title="Rapports du mois"
                  href="/reports"
                />
              </Grid>
              <Box mt={10} background="white" p={5} rounded="md" boxShadow="md">
                <Heading size="md" mb={5}>
                  Derniers rapports de journée
                </Heading>
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  }}
                  gap={5}
                  mt={2}
                >
                  {!isPending &&
                  reports.map((report) => {
                    if (i > 3) {
                      return;
                    }
                    return (
                      <Fragment key={report.id}>
                        <Hide>{i++}</Hide>
                        <DashboardDayReport
                          id={report.id}
                          name={report.data().userLastName}
                          body={report.data().report}
                          difficulties={report.data().difficulty}
                          isReaded={report.data().isReaded}
                          date={report
                            .data()
                            .createdAt.toDate()
                            .toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          hour={report
                            .data()
                            .createdAt.toDate()
                            .toLocaleTimeString()}
                        />
                      </Fragment>
                    );
                  })}
                  {isPending && (
                    <Fragment>
                      <Skeleton height="140px" rounded="md" />
                      <Skeleton height="140px" rounded="md" />
                      <Skeleton height="140px" rounded="md" />
                      <Skeleton height="140px" rounded="md" />
                    </Fragment>
                  )}
                </Grid>
              </Box>
  
                      <Box mt={10} background="white" p={5} rounded="md" boxShadow="md">
                <Heading size="md" mb={5}>
                  Employés n'ayant pas déposés de rapport Aujourd'hui
                   </Heading>
         
     <Container
            maxW="full"
            mt={-3}
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
  
            {reportNone &&  !isPending &&

              reportNone
              
              .slice(0, 5)
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
                    // cursor="pointer"
                  >
                    <Show above="md">
                      <Text flex={1}>
                        {personnel.data().lastName}{" "}
                        {personnel.data().isAdmin && (
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
          
          {reportNone && !isPending &&
           <Flex mt='2' ml='5'>
              <ViewIcon 
                rounded="full"
                background="purple.200"
                color="purple.400"
              />
              <Link to="/missedreport"  state={new Date().toISOString().split("T")[0]} >  
                <Text 
                  _hover={{ textDecoration: "underline"}} 
                  color={"purple.500"} 
                  ml="2"
                  mt="-1"
                  >
                     Voir plus de details
                </Text>
              </Link>

            </Flex>
          }
              </Box>
     
            </Box>
          )}


        </Box>
      )}
    </Box>
  );
}
