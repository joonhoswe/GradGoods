import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
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
  const tagOptions = ["Clothing", "Electronics", "Shoes", "Textbooks"];
  const [filters, setFilters] = useState([]);
  const { isSignedIn, user, isLoaded } = useUser();
  const [listings, setListings] = useState([]);
  const [sizeFilter, setSizeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  if (!school) {
    console.error("error: school not found");
  }

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

  const onInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleTagClick = (name) => {
    if (filters.includes(name)) {
      setFilters(filters.filter((filter) => filter !== name));
    } else {
      setFilters([...filters, name]);
    }
  };

  const handleSize = (event) => {
    setSizeFilter(event.target.value);
  };

  const handlePrice = (event) => {
    setPriceFilter(event.target.value);
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
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
                  colorScheme={filters.includes(tagName) ? "green" : "gray"}
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
            <InputRightAddon>
              <SearchIcon color="gray.600" />
            </InputRightAddon>
          </InputGroup>
        </div>
        <Divider className="my-3" />
        <HStack spacing={4}>
          <>Filter by:</>
          <div className="w-24">
            <Select onChange={handleSize} placeholder="Size" size="sm">
              <option value="XXS">XXS</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </Select>
          </div>
          <div className="w-24">
            <Select onChange={handlePrice} placeholder="Price" size="sm">
              <option value="$">$</option>
              <option value="$$">$$</option>
              <option value="$$$">$$$</option>
            </Select>
          </div>
        </HStack>
        <div className="mt-8 mb-24">
          <BrowseItemDisplay items={listings} />
        </div>
      </div>
    </div>
  );
}
