import React, { useState, useEffect } from 'react';
import './page2.css';
import {getGeneInfo} from "../TV/GeneInfo";
import {getGraphData} from "../TV/GraphData";
import MyGraph from "../TV/MyGraph";
import {getDrugInfo} from "../TV/moreDrug";

const dummyDrugs = Array.from({ length: 15 }, (_, i) => ({
  name: `Drug${i + 1}`,
  score: (Math.random() * 0.5 + 0.5).toFixed(2)
}));

function Page2({ gene, geneInfo, drugs, graphJSON, setNodeFromGraph }) {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [drugInfoText, setDrugInfoText] =useState("")


    useEffect(() => {
        if (selectedDrug?.drug?.name) {
            getDrugInfo(selectedDrug.drug.name)
                .then((info) => setDrugInfoText(info))
                .catch(() => setDrugInfoText('Failed to fetch drug info.'));
        } else {
            setDrugInfoText('');
        }
    }, [selectedDrug]);
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
        <section className="graph-area" id="graphArea"
                 style={{
                     boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.1)', // umbră subtilă doar în dreapta și jos
                     borderRadius: '0 0 8px 0',
                     padding: '4px',
                     backgroundColor: '#f5faff',
                     paddingTop: "100px"
                 }}>
                <MyGraph
                    jsonData={graphJSON}
                    targetNode={gene}
                    setNodeFromGraph={setNodeFromGraph}/>
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
                <button onClick={() => setActiveTab('general')}><strong>General Info</strong></button>
                <button onClick={() => setActiveTab('purpose')}><strong>Purpose</strong></button>
                <button onClick={() => setActiveTab('genetic')}><strong>Genetic Info & Map Location</strong></button>
                <button onClick={() => setActiveTab('similar')}><strong>Related Genes</strong></button>
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
                    <strong>Recommended for:</strong> Gene{' '}
                    <strong>{gene?.toUpperCase?.() || 'N/A'}</strong>
                </p>

                <p>
                    <strong>Interaction Score:</strong>{' '}
                    {selectedDrug?.interactionScore?.toFixed?.(2) || 'N/A'}
                </p>

                <p><strong>General Info:</strong></p>
                <div style={{whiteSpace: 'pre-wrap'}}>
                    {drugInfoText}
                </div>


            </div>
        </div>
      )}

    </div>


  );


}

export default Page2;
