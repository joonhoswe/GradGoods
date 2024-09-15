import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";

export default function Listing() {
  const [listings, setListings] = useState([]);
  const { isSignedIn, user, isLoaded } = useUser();
  const { id } = useParams();
  const [curr, setCurr] = useState(null);

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
      setCurr(listing[0]);
      console.log(listing[0]);
    }
  }, [listings]);

  if (!curr) {
    return <div>does not exist</div>;
  }

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="mt-20 mx-[5vw] flex flex-row justify-between">
        <div className="w-[50%]">image</div>
        <div className="w-[50%]">
          <h1>{curr.itemName}</h1>
          <p>{curr.owner}</p>
        </div>
      </div>
    </div>
  );
}
