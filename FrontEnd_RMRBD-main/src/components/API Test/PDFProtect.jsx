import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Navbar from "../Navbar/Navbar";
import Footer from '../Footer/Footer';
import Cookies from 'js-cookie';
import { Table, Button } from 'react-bootstrap';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Core styles for PDF viewer
import { pdfjs } from 'react-pdf';
import { pdfjsWorker } from '@react-pdf-viewer/default-layout';
import { pdfjsTheme } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/default-layout/lib/styles/index.css'; // Default Layout styles

const PDFProtect = () => {
  const [userEbooks, setUserEbooks] = useState([]);
  const [selectedpdfurl, setSelectedpdfurl] = useState(null);
  const [currentEbookIndex, setCurrentEbookIndex] = useState(0);
  const [error, setError] = useState(false); // To track if there is an error loading the PDF

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

  const handleRightClick = (e) => {
    e.preventDefault(); // Disable right-click
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
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
            <div onContextMenu={handleRightClick}>
              {/* Use the correct version of the PDF.js worker */}
              <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`}>
                <Viewer fileUrl={selectedpdfurl} />
              </Worker>
            </div>
          )}
        </div>
        )}
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default PDFProtect;
