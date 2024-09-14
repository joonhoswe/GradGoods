import { React, useState, useEffect } from  'react';
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
    <div className='h-full'>
        <a> hi </a>
    </div>
    );
}