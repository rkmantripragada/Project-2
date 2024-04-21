import mongoose from "mongoose"
await mongoose.connect("mongodb://localhost:27017/equinox")

const Schema = mongoose.Schema

// Define a Mongoose schema for dayEvent
const dayEventSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, "Date is required"],
  },

  eventTime: {
    type: String,
    required: true,
  },
  eventTitle: {
    type: String,
    required: [true, "Event name is required"],
  },
  place: {
    type: String,
    required: [true, "Please select a destination"],
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxLength: 140,
  },
})

const DayEvent = mongoose.model("day", dayEventSchema)

export async function getAllDayEvent() {
  return await DayEvent.find()
}

export async function getDayEventByTitle(eventTitle) {
  return await Event.findById(eventTitle)
    .populate({
      path: "user",
      select: "email _id -username",
    })
    .exec((err, event) => {
      if (err) {
        console.error("Error fetching event with user data....:...", err)
      } else {
        console.log("Event with populated user:.....: ", event)
      }
    })
}

export async function deleteDayEvent(eventTitle) {
  await DayEvent.findOneAndDelete({ eventTitle: eventTitle })
}

export async function addDayEvent(newDayEventData) {
  const created = new DayEvent(newDayEventData)
  await created.save()
  return created
}

//---------- DISCONNECT FROM DATABASE ----------//
// mongoose.disconnect()

export default DayEvent
