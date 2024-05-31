'use client'


import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface SearchResult {
  id: {
      videoId: string;
  };
  link: string;
  snippet: {
      title: string;
      description: string;
  };
}

// Then define the state type



export function MainPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreResults, setHasMoreResults] = useState(false);
    const [showPagination, setShowPagination] = useState(false);
    const itemsPerPage = 10;
    const googleApiKey = 'AIzaSyDMYtQogMv6p0rn3TURnVvGNvc9gEa3l1Y'; // Replace with your Google API key
    const youtubeApiKey = 'AIzaSyBdB65TRa7voiilyM90YJc-Nui0U7d5GSE'; // Replace with your YouTube API key
    const searchEngineId = '9065e95fa93064dc9'; // Replace with your Custom Search Engine ID
    const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${searchEngineId}&q=`;

    const handleSearch = async (newStart = 1) => {
        setLoading(true);
        setError('');

        let apiUrl = '';
        if (filter === 'video') {
            apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=${itemsPerPage}&pageToken=${newStart}`;
        } else {
            apiUrl = googleSearchUrl + encodeURIComponent(query) + (filter ? `&fileType=${filter}` : '') + `&start=${newStart}`;
        }

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                setResults(data.items);
                setHasMoreResults(data.queries.nextPage ? true : false);
                setShowPagination(true); // Show pagination when results are available
            } else {
                setError('No results found.');
                setResults([]);
                setShowPagination(false); // Hide pagination when no results are found
            }

            setCurrentPage(Math.ceil(newStart / itemsPerPage));
        } catch (error) {
            console.error("Fetching error:", error);
            setError('Error fetching results. Please try again later.');
            setResults([]);
            setShowPagination(false); // Hide pagination on error
        } finally {
            setLoading(false);
        }
    };

    const goToNextPage = () => {
      const newStart = currentPage * itemsPerPage + 1;
      handleSearch(newStart);
    };
    
    const goToPreviousPage = () => {
      const newStart = Math.max(1, (currentPage - 2) * itemsPerPage + 1);
      handleSearch(newStart);
    };
    
    return (
        <div className="flex flex-col items-center h-full">
            <div className="max-w-screen-md p-4 w-full">
                <h1 className="text-7xl font-bold text-center mb-6">ExamStuffs</h1>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                    <Input
                        type="text"
                        placeholder="Type your topic.."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded" />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded">
                        <option value="">All</option>
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                        <option value="course">Course</option>
                    </select>
                    <Button
                        type="button"
                        onClick={() => handleSearch(1)}  // Call `handleSearch` with start at 1
                        className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded">
                        Find
                    </Button>
                </div>
                {loading && <p className="text-center text-gray-600">Loading...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}
                <div className="mt-6">
                    {results.map((result, index) => (
                        <div key={index} className="mb-4 p-4 border rounded">
                            <a href={filter === 'video' ? `https://www.youtube.com/watch?v=${result.id.videoId}` : result.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                <h2 className="text-xl font-bold">{filter === 'video' ? result.snippet.title : result.title}</h2>
                            </a>
                            <p className="text-gray-600">{filter === 'video' ? result.snippet.description : result.snippet}</p>
                        </div>
                    ))}
                </div>
                {showPagination && ( // Render pagination only if showPagination is true
                    <div className="flex justify-between">
                        <Button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-4 py-2 bg-black text-white rounded">
                            Previous
                        </Button>
                        <Button onClick={goToNextPage} disabled={!hasMoreResults} className="px-4 py-2 bg-black text-white rounded">
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
