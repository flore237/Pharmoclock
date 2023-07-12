import { Box, Container, Flex, Skeleton, Text } from "@chakra-ui/react";

export default function AttendanceList(props) {
  const today = new Date();
  return (
    <Container
      maxW={props.userData.isAdmin ? "container.lg" : "container.xl"}
      mt={8}
      px={0}
      background="white"
      p={5}
      boxShadow="md"
      rounded="md"
    >
      <Flex
        w="full"
        justify="space-between"
        p={3}
        background="purple.400"
        color="white"
        fontWeight="bold"
      >
        <Text textAlign="center" flex={1}>
          Jour
        </Text>
        <Text textAlign="center" flex={1}>
          Heure d'arrivée
        </Text>
        <Text textAlign="center" flex={1}>
          Heure de départ
        </Text>
      </Flex>
      <Box>
        {props.presences &&
        
        props.presences.map((presence) => (
          <Flex
            w="full"
            justify="space-between"
            p={3}
            _hover={{
              background: "gray.100",
            }}
            key={presence.id}
            borderBottom="1px solid"
            borderBottomColor="gray.300"
          >
              <Text textAlign="center" flex={1}>
      {presence.data().heureArrivee &&
      today.toDateString("en-GB") ===
        presence.data().heureArrivee.toDate()?.toDateString("en-GB")
          ? "Aujourd'hui"
          : presence
              .data()
              .heureArrivee?.toDate()
              .toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
    </Text>
    <Text
      textAlign="center"
      flex={1}
      color={
        presence.data().heureArrivee?.toDate()?.getHours() > 9 ||
        (presence.data().heureArrivee?.toDate()?.getHours() === 9 &&
          (presence.data().heureArrivee?.toDate()?.getMinutes() > 0 ||
            presence.data().heureArrivee?.toDate()?.getSeconds() > 0))
          ? "red.500"
          : ""
      }
    >
      {presence
        .data()
        .heureArrivee?.toDate()
        .toLocaleTimeString("en-GB")}
    </Text>
  <Text
              textAlign="center"
              flex={1}
              color={
                presence.data().heureDepart &&
                presence.data().heureDepart.toDate().getHours() < 18
                  ? "red.500"
                  : ""
              }
            >
              {presence.data().heureDepart &&
                presence
                  .data()
                  .heureDepart.toDate()
                  .toLocaleTimeString("en-GB")}
            </Text>
          </Flex>
        ))}
        {props.isPending && (
          <Flex direction="column" gap={3} mt={3}>
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
          </Flex>
        )}
      </Box>
    </Container>
  );
}
