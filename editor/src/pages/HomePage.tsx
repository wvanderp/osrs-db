import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Items } from '../../server/server'

// Function to fetch items from the server
const fetchItems = async () => {
    const response = await fetch(`http://localhost:3000/itemsNames`);
    const items = await response.json();
    return items;
}

function HomePage() {
    const [id, setId] = useState('')
    const navigate = useNavigate()
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Items>([]);
    const [items, setItems] = useState<Items>([]);

    useEffect(() => {
        const getItems = async () => {
            const fetchedItems = await fetchItems();
            setItems(fetchedItems);
        };
        getItems();
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (id) {
            navigate(`/${id}`)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length >= 3) {
            const filteredItems = items.filter((item: { name: string }) => 
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filteredItems);
        } else {
            setResults([]);
        }
    }

    const handleSuggestionClick = (name: string) => {
        setQuery(name);
        const selectedItem = items.find(item => item.name === name);
        if (selectedItem) {
            setId(selectedItem.id.toString());
            navigate(`/${selectedItem.id}`);
        }
        setResults([]);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Welcome to the OSRS-db editor</h1>
            <p className="mb-4">Enter an item ID to view its details or search for items:</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter item ID"
                    className="border border-gray-300 p-2 mb-4 rounded" />
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search items"
                    className="border border-gray-300 p-2 mb-4 rounded w-full max-w-md" />
                {query.length >= 3 && results.length > 0 && (
                    <ul className="border border-gray-300 bg-white w-full max-w-md rounded shadow-md mt-1 z-10 max-h-60 overflow-y-auto">
                        {results.map((item: { id: number, name: string }) => (
                            <li 
                                key={item.id} 
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSuggestionClick(item.name)}
                            >
                                {item.name}
                            </li>
                        ))}
                    </ul>
                )}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Go</button>
            </form>
        </div>
    )
}

export default HomePage
