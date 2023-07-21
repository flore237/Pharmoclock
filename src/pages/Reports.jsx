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
import { Navigate, useNavigate, Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { FiSearch, FiEdit } from "react-icons/fi";
import { Button } from "@chakra-ui/react";
import { ChevronDownIcon,ChevronRightIcon } from '@chakra-ui/icons';
import ReactPaginate from "react-paginate";
import { Center } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

export default function Reports() {
  const { user, userData } = useContext(AuthContext);
  const [myReports, setMyReports] = useState([]);
  const [initialReports, setInitialReports] = useState([]);
    const [initialReport, setInitialReport] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [filterValues, setFilterValues] = useState({ group1: 'all', group2: 'all' });
  let sortedMyReports = [...myReports];
  const [dateDebut, setDateDebut] = useState();
  const [dateFin, setDateFin] = useState();
  const [affectedReports, setAffectedReports] = useState([]);
  const [reportAdmin, setReportAdmin] = useState([]);
    const [groupeName, setGroupeName] = useState([]);
      let admReports = [...reportAdmin];


  console.log("nameGroupe")
console.log(groupeName)

  //pagination
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 5;
  const pagesVisited = pageNumber * itemsPerPage;

  const pageCount = Math.ceil(myReports.length / itemsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };


  // barre de recherche
  const handleChange = (e) => {
    setSearchName(e.target.value);
  };

    const onFilterValueChange = (group, value) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [group]: value
    }));

console.log(group)
console.log(value)




  };

  groupeName.forEach((name)=>{
if(filterValues.group2 === name){
        if(filterValues.group1 === "all"){
       admReports = admReports.filter(
          report => (report.value.data().isReaded === true || report.value.data().isReaded === false) && (report.value.data().groupName === name)
        )
      }else if(filterValues.group1 === "Lu"){
         admReports = admReports.filter(
          report => report.value.data().isReaded === true && report.value.data().groupName === name
        )
      }else{
        admReports = admReports.filter(
          report => report.value.data().isReaded === false && report.value.data().groupName === name
        )
      }

}else{
      if(filterValues.group1 === "all"){
       admReports = admReports.filter(
          report => report.value.data().isReaded === true || report.value.data().isReaded === false
        )
      }else if(filterValues.group1 === "Lu"){
         admReports = admReports.filter(
          report => report.value.data().isReaded === true 
        )
      }else{
        admReports = admReports.filter(
          report => report.value.data().isReaded === false
        )
      }

}

})

  //fonction pour reset les donnees initiales dans le filtres par date
  const handleReset = () => {
    // setDateDebut("");
    // setDateFin("")
    setMyReports(initialReports)
    setReportAdmin(initialReport)
  };

//scrooll du tri
  const MAX_OPTIONS = 5; // Changer cette valeur pour ajuster le nombre maximal d'options

  const isScrollable = groupeName.length > MAX_OPTIONS;



// fonction qui permet de filtrer pour une periode de date
  const handleApplyFilters = () => {
    if(dateDebut && dateFin){
      sortedMyReports = initialReports
      .filter(report => {
        const createdAt = report.data().createdAt.toDate().toISOString().split("T")[0]
        return createdAt >= dateDebut&& createdAt <= dateFin;
      });

            admReports = initialReport
      .filter(report => {
        const createdAt = report.value.data().createdAt.toDate().toISOString().split("T")[0]
        return createdAt >= dateDebut&& createdAt <= dateFin;
      });
    }
    setMyReports(sortedMyReports)

    setReportAdmin(admReports)
    // setDateDebut("");
    //   setDateFin("");
  };

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);






  useEffect(() => {
       setIsPending(true);

     const EmployeesTable = [];

            //foncton pour lister les rapports affectees
        const getMyGroups = async () => {
console.log("groupeeeeeee")
        // const q = query(
        //     collection(db, "groups"),
        //     limit(50)
        // );
        setIsPending(true);

            try {
            const queryUsers = await getDocs(collection(db, "users"));
            const querySnapshot = await getDocs(collection(db, "groups"));
            const queryReports = await getDocs(collection(db, "reports"));
    userData.affectedGroup.forEach((group)=>{

        queryReports.docs.forEach((reportDoc) => {
          if(reportDoc.data().groupeId === group.value){
            const rapport = reportDoc
            console.log("reportDoc")
            console.log(reportDoc)

    let requete = queryUsers.docs.filter((pers, index) =>{
      if(pers.id === rapport.data().uid ){
      if(pers.data().isAdmin === "employe" || pers.data().isAdmin === "adjoint"){

           EmployeesTable.push({
            label: rapport.data().groupName,
            value: rapport
          });
      }
      }
    })
          }
          
        }
        )
         console.log(EmployeesTable)
        setAffectedReports(EmployeesTable)
        setIsPending(false);

                } )

            }catch (error) {
            // console.log(error.message);
            setIsPending(false);
            setError(true);
            }
        
        };



  const getReportsByGroup = async () => {
 

    try {
            const groupsSnapshot = await getDocs(collection(db, "groups"));
//       const usersSnapshot = await getDocs(collection(db, "users"));

      const reportsSnapshot = await getDocs(collection(db, "reports"));

      const groupReportData = [];
      const noGroupReportData = [];
      const GroupName = [];

      groupsSnapshot.docs.forEach((groupDoc) => {
        const groupId = groupDoc.id;
        const groupName = groupDoc.data().name;
        GroupName.push(groupName)
    })
//       groupDoc.data().personnels.map((personnel)=>
//   { if(usersSnapshot.docs){

//         usersSnapshot.docs.forEach((userDoc) => {
//           const userId = userDoc.id;
//           const userGroupId = userDoc.data().groupId;
          

          // if (userId === personnel.value) {
            reportsSnapshot.docs.forEach((reportDoc) => {
              if (reportDoc.data().groupeId && reportDoc.data().groupName) {
                const groupName = reportDoc.data().groupName;
                const reportData = {
                  label: groupName,
                  value: reportDoc,
                };

                groupReportData.push(reportData);
                console.log("reportdata")
                console.log(reportData)
              }
              else{
            const reportData = {
                label: "",
                value: reportDoc,
              };

              noGroupReportData.push(reportData);

              }
            });

      const allReports = [...groupReportData, ...noGroupReportData];

      setReportAdmin(allReports);
      setInitialReport(allReports)
      setGroupeName(GroupName);
      // setIsPending(false);
    } catch (error) {
      setIsPending(false);
      setError(true);
    }
  };


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
      if (userData.isAdmin === "admin") {
        try {
          const querySnapshot = onSnapshot(qAdmin, (snapshot) => {
            setMyReports(snapshot.docs);
            setInitialReports(snapshot.docs);
            // setIsPending(false);
          });
        } catch (error) {
          // console.log(error.message);
          // setIsPending(false);
          setError(true);
        }
      } else {
        try {
          const querySnapshot = await getDocs(q);
          // console.log(querySnapshot.docs[0].data());
          setMyReports(querySnapshot.docs);
          setInitialReports(querySnapshot.docs);
          setIsPending(false);
        } catch (error) {
          // console.log(error.message);
          setIsPending(false);
          setError(true);
        }
      }
    };
    getMyReports();
    getReportsByGroup();
    getMyGroups();


  }, []);


  //Conditions pour le tri par Statut



  return (
    <Box p={userData.isAdmin === "admin" ? { base: 4, md: 10 } : ""} minH="100vh">
      <Heading>
        {userData.isAdmin === "admin" ? "Derniers rapports" : "Mes derniers rapports"}
      </Heading>
        {userData.isAdmin === "admin" &&
        <>
      <Flex
        mt='5'
        justify={'space-between'}
        mb='5'
        >
          <InputGroup width="300px">
            <InputRightElement
              children={<Icon as={FiSearch} />}
              cursor="pointer"
            />
            <Input
              placeholder="Rechercher par employé"
              variant="flushed"
              onChange={handleChange}
            />
          </InputGroup>
          <Box>
            <Menu>
              <MenuButton px={4} py={2} borderBottom='md' borderBottomWidth='1px' w='300px' > 
                -- Trier par -- <ChevronDownIcon />
              </MenuButton>
              <MenuList minWidth='240px' maxH={isScrollable ? "10rem" : undefined} overflowY={isScrollable ? "scroll" : undefined}>
                <MenuOptionGroup defaultValue={filterValues.group1} title='Statut' type='radio' onChange={(value) => onFilterValueChange('group1', value)}>
                  <MenuItemOption value='all'>Tout</MenuItemOption>
                  <MenuItemOption value='Lu'>Lu</MenuItemOption>
                  <MenuItemOption value='NLu'>Non Lu</MenuItemOption>
                </MenuOptionGroup>
                <MenuOptionGroup defaultValue={filterValues.group2} title='Groupe' type='radio' onChange={(value) => onFilterValueChange('group2', value)}>
                  {groupeName && groupeName.map((name)=>(
              <MenuItemOption value={name}>{name}</MenuItemOption>))}
              <MenuItemOption value='all'>Tous les groupes</MenuItemOption>
                </MenuOptionGroup>
                
              </MenuList>
            </Menu>
          </Box>
          <Flex>
             <Input
                type="date"
                placeholder="jj/mm/aaaa"
                variant="flushed"
                onChange={(event) => setDateDebut(event.target.value)}
              />
              <Text textAlign={'center'} mx={3} mt={2} fontWeight={'bold'} color={"purple.500"}>à </Text>

              <Input
                type="date"
                placeholder="jj/mm/aaaa"
                variant="flushed"
                onChange={(event) => setDateFin(event.target.value)}
              />
              <Button color="purple.500" ml={3} onClick={handleApplyFilters}><Icon as={FiSearch} /></Button>
              <Button color="red.500" ml={3} onClick={handleReset}><Icon as={AiOutlineClose} /></Button>
          </Flex>
        </Flex>
        
      
        
        </>

}
  {userData.isAdmin === "admin" && admReports.length === 0 && !isPending &&
                
                <Text textAlign={'center'} mt={'3'}>Aucun(s) rapports recu(s) </Text>}
                 <Grid
        templateColumns={{
           base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(3, 1fr)",
        }}
        gap={5}
        mt={2}
      >
        {userData.isAdmin === "admin" && admReports && !isPending &&
        admReports
        
         .filter((report) =>{
                if(searchName == ""){
                  return report;
                }else if (report.value.data().userFirstName.toLowerCase().includes (searchName.toLowerCase()) || report.value.data().userLastName.toLowerCase().includes (searchName.toLowerCase()))
                  return report;
                }) 
        // .slice(pagesVisited, pagesVisited + itemsPerPage)
        // .slice(0, 8)
        .map((report) => (
          <Fragment key={report.value.id}>
            <DashboardDayReport
            groupe={report.label}
            uid={user.uid}
              id={report.value.id}
              name={report.value.data().userLastName}
              isReaded={report.value.data().isReaded}
              body={report.value.data().report}
              difficulties={report.value.data().difficulty}
              date={report.value
                .data()
                .createdAt.toDate()
                .toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              hour={report.value.data().createdAt.toDate().toLocaleTimeString()}
            />
          </Fragment>
        ))}

            
          
        {isPending && (
          <Fragment>
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
          </Fragment>
        )}
      </Grid>
{userData.isAdmin === "employe" &&

          <Flex w='450px' justifyContent={'flex-end'} mt={'5'}>
             <Input
                type="date"
                placeholder="jj/mm/aaaa"
                variant="flushed"
                onChange={(event) => setDateDebut(event.target.value)}
              />
              <Text textAlign={'center'} mx={3} mt={2} fontWeight={'bold'} color={"purple.500"}>à </Text>

             <Input
              type="date"
              placeholder="jj/mm/aaaa"
              variant="flushed"
              onChange={(event) => setDateFin(event.target.value)}
            />
            <Button color="purple.500" ml={3} onClick={handleApplyFilters}><Icon as={FiSearch} /></Button>
            <Button color="red.500" ml={3} onClick={handleReset}><Icon as={AiOutlineClose} /></Button>

          </Flex>
          
}

          
      {userData.isAdmin === "employe" &&    
      <Grid
        templateColumns={{
           base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
        }}
        gap={5}
        mt={10}
      >
        {sortedMyReports
        
         .filter((report) =>{
                if(searchName == ""){
                  return report;
                }else if (report.data().userFirstName.toLowerCase().includes (searchName.toLowerCase()) )
                  return report;
                }) 
        // .slice(pagesVisited, pagesVisited + itemsPerPage)
        
        .map((report) => (
          <Fragment key={report.id}>
            <DashboardDayReport
            //  groupe={report.label}
            uid={user.uid}
              id={report.id}
              name={userData.isAdmin === "admin" ? report.data().userFirstName : ""}
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
      </Grid>} 

    {(admReports || sortedMyReports) && !isPending &&  (userData.isAdmin === "admin" || userData.isAdmin === "employe") &&
    
    <Center mt='5'>
       
            <ReactPaginate 
              previousLabel={"<<"}
              nextLabel={">>"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </Center>
          }

              {userData.isAdmin === "adjoint" && 
              <>
                <Box mt={10} background="white" p={5} rounded="md" boxShadow="md">     
      <Grid
        templateColumns={{
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={5}
        mt={2}
      >
        {sortedMyReports && !isPending &&
        sortedMyReports
        
        //  .filter((report) =>{
        //         if(searchName == ""){
        //           return report;
        //         }else if (report.data().userFirstName.toLowerCase().includes (searchName.toLowerCase()) )
        //           return report;
        //         }) 
        // .slice(pagesVisited, pagesVisited + itemsPerPage)
        .slice(0, 4)
        .map((report) => (
          <Fragment key={report.id}>
            <DashboardDayReport
              id={report.id}
              name={report.data().userLastName}
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
          </Fragment>
        )}
      </Grid>
          
          {sortedMyReports && !isPending &&
           <Flex mt='4' ml='5'>
              <ViewIcon 
                rounded="full"
                background="purple.200"
                color="purple.400"
              />
              <Link to="/reportlist"  state={new Date().toISOString().split("T")[0]} >  
                <Text 
                  textDecoration={'underline'}
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
      {error && <Text>Vous n'avez pas de rapports</Text>}

      <Box mt='7'>

        <Heading>Rapports a la charge</Heading>
        <Box mt={10} background="white" p={5} rounded="md" boxShadow="md">
{affectedReports.length === 0 && !isPending &&
                
                <Text textAlign={'center'} mt={'3'}>Aucun(s) rapports de groupes recu(s) </Text>}
                 <Grid
        templateColumns={{
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={5}
        mt={2}
      >
        {affectedReports && !isPending &&
        affectedReports
        
        //  .filter((report) =>{
        //         if(searchName == ""){
        //           return report;
        //         }else if (report.data().userFirstName.toLowerCase().includes (searchName.toLowerCase()) )
        //           return report;
        //         }) 
        // .slice(pagesVisited, pagesVisited + itemsPerPage)
        .slice(0, 8)
        .map((report) => (
          <Fragment key={report.value.id}>
            <DashboardDayReport
            groupe={report.label}
            uid={user.uid}
              id={report.value.id}
              name={report.value.data().userLastName}
              isReaded={report.value.data().isReaded}
              body={report.value.data().report}
              difficulties={report.value.data().difficulty}
              date={report.value
                .data()
                .createdAt.toDate()
                .toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              hour={report.value.data().createdAt.toDate().toLocaleTimeString()}
            />
          </Fragment>
        ))}

            
          
        {isPending && (
          <Fragment>
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
          </Fragment>
        )}
      </Grid>
          
          {affectedReports && !isPending &&
           <Flex mt='4' ml='5'>
              <ViewIcon 
                rounded="full"
                background="purple.200"
                color="purple.400"
              />
              <Link to="/affectedreports"  state={new Date().toISOString().split("T")[0]} >  
                <Text 
                  textDecoration={'underline'}
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

              </>
              } 
    </Box>
  );
}
