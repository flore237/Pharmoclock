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
import { Navigate, useNavigate } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import AttendanceList from "../components/AttendanceList";
import DashboardCard from "../components/DashboardCard";
import DashboardDayReport from "../components/DashboardDayReport";
import { AuthContext } from "../context/authContext";
import { db } from "../firebase/config";
import { BsCalendarMonth } from "react-icons/bs";

export default function Home() {
  const { user, userData, setUserData } = useContext(AuthContext);
  const today = new Date();
  const [presences, setPresences] = useState([]);
  const [reports, setReports] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const [employeNumber, setEmployeNumber] = useState(null);
  const [adminNumber, setAdminNumber] = useState(null);
  const [reportsNumber, setReportsNumber] = useState(null);
  const [monthReports, setMonthReports] = useState(null);
  let i = 0;
  const lorem100 =
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus provident enim, reprehenderit voluptatem sapiente accusantium non harum fugit repudiandae exercitationem ex tempore nesciunt quis sequi. Inventore debitis exercitationem sunt hic, laudantium modi, maxime placeat earum amet eos quos molestias facilis, harum voluptatum assumenda dolores quisquam quam. Enim praesentium facere officia minima dolore vel, cum neque ducimus placeat aliquid eum quisquam sed aliquam officiis labore iure perspiciatis earum recusandae provident animi. Atque aut saepe odio labore inventore enim id tempora qui vitae tenetur, ea autem nostrum maxime rerum laboriosam cupiditate sapiente! Ad odio ullam laboriosam id, maiores doloremque eligendi. Deserunt, officia?";
  // const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  // if (!user) {
  //   return <Navigate to="/signin" />;
  // }
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
      where("uid", "==", user.uid),
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
  }, []);

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
                  {reports.map((report) => {
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
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
