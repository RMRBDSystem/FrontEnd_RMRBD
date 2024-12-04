import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchRecipe, searchBook, searchEbook } from '../services/SearchService';


const Product = () => {

    const { searchString = "" } = useParams();
    const [Recipes, setRecipes] = useState([]);
    const [Books, setBooks] = useState([]);
    const [Ebooks, setEbooks] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const recpie = await searchRecipe(searchString);
            const book = await searchBook(searchString);
            const ebook = await searchEbook(searchString);
            setRecipes(recpie.slice(0, 6));
            setBooks(book.slice(0, 6));
            setEbooks(ebook.slice(0, 6));
        };
        fetchProducts();
    }, [searchString]);


    return (
        <section className="section-center">
            <div className='container mt-5'>
                <h1 className='text-center mb-5'>Tìm kiếm sản phẩm: {searchString}</h1>
                <div className='row'>
                    <h3 className='text-center mb-3'>Công thức nấu ăn: <a href={`/recipe/${searchString}`} className='btn btn-link'>Xem thêm</a></h3>
                    <div className='row justify-content-center'>
                        {Recipes.map((recipe, index) => (
                            <div className='col-md-4 mb-4' key={index}>
                                <div className='card h-100'>
                                    <img className='card-img-top' src={recipe.images[0].imageUrl} alt={recipe.name} />
                                    <div className='card-body'>
                                        <h5 className='card-title'>{recipe.recipeName}</h5>
                                        <p className='card-text'>{recipe.price} xu</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='row mt-5'>
                    <h3 className='text-center mb-3'>Sách nấu ăn <a href={`/book/${searchString}`} className='btn btn-link'>Xem thêm</a></h3>
                    <div className='row justify-content-center'>
                        {Books.map((book, index) => (
                            <div className='col-md-4 mb-4' key={index}>
                                <div className='card h-100'>
                                    <img className='card-img-top' src={book.images[0].imageUrl} alt={book.name} />
                                    <div className='card-body'>
                                        <h5 className='card-title'>{book.bookName}</h5>
                                        <p className='card-text'>{book.price} xu</p>
                                        <a href={`/book/${book.bookId}`} className='btn btn-primary btn-block'>Xem chi tiết</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='row mt-5'>
                    <h3 className='text-center mb-3'>Sách điện tử <a href={`/ebook`} className='btn btn-link'>Xem thêm</a></h3>
                    <div className='row justify-content-center'>
                        {Ebooks.map((ebook, index) => (
                            <div className='col-md-4 mb-4' key={index}>
                                <div className='card h-100'>
                                    <img className='card-img-top' src={ebook.imageUrl} alt={ebook.name} />
                                    <div className='card-body'>
                                        <h5 className='card-title'>{ebook.ebookName}</h5>
                                        <p className='card-text'>{ebook.price} xu</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Product;