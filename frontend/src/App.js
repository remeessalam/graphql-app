import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/Auth";
import HomePage from "./pages/Home";
import EventPage from "./pages/Event";
import BookingPage from "./pages/Booking";
import MainNavigation from "./components/Navigation/MainNavigation";
function App() {
  return (
    <BrowserRouter>
      <>
        <MainNavigation />
        <main className="main-content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/auth" element={<AuthPage />} />
            <Route exact path="/events" element={<EventPage />} />
            <Route exact path="/bookings" element={<BookingPage />} />
          </Routes>
        </main>
      </>
    </BrowserRouter>
  );
}

export default App;
