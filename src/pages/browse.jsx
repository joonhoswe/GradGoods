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
  const tagOptions = ["View All", "Clothing", "Electronics", "Shoes", "Textbooks"];
  const [selectedTag, setSelectedTag] = useState("View All");
  // const [filters, setFilters] = useState([]);
  const { isSignedIn, user, isLoaded } = useUser();
  const [listings, setListings] = useState([]);
  const [sizeFilter, setSizeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  if (!school) {
    console.error("error: school not found");
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/get/');
      const database = response.data;
      console.log(database);
      if (user) {
        const filteredListings = database.filter(listing => {
          if (listing.school !== school) {
            return false;
          }
          if (selectedTag !== "View All" && !listing.category?.includes(selectedTag)) {
            return false;
          }
          if (sizeFilter && !listing.size?.includes(sizeFilter)) {
            return false;
          }
          if (priceFilter && listing.price) {
            const price = listing.price;
            if (priceFilter === "0-20" && (price < 0 || price > 20)) return false;
            if (priceFilter === "20-50" && (price < 20 || price > 50)) return false;
            if (priceFilter === ">50" && price <= 50) return false;
          }
          return true;
        });
        setListings(filteredListings);
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
            <InputRightAddon>
              <SearchIcon color="gray.600" />
            </InputRightAddon>
          </InputGroup>
        </div>
        <Divider className="my-3" />
        <div className="p-4">
        <HStack spacing={4}>
          <>Filter by:</>
          <Box width="auto">
            <Select onChange={handlePrice} placeholder="Price" size="sm" width="150px">
              <option value="0-20">Under $20</option>
              <option value="20-50">$20-$50</option>
              <option value=">50">Above $50</option>
            </Select>
          </Box>
          {(selectedTag === "Clothing" || selectedTag === "Shoes") && (
            <Box width="auto">
              <Select onChange={handleSize} placeholder="Size" size="sm" width={selectedTag === "Shoes" ? "230px" : "100px"}>
                {selectedTag === "Shoes" && (
                  <>
                    <option value="3 (Women's) / 5 (Men's)">3 (Women's) / 5 (Men's)</option>
                    <option value="4 (Women's) / 6 (Men's)">4 (Women's) / 6 (Men's)</option>
                    <option value="5 (Women's) / 7 (Men's)">5 (Women's) / 7 (Men's)</option>
                    <option value="6 (Women's) / 8 (Men's)">6 (Women's) / 8 (Men's)</option>
                    <option value="7 (Women's) / 9 (Men's)">7 (Women's) / 9 (Men's)</option>
                    <option value="8 (Women's) / 10 (Men's)">8 (Women's) / 10 (Men's)</option>
                    <option value="9 (Women's) / 11 (Men's)">9 (Women's) / 11 (Men's)</option>
                    <option value="10 (Women's) / 12 (Men's)">10 (Women's) / 12 (Men's)</option>
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
          <BrowseItemDisplay items={listings} />
        </div>
      </div>
        {/* <HStack spacing={4}>
          <>Filter by:</>
          <div className="w-24">
            <Select onChange={handlePrice} placeholder="Price" size="sm" width="150px">
              <option value="0-20">Under $20</option>
              <option value="20-50">$20-$50</option>
              <option value=">50">$50 & Above</option>
            </Select>
          </div>
          {(selectedTag === "Clothing" || selectedTag === "Shoes") && (
            <div className="w-24">
              <Select onChange={handleSize} placeholder="Size" size="sm" width={selectedTag ==="Shoes" ? "300px" : "200px"}>
                {selectedTag === "Shoes" && (
                  <>
                    <option value="3 (Women's) / 5 (Men's)">3 (Women's) / 5 (Men's)</option>
                    <option value="4 (Women's) / 6 (Men's)">4 (Women's) / 6 (Men's)</option>
                    <option value="5 (Women's) / 7 (Men's)">5 (Women's) / 7 (Men's)</option>
                    <option value="6 (Women's) / 8 (Men's)">6 (Women's) / 8 (Men's)</option>
                    <option value="7 (Women's) / 9 (Men's)">7 (Women's) / 9 (Men's)</option>
                    <option value="8 (Women's) / 10 (Men's)">8 (Women's) / 10 (Men's)</option>
                    <option value="9 (Women's) / 11 (Men's)">9 (Women's) / 11 (Men's)</option>
                    <option value="10 (Women's) / 12 (Men's)">10 (Women's) / 12 (Men's)</option>
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
            </div>
          )}
        </HStack>
        <div className="mt-8">
          <BrowseItemDisplay items={listings} />
        </div> */}
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import {
//   Input,
//   InputGroup,
//   InputRightAddon,
//   Heading,
//   Tag,
//   HStack,
//   Divider,
//   Select,
// } from "@chakra-ui/react";
// import { SearchIcon } from "@chakra-ui/icons";
// import Navbar from "../components/navbar";
// import BrowseItemDisplay from "../components/BrowseItemDisplay";
// import axios from "axios";
// import { useUser } from "@clerk/clerk-react";

// export default function Browse() {
//   const location = useLocation();
//   const { school } = location.state || {};
//   const [search, setSearch] = useState("");
//   const tagOptions = ["Clothing", "Electronics", "Shoes", "Textbooks"];
//   const [filters, setFilters] = useState(tagOptions);
//   const { isSignedIn, user, isLoaded } = useUser();
//   const [listings, setListings] = useState([]);
//   const [sizeFilter, setSizeFilter] = useState("");
//   const [priceFilter, setPriceFilter] = useState("");

//   if (!school) {
//     console.error("error: school not found");
//   }
//   const filter = (data) => {
//     return 
//   };
//   const fetchData = async () => {
//     console.log("i'm inside");
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/api/get/');
//       const database = response.data;
//       console.log(database);
//       if (user) {
//         setListings(response.data);
//         const userJoinedListings = database.filter(listing =>
//           listing.owner.includes(user.username)
//         );
//       }
//     } catch (error) {
//       console.error('Error fetching Data:', error);
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//         console.error('Response headers:', error.response.headers);
//       } else if (error.request) {
//         console.error('Request data:', error.request);
//       } else {
//         console.error('Error message:', error.message);
//       }
//     }
//   };

//   useEffect(() => {
//     // i// f (isSignedIn && user) {
//       // const fetchData = async () => {
//       //   try {
//       //     const response = await axios.get("http://127.0.0.1:8000/api/get/");
//       //     const data = response.data;
//       //     setListings(data);
//       //     console.log(data);
//       //   } catch (error) {
//       //     console.error("Error fetching Data:", error);
//       //     if (error.response) {
//       //       console.error("Response data:", error.response.data);
//       //       console.error("Response status:", error.response.status);
//       //       console.error("Response headers:", error.response.headers);
//       //     } else if (error.request) {
//       //       console.error("Request data:", error.request);
//       //     } else {
//       //       console.error("Error message:", error.message);
//       //     }
//       //   }
//       // };

//       fetchData();
//     // }
//   }, [isSignedIn, user, filters]);

//   const onInputChange = (event) => {
//     setSearch(event.target.value);
//   };

//   const handleTagClick = (name) => {
//     console.log("here");
//     if (filters.includes(name)) {
//       setFilters(filters.filter((filter) => filter !== name));
//     } else {
//       setFilters([...filters, name]);
//     }
//   };

//   const handleSize = (event) => {
//     setSizeFilter(event.target.value);
//   };

//   const handlePrice = (event) => {
//     setPriceFilter(event.target.value);
//   };

//   return (
//     <div>
//       <div className="fixed top-0 left-0 w-full z-50">
//         <Navbar />
//       </div>
//       <div className="mt-24 mx-[5vw]">
//         <Heading
//           className="text-left mb-3"
//           as="h2"
//           size="xl"
//           p={0}
//           noOfLines={1}
//         >
//           {school}'s Items
//         </Heading>
//         <div className="flex flex-row justify-between">
//           <HStack spacing="8px">
//             {tagOptions.map((tagName, index) => {
//               return (
//                 <Tag
//                   className="hover:cursor-pointer"
//                   key={index}
//                   size="lg"
//                   borderRadius="full"
//                   onClick={() => handleTagClick(tagName)}
//                   colorScheme={filters.includes(tagName) ? "green" : "gray"}
//                 >
//                   {tagName}
//                 </Tag>
//               );
//             })}
//           </HStack>
//           <InputGroup width="30vw" className="">
//             <Input
//               onChange={onInputChange}
//               value={search}
//               placeholder="Search"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" || e.key === "Return") {
//                   onSearch();
//                 }
//               }}
//             />
//             <InputRightAddon>
//               <SearchIcon color="gray.600" />
//             </InputRightAddon>
//           </InputGroup>
//         </div>
//         <Divider className="my-3" />
//         <HStack spacing={4}>
//           <>Filter by:</>
//           <div className="w-24">
//             <Select onChange={handleSize} placeholder="Size" size="sm">
//               <option value="XXS">XXS</option>
//               <option value="XS">XS</option>
//               <option value="S">S</option>
//               <option value="M">M</option>
//               <option value="L">L</option>
//               <option value="XL">XL</option>
//               <option value="XXL">XXL</option>
//             </Select>
//           </div>
//           <div className="w-24">
//             <Select onChange={handlePrice} placeholder="Price" size="sm">
//               <option value="$">$</option>
//               <option value="$$">$$</option>
//               <option value="$$$">$$$</option>
//             </Select>
//           </div>
//         </HStack>
//         <div className="mt-8">
//           <BrowseItemDisplay items={listings} />
//         </div>
//       </div>
//     </div>
//   );
// }
