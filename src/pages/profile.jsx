import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/navbar";
import { Heading, Divider } from "@chakra-ui/react";
import axios from "axios";
import placeholder from "../assets/placeholder.jpeg";
import ItemCard from "../components/ItemCard";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";

export default function Profile() {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [pounds, setPounds] = useState(0);
  const [listings, setListings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [userActiveListings, setUserActiveListings] = useState([]);
  const [userInactiveListings, setUserInactiveListings] = useState([]);

  const [active, setActive] = useState(true);

  // for inactive listings, add up all the prices to calculate money earned
  const calculateEarnings = () => {
    return userInactiveListings.reduce(
      (total, listing) => total + (listing.price || 0),
      0
    );
  };

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/get/");
          const database = response.data;
          if (user) {
            setListings(response.data);
            const userJoinedListings = database.filter(
              (listing) => listing.owner === user.username
            );
            setUserListings(userJoinedListings);

            const activeListings = userJoinedListings.filter(
              (listing) => listing.active === true
            );
            setUserActiveListings(activeListings);

            const inactiveListings = userJoinedListings.filter(
              (listing) => listing.active === false
            );
            setUserInactiveListings(inactiveListings);
          }
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

      const getPounds = async (item) => {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
              role: "user",
              content: `Tell me with an integer number how many pounds a ${item} would weigh. Return your response as just a number and nothing else. If you don't understand for any given object, just return 0.`,
            },
          ],
        });
        console.log(completion.choices[0].message.content);
      };

      fetchData();
      userInactiveListings.forEach((listing) => {
        const p = getPounds(listing.price);
        setPounds(pounds + p);
      });
    }
  }, [isSignedIn, user]); // Dependencies

  useEffect(() => {}, [active]);

  if (!isSignedIn) {
    return <div>Not signed in</div>;
  }

  const handleCardClick = (id) => {
    navigate(`/listing/${id}`);
  };

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
          p={0}
          noOfLines={1}
        >
          My Account
        </Heading>
        <div className="flex flex-row justify-between">
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
            <div className="flex items-center">
              <Heading>{user.username}</Heading>
            </div>
          </div>

          <div className="flex flex-col items-end">
            {/* Dynamically display total earnings */}
            <h1 className="text-3xl font-bold">
              {" "}
              💰 Earnings: ${calculateEarnings()}
            </h1>
            <h1 className="text-3xl font-bold text-green-500">
              🍃 ${pounds} of waste saved
            </h1>
          </div>
        </div>

        <Divider />

        <div className="flex flex-row w-full h-full py-8">
          <div className="flex flex-row w-1/4 h-full">
            <div className="flex flex-col space-y-2">
              <Heading mb={2} size="lg">My Listings</Heading>
              <p
                onClick={() => setActive(true)}
                className={`text-lg font-bold hover:cursor-pointer transition ease-in-out duration-300 hover:text-green-500 ${
                  active ? "text-black" : "text-gray-500"
                }`}
              >
                Active
              </p>
              <p
                onClick={() => setActive(false)}
                className={`text-lg font-bold hover:cursor-pointer transition ease-in-out duration-300 hover:text-green-500 ${
                  active ? "text-gray-500" : "text-black"
                }`}
              >
                Complete/Inactive
              </p>
            </div>
          </div>
          <div className="flex flex-row w-3/4 h-full">
            <div className="flex gap-6 items-center flex-wrap">
              {active
                ? userActiveListings.map((listing, index) => (
                    <div onClick={() => handleCardClick(listing.id)}>
                      <ItemCard item={listing} key={index} />
                    </div>
                  ))
                : userInactiveListings.map((listing, index) => (
                    <ItemCard item={listing} key={index} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
