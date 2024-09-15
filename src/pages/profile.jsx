import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/navbar";
import { Heading, Divider } from "@chakra-ui/react";
import axios from 'axios';

export default function Profile() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Move the hooks to the top level of the component
  const [listings, setListings] = useState([]);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/get/');
          const database = response.data;
          console.log(database);
          if (user) {
            setListings(response.data);
            const userJoinedListings = database.filter(listing =>
              listing.owner.includes(user.username)
            );
            setUserListings(userJoinedListings);
          }
        } catch (error) {
          console.error('Error fetching Data:', error);
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
          } else if (error.request) {
            console.error('Request data:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
        }
      };

      fetchData();
    }
  }, [isSignedIn, user]); // Dependencies

  if (!isSignedIn) {
    return <div>Not signed in</div>;
  }

  const { imageUrl } = user;
  const params = new URLSearchParams();
  params.set("height", "200");
  params.set("width", "200");
  params.set("quality", "100");
  params.set("fit", "crop");
  const imageSrc = `${imageUrl}?${params.toString()}`;

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="mt-24 mx-[5vw]">
        <Heading
          className="text-left mb-3"
          as="h2"
          size="lg"
          p={0}
          noOfLines={1}
        >
          My Account
        </Heading>
        <div className="flex flex-row">
          <img
            src={imageSrc}
            alt="pfp"
            className="mr-6"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div className="flex flex-col">
            <Heading>{user.fullName}</Heading>
            <div>sell</div>
          </div>
        </div>
        <Divider />
        <Heading>My Listings</Heading>
      </div>
    </div>
  );
}
