import axios from "axios";
import { useState, useEffect } from "react";
import { FaBan, FaCheckCircle, FaRegClock, FaBars } from "react-icons/fa";
import Cookies from "js-cookie";
const EbookList = () => {
  const [ebooks, setebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [censorID, setcensorID] = useState();
  useEffect(() => {
    setcensorID(Cookies.get("UserId"));
  }, []);
  const fetchebooks = async () => {
    try {
      const response = await axios.get(
        "https://rmrbdapi.somee.com/odata/ebook",
        {
          headers: { "Content-Type": "application/json", token: "123-abc" },
        }
      );
      setebooks(response.data);
    } catch (error) {
      console.error("Error fetching ebooks:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (ebookId, newStatus) => {
    console.log("Updating status for ebook:", ebookId, "to:", newStatus);
    try {
      const response = await axios.get(
        `https://rmrbdapi.somee.com/odata/ebook/${ebookId}`,
        {
          headers: { "Content-Type": "application/json", token: "123-abc" },
        }
      );

      const currentData = response.data;
      console.log("Fetched current ebook data:", currentData);

      const updatedData = {
        ...currentData,
        status: newStatus,
        censorId: censorID,
      };

      await axios.put(
        `https://rmrbdapi.somee.com/odata/ebook/${ebookId}`,
        updatedData,
        {
          headers: { "Content-Type": "application/json", token: "123-abc" },
        }
      );
      setebooks((prevebooks) =>
        prevebooks.map((ebook) =>
          ebook.ebookId === ebookId ? { ...ebook, status: newStatus } : ebook
        )
      );

      console.log(
        `Status for ebook ${ebookId} updated successfully to ${newStatus}`
      );
    } catch (error) {
      console.error("Error updating status:", error.response || error.message);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDetails = async (accountId, newDetails) => {};
  useEffect(() => {
    fetchebooks();
  }, []);

  return (
    <div className="flex-1 ml-0 md:ml-64 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>ebookName</th>
              <th>Price</th>
              <th>Images</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ebooks && ebooks.length > 0 ? (
              ebooks.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.ebookName || "Unknown"}</td>
                  <td>{item.price || "Unknown"}</td>
                  <td>
                    <img
                      src={item.imageUrl}
                      alt="ebook preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </td>

                  <td>
                    <FaBan
                      style={{
                        color: item.status === 0 ? "red" : "grey",
                        cursor: "pointer",
                        fontSize: "24px",
                      }}
                      title="Blocked"
                      onClick={() => handleStatusChange(item.ebookId, 0)}
                    />
                    <FaCheckCircle
                      style={{
                        color: item.status === 1 ? "green" : "grey",
                        cursor: "pointer",
                        fontSize: "24px",
                      }}
                      title="Approved"
                      onClick={() => handleStatusChange(item.ebookId, 1)}
                    />
                    <FaRegClock
                      style={{
                        color: item.status === -1 ? "orange" : "grey",
                        cursor: "pointer",
                        fontSize: "24px",
                      }}
                      title="Uncensored"
                      onClick={() => handleStatusChange(item.ebookId, -1)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDetails(item.ebookId)}
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

export default EbookList;
