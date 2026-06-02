"use client";

import { useState } from "react";

export function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    newAssignment: { email: true, inApp: true, push: false },
    gradePosted: { email: true, inApp: true, push: true },
    deadlineReminder: { email: true, inApp: true, push: true },
    classAnnouncement: { email: false, inApp: true, push: false },
    enrollmentAlert: { email: true, inApp: true, push: false },
  });

  const handleToggle = (
    key: keyof typeof prefs,
    channel: "email" | "inApp" | "push",
  ) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [channel]: !prev[key][channel],
      },
    }));
  };

  const events = [
    { id: "newAssignment", label: "New assignment posted" },
    { id: "gradePosted", label: "Grade posted" },
    { id: "deadlineReminder", label: "Deadline reminder (24h)" },
    { id: "classAnnouncement", label: "Class announcement" },
    { id: "enrollmentAlert", label: "Enrollment alert" },
  ];

  return (
    <div className="m-settings-card">
      <div className="m-settings-card__header">
        <h3>Notification preferences</h3>
      </div>
      <div className="m-notifications-table">
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Email</th>
              <th>In-app</th>
              <th>Mobile push</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.label}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={prefs[event.id as keyof typeof prefs].email}
                    onChange={() =>
                      handleToggle(event.id as keyof typeof prefs, "email")
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={prefs[event.id as keyof typeof prefs].inApp}
                    onChange={() =>
                      handleToggle(event.id as keyof typeof prefs, "inApp")
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={prefs[event.id as keyof typeof prefs].push}
                    onChange={() =>
                      handleToggle(event.id as keyof typeof prefs, "push")
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
