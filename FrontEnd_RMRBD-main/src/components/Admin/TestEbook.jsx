import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TestEbook = () => {
  const [ebooks, setEbooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]); // To store users (creators)
  const [newEbook, setNewEbook] = useState({
    EbookName: '',
    Description: '',
    Price: 0,
    Pdf: null,  // Store the PDF file
    Image: [],
    CategoryId: '',
    CreateById: '',
    CensorId: '',
    pdfurl: ''  // Store the existing PDF URL when editing
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEbookId, setSelectedEbookId] = useState(null);

  const fileInputRef = useRef(null);

  // Fetch ebooks and categories
  const fetchEbooks = async () => {
    try {
      const response = await axios.get('https://rmrbdapi.somee.com/odata/ebook', {
        headers: {
          'Token': '123-abc',
        },
      });

      console.log("Fetched ebooks:", response.data);

      if (Array.isArray(response.data)) {
        setEbooks(response.data);
      } else {
        console.warn('Unexpected API response structure:', response.data);
        setEbooks([]);
      }
    } catch (error) {
      console.error('Error fetching ebooks:', error.response ? error.response.data : error.message);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://rmrbdapi.somee.com/odata/BookCategory', {
        headers: {
          'Token': '123-abc',
        },
      });
      console.log("Fetched categories:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch users (creators)
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://rmrbdapi.somee.com/odata/Account', {
        headers: {
          'Token': '123-abc',
        },
      });
      console.log("Fetched users:", response.data);
      setUsers(response.data); 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Add new ebook with PDF
  const addEbook = async (e) => {
    e.preventDefault();
    try {
      const ebookData = new FormData();
      ebookData.append('EbookName', newEbook.EbookName);
      ebookData.append('Description', newEbook.Description);
      ebookData.append('Price', parseInt(newEbook.Price, 10));
      ebookData.append('Status', newEbook.Status);
      ebookData.append('categoryId', parseInt(newEbook.CategoryId, 10));
      ebookData.append('CreateById', newEbook.CreateById);
      ebookData.append('CensorId', newEbook.CensorId);

      if (newEbook.Image[0]) {
        ebookData.append('image', newEbook.Image[0]);
      }

      if (newEbook.Pdf) {
        ebookData.append('document', newEbook.Pdf);
      }

      const response = await axios.post('https://rmrbdapi.somee.com/odata/UploadPDF', ebookData, {
        headers: {
          'Token': '123-abc',
        },
      });

      setEbooks(prev => [...prev, { ...response.data, pdfurl: response.data.pdfurl }]);
      resetForm();
    } catch (error) {
      console.error('Error adding ebook:', error);
    }
  };

  // Edit ebook with existing PDF or new file
  const editEbook = async (e) => {
    e.preventDefault();
  
    const ebookData = new FormData();
    ebookData.append('ebookName', newEbook.EbookName);
    ebookData.append('description', newEbook.Description);
    ebookData.append('price', parseInt(newEbook.Price, 10));
    ebookData.append('createById', newEbook.CreateById);
    ebookData.append('ebookId', selectedEbookId);
  
    if (newEbook.Image[0]) {
      ebookData.append('image', newEbook.Image[0]);
    }
  
    if (newEbook.Pdf) {
      ebookData.append('document', newEbook.Pdf);
    }
  
    try {
      const response = await axios.put(
        `http://rmrbdapi.somee.com/odata/Ebook/${selectedEbookId}`,
        ebookData,
        {
          headers: {
            'Token': '123-abc',
          },
        }
      );
      setEbooks((prev) =>
        prev.map((ebook) =>
          ebook.ebookId === selectedEbookId
            ? { ...ebook, ...response.data }
            : ebook
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating ebook:", error.response ? error.response.data : error.message);
      alert(`Error updating ebook: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  const handleEditButtonClick = (ebook) => {
    setEditMode(true);
    setSelectedEbookId(ebook.ebookId);
    setNewEbook({
      EbookName: ebook.ebookName,
      Description: ebook.description,
      Price: ebook.price,
      Status: ebook.status,
      Pdf: null,
      Image: ebook.imageUrl ? [ebook.imageUrl] : [],
      CategoryId: ebook.categoryId,
      CreateById: ebook.createById,
      CensorId: ebook.censorId,
      pdfurl: ebook.pdfurl || '', 
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setNewEbook({
      EbookName: '',
      Description: '',
      Price: '',
      Pdf: null,  // Reset PDF field
      Image: [],  // Reset image field
      CategoryId: '',
      CreateById: 1,
      CensorId: '',
      pdfurl: ''  // Reset PDF URL
    });
    setModalOpen(false);
    setEditMode(false);
    setSelectedEbookId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEbook((prev) => ({ ...prev, Image: [file] }));
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEbook((prev) => ({ ...prev, Pdf: file }));
    }
  };

  useEffect(() => {
    fetchEbooks();
    fetchCategories();  
    fetchUsers(); 
  }, []);

  const getCreatorName = (createById) => {
    const creatorId = Number(createById);
    const user = users.find(user => Number(user.accountId) === creatorId);
    console.log(`Matching CreateById: ${createById} with AccountID: ${user ? user.accountId : 'No Match'}`);
    return user ? user.userName : 'Unknown';
  };

  return (
    <div className="flex flex-col min-h-screen font-roboto">
      <main className="flex-1 bg-gray-50 flex flex-col">
        <div className="p-4">
          <button onClick={() => setModalOpen(true)} className="bg-orange-500 text-white p-2 rounded">
            Add New Ebook
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Ebook List</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Image</th>
                <th className="py-2 px-4 border-b text-left">Ebook Name</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Price</th>
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Created By</th> {/* New Column */}
                <th className="py-2 px-4 border-b text-left">PDF Link</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ebooks.length > 0 ? (
                ebooks.map((ebook) => {
                  const category = categories.find(
                    (cat) => cat.categoryId === ebook.categoryId
                  );
                  return (
                    <tr key={ebook.ebookId}>
                      <td className="py-2 px-4 border-b">
                        {ebook.imageUrl && (
                          <img
                            src={ebook.imageUrl}
                            alt={ebook.ebookName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">{ebook.ebookName}</td>
                      <td className="py-2 px-4 border-b">{ebook.description}</td>
                      <td className="py-2 px-4 border-b">{ebook.price === 0 ? 'Free' : ebook.price}</td>
                      <td className="py-2 px-4 border-b">
                        {category ? category.name : 'No Category'}
                      </td>
                      <td className="py-2 px-4 border-b">{getCreatorName(ebook.createById)}</td>
                      <td className="py-2 px-4 border-b">
                        {ebook.pdfurl && ebook.pdfurl !== "" ? (
                          <a 
                            href={ebook.pdfurl.startsWith('http') ? ebook.pdfurl : `https://rmrbdapi.somee.com${ebook.pdfurl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-500 text-white rounded px-3 py-1 text-center hover:bg-blue-600 transition"
                          >
                            View PDF
                          </a>
                        ) : (
                          <span className="text-red-500">PDF not available</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEditButtonClick(ebook)}
                          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">No ebooks available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Modal for adding/editing ebook */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold">{editMode ? 'Edit Ebook' : 'Add Ebook'}</h3>
              <form onSubmit={editMode ? editEbook : addEbook}>
                {/* Ebook Name */}
                <div className="mb-4">
                  <label htmlFor="ebookName" className="block text-gray-700">Ebook Name</label>
                  <input
                    id="ebookName"
                    type="text"
                    value={newEbook.EbookName}
                    onChange={(e) => setNewEbook({ ...newEbook, EbookName: e.target.value })}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700">Description</label>
                  <textarea
                    id="description"
                    value={newEbook.Description}
                    onChange={(e) => setNewEbook({ ...newEbook, Description: e.target.value })}
                    required
                    className="w-full border p-2 rounded"
                  ></textarea>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label htmlFor="price" className="block text-gray-700">Price</label>
                  <input
                    id="price"
                    type="number"
                    value={newEbook.Price}
                    onChange={(e) => setNewEbook({ ...newEbook, Price: e.target.value })}
                    required
                    className="w-full border p-2 rounded"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label htmlFor="category" className="block text-gray-700">Category</label>
                  <select
                    id="category"
                    value={newEbook.CategoryId}
                    onChange={(e) => setNewEbook({ ...newEbook, CategoryId: e.target.value })}
                    required
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PDF File Upload */}
                <div className="mb-4">
                  <label htmlFor="pdfFile" className="block text-gray-700">Upload PDF</label>
                  <input
                    id="pdfFile"
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="w-full border p-2 rounded"
                  />
                  {newEbook.Pdf && newEbook.Pdf instanceof File && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">New PDF: {newEbook.Pdf.name}</p>
                    </div>
                  )}
                  {newEbook.pdfurl && !newEbook.Pdf && !editMode && (
                    <div className="mt-2">
                      <a href={newEbook.pdfurl} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Current PDF</a>
                    </div>
                  )}
                </div>

                {/* Image File Upload */}
                <div className="mb-4">
                  <label htmlFor="imageFile" className="block text-gray-700">Upload Image</label>
                  <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border p-2 rounded"
                  />
                  {newEbook.Image[0] && newEbook.Image[0] instanceof File && (
                    <div className="mt-2">
                      <img src={URL.createObjectURL(newEbook.Image[0])} alt="Preview" className="w-32 h-32 object-cover rounded" />
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {editMode ? 'Update Ebook' : 'Add Ebook'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TestEbook;
