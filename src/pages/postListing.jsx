import { React, useState, useEffect } from "react";
import Navbar from "../components/navbar";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import upload from "../assets/upload.png";
import axios from "axios";
import AWS from "aws-sdk";

export default function postListing() {
  // initialize AWS
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
  const [listings, setListings] = useState([]);

  const [submitClicked, setSubmitClicked] = useState(false);

  const isEmailValid = user
    ? user.primaryEmailAddress.emailAddress.substring(
        user.primaryEmailAddress.emailAddress.length - 4
      ) == ".edu"
    : true;

  useEffect(() => {
    if (user) {
      setOwner(user.username);
    }
  }, [user]);

  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [school, setSchool] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [active, setActive] = useState(true); // listing is default by active, will be turned off from profile when listing is deleted or closed
  const [size, setSize] = useState("N/A");

  const [imageObjects, setImageObjects] = useState([]); // stores image files
  const [fileNames, setFileNames] = useState([]); // stores parsed file names

  let imageURLs = ""; // store image AWS location URLs as a comma-separated string

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setImageObjects((prevFiles) => [...prevFiles, ...newFiles]);
    setFileNames((prevNames) => [
      ...prevNames,
      ...newFiles.map((file) => file.name),
    ]);
    console.log("Files:", imageObjects);
  };

  const handleFileDelete = (index) => {
    setImageObjects(imageObjects.filter((_, i) => i !== index));
    setFileNames(fileNames.filter((_, i) => i !== index));
  };

  // submit the form to the database along with images to AWS S3 bucket
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the image URLs from AWS S3
    imageURLs = await handleAWS(); // now returns a comma-separated string

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

    console.log("Submitting form: ", dataForSql);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/post/",
        dataForSql
      );
      setPosted(true);
      clearForm();
      console.log("Response:", response.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setSubmitClicked(false);
    }
  };

  // upload images to AWS S3 bucket and return URLs as a comma-separated string
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
        console.log("File uploaded successfully:", data.Location);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }

    return uploadedImages.join(","); // return a comma-separated string
  };

  // clear form after submission
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
    <>
      <Navbar />

      {!isEmailValid && (
        <div className="flex items-center justify-center w-full bg-red-500 text-white p-4 font-bold">
          You MUST have a valid .edu email address to post a listing!
        </div>
      )}

      <div className="h-full w-full lg:p-32 flex justify-center items-center">
        <div className="flex flex-row h-full w-full">
          {/* left side of page */}
          <div className="flex flex-col text-3xl font-bold h-full w-full md:w-1/2">
            <h1> List an Item </h1>
            {/* image upload box */}
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
                className={`flex items-center justify-center h-72 w-full max-w-lg rounded-lg border-2 border-grey mt-3 relative ${
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
                    {" "}
                    Drag & Drop your images here, or{" "}
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

              {/* each image uploaded */}
              <div className="mt-4 w-5/6">
                {fileNames.map((name, index) => (
                  <div
                    key={index}
                    className="w-full h-8 flex items-center justify-between rounded-lg bg-gray-200 p-2 mb-2"
                  >
                    <p className="text-blue-500 text-ellipsis overflow-hidden whitespace-nowrap" style = {{fontSize:20,maxWidth:500}}>{name}</p>
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

          {/* right side of page */}
          <div className="flex flex-col h-full w-1/2 space-y-4">
            <div className="flex items-center" style={{ paddingTop: "75px" }}>
              <div
                className="flex items-center justify-center h-8 w-8 bg-green-700 text-white rounded-full mr-4 font-bold"
                style={{ fontSize: "14px" }}
              >
                2
              </div>
              <label
                className="font-medium"
                style={{
                  paddingLeft: "0px",
                  paddingBottom: "1px",
                  fontSize: "23px",
                }}
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
              <input
                id="itemCategory"
                type="text"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                placeholder="Enter item category"
                className={`p-2 border rounded-lg ${
                  !isEmailValid ? "cursor-not-allowed" : "cursor-text"
                }`}
                disabled={!isEmailValid} // Disable input if the email is not valid
              />
            </div>

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
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Enter school name"
                className={`p-2 border rounded-lg ${
                  !isEmailValid ? "cursor-not-allowed" : "cursor-text"
                }`}
                disabled={!isEmailValid} // Disable input if the email is not valid
              />
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
    </>
  );
}
