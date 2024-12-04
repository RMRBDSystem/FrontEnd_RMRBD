import React, { useEffect, useState } from "react";
import { getEbooks, checkEbookOwnership } from "../../services/EbookService";
import EbookSidebar from "./EbookSidebar";
import EbookCard from './EbookCard';
import Cookies from 'js-cookie';

function Ebook() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: null,
    priceRange: null,
  });

  useEffect(() => {
    fetchEbooks();
  }, [filters]);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const data = await getEbooks();

      console.log("Fetched Ebooks:", data); // Log the fetched ebooks

      if (!data || data.length === 0) {
        setError("No ebooks found");
        setEbooks([]);
        return;
      }

      // Get ownership status for all ebooks if user is logged in
      const customerId = Cookies.get('UserId');
      let ebooksWithOwnership = data;

      if (customerId) {
        ebooksWithOwnership = await Promise.all(
          data.map(async (ebook) => {
            const isOwned = await checkEbookOwnership(customerId, ebook.ebookId);
            return { ...ebook, isOwned };
          })
        );
      }

      let filteredEbooks = ebooksWithOwnership;

      // Apply category filter
      if (filters.category) {
        filteredEbooks = filteredEbooks.filter(
          (ebook) => ebook.categoryId === filters.category
        );
      }

      // Apply price filter
      if (filters.priceRange) {
        filteredEbooks = filteredEbooks.filter((ebook) => {
          const price = ebook.price;
          switch (filters.priceRange) {
            case "0-50000":
              return price >= 0 && price <= 50000;
            case "50000-100000":
              return price > 50000 && price <= 100000;
            case "100000+":
              return price > 100000;
            default:
              return true;
          }
        });
      }

      console.log("Filtered Ebooks:", filteredEbooks); // Log the filtered ebooks

      setEbooks(filteredEbooks);
    } catch (error) {
      console.error("Error fetching ebooks:", error);
      setError("Failed to load ebooks");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (ebooks.length === 0) {
    return <div>No ebooks found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-black">Sách điện tử</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <EbookSidebar onFilterChange={handleFilterChange} />
        </div>
        
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ebooks.map((ebook) => (
              <EbookCard key={ebook.ebookId} ebook={ebook} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ebook; 