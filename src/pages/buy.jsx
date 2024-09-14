import React from "react";
import { useLocation } from 'react-router-dom';

export default function Buy() {
    const location = useLocation();
    const { school } = location.state || {}; // Access the `school` from state

    return (
      <div>
        <h1>Buy Page</h1>
        {school ? (
          <p>Received School: {school}</p>
        ) : (
          <p>No school provided</p>
        )}
      </div>
    );
}
