import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase/config';
import './AdminReview.css';
import { FaThumbsUp, FaThumbsDown, FaTrash } from 'react-icons/fa';
import Admin_nav from './Admin_nav';

function AdminReview() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const feedbackCollection = collection(db, 'feedback');
      const feedbackSnapshot = await getDocs(feedbackCollection);
      const feedbackData = feedbackSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedbackList(feedbackData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const feedbackDoc = doc(db, 'feedback', id);
      await updateDoc(feedbackDoc, { status });
      setSelectedStatus((prevStatus) => ({ ...prevStatus, [id]: status }));
      alert('Review status stored successfully!');
    } catch (error) {
      console.error('Error updating review status:', error);
      alert('Failed to store review status. Please try again.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteDoc(doc(db, 'feedback', id));
        setFeedbackList((prevList) => prevList.filter((feedback) => feedback.id !== id));
        alert('Review deleted successfully!');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  return (
    <>
      <Admin_nav />
      <section className="admin-review">
        <h1>Customer Feedback </h1>
        <div className="feedback-list">
          {feedbackList.length > 0 ? (
            feedbackList.map((feedback) => (
              <div key={feedback.id} className="feedback-card">
                <h3>{feedback.name}</h3>
                <p><strong>Email:</strong> {feedback.email}</p>
                <p><strong>Phone:</strong> {feedback.phone}</p>
                <p><strong>Message:</strong> {feedback.message}</p>
                <div className="feedback-actions">
                  <button 
                    className={`thumbs-up ${selectedStatus[feedback.id] === 'helpful' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(feedback.id, 'helpful')}
                  >
                    <FaThumbsUp /> Helpful
                  </button>
                  <button 
                    className={`thumbs-down ${selectedStatus[feedback.id] === 'not helpful' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(feedback.id, 'not helpful')}
                  >
                    <FaThumbsDown /> Not Helpful
                  </button>
                 
                </div>
                <button 
                    className="delete-button"
                    onClick={() => handleDeleteReview(feedback.id)}
                  >
                    <FaTrash /> Delete
                  </button>
              </div>
            ))
          ) : (
            <p>No feedback available.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default AdminReview;
