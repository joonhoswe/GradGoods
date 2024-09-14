import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom';

export default function Navbar() {

    return (
        <div className="w-full">
            <nav className="flex justify-between items-center p-4 px-16 bg-white shadow-md w-full">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-2xl font-bold text-gray-800">GradGoods</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <SignedIn>
                        <Link to="/postListing" className="text-lg text-gray-800">Sell</Link> {/* Use Link instead of a */}
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                </div>
            </nav>
        </div>
    )
}