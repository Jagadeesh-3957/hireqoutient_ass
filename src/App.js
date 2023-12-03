import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const URL ='https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const usersPerPage = 10; // Set the number of users per page to 10

  const fetchUserData = async (URL) => {
    try {
      const response = await fetch(URL);
      const data = await response.json();
      setUserData(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(URL);
  }, []);

  // Calculate the indexes of the first and last users on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to the first page when a new search is performed
  };

  const handleDeleteAll = () => {
    // Implement your delete all logic here
    setUserData([]);
    // Clear selected users when deleting all
    setSelectedUsers([]);
  };

  const handleDelete = (id) => {
    // Implement your delete logic here
    // For example, you can filter out the user with the given id
    const updatedUserData = userData.filter(user => user.id !== id);
    setUserData(updatedUserData);
    // Remove the user from the selected users array
    setSelectedUsers(selectedUsers.filter(userId => userId !== id));
  };

  const handleEdit = (id) => {
    // Implement your edit logic here
    // You can open a modal or navigate to an edit page
    console.log(`Edit user with id: ${id}`);
  };

  const handleCheckboxChange = (id) => {
    // Toggle the selected state of the user
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(userId => userId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Top Section with Search Bar, Delete All Button, and Checkboxes */}
      <div className="top-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <button onClick={handleDeleteAll}>Delete All</button>
      </div>

      {/* Table Section */}
      <table className='table'>
        <thead>
          <tr>
            <th>Select</th> {/* New column for checkboxes */}
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected-row' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user.id)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(userData.length / usersPerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;