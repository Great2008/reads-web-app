import React from 'react';

export default function Admin({ user, userDoc }) {
  if (!user) return <p>Please login to access admin panel.</p>;
  if (!userDoc || !userDoc.isAdmin) return <p>Access denied. You are not an admin.</p>;

  return (
    <section>
      <h2>Admin Panel</h2>
      <p>Welcome, admin. Use this panel to upload and manage content.</p>
    </section>
  );
}