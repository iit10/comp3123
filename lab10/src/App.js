import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    address: "",
    city: "",
    province: "",
    postalCode: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="App">
      <h2>Data Entry Form</h2>

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /><br/>

        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} /><br/>

        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} /><br/>

        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} /><br/>

        <input type="text" name="province" placeholder="Province" value={formData.province} onChange={handleChange} /><br/>

        <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} /><br/>

        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <div className="output">
          <h3>Submitted Information</h3>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Full Name:</strong> {formData.fullName}</p>
          <p><strong>Address:</strong> {formData.address}</p>
          <p><strong>City:</strong> {formData.city}</p>
          <p><strong>Province:</strong> {formData.province}</p>
          <p><strong>Postal Code:</strong> {formData.postalCode}</p>
        </div>
      )}
    </div>
  );
}

export default App;
