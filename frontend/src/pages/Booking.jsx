import { useContext, useEffect, useState } from "react";
import authContext from "../context/auth-context";
import "./Booking.css";
const BookingPage = () => {
  const token = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
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
        if (!res.data.bookings) {
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

  return (
    <>
      <div>
        {!isLoading ? (
          bookings.map((bookedEvents) => {
            return (
              <div key={bookedEvents._id}>
                <h1>{bookedEvents.user.email}</h1>
                <h1>{bookedEvents.event.title}</h1>
              </div>
            );
          })
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
