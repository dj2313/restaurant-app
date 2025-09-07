import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../firebase/config';
import './home.css';
import { Link } from "react-router-dom";
import paneer from './../Images/pexels-chanwalrus-941869.jpg';
import fire from './../Images/pexels-dainiktales-19834446.jpg';
import dal from './../Images/pexels-pixabay-209540.jpg'; 


function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [chefs, setChefs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const sliderContent = [
        {
            image: paneer,
            title: "Welcome to Dine Delight",
            subtitle: "Experience the best dining with us"
        },
        {
            image: fire,
            title: "Unique Dining Experience",
            subtitle: "Enjoy the finest cuisines"
        },
        {
            image: dal ,
            title: "Special Occasions",
            subtitle: "Make your moments memorable"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => 
                prevSlide === sliderContent.length - 1 ? 0 : prevSlide + 1
            );
        }, 6000); 

        return () => clearInterval(timer);
    }, []);

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

    const nextSlide = () => {
        setCurrentSlide(currentSlide === sliderContent.length - 1 ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? sliderContent.length - 1 : currentSlide - 1);
    };

    return (
        <div className="home-container"> {/* Add this div */}
            <div className="slider-container">
                <div className="slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {sliderContent.map((slide, index) => (
                        <div className="slide" key={index}>
                            <img src={slide.image} alt={`Slide ${index + 1}`} />
                            <div className="slide-content">
                                <h1>{slide.title}</h1>
                                <p>{slide.subtitle}</p>
                                {/* <button className="cta-button" onClick={MenuPage}><Link to='./menu'>
                                Explore Menu</Link></button> */}
                                <Link to="/menu" className="cta-button">Explore Menu</Link>

                            </div>
                        </div>
                    ))}
                </div>
                <button className="slider-button prev" onClick={prevSlide}>&#10094;</button>
                <button className="slider-button next" onClick={nextSlide}>&#10095;</button>
            </div>

            {/* Integrated WhyChooseUs Section */}
            {/* <WhyChooseUs /> */}

            <div className="chef-section">
                <h2>👨‍🍳 Meet Our Master Chefs</h2>
                <div className="chef-container">
                    {loading ? (
                        <p>Loading chefs...</p>
                    ) : chefs.length === 0 ? (
                        <p>No chefs available</p>
                    ) : (
                        chefs.map((chef) => (
                            <div key={chef.id} className="chef-card">
                                <img 
                                    src={chef.imageUrl} 
                                    alt={chef.name}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150?text=Chef+Image';
                                    }}
                                />
                                <h3>{chef.name}</h3>
                                <p className="speciality">{chef.speciality}</p>
                                <p>{chef.description}</p>
                                <p className="experience">{chef.experience} Years of Experience</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div> 
    );
}

export default Home;
