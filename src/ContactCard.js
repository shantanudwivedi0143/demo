import React, { useState } from 'react';

const ContactCard = ({ icon, title, description }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hovered
          ? '0 12px 25px rgba(0, 0, 0, 0.2)'
          : '0 8px 20px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.iconCircle}>
        {icon}
      </div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.description}>{description}</p>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#f6f6f6',
    padding: '30px',
    borderRadius: '15px',
    width: '250px',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    margin: '20px',
  },
  iconCircle: {
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
    fontSize: '36px',
    color: '#003b5b',
  },
  title: {
    marginBottom: '10px',
    color: '#111',
  },
  description: {
    color: '#444',
    fontSize: '14px',
  },
};

export default ContactCard;
