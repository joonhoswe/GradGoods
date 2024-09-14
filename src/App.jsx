import { useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Buy from './pages/buy';
import "./App.css";
import Navbar from "./components/navbar";
import { Input, InputGroup, InputRightAddon, Heading } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

function App() {
  const [school, setSchool] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSchool(event.target.value);
  };

  const handleSearch = () => {
    console.log("search", school);  // Logs the search value
    navigate("/buy", { state: { school } });  // Passes the search value to Buy page
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Home onSearch={handleSearch} onInputChange={handleInputChange} school={school} />} 
      />
      <Route path="/buy" element={<Buy />} />
    </Routes>
  );
}

export default App;

// Home component inside App.jsx
function Home({ onSearch, onInputChange, school }) {
  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="mt-[35vh]">
        <Heading className="text-center" as="h2" size="3xl" p={0} noOfLines={1}>
          GradGoods
        </Heading>
        <div className="flex flex-row justify-center">
          <InputGroup size="lg" width="45vw" className="mt-8">
            <Input
              onChange={onInputChange}
              value={school}
              placeholder="Search for your school"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Return") {
                  onSearch();
                }
              }}
            />
            <InputRightAddon onClick={onSearch}>
              <SearchIcon color="gray.600" />
            </InputRightAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
