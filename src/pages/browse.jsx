import React, { useState } from "react";
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

export default function Browse() {
  const location = useLocation();
  const { school } = location.state || {}; // Access the `school` from state
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState([]);

  if (!school) {
    console.error("error: school not found");
  }

  const onInputChange = (event) => {
    setSearch(event.target.value);
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
            <Tag size="lg" borderRadius="full">
              Clothing
            </Tag>
            <Tag size="lg" borderRadius="full">
              Electronics
            </Tag>
            <Tag size="lg" borderRadius="full">
              Shoes
            </Tag>
            <Tag size="lg" borderRadius="full">
              Textbooks
            </Tag>
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
            <Select placeholder="Size" size="sm">
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
            <Select placeholder="Price" size="sm">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </div>
        </HStack>
      </div>
    </div>
  );
}
