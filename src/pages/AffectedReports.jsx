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

function AffectedReports() {

 const { user, userData } = useContext(AuthContext);
  const [myReports, setMyReports] = useState([]);
  const [initialReports, setInitialReports] = useState([]);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [filterValues, setFilterValues] = useState( "all" );
  let sortedMyReports = [...myReports];
  const [dateDebut, setDateDebut] = useState();
  const [dateFin, setDateFin] = useState();
const [affectedReports, setAffectedReports] = useState([]);


console.log("affectedReports")
console.log(affectedReports)

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

  const onFilterValueChange = (value) => {
    setFilterValues(value);
  };

  //fonction pour reset les donnees initiales dans le filtres par date
  const handleReset = () => {
    // setDateDebut("");
    // setDateFin("")
    setMyReports(initialReports)
  };


// fonction qui permet de filtrer pour une periode de date
  const handleApplyFilters = () => {
    if(dateDebut && dateFin){
      sortedMyReports = initialReports
      .filter(report => {
        const createdAt = report.data().createdAt.toDate().toISOString().split("T")[0]
        return createdAt >= dateDebut&& createdAt <= dateFin;
      });
    }
    setMyReports(sortedMyReports)
    // setDateDebut("");
    //   setDateFin("");
  };

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

    // useEffect(() => {
    // if (userData.isAdmin === "adjoint") {


    //    userData.affectedGroup.filter((group)=>
    //          group.value )
 
      
    // }
//   }, [user]);
    useEffect(() => {
            const EmployeesTable = [];
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
      if(pers.id === rapport.data().uid){
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

            } catch (error) {
            // console.log(error.message);
            setIsPending(false);
            setError(true);
            }
        
        };
        getMyGroups();
     }, []);

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
      if (userData.isAdmin === "admin") {
        try {
          const querySnapshot = onSnapshot(qAdmin, (snapshot) => {
            setMyReports(snapshot.docs);
            setInitialReports(snapshot.docs);
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
  }, []);


  //Conditions pour le tri par Statut
      if(filterValues === "all"){
        sortedMyReports = sortedMyReports.filter(
          report => report.data().isReaded === true || report.data().isReaded === false
        )
      }else if(filterValues === "Lu"){
        sortedMyReports = sortedMyReports.filter(
          report => report.data().isReaded === true
        )
      }else{
        sortedMyReports = sortedMyReports.filter(
          report => report.data().isReaded === false
        )
      }




  return (
   <Box p={userData.isAdmin === "admin" ? { base: 4, md: 10 } : ""} minH="100vh">
      <Heading>
        Rapports a la charge
      </Heading>

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
              <MenuList minWidth='240px'>
                <MenuOptionGroup defaultValue={filterValues} title='Statut' type='radio' onChange={(value) => onFilterValueChange(value)}>
                  <MenuItemOption value='all'>Tout</MenuItemOption>
                  <MenuItemOption value='Lu'>Lu</MenuItemOption>
                  <MenuItemOption value='NLu'>Non Lu</MenuItemOption>
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

          
     {affectedReports.length === 0 && !isPending &&
                
                <Text textAlign={'center'} mt={'3'}>Aucun(s) rapports de groupes recu(s) </Text>}     
      <Grid
        templateColumns={{
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={5}
        mt={10}
      >
        {affectedReports && !isPending &&
        affectedReports
        
         .filter((report) =>{
                if(searchName == ""){
                  return report;
                }else if (report.data().userFirstName.toLowerCase().includes (searchName.toLowerCase()) )
                  return report;
                }) 
        // .slice(pagesVisited, pagesVisited + itemsPerPage)
        
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
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
            <Skeleton height="100px" rounded="md" />
          </Fragment>
        )}
      </Grid>
      {error && <Text>Vous n'avez pas de rapports</Text>}

    {affectedReports && !isPending &&  
    
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
    </Box>
  );
}

export default AffectedReports