import { useContext, useEffect, useState } from "react";
import authContext from "../context/auth-context";
import "./Booking.css";
const BookingPage = () => {
  const token = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState();
  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
            query{
                bookings{
                  _id
                event{
                  title
                  price
                  date
                }
                user{
                  email
                }
                createdAt
                }
              }`,
    };

    fetch("http://localhost:8000/graphql", {
      method: "post",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((res) => {
        console.log("bookings :", res);
        if (!res.data.bookings || res.data.bookings.length === 0) {
          setIsLoading(false);
          return;
        }
        setBookings(res.data.bookings);
        setIsLoading(false);
        return;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("failed");
      });
  };

  const bookingCancelHandler = (id) => {
    const requestBody = {
      query: `
            mutation{
                cancelBooking(bookingId:"${id}" ){
                  title
                  _id
                }
              }`,
    };

    fetch("http://localhost:8000/graphql", {
      method: "post",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((res) => {
        console.log("events booking cancel:", res);
        if (!res.data.cancelBooking) {
          return;
        }
        console.log("booking cancels: ", bookings);
        setBookings((prev) => {
          prev.filter(
            (cancel) => cancel.event._id !== res.data.cancelBooking._id
          );
        });
        // setEvents(res.data.events);
        // setIsLoading(false);
        return;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("failed");
      });
  };

  return (
    <>
      <div className="booking-details-container">
        {/* {bookings.length} */}
        {!isLoading ? (
          !bookings ? (
            <h1>No Booked Events</h1>
          ) : (
            bookings.map((bookedEvents) => {
              return (
                <>
                  <div key={bookedEvents._id} className="booking-details">
                    <div className="details">
                      <h5>Event: {bookedEvents.event.title}</h5>
                      <h5>
                        Date:{" "}
                        {new Date(bookedEvents.event.date).toLocaleDateString()}
                      </h5>
                    </div>
                    <div>
                      <button
                        className="btn"
                        onClick={() => bookingCancelHandler(bookedEvents._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              );
            })
          )
        ) : (
          <div className="bookedEvents_list-loading">
            <p>...loading</p>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingPage;
