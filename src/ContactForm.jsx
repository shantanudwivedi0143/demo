import React, { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);

    // ✅ Do email sending here (e.g., via API / EmailJS / backend)
    console.log('Form submitted:', formData);

    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Get in Touch</h2>
      {submitted && <p style={styles.success}>Your message has been sent!</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.name && <span style={styles.error}>{errors.name}</span>}

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <span style={styles.error}>{errors.email}</span>}

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.subject && <span style={styles.error}>{errors.subject}</span>}

        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          style={styles.textarea}
        />
        {errors.message && <span style={styles.error}>{errors.message}</span>}

        <button type="submit" style={styles.button}>Send Message</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '60px auto',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    backgroundColor: '#EBE3FA',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    height: '100px',
    resize: 'vertical',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1e90ff',
    color: '#fff',
    cursor: 'pointer',
    transition: '0.3s',
  },
  error: {
    color: 'red',
    fontSize: '13px',
    marginTop: '-10px',
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
  }
};
