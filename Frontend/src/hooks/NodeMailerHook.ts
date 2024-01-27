import { useState } from 'react';
import apiClient from '../apiClient';

interface EmailData {
  to: string;
  subject: string;
  text: string;
}

const useEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (data: EmailData) => {
    setLoading(true);
    setError(null);

    try {
      // Replace '/api/send-email' with your actual endpoint
      await apiClient.post('/api/mail/send-email', data);
      console.log('Email sent successfully');
    } catch (err) {
      console.error('Error sending email:', err);
      setError(`'Failed to send email' ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return { sendEmail, loading, error };
};

export default useEmail;
