import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Banner from './Banner.jsx';
import BookCard from './BookCard.jsx';
import { getBooks, getImagesByBookId } from '../../services/BookService.js';

function Book() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Lấy danh sách sách
                const booksData = await getBooks();

                // Dùng Promise.all để lấy ảnh của từng sách song song
                const booksWithImages = await Promise.all(
                    booksData.map(async (book) => {
                        const imageUrl = await getImagesByBookId(book.bookId);
                        return { ...book, imageUrl }; // Kết hợp `imageUrl` vào đối tượng `book`
                    })
                );

                setBooks(booksWithImages); // Đặt danh sách sách với URL ảnh vào state
            } catch (error) {
                console.error("Failed to fetch books or images", error);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="flex justify-center p-4">
            {/* Giới hạn độ rộng tối đa và căn giữa nội dung */}
            <div className="max-w-screen-lg w-full flex flex-col lg:flex-row">
                {/* Sidebar */}
                <div className="w-full lg:w-1/4 p-4">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className="w-full lg:w-3/4 p-4">
                    <Banner />

                    {/* Danh sách sách nấu ăn */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {books.map((book) => (
                            <BookCard key={book.bookId} book={book} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Book;
