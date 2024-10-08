import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/navbar";
import { Heading, Divider, Button } from "@chakra-ui/react";
import axios from "axios";
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
  const [isMarkingComplete, setIsMarkingComplete] = useState(true);
  const [active, setActive] = useState(true);

  const calculateEarnings = () => {
    return userInactiveListings.reduce(
      (total, listing) => total + (listing.price || 0),
      0
    );
  };

  useEffect(() => {
    if (isSignedIn && isLoaded && user) {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/get/");
          const database = response.data;
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

          // Calculate pounds after fetching data
          calculateTotalPounds(inactiveListings);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const getPounds = async (item) => {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
              role: "user",
              content: `Tell me with an integer number how many pounds an average ${item} would weigh. Return your response as just a number and nothing else. If you don't understand for any given object, just return 0.`,
            },
          ],
        });
        return parseInt(completion.choices[0].message.content, 10) || 0;
      };

      // Async function to calculate pounds for all inactive listings
      const calculateTotalPounds = async (inactiveListings) => {
        let totalPounds = 0;

        // Use for...of loop to await the asynchronous getPounds calls
        for (const listing of inactiveListings) {
          const poundsForItem = await getPounds(listing.itemName);
          totalPounds += poundsForItem;
        }

        // After calculating all pounds, set the state
        setPounds(totalPounds);
      };

      fetchData();
    }
  }, [isSignedIn, isLoaded, user, isMarkingComplete]);

  const handleCardClick = (id) => {
    if (!isMarkingComplete) {
      markComplete(id);
    } else {
      navigate(`/listing/${id}`);
    }
  };

  const markComplete = async (id) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/patch/${id}/`, {
        active: false // The field to update
      });
      console.log("Listing marked complete:", response.data);

      const updatedListings = listings.map((listing) =>
        listing.id === id ? { ...listing, active: false } : listing
      );
      setListings(updatedListings);
      setUserActiveListings(updatedListings.filter(listing => listing.active));
      setUserInactiveListings(updatedListings.filter(listing => !listing.active));
      
      setIsMarkingComplete(true);
    } catch (error) {
      console.error("Error marking listing as complete:", error);
    }
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="mt-24 mx-[5vw]">
        <Heading className="text-left mb-3" as="h2" p={0} noOfLines={1}>
          My Account
        </Heading>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row">
            {isLoaded && user ? (
              <>
                <img
                  src={user.imageUrl || placeholder}
                  alt="Profile picture"
                  className="mr-6"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div className="flex items-center">
                  <Heading>{user?.username || "User"}</Heading>
                </div>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>

          <div className="flex flex-col items-end">
            <h1 className="text-3xl font-bold"> 💰 Earnings: ${calculateEarnings()}</h1>
            <h1 className="text-3xl font-bold text-green-500"> 🍃 {pounds} lbs of waste saved</h1>
          </div>
        </div>

        {/* Button aligned to the right above the divider */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsMarkingComplete(!isMarkingComplete)}
            className={`transition ease-in-out duration-500 rounded-md w-48 h-10 font-bold ${
              isMarkingComplete
                ? 'bg-green-500 text-white'
                : 'border border-green-500 bg-white text-green-500'
            }`}
          >
            {isMarkingComplete ? 'Mark as Completed' : 'Selection in Progress'}
          </button>
        </div>
        <Divider />

        <div className="flex flex-row w-full h-full py-8">
          <div className="flex flex-row w-1/4 h-full">
            <div className="flex flex-col space-y-2">
              <Heading mb={2} size="lg">
                My Listings
              </Heading>
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
                Complete
              </p>
            </div>
          </div>
          <div className="flex flex-row w-3/4 h-auto">
            <div className="h-full flex gap-6 items-center flex-wrap">
              {active
                ? userActiveListings.map((listing, index) => (
                    <div
                      onClick={() => handleCardClick(listing.id)}
                      key={index}
                    >
                      <ItemCard item={listing} />
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
