import React, { useState, useEffect } from 'react';
import './page2.css';

const dummyDrugs = Array.from({ length: 15 }, (_, i) => ({
  name: `Drug${i + 1}`,
  score: (Math.random() * 0.5 + 0.5).toFixed(2)
}));

function Page2({ gene, geneInfo, drugs }) {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [showModal, setShowModal] = useState(false);



  const renderBottomContent = () => {
    if (!geneInfo) {
      return <p>No gene info found. Try another one.</p>;
    }
  
    switch (activeTab) {
      case 'general':
        return (
          <div>
            <h3><strong>{gene?.toUpperCase?.() || 'Unknown Gene'}</strong></h3>
            <p><strong>Nomenclature Name:</strong> {geneInfo?.getNomenclatureName?.() || 'N/A'}</p>
            <p><strong>Summary:</strong> {geneInfo?.getSummary?.() || 'No summary available.'}</p>
          </div>
        );
  
      case 'purpose':
        return (
          <p>
            {/* Fallback la un mesaj standard dacă nu ai o funcție specifică */}
            Used in cancer treatment and gene expression regulation.
          </p>
        );
  
      case 'genetic':
        return (
          <>
            <p><strong>Genetic Source:</strong> {geneInfo?.getGeneticSource?.() || 'N/A'}</p>
            <p><strong>Map Location:</strong> {geneInfo?.getMapLocation?.() || 'N/A'}</p>
          </>
        );
  
      case 'similar':
        return (
          <p>{geneInfo?.getOtherAliases?.() || 'No related genes found.'}</p>
        );
  
      default:
        return null;
    }
  };
  
  
  return (
    <div className="container page2-enter">
  
      {/* Middle */}
      <main className="middle-section">
        <section className="graph-area" id="graphArea">
          {/* viitor graf */}
        </section>

        <section className="details-card">
          <h2>Drug Repurposer</h2>
          <ul className="drug-list">
  {drugs.map((interaction, i) => (
    <li key={i} onClick={() => {
      setSelectedDrug(interaction);
      setShowModal(true);
    }}>
    <strong>{interaction?.drug?.name || 'Unknown Drug'}</strong><br />
    Score: {interaction?.interactionScore?.toFixed?.(2) || 'N/A'}
    </li>
  ))}
</ul>


        </section>
      </main>

      {/* Tabs bottom */}
      <footer className="bottom-card">
      <div className="tabs">
  <button onClick={() => setActiveTab('general')}>General Info</button>
  <button onClick={() => setActiveTab('purpose')}>Purpose</button>
  <button onClick={() => setActiveTab('genetic')}>Genetic Info & Map Location</button>
  <button onClick={() => setActiveTab('similar')}>Related Genes</button>
</div>

        <div className="tab-content">
          {renderBottomContent()}
        </div>
      </footer>
      {showModal && selectedDrug && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            
            <h2>{selectedDrug?.drug?.name || 'Unknown Drug'}</h2>
            
            <p>
              <strong>Interaction Score:</strong>{' '}
              {selectedDrug?.interactionScore?.toFixed?.(2) || 'N/A'}
            </p>
            
            <p><strong>Status:</strong> Experimental / Predicted by DGIdb</p>
            
            <p>
              <strong>Recommended for:</strong> Gene{' '}
              <strong>{gene?.toUpperCase?.() || 'N/A'}</strong>
            </p>
          </div>
        </div>
      )}

    </div>
    


  );

  
}

export default Page2;
