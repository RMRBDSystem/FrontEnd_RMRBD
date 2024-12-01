import axios from "axios";
import { useState, useEffect } from "react";
import { FaBan, FaCheckCircle, FaRegClock, FaBars } from "react-icons/fa";
import Cookies from "js-cookie";
const BookList = () => {
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [censorID, setcensorID] = useState();
  useEffect(() => {
    setcensorID(Cookies.get("UserId"));
  }, []);
  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://rmrbdapi.somee.com/odata/Book",
        {
          headers: { "Content-Type": "application/json", token: "123-abc" },
        }
      );
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching Books:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (BookId, newStatus) => {
    console.log("Updating status for Book:", BookId, "to:", newStatus);
    console.log("censor", censorID);
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/Book/${BookId}`,
        {
          headers: { "Content-Type": "application/json", token: "123-abc" },
        }
      );

      const currentData = response.data;
      console.log("Fetched current Book data:", currentData);

      const updatedData = {
        ...currentData,
        status: newStatus,
        censorId: censorID,
      };

      await axios.put(
        `https://rmrbdapi.somee.com/odata/Book/${BookId}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json", token: "123-abc" },
        }
      );
      setBooks((prevBooks) =>
        prevBooks.map((Book) =>
          Book.BookId === BookId
            ? { ...Book, status: newStatus }
            : Book
        )
      );

      console.log(
        `Status for Book ${BookId} updated successfully to ${newStatus}`
      );
    } catch (error) {
      console.error("Error updating status:", error.response || error.message);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDetails = async (accountId, newDetails) => {};
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="flex-1 ml-0 md:ml-64 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>BookName</th>
              <th>createDate</th>
              <th>Images</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Books && Books.length > 0 ? (
              Books.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.bookName || "Unknown"}</td>
                  <td>{item.createDate || "Unknown"}</td>
                  <td>
                    {item.images?.length > 0 && (
                      <img
                        src={item.images[0].imageUrl}
                        alt="Book preview"
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    )}
                  </td>

                  <td>
                    <FaBan
                      style={{
                        color: item.status === 0 ? "red" : "grey",
                        cursor: "pointer",
                        fontSize: "24px",
                      }}
                      title="Blocked"
                      onClick={() => handleStatusChange(item.BookId, 0)}
                    />
                    <FaCheckCircle
                      style={{
                        color: item.status === 1 ? "green" : "grey",
                        cursor: "pointer",
                        fontSize: "24px",
                      }}
                      title="Approved"
                      onClick={() => handleStatusChange(item.BookId, 1)}
                    />
                    <FaRegClock
                      style={{
                        color: item.status === -1 ? "orange" : "grey",
                        cursor: "pointer",
                        fontSize: "24px",
                      }}
                      title="Uncensored"
                      onClick={() => handleStatusChange(item.BookId, -1)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDetails(item.BookId)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
