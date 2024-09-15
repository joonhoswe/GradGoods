import { useState, useEffect } from "react";
import axios from "axios";
import { Heading, Button, Image, Icon } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import AWS from "aws-sdk";
import { useNavigate } from "react-router-dom";

export default function Listing() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [currImage, setCurrImage] = useState(0);
  const [imagesArr, setImagesArr] = useState([]);
  const { isSignedIn, user, isLoaded } = useUser();
  const { id } = useParams();
  const [curr, setCurr] = useState(null);
  const [isMyListing, setIsMyListing] = useState(false);

  AWS.config.update({
    region: "us-east-2",
    credentials: new AWS.Credentials(
      import.meta.env.VITE_AWS_ACCESS_KEY,
      import.meta.env.VITE_AWS_SECRET_KEY
    ),
  });

  const s3 = new AWS.S3();

  const handleDelete = async (item) => {
    try {
      // Delete the listing from the database
      await axios.delete(`http://127.0.0.1:8000/api/delete/${item.id}`);
      const imageUrls = item.imageURLs.split(",");

      // Delete images from AWS S3
      for (const imageUrl of imageUrls) {
        const imageKey = imageUrl.split("/").pop();
        if (imageKey.length !== 0) {
          const information = {
            Bucket: "gradgoodsimages",
            Key: imageKey,
          };
          await s3.deleteObject(information).promise();
        }
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    } finally {
      navigate("/browse");
    }
  };

  // const handleUpdate = async (item) => {
  //     try {
  //       const response = await axios.post(
  //         "http://127.0.0.1:8000/api/post/",
  //         dataForSql
  //       );
  //       setPosted(true);
  //       clearForm();
  //       console.log("Response:", response.data);
  //     } catch (error) {
  //       console.error(
  //         "Error:",
  //         error.response ? error.response.data : error.message
  //       );
  //     } finally {
  //       setSubmitClicked(false);
  //     }
  //   }
  //   };

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
      setIsMyListing(user.username === curr.owner);
    }
  }, [curr]);

  // if (!curr) {
  //   return <div>does not exist</div>;
  // }

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
        {curr ? ( // Check if `curr` exists before trying to access its properties
          <>
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
                width="450px"
                height="450px"
                objectFit="cover"
                src={imagesArr[currImage]}
                alt="product-image"
              />
              <Icon
                cursor={currImage < imagesArr.length - 1 ? "pointer" : null}
                boxSize={10}
                color={
                  currImage < imagesArr.length - 1 ? "gray.700" : "gray.300"
                }
                ml="4"
                as={ChevronRightIcon}
                onClick={
                  currImage < imagesArr.length - 1 > 0
                    ? increaseImageIndex
                    : null
                }
              />
            </div>
            <div className="w-[50%] ml-10">
              <div className="flex flex-row justify-between">
                <Heading size="2xl">{curr.itemName}</Heading>
                {isMyListing ? (
                  <div>
                    <Button
                      borderRadius="full"
                      onClick={() => handleUpdate(curr)}
                    >
                      Edit
                    </Button>
                  </div>
                ) : null}
              </div>
              <p className="mb-4 text-2xl font-medium">{curr.owner}</p>
              {curr.itemCategory === "Clothing" ||
              curr.itemCategory === "Shoes" ? (
                <div className="mb-4 text-2xl font-normal">Size: </div>
              ) : null}
              <p className="mb-4 text-xl font-normal">
                Category: {curr.itemCategory}
              </p>
              <p className="mb-4 text-2xl font-bold">${curr.price}</p>
              {isMyListing ? (
                <Button
                  onClick={() => handleDelete(curr)}
                  size="lg"
                  colorScheme="red"
                >
                  Delete
                </Button>
              ) : (
                <Button size="lg" colorScheme="green">
                  Buy now
                </Button>
              )}
              <p className="mb-2 text-2xl font-bold mt-8">Description</p>
              <p className="text-lg">{curr.description}</p>
            </div>
          </>
        ) : (
          <div>Loading listing details...</div> // Placeholder while curr is still null
        )}
      </div>
    </div>
  );
}
