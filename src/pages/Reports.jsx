import { Box, Flex, Grid, Heading, Skeleton, Text } from "@chakra-ui/react";
import React, { Fragment, useContext, useEffect, useState } from "react";
import DashboardDayReport from "../components/DashboardDayReport";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const { user, userData } = useContext(AuthContext);
  const [myReports, setMyReports] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  useEffect(() => {
    const getMyReports = async () => {
      const q = query(
        collection(db, "reports"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(16)
      );
      const qAdmin = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      setIsPending(true);
      if (userData.isAdmin) {
        try {
          const querySnapshot = onSnapshot(qAdmin, (snapshot) => {
            setMyReports(snapshot.docs);
            setIsPending(false);
          });
        } catch (error) {
          // console.log(error.message);
          setIsPending(false);
          setError(true);
        }
      } else {
        try {
          const querySnapshot = await getDocs(q);
          // console.log(querySnapshot.docs[0].data());
          setMyReports(querySnapshot.docs);
          setIsPending(false);
        } catch (error) {
          // console.log(error.message);
          setIsPending(false);
          setError(true);
        }
      }
    };
    getMyReports();
  }, []);
  return (
    <Box p={userData.isAdmin ? { base: 4, md: 10 } : ""} minH="100vh">
      <Heading>
        {userData.isAdmin ? "Derniers rapports" : "Mes derniers rapports"}
      </Heading>
      <Grid
        templateColumns={{
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={5}
        mt={8}
      >
        {myReports.map((report) => (
          <Fragment key={report.id}>
            <DashboardDayReport
              id={report.id}
              name={userData.isAdmin ? report.data().userFirstName : ""}
              isReaded={report.data().isReaded}
              body={report.data().report}
              difficulties={report.data().difficulty}
              date={report
                .data()
                .createdAt.toDate()
                .toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              hour={report.data().createdAt.toDate().toLocaleTimeString()}
            />
          </Fragment>
        ))}
        {isPending && (
          <Fragment>
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
          </Fragment>
        )}
      </Grid>
      {error && <Text>Vous n'avez pas de rapports</Text>}
    </Box>
  );
}
