import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const victoryConditions = [
  { id: 1, name: "Recover Supplies", description: "Five treasures are placed on the board, the first in the centre and the remaining 4 placed 6 inches away along the central lines. After 4 rounds, the player with the most fighters carrying treasure wins." },
  { id: 2, name: "Secure the Intel", description: "Place 1 central treasure. The carrier takes damage 3 at the end of each activation. After 4 rounds, the player carrying it wins; otherwise, the player with the most fighters within 3\" of it wins." },
  { id: 3, name: "Hold Ground", description: "Divide the battlefield into 4 quarters. After 4 rounds, a player controls a quarter if they have more fighters within it than their opponent. The player controlling the most quarters wins." },
  { id: 4, name: "Capture Objectives", description: "Place 3 objective markers, one in the centre and the other two 8 inches away on either side along the long centre line. After 4 rounds, the player controlling the most objectives wins. A player controls an objective if they have more fighters within 3\" of it than their opponent." },
  { id: 5, name: "Assassinate Target", description: "The first player to take down the enemy Leader wins immediately." },
  { id: 6, name: "Attrition", description: "At the end of each Mission round, score 1 point if fewer of your fighters are damaged or taken down than your opponent. After 4 rounds, the player with the most points wins." },
];

const twists = [
  { roll: 2, name: "Night Raid", effect: "Fighters can only see up to 8\" for attack actions and abilites." },
  { roll: 3, name: "Heavy Fog", effect: "Add 1 to the Def characteristic of all fighters against ballistic skill attack actions." },
  { roll: 4, name: "Uneven Ground", effect: "Add 1 to the Def characteristic of fighters while they are within 1\" of an obstacle." },
  { roll: 5, name: "Defensive Position", effect: "Add 1 to the Def characteristic of fighters while they are within 1\" of another friendly fighter." },
  { roll: 6, name: "Disciplined Advance", effect: "Add 1 to the Move characteristic of all fighters during the first Mission round." },
  { roll: 7, name: "All Clear", effect: "No twist is in effect for this battle." },
  { roll: 8, name: "Lucky Break", effect: "Players gain an extra wild die at the start of the combat." },
  { roll: 9, name: "Favourable Winds", effect: "Add 2\" to the Range characteristic of ballistic skill attack actions (to a maximum of +3\")." },
  { roll: 10, name: "High Ground", effect: "Add 1 to the Strength characteristic of attack actions made by fighters that are on a platform above their target." },
  { roll: 11, name: "Battle Momentum", effect: "After taking down an enemy fighter, add 1 to the Move characteristic of that fighter until the end of their activation." },
  { roll: 12, name: "Maximum Effort", effect: "Once per battle, a player can re-roll all hit rolls for one attack action." },
];

const MissionGenerator = () => {
  const baseUrl = useBaseUrl('/');

  // 1. Load initial state from LocalStorage
  const [step, setStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mission_step');
      return saved !== null ? JSON.parse(saved) : 0;
    }
    return 0;
  });

  const [mission, setMission] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mission_data');
      return saved !== null ? JSON.parse(saved) : { victory: null, deploymentNum: null, twist: null };
    }
    return { victory: null, deploymentNum: null, twist: null };
  });

  // 2. Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('mission_step', JSON.stringify(step));
    localStorage.setItem('mission_data', JSON.stringify(mission));
  }, [step, mission]);

  const handleNextStep = () => {
    if (step === 0) {
      setMission({ ...mission, victory: victoryConditions[Math.floor(Math.random() * victoryConditions.length)] });
    } else if (step === 1) {
      setMission({ ...mission, deploymentNum: Math.floor(Math.random() * 6) + 1 });
    } else if (step === 2) {
      const roll = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
      setMission({ ...mission, twist: twists.find(t => t.roll === roll) });
    }
    setStep(step + 1);
  };

  const reset = () => {
    localStorage.removeItem('mission_step');
    localStorage.removeItem('mission_data');
    setStep(0);
    setMission({ victory: null, deploymentNum: null, twist: null });
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid var(--ifm-color-emphasis-300)', 
      borderRadius: '8px', 
      backgroundColor: 'var(--ifm-background-surface-color)',
      boxShadow: 'var(--ifm-global-shadow-lw)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--ifm-color-primary)', margin: 0 }}>Mission Randomizer</h2>
        {step > 0 && <button className="button button--secondary button--sm" onClick={reset}>Clear/Reset</button>}
      </div>
      <hr />

      {step >= 1 && mission.victory && (
        <div style={{ margin: '20px 0' }}>
          <h3>Victory: {mission.victory.name}</h3>
          <p>{mission.victory.description}</p>
        </div>
      )}

      {step >= 2 && mission.deploymentNum && (
        <div style={{ margin: '20px 0', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
          <h3>Deployment Map</h3>
          <img 
            src={`${baseUrl}img/missions/deployment${mission.deploymentNum}.png`} 
            alt={`Deployment ${mission.deploymentNum}`} 
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', border: '1px solid #444' }} 
          />
        </div>
      )}

      {step >= 3 && mission.twist && (
        <div style={{ margin: '20px 0', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
          <h3>Twist: {mission.twist.name}</h3>
          <p><em>{mission.twist.effect}</em></p>
        </div>
      )}

      {step < 3 && (
        <div style={{ marginTop: '30px' }}>
          <button className="button button--primary" onClick={handleNextStep}>
            {step === 0 ? "Generate Victory" : step === 1 ? "Generate Deployment" : "Generate Twist"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MissionGenerator;