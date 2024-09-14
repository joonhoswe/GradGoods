import { React, useState, useEffect } from  'react';
import Navbar from '../components/navbar';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

import axios from 'axios';
// import AWS from 'aws-sdk';

export default function postListing() {

    const [listing, setListing] = useState([]);

    const [owner, setOwner] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [school, setSchool] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    const [imageObjects, setImageObjects] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);

    return (
    <>
        <Navbar/>
        <div className='h-full w-full lg:p-32 flex justify-center items-center'>
            <div className='flex flex-row h-full w-full'>
                {/* left side of page */}
                <div className='flex flex-col text-3xl font-bold h-full w-1/2'>
                    <h1> List an Item </h1>

                    {/* image upload box */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-72 w-full rounded-lg ring-2 ring-red-500 relative">
                            <input
                            className="absolute opacity-0 w-full h-full cursor-pointer"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center justify-center">
                                <img src={upload.src} alt='upload' className='h-24 w-24'/>
                                <p className="mt-2 text-gray-500"> Drag & Drop your images here, or </p>
                                <button className="mt-2 text-blue-500 underline"> Choose File </button>
                            </div>
                        </div>

                        {/* each image uploaded */}
                        <div className="mt-4 w-full">
                            {fileNames.map((name, index) => (
                                <div key={index} className="w-full h-8 flex items-center justify-between rounded-lg bg-gray-200 p-2 mb-2">
                                    <p className="text-blue-500">{name}</p>
                                    <button onClick={() => handleFileDelete(index)} className="text-red-500 text-sm hover:text-gray-400 transition ease-in-out duration-300" title='Remove Image'> 
                                        x 
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* right side of page */}
                <div className='flex flex-col h-full w-1/2'>
                    <div className='flex flex-col space-y-2'>
                        <p>Name</p>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}