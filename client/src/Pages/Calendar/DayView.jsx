import React, { useContext, useEffect, useState } from "react"
import { format, set } from "date-fns"
import DeleteButton from "../../components/ReusableComponents/Delete"
import "../../global.css"
import { AuthContext } from "../../components/Auth/AuthProvider"
function DayView({ selectedDate }) {
  const { auth } = useContext(AuthContext)

  //replace with actual events
  const [events, setEvents] = useState([
    { id: "", hour: "", event: "" },
    { id: "", hour: "", event: "" },
    { id: "", hour: "", event: "" },
    { id: "", hour: "", event: "" },
  ])
  //useState for Adding events
  const [hourInput, setHourInput] = useState("")
  const [eventInput, setEventInput] = useState("")
  //useState for Editing events
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingEventText, setEditingEventText] = useState("")
  const handleEventChange = (e) => {
    setEditingEvent((prevEvent) => [...prevEvent, event, e.target.value])
  }

  const saveEditingEvent = async () => {
    try {
      const response = await fetch("/api/events", editingEvent, {
        method: "POST",
        header: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.accessToken,
        },
      })

      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  // const saveEditingEvent = async () => {
  //   try {
  //     const response = await axios.post("/api/events", editingEvent)
  //     console.log(response.data)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const hours = []
  for (let i = 0; i < 24; i++) {
    hours.push(i)
  }

  const addEvent = (hour, event) => {
    const newEvent = { id: Date.now(), hour, event }
    setEvents((prevEvents) => [...prevEvents, newEvent])
  }

  const editEvent = (id, updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === id ? updatedEvent : event))
    )
    setEditingEvent(null)
  }

  const deleteEvent = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))
  }
  const fetchEvents = async () => {
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      const response = await fetch(`/api/events/?date=${formattedDate}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + auth.accessToken,
        },
      })
      const data = await response.json()
      const convertedEvents = data.map((event) => ({
        id: event._id,
        hour: Number.parseInt(event.eventTime),
        event: event.eventTitle,
      }))
      console.log("2. convertedEvents....:...", convertedEvents)
      setEvents(convertedEvents)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [selectedDate])

  return (
    <>
      <div className="dayView">
        <h2 className="selectedDate flex- gap-2">
          Selected Day: {format(selectedDate, "MMMM, d, yyyy")}
        </h2>
        <ol>
          {hours.map((hour) => (
            <li key={hour} className="dayViewHour">
              <div className="hourEventContainer">
                <span>{hour}:00</span>
                {events
                  .filter((event) => event.hour === hour)
                  .map((event) => (
                    <div key={event.id} className="eventName">
                      <span>
                        {event.event}
                        <span>{".....   "}</span>
                      </span>

                      <button
                        className="eventButton"
                        onClick={() => deleteEvent(event.id)}
                      >
                        Delete
                      </button>

                      <button
                        className="eventButton"
                        onClick={() => setEditingEvent(event)}
                      >
                        <i className="fa-solid fa-pen-to-square">Edit</i>
                      </button>

                      {editingEvent === event && (
                        <div>
                          <input
                            className="editInput"
                            type="text"
                            value={editingEventText}
                            onChange={(e) =>
                              setEditingEventText(e.target.value)
                            }
                          />
                          <button
                            className="saveButton"
                            type="submit"
                            onClick={() => {
                              editEvent(editingEvent.id, editingEvent)
                              saveEditingEvent()
                              setEditingEvent(null)
                              setEditingEventText("")
                            }}
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div></div>
    </>
  )
}

export default DayView
