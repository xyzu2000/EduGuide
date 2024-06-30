import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../assets/css/Scheduler.css';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import SchedulerLegend from './SchedulerLegend';

const localizer = momentLocalizer(moment);

export const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (currentUser) {
        const docRef = doc(db, "userEvents", currentUser.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const formattedEvents = data.events.map(event => ({
              ...event,
              start: event.start.toDate(), // Konwersja Timestamp na Date
              end: event.end.toDate(), // Konwersja Timestamp na Date
            }));
            setEvents(formattedEvents);
          } else {
            console.log("No events found for this user");
          }
        } catch (error) {
          console.error("Error fetching user events:", error);
        }
      }
    };

    fetchUserEvents();
  }, [currentUser]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title) {
      const newEvent = {
        title,
        start,
        end,
      };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      saveEventsToFirestore(updatedEvents);
    }
  };

  const handleSelectEvent = event => {
    const updatedTitle = window.prompt('Edit Event name', event.title);
    if (updatedTitle) {
      const updatedEvents = events.map(evt =>
        evt.start === event.start && evt.end === event.end
          ? { ...evt, title: updatedTitle }
          : evt
      );
      setEvents(updatedEvents);
      saveEventsToFirestore(updatedEvents);
    }
  };

  const handleDeleteEvent = event => {
    if (window.confirm(`Are you sure you want to delete the event '${event.title}'?`)) {
      const updatedEvents = events.filter(evt => evt.start !== event.start || evt.end !== event.end);
      setEvents(updatedEvents);
      saveEventsToFirestore(updatedEvents);
    }
  };

  const saveEventsToFirestore = async (updatedEvents) => {
    if (currentUser) {
      const formattedEvents = updatedEvents.map(event => ({
        ...event,
        start: Timestamp.fromDate(event.start), // Konwersja Date na Timestamp
        end: Timestamp.fromDate(event.end), // Konwersja Date na Timestamp
      }));
      await setDoc(doc(db, "userEvents", currentUser.uid), {
        events: formattedEvents,
      });
    }
  };

  const handleContextMenu = (event, calEvent) => {
    event.preventDefault();
    handleDeleteEvent(calEvent);
  };

  if (!currentUser) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  const handleContextMenuClick = (e, event) => {
    e.preventDefault();
    handleContextMenu(e, event); // Przekazujemy zdarzenie i wydarzenie do funkcji obsługi menu kontekstowego
  };
  return (
    <div className="Scheduler flex flex-col justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 w-full max-w-4xl mb-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Scheduler</h1>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          components={{
            eventWrapper: ({ event, children }) => (
              <div onContextMenu={(e) => handleContextMenu(e, event)}>
                {children}
              </div>
            ),
          }}
          className="rbc-calendar"
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 w-full max-w-4xl">
        <SchedulerLegend />
      </div>
    </div>
  );
};

export default Scheduler;
