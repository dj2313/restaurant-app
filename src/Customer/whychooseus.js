// import React from "react";
// import "./whychooseus.css";
// import { FaChartBar, FaGem, FaHamburger } from "react-icons/fa"; // Importing icons

// const WhyChooseUs = () => {
//   return (
//     <section className="why-choose-us">
//       <div className="content-box red-box">
//         <h2>Why Choose Dine Delight</h2>
//         <p>
//         Dine Delight offers a perfect blend of delicious cuisine, elegant ambiance, and exceptional service.
//         With fresh ingredients, diverse menu options, and a cozy atmosphere, we ensure a memorable dining experience.
//         </p>
//         <button className="learn-more-btn">Learn More &gt;</button>
//       </div>

//       <div className="feature-boxes">
//         <div className="feature-card">
//           <div className="feature-icon"><FaChartBar /></div>
//           <h3>Corporis voluptates officia eiusmod</h3>
//           <p>Consequuntur sunt aut quasi enim aliquam quae harum pariatur laboris nisi ut aliquip</p>
//         </div>

//         <div className="feature-card">
//           <div className="feature-icon"><FaGem /></div>
//           <h3>Ullamco laboris ladore lore pan</h3>
//           <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt</p>
//         </div>

//         <div className="feature-card">
//           <div className="feature-icon"><FaHamburger /></div>
//           <h3>Labore consequatur incidid dolore</h3>
//           <p>Aut suscipit aut cum nemo deleniti aut omnis. Doloribus ut maiores omnis facere</p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhyChooseUs;


import React from "react";
import "./whychooseus.css"; 
import { FaChartBar, FaGem, FaHamburger } from "react-icons/fa"; // Import icons

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      <div className="content-box red-box">
        <h2>Why Choose Dine Delight</h2>
        <p>
        Dine Delight offers a perfect blend of delicious cuisine, elegant ambiance, and exceptional service.
         With fresh ingredients, diverse menu options, and a cozy atmosphere, we ensure a memorable dining experience.
        </p>
        <button className="learn-more-btn">Learn More &gt;</button>
      </div>

      <div className="feature-boxes">
        <div className="feature-card">
          <div className="feature-icon"><FaChartBar /></div>
          <h3>Corporis voluptates officia eiusmod</h3>
          <p>Consequuntur sunt aut quasi enim aliquam quae harum pariatur laboris nisi ut aliquip</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><FaGem /></div>
          <h3>Ullamco laboris ladore lore pan</h3>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon"><FaHamburger /></div>
          <h3>Labore consequatur incidid dolore</h3>
          <p>Aut suscipit aut cum nemo deleniti aut omnis. Doloribus ut maiores omnis facere</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
