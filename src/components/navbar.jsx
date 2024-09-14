import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

export default function Navbar() {

    return (
        <div className="w-full">
            <nav className="flex justify-between items-center p-4 px-16 bg-white shadow-md w-full">
                <div className="flex items-center space-x-4">
                <a href="/" className="text-2xl font-bold text-gray-800">GradGoods</a>
                
                </div>
                <div className="flex items-center space-x-4">
                <SignedIn>
                    <a href="/postListing" className="text-lg text-gray-800">Sell</a>
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