import React from 'react'

export const Scheduler = () => {
  return (
    <div>Scheduler</div>
  )
}

export default Scheduler


// import format from 'date-fns/format';
// import getDay from 'date-fns/getDay';
// import parse from 'date-fns/parse';
// import startOfWeek from 'date-fns/startOfWeek';
// import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// import React, { useContext, useEffect, useState } from 'react';
// import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { TbAlertHexagon } from 'react-icons/tb';
// import { db } from '../../config/firebase';
// import { AuthContext } from '../../context/AuthContext';

// const locales = {
//   'en-US': require('date-fns/locale/en-US'),
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// const Scheduler = () => {
//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     start: new Date(),
//     end: new Date(),
//   });
//   const [allEvents, setAllEvents] = useState([]);
//   const [error, setError] = useState('');
//   const { currentUser } = useContext(AuthContext);
//   const userUID = currentUser.uid;

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const userEventsDocRef = doc(db, 'userEvents', userUID);
//         const userEventsDoc = await getDoc(userEventsDocRef);

//         if (userEventsDoc.exists()) {
//           const events = userEventsDoc.data().events || [];
//           setAllEvents(events);
//         } else {
//           setAllEvents([]);
//         }
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       }
//     };

//     fetchEvents();
//   }, [userUID]);

//   const handleAddEvent = async () => {
//     // dodałem obsługe, ze jak nie poda tytułu wiekszego od 3 to ustawia error i wychodzi z funkcji
//     if (newEvent.title.trim().length < 3) {
//       setError('Tytuł musi zawierać co najmniej 3 znaki');
//       return;
//     }

//     try {
//       const userEventsDocRef = doc(db, 'userEvents', userUID);
//       const userEventsDoc = await getDoc(userEventsDocRef);

//       if (!userEventsDoc.exists()) {
//         await setDoc(doc(db, 'userEvents', userUID), { events: [] });
//       }
//       //  else {
//       //   const existingEvents = userEventsDoc.data().events || [];
//       //   setAllEvents(existingEvents);
//       // }

//       const updatedEvents = [...allEvents, newEvent];
//       setAllEvents(updatedEvents);

//       await updateDoc(userEventsDocRef, {
//         events: updatedEvents,
//       });

//       handleResetForm();
//     } catch (err) {
//       setError('Error adding event:');
//       console.error(err);
//     }
//   };

//   const handleResetForm = () => {
//     setNewEvent({
//       title: '',
//       start: new Date(),
//       end: new Date(),
//     });
//     setError('');
//   };

//   return (
//     <div className="home">
//       <div className="container">
//         <div className="chat">
//           <h1>Calendar</h1>
//           <h2>Add New Event</h2>
//           <div>
//             <input
//               type="text"
//               placeholder="Add Title"
//               style={{ width: '20%', marginRight: '10px' }}
//               value={newEvent.title}
//               onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
//             />
//             <DatePicker
//               selected={new Date(newEvent.start)}
//               onChange={start => setNewEvent(prev => ({ ...prev, start: start.toISOString() }))}
//               showTimeSelect
//               timeFormat="HH:mm"
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="MMMM d, yyyy h:mm aa"
//             />
//             <DatePicker
//               selected={new Date(newEvent.end)}
//               onChange={end => setNewEvent(prev => ({ ...prev, end: end.toISOString() }))}
//               showTimeSelect
//               timeFormat="HH:mm"
//               timeIntervals={15}
//               timeCaption="Time"
//               dateFormat="MMMM d, yyyy h:mm aa"
//             />
//             <button style={{ marginTop: '10px' }} onClick={handleAddEvent}>
//               Add Event
//             </button>
//           </div>
//           {/* tutaj jest obsłuzony ten error. Dodalem klasy css z alertami */}
//           {error && (
//             <div className="error-msg">
//               <TbAlertHexagon /> {error}
//               dasdsada
//             </div>
//           )}
//           <Calendar
//             localizer={localizer}
//             events={allEvents}
//             startAccessor="start"
//             endAccessor="end"
//             style={{ height: 500, margin: '50px' }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Scheduler;
