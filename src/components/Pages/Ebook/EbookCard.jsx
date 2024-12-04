import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkEbookOwnership } from '../../services/EbookService';
import Cookies from 'js-cookie';

const EbookCard = ({ ebook }) => {
  const [isOwned, setIsOwned] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      const customerId = Cookies.get('UserId');
      if (customerId) {
        const owned = await checkEbookOwnership(customerId, ebook.ebookId);
        setIsOwned(owned);
      }
    };

    checkOwnership();
  }, [ebook.ebookId]);

  return (
    <div className="flex flex-col">
      <Link 
        to={`/ebook/${ebook.ebookId}`}
        className="group relative block transition-transform duration-300 hover:-translate-y-2"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          {/* Book Cover */}
          <img
            src={ebook.imageUrl}
            alt={ebook.ebookName}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
            }}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-gray-800">
              <h3 className="text-lg font-semibold mb-2">{ebook.ebookName}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{ebook.description}</p>
            </div>
          </div>
        </div>
      </Link>
      <h3 className="mt-3 text-center text-gray-800 font-medium line-clamp-2">
        {ebook.ebookName}
      </h3>
      <p className="text-center text-gray-600">
        {isOwned ? (
          <span className="text-green-600 font-medium">Đã sở hữu</span>
        ) : (
          `${ebook.price} xu`
        )}
      </p>
    </div>
  );
};

export default EbookCard; 