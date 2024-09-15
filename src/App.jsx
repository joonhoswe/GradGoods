import { useState } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import Browse from './pages/browse';
import "./App.css";
import Navbar from "./components/navbar";
import PostListing from './pages/postListing';
import { Input, InputGroup, InputRightAddon, Heading } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import MyImage from './img/back.png';

function App() {
  const [school, setSchool] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSchool(event.target.value);
  };

  const handleSearch = () => {
    console.log("search", school);  // Logs the search value
    navigate("/browse", { state: { school } });  // Passes the search value to Buy page
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Home onSearch={handleSearch} onInputChange={handleInputChange} school={school} />} 
      />
      <Route path="/browse" element={<Browse />} />
      <Route path="/postListing" element={<PostListing />} />
    </Routes>
  );
}

export default App;

// Home component inside App.jsx
function Home({ onSearch, onInputChange, school }) {
  return (
    // Background
    <div style = {{ 
      backgroundImage: `url(${MyImage}),url(${MyImage})`,
      // backgroundSize: 'cover', 
      // backgroundPosition: 'left',
      backgroundPosition: 'left 270%, right 270%',
      backgroundRepeat: 'no-repeat, no-repeat',
      height: '100vh', 
      width: '100vw', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left'
      }}>
  {/* // <div style={{ backgroundImage: `url(${MyImage})`, backgroundSize: 'cover', backgroundPosition: 'center',}}> */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      
      <div className="mt-[35vh]" style = {{zIndex:2}}>
        <Heading className="text-center" as="h2" size="3xl" p={0} noOfLines={1}>
          GradGoods
        </Heading>
        <div className="flex flex-row justify-center">
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
            />
            <InputRightAddon onClick={onSearch}>
              <SearchIcon color="black.600" />
            </InputRightAddon>
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
