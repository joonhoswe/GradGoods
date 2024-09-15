import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Browse from './pages/browse';
import "./App.css";
import Navbar from "./components/navbar";
import PostListing from "./pages/postListing";
import Listing from "./pages/listing";
import Profile from "./pages/profile.jsx";
import { allSchools } from "./schoolData.js";
import { Input, InputGroup, InputRightAddon, Heading, Box, List, ListItem, Text } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import MyImage from '../public/lightbulb.png';

function App() {
  const [school, setSchool] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");
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
    setError("");
  };

  const hasSchool = (query) => {
    return allSchools.some((school) =>
      school.toLowerCase() === query.toLowerCase()
    ); 
  };
  const getSchool = (query) => {
    for (const name of allSchools) {
      if (name.toLowerCase() == query.toLowerCase()) {
        return name;
      }
    }
    return "";
  };

  const fetchSchoolSuggestions = (query) => {
    return allSchools.filter(school =>
      school.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSelectSuggestion = (school) => {
    setSchool(school);
    setTimeout(() => setShowSuggestions(false), 20);
  };

  const handleSearch = () => {
    if (hasSchool(school)) {
      const properSchool = getSchool(school);
      navigate("/browse", { state: { school : properSchool } }); 
      setError("");
    } else {
      setError("No results found.");
    }
  };

  const handleClickOutside = useCallback((event) => {
    if (!event.target.closest('.suggestions-box') && !event.target.closest('.chakra-input')) {
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
            error={error}
          />} 
      />
      <Route path="/browse" element={<Browse />} />
      <Route path="/postListing" element={<PostListing />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/listing/:id" element={<Listing />} />
    </Routes>
  );
}

function Home({ onSearch, onInputChange, school, suggestions, handleSelectSuggestion, showSuggestions, error }) {
  return (
    <div>
      <img src='../public/lightbulb.png' alt='Lightbulb' style={{position: 'absolute', right: 0, height: 500, paddingRight:180}} />
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      
      <div className="mt-[25vh]" style = {{zIndex:2}}>
        <Heading className="text-left" as="h2" size="4xl" p={0} noOfLines={1} paddingLeft="100px">
          <span style={{ fontWeight: 'normal' }}>Grad</span>
          <span style={{ fontWeight: 'bold', color: '#5abe23' }}>Goods</span>
        </Heading>
        
      <div className="text-left" style={{ paddingLeft: "100px", fontSize: '40px',paddingTop: '40px'}}>
        <p><span style={{ fontWeight: 'bold', color: '#5abe23' }}>Reduce</span> Waste.</p>
        <p><span style={{ fontWeight: 'bold', color: '#5abe23' }}>Save</span> Money.</p>
        <p><span style={{ fontWeight: 'bold', color: '#5abe23' }}>Foster</span> Community.</p>
      </div>
        <div className="flex flex-row justify-left" style={{paddingLeft:'100px'}}>
          <InputGroup size="lg" width="45vw" className="mt-8" >

            <Input
              onChange={onInputChange}
              value={school}
              placeholder="Search for your school"
              style={{ backgroundColor: '#f0f0f0'}}
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
                      _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            <InputRightAddon onClick={onSearch}>
              <SearchIcon color="gray.600" className="cursor-pointer"/>
            </InputRightAddon>
          </InputGroup>
        </div>
        <div className="flex flex-row justify-center">
          {error && (
            <Box textAlign="center" mt="2" width="45vw">
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
