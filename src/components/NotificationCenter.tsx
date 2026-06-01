import React, { useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, AlertTriangle, Calendar, FileText, MessageCircle, Trash2 } from 'lucide-react';
import { useCareStore, Notification } from '../stores/careStore';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

const notifIcons: Record<string, React.ReactNode> = {
  new_booking: <Calendar className="w-4 h-4 text-blue-500" />,
  booking_accepted: <Check className="w-4 h-4 text-emerald-500" />,
  booking_completed: <CheckCheck className="w-4 h-4 text-violet-500" />,
  booking_cancelled: <X className="w-4 h-4 text-red-500" />,
  care_note_added: <FileText className="w-4 h-4 text-amber-500" />,
  alert_generated: <AlertTriangle className="w-4 h-4 text-red-500" />,
  new_message: <MessageCircle className="w-4 h-4 text-indigo-500" />,
  admin_message: <MessageCircle className="w-4 h-4 text-blue-600" />,
  admin_warning: <AlertTriangle className="w-4 h-4 text-amber-600" />,
};

const notifBg: Record<string, string> = {
  new_booking: 'bg-blue-50',
  booking_accepted: 'bg-emerald-50',
  booking_completed: 'bg-violet-50',
  booking_cancelled: 'bg-red-50',
  care_note_added: 'bg-amber-50',
  alert_generated: 'bg-red-50',
  new_message: 'bg-indigo-50',
  admin_message: 'bg-blue-100',
  admin_warning: 'bg-amber-100',
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({ open, onClose }) => {
  const {
    notifications,
    unreadNotificationCount,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useCareStore();

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!open) return null;

  const formatTime = (date: string | Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
      style={{ animation: 'dropdownFade 0.2s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-700" />
          <span className="font-semibold text-slate-800 text-sm">Notifications</span>
          {unreadNotificationCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {unreadNotificationCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadNotificationCount > 0 && (
            <button
              onClick={() => markAllNotificationsRead()}
              className="text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-500">No notifications yet</p>
            <p className="text-xs text-slate-400 mt-1">We'll notify you of important updates here</p>
          </div>
        ) : (
          notifications.map((notif: Notification) => (
            <div
              key={notif._id}
              className={`flex items-start gap-3 px-5 py-3.5 border-b border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer ${
                !notif.isRead ? 'bg-violet-50/40' : ''
              }`}
              onClick={() => !notif.isRead && markNotificationRead(notif._id)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notifBg[notif.type] || 'bg-slate-50'}`}>
                {notifIcons[notif.type] || <Bell className="w-4 h-4 text-slate-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium text-slate-800 leading-snug ${!notif.isRead ? 'font-semibold' : ''}`}>
                    {notif.title}
                  </p>
                  {!notif.isRead && (
                    <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                <p className="text-[10px] text-slate-400 mt-1">{formatTime(notif.createdAt)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-red-500 transition-all flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;
