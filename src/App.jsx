import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/navbar'
import {
  Input,
  InputGroup,
  InputRightAddon,
  Heading,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

function App() {
  const [school, setSchool] = useState("");

  const handleInputChange = (event) => {
    setSchool(event.target.value);
  };

  const handleSearch = () => {
    console.log("search", school);
  };

  return (
    <div className="mt-[35vh]">
      <Heading className="text-center" as="h2" size="3xl" p={0} noOfLines={1}>
        GradGoods
      </Heading>
      <div className="flex flex-row justify-center">
        <InputGroup size="lg" width="45vw" className="mt-8">
          <Input
            onChange={handleInputChange}
            value={school}
            placeholder="Search for your school"
          />
          <InputRightAddon onClick={handleSearch}>
            <SearchIcon color="gray.600" />
          </InputRightAddon>
        </InputGroup>
      </div>
    </div>
  );
}

export default App;
