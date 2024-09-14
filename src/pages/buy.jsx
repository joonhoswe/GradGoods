import { React, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


export default function Buy()
{
    const location = useLocation();
    const { inputValue } = location.state || {};
  
    return (
      <div>
        <h1>Second Page</h1>
        <p>Received Input: {inputValue}</p>
      </div>
    );
}