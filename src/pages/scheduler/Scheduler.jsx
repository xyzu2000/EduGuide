import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../assets/css/Scheduler.css';
import Button from "../../components/basics/Button";
import LoadingSpinner from '../../components/loadingPage/LoadingSpinner';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import CustomEvent from './CustomEvent'; // Importuj niestandardowy komponent

const localizer = momentLocalizer(moment);

export const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newStart, setNewStart] = useState(null);
  const [newEnd, setNewEnd] = useState(null);


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
    setEventTitle('');
    setSelectedEvent({ start, end });
    setNewStart(start);
    setNewEnd(end);
    setShowEventModal(true);
  };

  const handleSelectEvent = (event) => {
    setEventTitle(event.title);
    setSelectedEvent(event);
    setNewStart(event.start);
    setNewEnd(event.end);
    setShowEditModal(true);
  };

  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const saveEvent = () => {
    if (eventTitle) {
      const newEvent = {
        title: eventTitle,
        start: selectedEvent.start,
        end: selectedEvent.end,
      };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      saveEventsToFirestore(updatedEvents);
      setShowEventModal(false);
    }
  };

  const updateEvent = () => {
    if (eventTitle && newStart && newEnd) {
      const updatedEvents = events.map((evt) =>
        evt.start === selectedEvent.start && evt.end === selectedEvent.end
          ? { ...evt, title: eventTitle, start: newStart, end: newEnd }
          : evt
      );
      setEvents(updatedEvents);
      saveEventsToFirestore(updatedEvents);
      setShowEditModal(false);
    }
  };

  const confirmDeleteEvent = () => {
    const updatedEvents = events.filter(
      (evt) => evt.start !== selectedEvent.start || evt.end !== selectedEvent.end
    );
    setEvents(updatedEvents);
    saveEventsToFirestore(updatedEvents);
    setShowDeleteModal(false);
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


  const handleEdit = (event) => {
    setEventTitle(event.title);
    setSelectedEvent(event);
    setNewStart(event.start);
    setNewEnd(event.end);
    setShowEditModal(true);
  };

  if (!currentUser) {
    return <LoadingSpinner />
  }

  return (
    <div className="text-violet-700 flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 w-full max-w-4xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-center flex-1">Scheduler</h1>
        </div>
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
            event: ({ event }) => (
              <CustomEvent event={event} handleEdit={handleEdit} handleDelete={handleDeleteEvent} />
            ),
          }}
          className="rbc-calendar"
        />
      </div>

      {showEventModal && (
        <div className="fixed inset-0 pl-[148px] bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Dodaj Nowe Wydarzenie</h2>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Nazwa Wydarzenia"
            />
            <Button
              onClick={saveEvent}
              className='mr-2'
            >
              Zapisz
            </Button>
            <Button
              onClick={() => setShowEventModal(false)}
            >
              Anuluj
            </Button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 pl-[148px] bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edytuj Wydarzenie</h2>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Nazwa Wydarzenia"
            />
            <label className="block mb-2">Start:</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={newStart ? moment(newStart).format('YYYY-MM-DDTHH:mm') : ''}
              onChange={(e) => setNewStart(new Date(e.target.value))}
            />
            <label className="block mb-2">End:</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={newEnd ? moment(newEnd).format('YYYY-MM-DDTHH:mm') : ''}
              onChange={(e) => setNewEnd(new Date(e.target.value))}
            />
            <Button
              onClick={updateEvent}
              className='mr-2'
            >
              Zapisz
            </Button>
            <Button
              onClick={() => setShowEditModal(false)}
            >
              Anuluj
            </Button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 pl-[148px] bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Usuń Wydarzenie</h2>
            <p className="mb-4">Czy na pewno chcesz usunąć wydarzenie '{selectedEvent?.title}'?</p>
            <Button
              onClick={confirmDeleteEvent}
              className='mr-2'
            >
              Tak
            </Button>
            <Button
              onClick={() => setShowDeleteModal(false)}
            >
              Nie
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;
