import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
} from "@chakra-ui/react";

// item fields:
// title, imageUrl, category,
const ItemCard = ({ item }) => {
  return (
    <Card
      w="290px"
      h="392px"
      borderRadius="lg"
      _hover={{
        cursor: "pointer",
        boxShadow: "0px 0px 10px rgba(0, 128, 0, 0.6)",
      }}
      transition="all 0.4s ease"
    >
      <CardBody>
        <Image
          src={item.imageURLs[0]}
          alt={item.title}
          borderRadius="lg"
          objectFit="cover"
          boxSize="250px"
          width="250px"
          height="250px"
        />
        <Stack mt="2" spacing="1">
          <Text color="#979797" fontSize="12px" textAlign="left">
            {item.itemCategory}
          </Text>
          <Heading size="md" textAlign="left" isTruncated>
            {item.itemName}
          </Heading>
          <Text color="black" fontSize="1xl" textAlign="left" fontWeight="500">
            ${item.price}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ItemCard;
