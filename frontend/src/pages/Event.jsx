import React, { useContext, useEffect, useState } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import "./Event.css";
import authContext from "../context/auth-context";
const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState();
  const [description, setDescription] = useState("");

  const token = useContext(authContext);
  console.log(token, "thisistoken");
  const onCancel = () => {
    setCreating(false);
  };
  const onConfirm = () => {
    setCreating(false);
    setIsLoading(true);
    if (
      title.trim().length === 0 ||
      price.trim().length === 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }
    const event = { title, price: parseFloat(price), date, description };
    console.log(event, "thisformdatas");

    const requestBody = {
      query: `
            mutation{
              createEvent(eventInput: {title:"${event.title}", description: "${event.description}", price : ${event.price}, date: "${event.date}"}){
                _id
                title
                description
                price
                date
                creator{
                  email
                  _id
                }
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
        console.log("This is response after login or signup :", res);
        if (!res.data.createEvent) {
          return;
        }
        // const event = {res.data.events}
        setEvents((prev) => {
          return [...prev, res.data.createEvent];
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        throw new Error("failed");
      });
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
            query{
                events{
                  _id
                  title
                  description
                  price
                  date
                  creator{
                    email
                    _id
                  }
                }
              }`,
    };

    fetch("http://localhost:8000/graphql", {
      method: "post",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((res) => {
        console.log("events :", res);
        if (!res.data.events) {
          return;
        }
        setEvents(res.data.events);
        setIsLoading(false);
        return;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("failed");
      });
  };

  const viewDetails = (id) => {
    setView((prev) => (prev === id ? "" : id));
  };

  const bookEventHandler = (id) => {
    const requestBody = {
      query: `
            mutation{
                bookEvent(eventId:"${id}" ){
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
        console.log("events booking:", res);
        if (!res.data.events) {
          return;
        }
        // setEvents(res.data.events);
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        throw new Error("failed");
      });
  };

  return (
    <>
      {creating && (
        <>
          <Backdrop />
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={onCancel}
            onConfirm={onConfirm}
          >
            <form action="">
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  rows="4"
                  id="description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </form>
          </Modal>
        </>
      )}
      {token.token && (
        <div className="events-control">
          <p>Share you own Events</p>
          <button className="btn" onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}
      <ul className="events_list">
        {!isLoading ? (
          events.map((event) => {
            return (
              <>
                <li key={event._id} className="events_list-item">
                  <div className="event-details">
                    <h1>{event.title}</h1>
                    {/* <p>{event.description}</p> */}
                    <h3>
                      $ {event.price} -{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </h3>
                  </div>
                  <div className="event-booking">
                    {token.userId === event.creator._id ? (
                      <p>Your the owner of this Event</p>
                    ) : (
                      <button
                        className="btn"
                        onClick={() => viewDetails(event._id)}
                      >
                        View Details
                      </button>
                    )}
                  </div>
                  {event._id === view && (
                    <>
                      <div className="event_booking">
                        <p>Description: {event.description}</p>
                        <h3>Creator: {event.creator.email}</h3>
                        <button
                          className="btn"
                          onClick={() => {
                            bookEventHandler(event._id);
                          }}
                        >
                          Book
                        </button>
                      </div>
                    </>
                  )}
                </li>
              </>
            );
          })
        ) : (
          <div className="events_list-loading">
            <p>...loading</p>
          </div>
        )}
      </ul>
    </>
  );
};

export default EventPage;
