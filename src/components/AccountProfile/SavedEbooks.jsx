import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { FiBookOpen } from 'react-icons/fi';
import Sidebar from './Sidebar';
import LoadingPage from '../shared/LoadingPage';

const SavedEbooks = () => {
    const [ebooks, setEbooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const userId = Cookies.get('UserId');

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        fetchSavedEbooks();
    }, [userId, navigate]);

    const fetchSavedEbooks = async () => {
        try {
            // First, get all bookshelf entries for the user
            const bookshelfResponse = await axios.get(
                `https://rmrbdapi.somee.com/odata/bookshelf?$filter=customerId eq ${userId} and status eq 1`,
                {
                    headers: {
                        'Token': '123-abc'
                    }
                }
            );

            if (!bookshelfResponse.data || !bookshelfResponse.data.length) {
                setEbooks([]);
                return;
            }

            // Then fetch the ebook details for each bookshelf entry
            const ebookPromises = bookshelfResponse.data.map(async (bookshelfItem) => {
                try {
                    const ebookResponse = await axios.get(
                        `https://rmrbdapi.somee.com/odata/ebook/${bookshelfItem.ebookId}`,
                        {
                            headers: {
                                'Token': '123-abc'
                            }
                        }
                    );
                    return {
                        ...ebookResponse.data,
                        savedDate: bookshelfItem.purchaseDate
                    };
                } catch (error) {
                    console.error(`Error fetching ebook ${bookshelfItem.ebookId}:`, error);
                    return null;
                }
            });

            const ebookResults = await Promise.all(ebookPromises);
            const validEbooks = ebookResults.filter(ebook => ebook !== null);
            setEbooks(validEbooks);
        } catch (err) {
            setError('Failed to fetch saved ebooks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReadEbook = (ebookId) => {
        navigate(`/ebook/${ebookId}/read`);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-4">
                <div className="container mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Sách điện tử đã lưu</h2>
                    <div className="relative">
                        {loading ? (
                            <LoadingPage />
                        ) : error ? (
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <div className="text-center text-red-500 py-4">{error}</div>
                            </div>
                        ) : (
                            <>
                                {ebooks.length === 0 ? (
                                    <div className="text-center text-gray-500">
                                        Bạn chưa lưu sách điện tử nào
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {ebooks.map((ebook) => (
                                            <div key={ebook.ebookId} className="bg-white rounded-lg shadow-md p-4">
                                                <img
                                                    src={ebook.imageUrl || '/default-book-cover.png'}
                                                    alt={ebook.ebookName}
                                                    className="w-full h-48 object-cover rounded-md mb-4"
                                                />
                                                <h3 className="text-lg font-semibold mb-2">{ebook.ebookName}</h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {ebook.author || 'Unknown Author'}
                                                </p>
                                                <p className="text-sm text-gray-500 mb-4">
                                                    Saved: {new Date(ebook.savedDate).toLocaleDateString()}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <button
                                                        onClick={() => handleReadEbook(ebook.ebookId)}
                                                        className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
                                                    >
                                                        <FiBookOpen /> Read Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedEbooks; 