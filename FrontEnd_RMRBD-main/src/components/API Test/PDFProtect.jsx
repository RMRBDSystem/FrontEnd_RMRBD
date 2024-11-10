import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Navbar from "../Navbar/Navbar";
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';
import { Table, Button } from 'react-bootstrap';
import { Worker, Viewer } from '@react-pdf-viewer/core';

const PDFProtect = () => {
  const [userEbooks, setUserEbooks] = useState([]);
  const [selectedpdfurl, setSelectedpdfurl] = useState(null);
  const [currentEbookIndex, setCurrentEbookIndex] = useState(0);
  const [error, setError] = useState(false); // To track if there is an error loading the PDF
  const [numPages, setNumPages] = useState(null); // Track number of pages
  const [currentPage, setCurrentPage] = useState(1); // Track the current page number
  const [hiddenTextAreas, setHiddenTextAreas] = useState([]); // Areas to hide text

  const getUserIdFromCookie = () => {
    const userId = Cookies.get('UserId');
    return userId;
  };

  useEffect(() => {
    const fetchEbooksForUser = async () => {
      const userId = getUserIdFromCookie();
      if (!userId) {
        toast.error("User ID is missing, please log in.");
        return;
      }

      try {
        const response = await axios.get('https://rmrbdapi.somee.com/odata/ebook', {
          headers: {
            'Token': '123-abc',
          },
        });

        const filteredEbooks = response.data.filter((ebook) => {
          return String(ebook.createById) === String(userId) && ebook.pdfurl;
        });

        if (filteredEbooks.length === 0) {
          toast.info("No ebooks found for this user.");
        }

        setUserEbooks(filteredEbooks);
      } catch (error) {
        toast.error("Failed to fetch ebook details");
      }
    };

    fetchEbooksForUser();
  }, []);

  const handleViewPdf = (pdfurl) => {
    setSelectedpdfurl(pdfurl);
    setError(false); // Reset any previous error state when starting to view a new PDF
    setCurrentPage(1); // Reset to the first page
    setHiddenTextAreas([
      { page: 1, x: 100, y: 200, width: 150, height: 20 }, // Example: Coordinates to cover
      { page: 1, x: 250, y: 400, width: 100, height: 30 }, // Another area to cover
    ]); // Example areas to hide
  };

  const nextEbook = () => {
    if (currentEbookIndex < userEbooks.length - 1) {
      setCurrentEbookIndex(currentEbookIndex + 1);
    }
  };

  const prevEbook = () => {
    if (currentEbookIndex > 0) {
      setCurrentEbookIndex(currentEbookIndex - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault(); // Disable right-click
  };

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '20px', flexGrow: 1 }}>
        <h1>Your Ebooks</h1>
        {userEbooks.length > 0 ? (
          <div style={{ textAlign: 'center' }}>
            <Button variant="secondary" onClick={prevEbook} disabled={currentEbookIndex === 0}>
              Previous
            </Button>

            <Table striped bordered hover style={{ display: 'inline-block', width: 'auto', margin: '20px' }}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Ebook Name</th>
                  <th>Description</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img src={userEbooks[currentEbookIndex].imageUrl} alt={userEbooks[currentEbookIndex].ebookName} style={{ width: '100px', height: 'auto' }} />
                  </td>
                  <td>{userEbooks[currentEbookIndex].ebookName}</td>
                  <td>{userEbooks[currentEbookIndex].description}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleViewPdf(userEbooks[currentEbookIndex].pdfurl)}>
                      View PDF
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>

            <Button variant="secondary" onClick={nextEbook} disabled={currentEbookIndex === userEbooks.length - 1}>
              Next
            </Button>
          </div>
        ) : (
          <p>No ebooks found for this user.</p>
        )}

        {selectedpdfurl && (
          <div style={{ marginTop: '30px' }}>
            <h3>Viewing PDF</h3>
            {error ? (
              <div>
                <p style={{ color: 'red' }}>Failed to load PDF file. Resetting...</p>
                <span>Page 1 of 1</span> {/* Fallback page info when error occurs */}
              </div>
            ) : (
              <div
                onContextMenu={handleRightClick}
                style={{
                  display: 'flex',
                  justifyContent: 'center', // Centers the PDF horizontally
                  alignItems: 'center', // Centers the PDF vertically
                  height: 'calc(100vh - 250px)', // Adjust the height to leave space for other elements
                  overflowY: 'auto',
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    width: '80%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                    border: '1px solid #ddd',
                    position: 'relative',
                    padding: '10px',
                    userSelect: 'none',
                  }}
                >
                  <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}>
                    {/* Render only the current page */}
                    <Viewer
                      fileUrl={selectedpdfurl}
                      onError={() => setError(true)}
                      initialPage={currentPage - 1} // Start at the current page (zero-indexed)
                      onLoadSuccess={onLoadSuccess}
                      renderMode="canvas"
                    />
                  </Worker>

                  {/* Transparent overlay to hide text */}
                  {hiddenTextAreas.map((area, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        top: `${area.y}px`,
                        left: `${area.x}px`,
                        width: `${area.width}px`,
                        height: `${area.height}px`,
                        backgroundColor: 'white',
                        zIndex: 10,
                        pointerEvents: 'none', // Make sure the overlay does not block interactions
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div>
              <button onClick={prevPage} disabled={currentPage === 1}>Previous Page</button>
              <span>Page {currentPage} of {numPages}</span>
              <button onClick={nextPage} disabled={currentPage === numPages}>Next Page</button>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default PDFProtect;
