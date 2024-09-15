import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Input,
  InputGroup,
  InputRightAddon,
  Heading,
  Tag,
  HStack,
  Divider,
  Select,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Navbar from "../components/navbar";
import BrowseItemDisplay from "../components/BrowseItemDisplay";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export default function Browse() {
  const location = useLocation();
  const { school } = location.state || {};
  const [search, setSearch] = useState("");
  const tagOptions = [
    "View All",
    "Clothing",
    "Electronics",
    "Shoes",
    "Textbooks",
    "Miscellaneous"
  ];
  const [selectedTag, setSelectedTag] = useState("View All");
  const { isSignedIn, user, isLoaded } = useUser();

  const isEmailValid = user
  ? user.primaryEmailAddress.emailAddress.substring(
      user.primaryEmailAddress.emailAddress.length - 4
    ) == ".edu"
  : false;

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [sizeFilter, setSizeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const updateListings = (query) => {
    setFilteredListings(
      listings.filter((listing) =>
        listing.itemName?.toLowerCase().includes(query.toLowerCase())
      )
    );
  };
  useEffect(() => {
    updateListings(search);
  }, [search]);
  if (!school) {
    console.error("error: school not found");
  }

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/get/");
      const database = response.data;
      console.log(database);
      if (user) {
        const filteredData = database.filter((listing) => {
          if (listing.school !== school) {
            return false;
          }
          if (listing.active === false) {
            return false;
          }
          if (
            selectedTag !== "View All" &&
            !listing.itemCategory?.includes(selectedTag)
          ) {
            return false;
          }
          if (sizeFilter && !listing.size?.includes(sizeFilter)) {
            return false;
          }
          if (priceFilter && listing.price) {
            const price = listing.price;
            if (priceFilter === "0-20" && (price < 0 || price > 20)) {
              return false;
            }
            if (priceFilter === "20-50" && (price < 20 || price > 50)) {
              return false;
            }
            if (priceFilter === ">50" && price <= 50) {
              return false;
            }
          }
          return true;
        });
        setListings(filteredData);
        setFilteredListings(
          filteredData.filter((listing) =>
            listing.itemName?.toLowerCase().includes(search.toLowerCase())
          )
        );
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

  useEffect(() => {
    if (isSignedIn && user) {
      console.log("Inside");
      fetchData();
    }
  }, [isSignedIn, user, selectedTag, sizeFilter, priceFilter]);

  const onInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleTagClick = (name) => {
    setSelectedTag(name);
    if (name === "View All") {
      setSizeFilter("");
      setPriceFilter("");
    }
  };

  const handleSize = (event) => {
    setSizeFilter(event.target.value);
  };

  const handlePrice = (event) => {
    setPriceFilter(event.target.value);
  };

  const onSearch = () => {
    fetchData();
  };
  
  return (
    <div>
        <Navbar />

        {!isEmailValid && (
          <div className="flex items-center justify-center w-full bg-red-500 text-white p-4 font-bold z-50">
            You MUST have a valid .edu email address to purchase listings!
          </div>
        )}


      <div className="mt-24 mx-[5vw]">
        <Heading
          className="text-left mb-3"
          as="h2"
          size="xl"
          p={0}
          noOfLines={1}
        >
          {school}'s Items
        </Heading>
        <div className="flex flex-row justify-between">
          <HStack spacing="8px">
            {tagOptions.map((tagName, index) => {
              return (
                <Tag
                  className="hover:cursor-pointer"
                  key={index}
                  size="lg"
                  borderRadius="full"
                  onClick={() => handleTagClick(tagName)}
                  colorScheme={selectedTag === tagName ? "green" : "gray"}
                >
                  {tagName}
                </Tag>
              );
            })}
          </HStack>
          <InputGroup width="30vw" className="">
            <Input
              onChange={onInputChange}
              value={search}
              placeholder="Search"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Return") {
                  onSearch();
                }
              }}
            />
            <InputRightAddon  _hover={{ bg: 'gray.50', cursor: 'pointer' }}>
              <SearchIcon color="gray.600" />
            </InputRightAddon>
          </InputGroup>
        </div>
        <Divider className="my-3" />
        <div className="p-4">
          <HStack spacing={4}>
            <>Filter by:</>
            <Box width="auto">
              <Select
                onChange={handlePrice}
                placeholder="Price"
                size="sm"
                width="150px"
              >
                <option value="0-20">Under $20</option>
                <option value="20-50">$20-$50</option>
                <option value=">50">Above $50</option>
              </Select>
            </Box>
            {(selectedTag === "Clothing" || selectedTag === "Shoes") && (
              <Box width="auto">
                <Select
                  onChange={handleSize}
                  placeholder="Size"
                  size="sm"
                  width={selectedTag === "Shoes" ? "230px" : "100px"}
                >
                  {selectedTag === "Shoes" && (
                    <>
                      <option value="3 (Women's) / 5 (Men's)">
                        3 (Women's) / 5 (Men's)
                      </option>
                      <option value="4 (Women's) / 6 (Men's)">
                        4 (Women's) / 6 (Men's)
                      </option>
                      <option value="5 (Women's) / 7 (Men's)">
                        5 (Women's) / 7 (Men's)
                      </option>
                      <option value="6 (Women's) / 8 (Men's)">
                        6 (Women's) / 8 (Men's)
                      </option>
                      <option value="7 (Women's) / 9 (Men's)">
                        7 (Women's) / 9 (Men's)
                      </option>
                      <option value="8 (Women's) / 10 (Men's)">
                        8 (Women's) / 10 (Men's)
                      </option>
                      <option value="9 (Women's) / 11 (Men's)">
                        9 (Women's) / 11 (Men's)
                      </option>
                      <option value="10 (Women's) / 12 (Men's)">
                        10 (Women's) / 12 (Men's)
                      </option>
                    </>
                  )}
                  {selectedTag === "Clothing" && (
                    <>
                      <option value="">Any</option>
                      <option value="XXS">XXS</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </>
                  )}
                </Select>
              </Box>
            )}
          </HStack>
          <div className="mt-8 mb-24">
            <BrowseItemDisplay items={filteredListings} isEmailValid={isEmailValid} school={school}/>
          </div>
        </div>
      </div>
    </div>
  );
}
