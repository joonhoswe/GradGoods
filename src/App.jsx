import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Browse from "./pages/browse";
import "./App.css";
import Navbar from "./components/navbar";
import PostListing from "./pages/postListing";
import Profile from "./pages/profile.jsx";
import { allSchools } from "./schoolData.js";
import {
  Input,
  InputGroup,
  InputRightAddon,
  Heading,
  Box,
  List,
  ListItem,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

function App() {
  const [school, setSchool] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (school.length > 1) {
      const results = fetchSchoolSuggestions(school);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [school]);

  const handleInputChange = (event) => {
    setSchool(event.target.value);
  };

  const fetchSchoolSuggestions = (query) => {
    return allSchools.filter((school) =>
      school.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSelectSuggestion = (school) => {
    setSchool(school);
    setTimeout(() => setShowSuggestions(false), 20);
  };

  const handleSearch = () => {
    console.log("search", school);
    navigate("/browse", { state: { school } });
  };

  const handleClickOutside = useCallback((event) => {
    if (
      !event.target.closest(".suggestions-box") &&
      !event.target.closest(".chakra-input")
    ) {
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            onSearch={handleSearch}
            onInputChange={handleInputChange}
            school={school}
            suggestions={suggestions}
            handleSelectSuggestion={handleSelectSuggestion}
            showSuggestions={showSuggestions}
          />
        }
      />
      <Route path="/browse" element={<Browse />} />
      <Route path="/postListing" element={<PostListing />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

function Home({
  onSearch,
  onInputChange,
  school,
  suggestions,
  handleSelectSuggestion,
  showSuggestions,
}) {
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
          <InputGroup
            size="lg"
            width="45vw"
            className="mt-8"
            position="relative"
          >
            <Input
              onChange={onInputChange}
              value={school}
              placeholder="Search for your school"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Return") {
                  onSearch();
                }
              }}
              className="chakra-input"
            />
            {showSuggestions && suggestions.length > 0 && (
              <Box
                className="suggestions-box"
                position="absolute"
                top="100%"
                left="0"
                right="0"
                bg="white"
                boxShadow="md"
                zIndex="1"
                mt="2"
                maxH="200px"
                overflowY="auto"
              >
                <List spacing={1}>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      padding="2"
                      _hover={{ bg: "gray.100", cursor: "pointer" }}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            <InputRightAddon
              onClick={onSearch}
              className="hover:cursor-pointer"
            >
              <SearchIcon color="gray.600" />
            </InputRightAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}

export default App;
