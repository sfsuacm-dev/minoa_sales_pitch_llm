import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export default function SlideDeck() {
    const location = useLocation();
    console.log("Location state:", location.state); // For testing
    
    const { pitchData } = location.state || {};
    console.log("Pitch data:", pitchData); // For testing

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Sales Pitch Slide Deck</h1>
            <div className="bg-white shadow-lg rounded-lg p-6">
                {pitchData ? (
                    <ReactMarkdown>{pitchData}</ReactMarkdown>
                ) : (
                    <p>No pitch data available</p>
                )}
            </div>
        </div>
    );
}
