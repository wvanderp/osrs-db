import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'jsoneditor/dist/jsoneditor.min.css';
import 'tailwindcss/tailwind.css';
import { Items } from '../../server/server';
import JSONEditorComponent from '../components/JSONEditorComponent';

function loadItemInfo(number: string): Promise<Items[0]> {
    return fetch(`http://localhost:3000/items/${number}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Item not found');
            }
            return response.json();
        });
}

function ItemPage() {
    const { number } = useParams<{ number: string }>();
    const [item, setItem] = React.useState<Items[0] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        if (!number) {
            setLoading(false);
            setError('No item number provided');
            return;
        }

        loadItemInfo(number)
            .then(item => {
                setItem(item);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
                setLoading(false);
            });
            
    }, [number]);

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded">
                <div>Error: {error}</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-4 bg-blue-100 text-blue-700 rounded">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-4">{item?.name}</h1>
                <>
                    <p className="mb-4">Item number: {number}</p>
                    <JSONEditorComponent />
                </>
        </div>
    );
}

export default ItemPage;
