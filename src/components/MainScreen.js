import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
} from "firebase/firestore";
import db from "../firebaseconfig";
import Calendar from "./Calender";
import { FaTrashAlt } from "react-icons/fa";
import AppointmentForm from "./AppointmentForm";
import "../App.css";

const MainScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [draggedSlot, setDraggedSlot] = useState(null);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (selectedDate) {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("date", "==", selectedDate));
        const querySnapshot = await getDocs(q);

        const bookedSlotsData = [];
        querySnapshot.forEach((doc) => {
          bookedSlotsData.push(doc.data().time);
        });

        setBookedSlots(bookedSlotsData);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleAppointmentSubmit = (formData) => {
    const appointmentsRef = collection(db, "appointments");

    addDoc(appointmentsRef, {
      name: formData.name,
      age: formData.age,
      phone: formData.phone,
      date: selectedDate,
      time: selectedSlot,
    })
      .then(() => {
        const confirmationMessage = `Appointment taken for ${selectedDate} at ${selectedSlot}`;
        alert(confirmationMessage);

        setBookedSlots([...bookedSlots, selectedSlot]);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        alert("Failed to book the appointment. Please try again.");
      });
  };

  const handleDeleteSlot = async (slot) => {
    const appointmentsRef = collection(db, "appointments");
    const q = query(
      appointmentsRef,
      where("date", "==", selectedDate),
      where("time", "==", slot)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    const updatedSlots = bookedSlots.filter(
      (bookedSlot) => bookedSlot !== slot
    );
    setBookedSlots(updatedSlots);
  };

  const handleDragStart = (event, slot) => {
    event.dataTransfer.setData("text/plain", slot);
  };

  const handleDragOver = (event, slot) => {
    event.preventDefault();
  };

  const handleDrop = (event, targetSlot) => {
    const droppedSlot = event.dataTransfer.getData("text/plain");
    if (targetSlot === "delete-zone") {
      handleDeleteSlot(droppedSlot);
    } else {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("date", "==", selectedDate),
        where("time", "==", droppedSlot)
      );
      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
          addDoc(appointmentsRef, {
            name: "data",
            age: 0,
            phone: "data",
            date: selectedDate,
            time: targetSlot,
          })
            .then(() => {
              const confirmationMessage = `Appointment moved from ${droppedSlot} to ${targetSlot}`;
              alert(confirmationMessage);

              // Update the UI to reflect the moved appointment
              const updatedSlots = bookedSlots.map((slot) =>
                slot === droppedSlot ? targetSlot : slot
              );
              setBookedSlots(updatedSlots);
              setSelectedSlot(null);
            })
            .catch((error) => {
              alert("Failed to move the appointment. Please try again.");
            });
        })
        .catch((error) => {
          alert("Failed to move the appointment. Please try again.");
        });
    }

    setDraggedSlot(null);
  };

  return (
    <div className="container">
      <h1>Book your appointment</h1>
      <Calendar onSelectDate={handleDateSelect} />
      {selectedDate && (
        <>
          <h3>Available Time Slots for {selectedDate.toDateString()}</h3>
          <div className="time-slots">
            {["10-11", "11-12", "12-1", "1-2", "2-3", "3-4"].map((slot) => (
              <div
                key={slot}
                className={`slot ${selectedSlot === slot ? "selected" : ""} ${
                  bookedSlots.includes(slot) ? "booked" : ""
                }`}
                onClick={() => {
                  if (!bookedSlots.includes(slot)) {
                    handleSlotSelect(slot);
                  }
                }}
                draggable
                onDragStart={(event) => handleDragStart(event, slot)}
                onDragOver={(event) => handleDragOver(event, slot)}
                onDrop={(event) => handleDrop(event, slot)}
              >
                {slot}
              </div>
            ))}
          </div>

          {selectedSlot && !bookedSlots.includes(selectedSlot) && (
            <AppointmentForm
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onAppointmentSubmit={handleAppointmentSubmit}
            />
          )}
          <div>
            <div
              className="delete-zone"
              onDragOver={(event) => handleDragOver(event, "delete-zone")}
              onDrop={(event) => handleDrop(event, "delete-zone")}
            >
              <FaTrashAlt />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainScreen;
