import mongoose from "mongoose";
import dotenv from "dotenv";
import CareNote from "./models/CareNote.js";

dotenv.config();

async function checkKiranNotes() {
  const MONGODB_URI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to DB!");

    const notes = await CareNote.find({ patient: "6a156ce7eddc83af8e081452" });
    console.log(`Found ${notes.length} notes for K KIRAN directly:`);
    console.log(JSON.stringify(notes, null, 2));

    const notesByBooking = await CareNote.find({ booking: "6a156d4ceddc83af8e081453" });
    console.log(`Found ${notesByBooking.length} notes for booking 6a156d4ceddc83af8e081453:`);
    console.log(JSON.stringify(notesByBooking, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
}

checkKiranNotes();
