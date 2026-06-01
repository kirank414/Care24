import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: "new_booking" | "booking_accepted" | "booking_completed" | "care_note_added" | "alert_generated" | "booking_cancelled" | "new_message" | "admin_message" | "admin_warning";
  title: string;
  message: string;
  relatedId?: mongoose.Types.ObjectId;
  relatedModel?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["new_booking", "booking_accepted", "booking_completed", "care_note_added", "alert_generated", "booking_cancelled", "new_message", "admin_message", "admin_warning"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedId: { type: Schema.Types.ObjectId, default: null },
    relatedModel: { type: String, default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);
