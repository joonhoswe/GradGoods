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
import axios from "axios";
import AWS from 'aws-sdk';

// item fields:
// title, imageUrl, category,
const ItemCard = ({ item }) => {
  const imageUrls = item.imageURLs.split(",");
  const firstImage = imageUrls[0];

  AWS.config.update({
    region: 'us-east-2',
    credentials: new AWS.Credentials(
      import.meta.env.VITE_AWS_ACCESS_KEY,
      import.meta.env.VITE_AWS_SECRET_KEY
    ),
  });
  
  const s3 = new AWS.S3();

  const handleDelete = async (item) => {
    // setLoading(true);
    try {
        // Find the listing to be deleted using the provided id
        // const listing = allListings.find(listing => listing.id === id);
        // if (!listing) {
        //     throw new Error("Listing not found");
        // }

        // Delete the listing from the database
        await axios.delete(`http://127.0.0.1:8000/api/delete/${item.id}`);

        // Delete images from AWS S3
        for (const imageUrl of imageUrls) {
            const imageKey = imageUrl.split('/').pop();
            if (imageKey.length !== 0) {
                const information = {
                    Bucket: 'gradgoodsimages',
                    Key: imageKey,
                };
                await s3.deleteObject(information).promise();
            }
        }

        // // Update the local state to remove the deleted listing
        // const updatedListings = allListings.filter(listing => listing.id !== id);

        // // Update the user's listings if called from Profile to re-render the listings joined by the user
        // if (changeUserListing) {
        //     await changeUserListing(updatedListings);
        // }
        // else{
        //     await refreshListing(updatedListings);
        // }

    } catch (error) {
        console.error('Error deleting listing:', error);
    } finally {
        // setLoading(false);
        // setConfirm(false);
    }
};

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
          src={firstImage}
          // src="https://gradgoodsimages.s3.us-east-2.amazonaws.com/Cmu%20Scs%20from%20Heather%20Miller.png"
          alt={item.itemName}
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
          <button onClick={() => handleDelete(item)} className='flex items-center justify-center w-20 h-6 outline-none ring-2 ring-red-500 bg-red-500 text-white text-sm font-bold hover:scale-105 transition ease-in-out duration-300 rounded-lg'> 
            Delete
           </button>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default ItemCard;
