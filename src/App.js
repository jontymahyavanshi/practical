import React, { useState, useEffect } from "react";

function UserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: ""
  });
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
// npm -i -g json-server, j-s db.json --port 3001
  // Fetch all users when component loads
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      // UPDATE existing user
      fetch(`http://localhost:3001/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then((res) => res.json())
        .then(() => {
          alert("User updated!");
          setFormData({ name: "", email: "", age: "", gender: "" });
          setEditingUser(null);
          fetchUsers();
        });
    } else {
      // ADD new user
      fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then((res) => res.json())
        .then(() => {
          alert("User added!");
          setFormData({ name: "", email: "", age: "", gender: "" });
          fetchUsers();
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`http://localhost:3001/users/${id}`, { method: "DELETE" })
        .then(() => {
          alert("User deleted!");
          fetchUsers();
        });
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingUser(user);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>{editingUser ? "Edit User" : "Add User"}</h2>

      {/* User Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9"
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Age:</label>
          <br />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Gender:</label>
          <br />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">--Select--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {editingUser ? "Update User" : "Add User"}
        </button>
      </form>

      {/* User Table */}
      <h3 style={{ marginTop: "30px" }}>User List</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px"
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#ddd" }}>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Age</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Gender</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {user.id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {user.name}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {user.email}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {user.age}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {user.gender}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      marginRight: "5px",
                      padding: "5px 10px",
                      backgroundColor: "orange",
                      border: "none",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "red",
                      border: "none",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{ textAlign: "center", padding: "10px" }}
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserForm;
