import React, { useState } from "react";
import { Popup } from "reactjs-popup";
import "../App.css";

const AppointmentForm = ({
  selectedDate,
  selectedSlot,
  onAppointmentSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onAppointmentSubmit(formData);
  };

  return (
    <Popup
      trigger={
        <button type="button">Book Appointment at {selectedSlot}</button>
      }
      modal
      nested
    >
      {(close) => (
        <div className="form-container">
          <h2>Appointment Form</h2>
          <form>
            <label>Name:</label>
            <input type="text" name="name" onChange={handleChange} required />

            <label>Age:</label>
            <input type="text" name="age" onChange={handleChange} required />

            <label>Phone Number:</label>
            <input type="text" name="phone" onChange={handleChange} required />

            <button
              type="button"
              onClick={() => {
                handleSubmit();
                close();
              }}
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </Popup>
  );
};

export default AppointmentForm;
