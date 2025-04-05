import { useState } from 'react';
import './Page1.css';

function Page1({ startTransition, onTransition  }) {
  const [searchStarted, setSearchStarted] = useState(false);

  const handleSearchClick = () => {
    setSearchStarted(true);
  
    // Așteptăm finalul tranziției înainte să trecem la Page2
    setTimeout(() => {
      onTransition(); // primit ca prop
    }, 1200); // egal cu durata animației din CSS
  };
  

  return (
    <div className={`hero-wrapper ${startTransition ? 'fade-bg' : ''}`}>
      {/* VIDEO fundal */}
      <div className="video-background">
        <video src="/video_prima_pg.mp4" autoPlay loop muted playsInline />
      </div>

      {/* Gradient peste video */}
      <div className="overlay" />

      {/* LOGO sus stânga */}
      {/* <div className={`logo-container ${searchStarted ? 'logo-shrink' : ''}`}>
        <img src="/logo-shift-happens.png" alt="Shift Happens Logo" />
      </div> */}

      {/* Conținut principal */}
      <div className={`hero-content ${searchStarted ? 'move-up' : ''}`}>
        {/* <h1 className={`fade-title ${searchStarted ? 'fade-out' : ''}`}>
          Precision  Connection  Care
        </h1>
        <p className={`fade-subtitle ${searchStarted ? 'fade-out' : ''}`}>
        Visualize relationships between medicines, genes, and conditions — intelligently
        </p> */}

        {/* <div className={`search-bar ${searchStarted ? 'search-up' : ''}`}>
          <input
            type="text"
            placeholder="Search gene, disease or drug..."
            className="search-input"
          />
          <button className="search-button" onClick={handleSearchClick}>
            ↓
          </button>
        </div> */}
      </div>

     
    </div>
  );
}

export default Page1;
