import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Chefs.css';

const Chefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const chefsRef = collection(db, "chefs");
        const snapshot = await getDocs(chefsRef);
        const chefsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChefs(chefsList);
      } catch (error) {
        console.error("Error fetching chefs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  if (loading) {
    return <div className="chefs-container">Loading chefs...</div>;
  }

  return (
    <div className="chefs-container">
      <h2>Our Master Chefs</h2>
      <div className="chefs-grid">
        {chefs.map(chef => (
          <div key={chef.id} className="chef-card">
            <div className="chef-image">
              <img src={chef.imageUrl} alt={chef.name} />
            </div>
            <div className="chef-info">
              <h3>{chef.name}</h3>
              <p className="speciality">{chef.speciality}</p>
              <p className="experience">{chef.experience} Years of Experience</p>
              <p className="description">{chef.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chefs;