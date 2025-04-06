import { useState } from 'react';
import Page1 from './Page1';
import Page2 from './Page2';
import { getGeneInfo } from '../TV/GeneInfo';
import { getTop20GeneInteractions } from '../TV/GenetoDrugDetails';
import Chatbot from './Chatbot';
import {getGraphData} from "../TV/GraphData";
import async from "async";

function App() {
  const [showPage2, setShowPage2] = useState(false);
  const [startTransition, setStartTransition] = useState(false);
  const [gene, setGene] = useState('');
  const [geneInfo, setGeneInfo] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [graphJSON, setGraphJSON] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialSearchDone, setIsInitialSearchDone] = useState(false);


  const handleSearchClick = async () => {
    if (!isInitialSearchDone) {
      setStartTransition(true);

      // 🧠 Tranzitia vizuala
      setTimeout(async () => {
        setIsLoading(true);
        setGeneInfo(null);
        setDrugs([]);

        // 🔍 Fetch complet
        const interactions = await getTop20GeneInteractions(gene);
        const info = await getGeneInfo(gene);
        const graphData = await getGraphData(gene);
        // await fetchExtraData(gene, info);

        setGraphJSON(graphData);
        setDrugs(interactions);
        setGeneInfo(info);

        setShowPage2(true);
        setIsLoading(false);
        setIsInitialSearchDone(true); // 🔓 Cautare ulterioara fara animatie
      }, 1000);
    } else {
      // 🔁 Căutări ulterioare, fără animație dar cu fetch complet
      setIsLoading(true);

      const interactions = await getTop20GeneInteractions(gene);
      const info = await getGeneInfo(gene);
      const graphData = await getGraphData(gene);
      // await fetchExtraData(gene, info);

      setGraphJSON(graphData);
      setDrugs(interactions);
      setGeneInfo(info);

      setIsLoading(false);
    }
  };

  const setNodeFromGraph = async (name) => {
    if (!isInitialSearchDone) {
      setGene(name);
      setStartTransition(true);

      // 🧠 Tranzitia vizuala
      setTimeout(async () => {
        setIsLoading(true);
        setGeneInfo(null);
        setDrugs([]);

        // 🔍 Fetch complet
        const interactions = await getTop20GeneInteractions(name);
        const info = await getGeneInfo(name);
        const graphData = await getGraphData(name);
        // await fetchExtraData(gene, info);

        setGraphJSON(graphData);
        setDrugs(interactions);
        setGeneInfo(info);
        setGene(name)

        setShowPage2(true);
        setIsLoading(false);
        setIsInitialSearchDone(true); // 🔓 Cautare ulterioara fara animatie
      }, 1000);
    } else {
      // 🔁 Căutări ulterioare, fără animație dar cu fetch complet
      setIsLoading(true);

      const interactions = await getTop20GeneInteractions(name);
      const info = await getGeneInfo(name);
      const graphData = await getGraphData(name);
      // await fetchExtraData(gene, info);

      setGraphJSON(graphData);
      setDrugs(interactions);
      setGeneInfo(info);
      setGene(name)

      setIsLoading(false);
    }
  }

  // const handleSearchClick = async () => {
  //   if (!isInitialSearchDone) {
  //     setStartTransition(true);
  //
  //     setTimeout(async () => {
  //       setIsLoading(true);
  //       setGeneInfo(null);
  //       setDrugs([]);
  //
  //       const interactions = await getTop20GeneInteractions(gene);
  //       const info = await getGeneInfo(gene);
  //       const graphData = await getGraphData(gene);
  //       setGraph(graphData);
  //       setDrugs(interactions);
  //       setGeneInfo(info);
  //       setShowPage2(true);
  //       setIsLoading(false);
  //       setIsInitialSearchDone(true);
  //     }, 1000);
  //   } else {
  //     setIsLoading(true);
  //     const interactions = await getTop20GeneInteractions(gene);
  //     const info = await getGeneInfo(gene);
  //     setDrugs(interactions);
  //     setGeneInfo(info);
  //     setIsLoading(false);
  //   }
  // };
  //
  

  return (
    <>
      <div className={`logo-container ${startTransition ? 'logo-shrink' : ''}`}>
        <img src="/logo-shift-happens.png" alt="Shift Happens Logo" />
      </div>

      <div className={`intro-text ${startTransition ? 'fade-out' : ''}`}>
        <h1>Precision Connection Care</h1>
        <p>
          Visualize relationships between medicines, genes, and conditions — intelligently
        </p>
      </div>

      <div className={`search-bar-wrapper ${startTransition ? 'float-up white-theme' : ''}`}>
        <div className="search-bar match-style">
          <input
            type="text"
            placeholder="Search gene . . ."
            className="search-input"
            value={gene}
            onChange={(e) => setGene(e.target.value)}
          />
          <button className="search-button" onClick={handleSearchClick}>
            {startTransition ? '⌕' : '↓'}
          </button>
        </div>
      </div>

      {isLoading && isInitialSearchDone && (
      <div className="loading-overlay">
        <div className="loading-spinner">Loading...</div>
      </div>
    )}



      <div className={`app-wrapper ${startTransition ? 'fade-to-white' : ''}`}>
        {!showPage2 ? (
          <Page1 startTransition={startTransition} />
        ) : (
          <div className="page2-enter">
            <Page2
              gene={gene}
              geneInfo={geneInfo}
              drugs={drugs}
              graphJSON={graphJSON}
              setNodeFromGraph={setNodeFromGraph}
            />
          </div>
        )}
      </div>

      {showPage2 && <Chatbot/>}
      

    </>
  );
}

export default App;
