import { useState, useEffect } from "react";
import axios from "axios";
import { Heading, Button, Image, Icon } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";

export default function Listing() {
  const [listings, setListings] = useState([]);
  const [currImage, setCurrImage] = useState(1);
  const [imagesArr, setImagesArr] = useState([]);
  const { isSignedIn, user, isLoaded } = useUser();
  const { id } = useParams();
  const [curr, setCurr] = useState(null);
  const [isMyListing, setIsMyListing] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/get/");
          const data = response.data;
          setListings(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching Data:", error);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
          } else if (error.request) {
            console.error("Request data:", error.request);
          } else {
            console.error("Error message:", error.message);
          }
        }
      };

      fetchData();
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    if (listings) {
      const listing = listings.filter((l) => {
        return l.id.toString() === id;
      });
      console.log(listing);
      setCurr(listing[0]);
    }
  }, [listings]);

  useEffect(() => {
    if (curr) {
      setImagesArr(curr.imageURLs.split(","));
      console.log(curr.imageURLs.split(","));
    }
  }, [curr]);

  if (!curr) {
    return <div>does not exist</div>;
  }

  const decreaseImageIndex = () => {
    setCurrImage(currImage - 1);
  };

  const increaseImageIndex = () => {
    setCurrImage(currImage + 1);
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="mt-20 mx-[5vw] flex flex-row justify-between">
        <div className="w-[50%] flex flex-row justify-center items-center">
          <Icon
            boxSize={10}
            cursor={currImage > 0 ? "pointer" : null}
            as={ChevronLeftIcon}
            mr="4"
            onClick={currImage > 0 ? decreaseImageIndex : null}
            color={currImage > 0 ? "gray.700" : "gray.300"}
          />
          <Image
            boxSize="68%"
            objectFit="cover"
            src={imagesArr[currImage]}
            alt="product-image"
          />
          <Icon
            cursor={currImage < imagesArr.length - 1 ? "pointer" : null}
            boxSize={10}
            color={currImage < imagesArr.length - 1 ? "gray.700" : "gray.300"}
            ml="4"
            as={ChevronRightIcon}
            onClick={
              currImage < imagesArr.length - 1 > 0 ? increaseImageIndex : null
            }
          />
        </div>
        <div className="w-[50%]">
          <Heading size="2xl">{curr.itemName}</Heading>
          <p className="mb-4 text-2xl font-medium">{curr.owner}</p>
          {curr.itemCategory === "Clothing" || curr.itemCategory === "Shoes" ? (
            <div className="mb-4 text-2xl font-normal">Size: </div>
          ) : null}
          <p className="mb-4 text-xl font-normal">
            Category: {curr.itemCategory}
          </p>
          <p className="mb-4 text-2xl font-bold">${curr.price}</p>
          <Button size="lg" colorScheme="green">
            Buy now
          </Button>
          <p className="mb-2 text-2xl font-bold mt-8">Description</p>
          <p className="text-lg">{curr.description}</p>
        </div>
      </div>
    </div>
  );
}
