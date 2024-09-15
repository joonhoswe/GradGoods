import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useUser } from "@clerk/clerk-react";
import upload from "../assets/upload.png";
import axios from "axios";
import AWS from "aws-sdk";
import { allSchools } from "../schoolData.js";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function PostListing() {
  const navigate = useNavigate();
  // Initialize AWS
  useEffect(() => {
    AWS.config.update({
      region: "us-east-2",
      credentials: new AWS.Credentials(
        import.meta.env.VITE_AWS_ACCESS_KEY,
        import.meta.env.VITE_AWS_SECRET_KEY
      ),
    });
  }, []);

  const { isSignedIn, user, isLoaded } = useUser();

  const [owner, setOwner] = useState("");
  const [posted, setPosted] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);

  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [school, setSchool] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [active, setActive] = useState(true);
  const [size, setSize] = useState("N/A");

  const [imageObjects, setImageObjects] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [allSizes, setAllSizes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    setAllSizes({
      Clothing: ["Any", "XXS", "XS", "S", "M", "L", "XL", "XXL"],
      Shoes: [
        "3 (Women's) / 5 (Men's)",
        "4 (Women's) / 6 (Men's)",
        "5 (Women's) / 7 (Men's)",
        "6 (Women's) / 8 (Men's)",
        "7 (Women's) / 9 (Men's)",
        "8 (Women's) / 10 (Men's)",
        "9 (Women's) / 11 (Men's)",
        "10 (Women's) / 12 (Men's)",
      ],
    });
  }, []);

  useEffect(() => {
    if (user) {
      setOwner(user.username);
    }
  }, [user]);

  const isEmailValid = user
    ? user.primaryEmailAddress.emailAddress.endsWith(".edu")
    : false;

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setImageObjects((prevFiles) => [...prevFiles, ...newFiles]);
    setFileNames((prevNames) => [
      ...prevNames,
      ...newFiles.map((file) => file.name),
    ]);
  };

  const handleFileDelete = (index) => {
    setImageObjects(imageObjects.filter((_, i) => i !== index));
    setFileNames(fileNames.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the image URLs from AWS S3
    const imageURLs = await handleAWS(); // now returns a comma-separated string

    // Data to be sent to the database
    const dataForSql = {
      owner,
      price,
      itemName,
      itemCategory,
      description,
      school,
      imageURLs, // passed as a comma-separated string
      active,
      size,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/post/",
        dataForSql
      );
      setPosted(true);
      clearForm();
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setSubmitClicked(false);
      toast({
        title: "Listing posted!",
        description:
          "Your item is now available for purchase by other students.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        // Set the timeout
        navigate("/profile"); // Redirect path
      }, 1000);
    }
  };

  const handleAWS = async () => {
    const s3 = new AWS.S3();
    let uploadedImages = [];

    for (const image of imageObjects) {
      const params = {
        Bucket: "gradgoodsimages",
        Key: image.name,
        Body: image,
        ContentType: image.type,
      };

      try {
        const data = await s3.upload(params).promise();
        uploadedImages.push(data.Location); // collect URLs
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }

    return uploadedImages.join(","); // return a comma-separated string
  };

  const handleSchoolInputChange = (e) => {
    const value = e.target.value;
    setSchool(value);
    if (value.length > 1) {
      const filteredSuggestions = allSchools.filter((school) =>
        school.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSchoolSelect = (selectedSchool) => {
    setSchool(selectedSchool);
    setShowSuggestions(false);
  };

  const clearForm = () => {
    setItemName("");
    setItemCategory("");
    setSchool("");
    setDescription("");
    setPrice(0);
    setFileNames([]);
    setImageObjects([]);
    setSize("N/A");
  };

  return (
    <div className="mb-8">
      <Navbar />

      {!isEmailValid && (
        <div className="flex items-center justify-center w-full bg-red-500 text-white p-4 font-bold">
          You MUST have a valid .edu email address to post a listing!
        </div>
      )}
      <h1 className="pl-16 pt-8 text-[30px] font-extrabold">List an Item</h1>

      <div className="justify-center items-center">
        <div className="px-16 flex flex-row h-full w-full space-x-4">
          {/* Left side of page */}
          <div className="flex flex-col text-3xl font-bold h-full w-1/2">
            {/* Image upload box */}
            <div className="flex flex-col" style={{ paddingTop: "30px" }}>
              <div className="flex items-center">
                <div
                  className="flex items-center justify-center h-8 w-8 bg-green-700 text-white rounded-full mr-4"
                  style={{ fontSize: "14px" }}
                >
                  1
                </div>
                <label
                  className="font-medium"
                  style={{
                    paddingLeft: "0px",
                    paddingBottom: "1px",
                    fontSize: "23px",
                  }}
                >
                  Image Upload
                </label>
              </div>
              <div
                className={`flex items-center justify-center h-72 max-w-lg rounded-lg border-2 border-grey mt-8 relative ${
                  !isEmailValid ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{ width: "500px", paddingTop: "5px" }}
              >
                <input
                  className="absolute opacity-0 w-full h-full"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!isEmailValid} // Disable input if the email is not valid
                />
                <div className="flex flex-col items-center justify-center">
                  <img src={upload} alt="upload" className="h-24 w-24" />
                  <p
                    className="mt-2 text-gray-500"
                    style={{ fontSize: "20px" }}
                  >
                    Drag & Drop your images here, or
                  </p>
                  <button
                    className={`mt-2 text-blue-500 underline ${
                      !isEmailValid ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    disabled={!isEmailValid}
                  >
                    Choose File
                  </button>
                </div>
              </div>

              {/* Each image uploaded */}
              <div className="mt-4 max-w-lg">
                {fileNames.map((name, index) => (
                  <div
                    key={index}
                    className="w-full h-8 flex items-center justify-between rounded-lg bg-gray-200 p-2 mb-2"
                  >
                    {/* <p className="text-blue-500">{name}</p> */}
                    <p
                      className="text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap"
                      style={{ fontSize: 20, maxWidth: 500 }}
                    >
                      {name}
                    </p>
                    <button
                      onClick={() => handleFileDelete(index)}
                      className={`text-red-500 text-sm hover:text-gray-400 transition ease-in-out duration-300 ${
                        !isEmailValid ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      title="Remove Image"
                      disabled={!isEmailValid}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side of page */}
          <div className="flex flex-col h-full w-1/2 space-y-4">
            <div className="flex items-center" style={{ paddingTop: "35px" }}>
              <div
                className="flex items-center justify-center h-8 w-8 bg-green-700 text-white rounded-full mr-4 font-bold"
                style={{ fontSize: "14px" }}
              >
                2
              </div>
              <label
                className="font-medium"
                style={{ fontSize: "23px", paddingBottom: "1px" }}
              >
                Item Details
              </label>
            </div>
            {/* Item Name */}
            <div className="flex flex-col">
              <label className="text-lg font-medium" htmlFor="itemName">
                Item Name
              </label>
              <input
                id="itemName"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter item name"
                className={`p-2 border rounded-lg ${
                  !isEmailValid ? "cursor-not-allowed" : "cursor-text"
                }`}
                disabled={!isEmailValid} // Disable input if the email is not valid
              />
            </div>

            {/* Item Category */}
            <div className="flex flex-col">
              <label className="text-lg font-medium" htmlFor="itemCategory">
                Item Category
              </label>
              <select
                id="itemCategory"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                // className={`p-2 border rounded-lg ${
                //   !isEmailValid ? "cursor-not-allowed" : "cursor-text"
                // }`}
                disabled={!isEmailValid} // Disable input if the email is not valid
              >
                <option value="">Select a category</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Shoes">Shoes</option>
                <option value="Textbooks">Textbooks</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>

            {/* Size - conditionally rendered */}
            {(itemCategory === "Clothing" || itemCategory === "Shoes") && (
              <div className="flex flex-col">
                <label className="text-lg font-medium" htmlFor="size">
                  Size
                </label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className={`p-2 border rounded-lg ${
                    !isEmailValid ? "cursor-not-allowed" : "cursor-text"
                  }`}
                  disabled={!isEmailValid} // Disable input if the email is not valid
                >
                  {itemCategory === "Shoes" && (
                    <>
                      <option value="">Select size</option>
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
                  {itemCategory === "Clothing" && (
                    <>
                      <option value="">Select size</option>
                      <option value="XXS">XXS</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Price */}
            <div className="flex flex-col">
              <label className="text-lg font-medium" htmlFor="price">
                Price
              </label>
              <div className="flex flex-row items-center">
                <p className="text-lg font-medium">$</p>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value === "" ? "" : parseInt(e.target.value)
                    )
                  }
                  placeholder="Enter item price"
                  className={`p-2 border rounded-lg ${
                    !isEmailValid ? "cursor-not-allowed" : "cursor-text"
                  }`}
                  disabled={!isEmailValid} // Disable input if the email is not valid
                />
              </div>
            </div>

            {/* School */}
            <div className="flex flex-col">
              <label className="text-lg font-medium" htmlFor="school">
                School
              </label>
              <input
                id="school"
                type="text"
                value={school}
                onChange={handleSchoolInputChange}
                placeholder="Enter your school"
                className={`p-2 border rounded-lg ${
                  !isEmailValid ? "cursor-not-allowed" : "cursor-text"
                }`}
                disabled={!isEmailValid} // Disable input if the email is not valid
              />
              {showSuggestions && (
                <ul className="border border-gray-300 bg-white mt-2 rounded-lg shadow-lg max-h-48 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSchoolSelect(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-lg font-medium" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter item description"
                className={`p-2 border rounded-lg ${
                  !isEmailValid ? "cursor-not-allowed" : "cursor-text"
                }`}
                rows="4"
                disabled={!isEmailValid} // Disable input if the email is not valid
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                className={`bg-green-800 text-white p-3 rounded-lg mt-4 font-bold ${
                  !isEmailValid ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={handleSubmit}
                disabled={!isEmailValid} // Disable the submit button if the email is not valid
              >
                Submit Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
