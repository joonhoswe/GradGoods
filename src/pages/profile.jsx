import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/navbar";
import { Heading, Divider } from "@chakra-ui/react";
import axios from 'axios';
import placeholder from '../assets/placeholder.jpeg';
import { use } from "framer-motion/client";

export default function Profile() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Move the hooks to the top level of the component
  const [listings, setListings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [userInactiveListings, setUserInactiveListings] = useState([]);

  const [active, setActive] = useState(true);

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/get/');
          const database = response.data;
          if (user) {
            setListings(response.data);
            const userJoinedListings = database.filter(listing =>
              listing.owner.includes(user.username)
            );
            setUserListings(userJoinedListings);

            const inactiveListings = userJoinedListings.filter(listing =>
              listing.active.includes(false)
            );
            setUserInactiveListings(inactiveListings);
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

  useEffect(() => {
  }, [active]);

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
        
        <div className="flex flex-row w-full h-full py-16">
            <div className="flex flex-row w-1/4 h-full">
              <div className="flex flex-col space-y-2">
                <Heading>My Listings</Heading>
                <p onClick={() => setActive(!active)} className={`font-bold hover:cursor-pointer ${active ? 'text-black' : 'text-gray-500'}`}> Active </p>
                <p onClick={() => setActive(!active)} className={`font-bold hover:cursor-pointer ${active ? 'text-gray-500' : 'text-black'}`}> Inactive </p>
              </div>
            </div>
            <div className="flex flex-row w-3/4 h-full">
              <div className='flex gap-6 items-center flex-wrap'>
                {userListings.map((listing, index) => {
                const imagesArray = listing.imageURLs ? listing.imageURLs.split(',') : []; // Split the 'images' string into an array
                return ( 
                  <div
                    key={index}
                    className='relative flex flex-col h-56 w-56 hover:cursor-pointer border border-gray-200'
                  >
                    <img
                      src={!imagesArray[0] ? placeholder : imagesArray[0]}
                      alt='Listing Image'
                      className='h-1/2 w-full'
                    />
                    <div className='flex flex-col space-y-1 justify-start text-start px-4'>
                      <div className='flex flex-col space-y-1'>
                        <p className='text-xs'> {listing.itemCategory} </p>
                        <h1 className='text-lg font-bold'> {listing.itemName} </h1>
                        <p className='text-md'> ${listing.price} </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
        </div>
        
      </div>
    </div>
  );
}