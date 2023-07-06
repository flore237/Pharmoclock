import { Box, Flex, Grid, Heading, Skeleton, Text, Icon,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider, } from "@chakra-ui/react";
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
import { FiSearch, FiEdit } from "react-icons/fi";
import { Button } from "@chakra-ui/react";
import { ChevronDownIcon,ChevronRightIcon } from '@chakra-ui/icons'

export default function Reports() {
  const { user, userData } = useContext(AuthContext);
  const [myReports, setMyReports] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [filterValues, setFilterValues] = useState( "all" );
  let sortedMyReports = [...myReports];

  const handleChange = (e) => {
    setSearchName(e.target.value);
  };


  const onFilterValueChange = (value) => {
  setFilterValues(value);

  };
     console.log("------------->> ici les filterValues");
    console.log(filterValues);



    ///

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


  //Conditions pour le tri par Statut
      if(filterValues === "all"){
      sortedMyReports = sortedMyReports
                  .filter(report => report.data().isReaded === true || report.data().isReaded === false )

    }else if(filterValues === "Lu"){
      sortedMyReports = sortedMyReports
                  .filter(report => report.data().isReaded === true)

    }else{
      sortedMyReports = sortedMyReports
                  .filter(report => report.data().isReaded === false)

    }
  return (
    <Box p={userData.isAdmin ? { base: 4, md: 10 } : ""} minH="100vh">
      <Heading>
        {userData.isAdmin ? "Derniers rapports" : "Mes derniers rapports"}
      </Heading>
     {userData.isAdmin ?
      <Flex
            mt='5'
            justify={'space-between'}
            >
   
    <InputGroup width="300px">
            <InputRightElement
              children={<Icon as={FiSearch} />}
              cursor="pointer"
            />
            <Input
            color={'purple.500'}
              placeholder="Rechercher par employé"
              variant="flushed"
              onChange={handleChange}
            />
          </InputGroup>
  <Box>
      <Menu closeOnSelect={false}>
        <MenuButton px={4} py={2} borderBottom='md' borderBottomWidth='1px' w='300px'>
          -- Trier par -- <ChevronDownIcon />
        </MenuButton>
        <MenuList minWidth='240px'>
          <MenuOptionGroup defaultValue={filterValues} title='Statut' type='radio' onChange={(value) => onFilterValueChange(value)}>
      <MenuItemOption value='all'>Tout</MenuItemOption>
      <MenuItemOption value='Lu'>Lu</MenuItemOption>
      <MenuItemOption value='NLu'>Non Lu</MenuItemOption>
        </MenuOptionGroup>
         
        </MenuList>
      </Menu>
      {/* <button onClick={handleApplyFilters}>Appliquer les filtres</button> */}
    </Box>
        
        

          <Flex>
             <Input
           type="date"
              placeholder="jj/mm/aaaa"
              variant="flushed"
              onChange={handleChange}
            />
            <Text textAlign={'center'} mx={3} mt={2} fontWeight={'bold'} color={"purple.500"}>à </Text>

             <Input
           type="date"
              placeholder="jj/mm/aaaa"
              variant="flushed"
              onChange={handleChange}
            />
            <Button color="purple.500" ml={3}><Icon as={FiSearch} /></Button>
          </Flex>
</Flex>
          :
          <Flex>
             <Input
           type="date"
              placeholder="jj/mm/aaaa"
              variant="flushed"
              onChange={handleChange}
            />
            <Text textAlign={'center'} mx={3} mt={2} fontWeight={'bold'} color={"purple.500"}>à </Text>

             <Input
           type="date"
              placeholder="jj/mm/aaaa"
              variant="flushed"
              onChange={handleChange}
            />
          </Flex>

}
          
          
      <Grid
        templateColumns={{
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={5}
        mt={8}
      >
        {sortedMyReports
        
         .filter((report) =>{
                if(searchName == ""){
                  return report;
                }else if (report.data().userFirstName.toLowerCase().includes (searchName.toLowerCase()) )
                  return report;
                }) 
        
        
        .map((report) => (
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
