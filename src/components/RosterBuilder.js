import React, { useState, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { TraitLink } from './Engine';

/**
 * UTILITY COMPONENTS & FUNCTIONS
 */

const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => { cancelAnimationFrame(animation); setEnabled(false); };
  }, []);
  if (!enabled) return null;
  return <Droppable {...props}>{children}</Droppable>;
};

const SafeTraitLink = ({ trait, traits, basePath }) => {
  if (typeof TraitLink !== 'undefined' && TraitLink) {
    return <TraitLink trait={trait} traits={traits} basePath={basePath} />;
  }
  return <span>{trait}</span>;
};

const groupItems = (items) => {
  const activeItems = items.filter(i => !i.suppressed);
  const counts = activeItems.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(counts).map(name => ({
    name,
    count: counts[name],
    originalItem: activeItems.find(i => i.name === name)
  }));
};

const getModifiedStat = (fighter, statKey) => {
  const baseStat = parseInt(fighter[statKey]) || 0;
  const bonus = (fighter.selectedExtras || [])
    .filter(e => !e.suppressed)
    .reduce((sum, item) => {
      return sum + (parseInt(item[statKey]) || 0);
    }, 0);
  
  const finalValue = baseStat + bonus;

  // Ensure stats like M, WS, BS, etc., do not drop below 2
  // We check if the baseStat was higher than 0 to avoid affecting non-existent stats
  if (baseStat > 0 && finalValue < 2) {
    return 2;
  }

  return finalValue < 0 ? 0 : finalValue;
};

/**
 * HOISTED ROW COMPONENT
 */
const FighterRow = ({ 
  f, 
  provided, 
  isDraggable, 
  activeTab, 
  isDeployed, 
  updateFighterName, 
  addItem, 
  allWeapons, 
  gearOptions, 
  abilityOptions, 
  advancementOptions, 
  injuryOptions, 
  isAvailableForFighter, 
  allTraitsData, 
  basePath, 
  removeItem, 
  getDisplayCost,
  duplicateFighter, 
  removeFighter, 
  moveToGroup,
  namesData // NEW: Access to names from data.json
}) => {

  const [rollResult, setRollResult] = useState(null); // Track the roll for the subtle UI

    // Automatically clear the message after 3 seconds
    useEffect(() => {
      if (rollResult) {
        const timer = setTimeout(() => setRollResult(null), 3000);
        return () => clearTimeout(timer);
      }
    }, [rollResult]);

  const handleRollInjury = () => {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const roll = parseInt(`${die1}${die2}`);

    let injuryName = "";

    // Exact string matches for your data.json
    if (roll >= 11 && roll <= 13) injuryName = "Death";
    else if (roll >= 14 && roll <= 16) injuryName = "Miss next mission";
    else if (roll >= 21 && roll <= 23) injuryName = "▼ Gut Wound";
    else if (roll >= 24 && roll <= 26) injuryName = "▼ Cracked Rib";
    else if (roll >= 31 && roll <= 33) injuryName = "▼ Eye Injury";
    else if (roll >= 34 && roll <= 36) injuryName = "▼ Broken Arm";
    else if (roll >= 41 && roll <= 43) injuryName = "▼ Leg Fracture";
    else if (roll >= 44 && roll <= 46) injuryName = "▼ Head Trauma";
    else if (roll >= 51 && roll <= 65) injuryName = "Flesh Wound";
    else if (roll === 66) injuryName = "Lucky Escape";

    if (injuryName) {
      // addItem will now find the match in allTraitsData
      addItem(f.instanceId, injuryName, 'extra'); 
      setRollResult({ roll, name: injuryName });
    }
  };

 const handleRandomName = () => {
  // 1. Find the correct faction bucket or fallback to Universal
  const factionData = namesData?.[f.faction] || namesData?.["Universal"];
  
  // 2. If no data exists at all, exit early
  if (!factionData) return;

  // 3. Pick First Name (check if array exists and has items)
  const firstList = factionData.first || [];
  const randomFirst = firstList.length > 0 
    ? firstList[Math.floor(Math.random() * firstList.length)] 
    : "";
  
  // 4. Pick Last Name (check if array exists and has items)
  const lastList = factionData.last || [];
  const randomLast = lastList.length > 0 
    ? lastList[Math.floor(Math.random() * lastList.length)] 
    : "";
  
  // 5. Combine and trim (prevents weird spacing if one is missing)
  const fullName = `${randomFirst} ${randomLast}`.trim();

  if (fullName) {
    updateFighterName(f.instanceId, fullName);
  }
};

  return (
    <tr 
      ref={provided?.innerRef} 
      {...(provided?.draggableProps || {})} 
      className={isDeployed ? 'deployed-row' : ''} 
      style={{ borderBottom: '1px solid var(--ifm-color-emphasis-300)', ...(provided?.draggableProps?.style || {}) }}
    >
      <td style={{ textAlign: 'left', padding: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input 
            className="editable-input" 
            style={{ fontWeight: 'bold', fontSize: '1rem', flex: 1 }} 
            value={f.customName} 
            onChange={(e) => updateFighterName(f.instanceId, e.target.value)}
          />
          {/* NEW: Dice button for name generation */}
          {!isDeployed && (
            <button 
              className="no-print action-btn-text name-gen-btn" 
              onClick={handleRandomName}
              title="Randomize Name"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px' }}
            >
              🎲
            </button>
          )}
          {isDeployed && <span className="deployed-badge">{f.groupId}</span>}
        </div>
        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{f.name}</div>
        {activeTab === 'build' && !isDeployed && (
          <div className="no-print" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <select onChange={(e) => addItem(f.instanceId, e.target.value, 'weapon')} value="" style={{ fontSize: '0.7rem' }}>
              <option value="" disabled>+ Weapon</option>
              {allWeapons.filter(w => isAvailableForFighter(w, f)).sort((a,b) => a.name.localeCompare(b.name)).map(w => <option key={w.name} value={w.name}>{w.name} ({w.cost})</option>)}
            </select>
            <select onChange={(e) => addItem(f.instanceId, e.target.value, 'extra')} value="" style={{ fontSize: '0.7rem' }}>
              <option value="" disabled>+ Gear</option>
              {gearOptions.filter(g => isAvailableForFighter(g, f)).sort((a,b) => a.name.localeCompare(b.name)).map(g => <option key={g.name} value={g.name}>{g.name} ({g.cost})</option>)}
            </select>
            <select onChange={(e) => addItem(f.instanceId, e.target.value, 'extra')} value="" style={{ fontSize: '0.7rem' }}>
              <option value="" disabled>+ Ability</option>
              {abilityOptions.filter(a => isAvailableForFighter(a, f)).sort((a,b) => a.name.localeCompare(b.name)).map(a => <option key={a.name} value={a.name}>{a.name} ({a.cost})</option>)}
            </select>
            <select onChange={(e) => addItem(f.instanceId, e.target.value, 'extra')} value="" style={{ fontSize: '0.7rem' }}>
              <option value="" disabled>+ Advancement</option>
              {advancementOptions.filter(adv => isAvailableForFighter(adv, f)).sort((a,b) => a.name.localeCompare(b.name)).map(adv => <option key={adv.name} value={adv.name}>{adv.name} ({adv.cost})</option>)}
            </select>
            <select onChange={(e) => addItem(f.instanceId, e.target.value, 'extra')} value="" style={{ fontSize: '0.7rem' }}>
              <option value="" disabled>+ Injury</option>
              {injuryOptions.filter(i => isAvailableForFighter(i, f)).sort((a,b) => a.name.localeCompare(b.name)).map(i => <option key={i.name} value={i.name}>{i.name} ({i.cost})</option>)}
            </select>
          </div>
        )}
      </td>
      <td>{getModifiedStat(f, 'm')}</td><td>{getModifiedStat(f, 'ws') === 0 ? '-' : `${getModifiedStat(f, 'ws')}`}</td>
      <td>{getModifiedStat(f, 'bs') === 0 ? '-' : `${getModifiedStat(f, 'bs')}`}</td><td>{getModifiedStat(f, 'def')}</td><td>{getModifiedStat(f, 'w')}</td>
    <td style={{ textAlign: 'left', padding: '10px' }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
      {(Array.isArray(f.traits) ? f.traits : [f.traits])
        .filter(t => t !== "-")
        .sort((a, b) => a.localeCompare(b))
        .map((t, i) => (
          <span key={`trait-${i}`} className="trait-pill">
            <SafeTraitLink trait={t} traits={allTraitsData} basePath={basePath} />
          </span>
        ))
      }
      {groupItems(f.selectedWeapons || [])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((grouped, i) => (
          <span key={`w-${i}`} className="trait-pill inline-flex">
            {grouped.count > 1 && <span>{grouped.count}x </span>}
            <SafeTraitLink trait={grouped.name} traits={allTraitsData} basePath={basePath} />
            <span style={{ marginLeft: '4px' }}>({grouped.originalItem.cost})</span>
            <span className="no-print remove-btn" onClick={() => removeItem(f.instanceId, grouped.name, 'weapon')}>×</span>
          </span>
        ))
      }
      {groupItems(f.selectedExtras || [])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((grouped, i) => (
          <span key={`e-${i}`} className="trait-pill inline-flex">
            {grouped.count > 1 && <span>{grouped.count}x </span>}
            <SafeTraitLink trait={grouped.name} traits={allTraitsData} basePath={basePath} />
            <span style={{ marginLeft: '4px' }}>({grouped.originalItem.cost})</span>
            <span className="no-print remove-btn" onClick={() => removeItem(f.instanceId, grouped.name, 'extra')}>×</span>
          </span>
        ))
      }
    </div>
  </td>
      <td style={{ fontWeight: 'bold' }}>{getDisplayCost(f)}</td>
  <td className="no-print">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
          {isDraggable && <div {...provided.dragHandleProps} style={{ cursor: 'grab', fontSize: '1.2rem', opacity: 0.5 }}>⠿</div>}
          
          {/* Subtle Notification Overlay */}
          {rollResult && (
            <div style={{
              position: 'absolute',
              top: '-10px',
              background: 'var(--ifm-color-primary)',
              color: 'black',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10,
              animation: 'fadeInOut 3s forwards'
            }}>
              🎲 {rollResult.roll}: {rollResult.name}
            </div>
          )}
          
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            {!isDeployed && activeTab === 'build' ? (
              <>
                <button className="action-btn-text field-btn" onClick={() => moveToGroup(f.instanceId, 'A')}>Field</button>
                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                  {['A', 'B', 'C'].map(group => (
                    <button
                      key={group}
                      className={`action-btn-text group-select-btn ${f.groupId === group ? 'active' : ''}`}
                      onClick={() => moveToGroup(f.instanceId, group)}
                      disabled={f.groupId === group}
                      style={{ flex: 1 }}
                    >
                      {group}
                    </button>
                  ))}
                </div>
                <button className="action-btn-text copy-btn" onClick={() => duplicateFighter(f)}>Copy</button>

                <button className="action-btn-text injury-btn" onClick={handleRollInjury}>Roll Injury</button>

                <button className="action-btn-text del-btn" onClick={() => removeFighter(f.instanceId)}>Del</button>
              </>
            ) : (
              <>
                <button className="action-btn-text return-btn" onClick={() => moveToGroup(f.instanceId, 'Roster')}>Return</button>
                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                  {['A', 'B', 'C'].map(group => (
                    <button
                      key={group}
                      className={`action-btn-text group-select-btn ${f.groupId === group ? 'active' : ''}`}
                      onClick={() => moveToGroup(f.instanceId, group)}
                      disabled={f.groupId === group}
                      style={{ flex: 1 }}
                    >
                      {group}
                    </button>
                  ))}
                </div>
                <button className="action-btn-text copy-btn" disabled>Copy</button>
                <button className="action-btn-text injury-btn" onClick={handleRollInjury}>Roll Injury</button>
                <button className="action-btn-text del-btn" disabled>Del</button>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

/**
 * MAIN COMPONENT
 */
export const RosterBuilder = ({ fighters = [], weapons = [], traits = [], names = {}, basePath, storageKey = 'default_roster' }) => {
  const [activeTab, setActiveTab] = useState('build'); 
  
  // 1. Initialize state from LocalStorage or use defaults
  const [roster, setRoster] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_roster_data`);
    return saved ? JSON.parse(saved) : [];
  });

  const [masterRosterName, setMasterRosterName] = useState(() => {
    return localStorage.getItem(`${storageKey}_master_name`) || 'My Master Roster';
  });

  const [warbandName, setWarbandName] = useState(() => {
    return localStorage.getItem(`${storageKey}_warband_name`) || 'My Active Warband';
  });

  const [selectedFaction, setSelectedFaction] = useState(() => {
    return localStorage.getItem(`${storageKey}_faction`) || '';
  });

  const [houseRulesOverride, setHouseRulesOverride] = useState(() => {
    return localStorage.getItem(`${storageKey}_house_rules`) === 'true';
  });

  // 2. Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(`${storageKey}_roster_data`, JSON.stringify(roster));
    localStorage.setItem(`${storageKey}_master_name`, masterRosterName);
    localStorage.setItem(`${storageKey}_warband_name`, warbandName);
    localStorage.setItem(`${storageKey}_faction`, selectedFaction);
    localStorage.setItem(`${storageKey}_house_rules`, houseRulesOverride);
  }, [roster, masterRosterName, warbandName, selectedFaction, houseRulesOverride, storageKey]);

  // ... rest of your component logic ...

  const allFighters = fighters;
  const allWeapons = weapons;
  const allTraitsData = traits;

  const parseCost = (costVal, useWarbandCost = false) => {
    if (!costVal || costVal === "-") return 0;
    const s = String(costVal);
    if (s.includes('/')) {
      const parts = s.split('/').map(p => p.trim());
      return useWarbandCost ? (parseInt(parts[0]) || 0) : (parseInt(parts[1]) || 0);
    }
    return parseInt(s) || 0;
  };

  const factions = [...new Set(allFighters.flatMap(f => f.faction))].sort();
  const availableFighters = allFighters.filter(f => {
    if (Array.isArray(f.faction)) return f.faction.includes(selectedFaction);
    return f.faction === selectedFaction;
  });

    const isAvailableForFighter = (item, fighter) => {
    if (houseRulesOverride) return true;
    const itemType = item.type?.toLowerCase() || '';
    if (itemType === 'advancement' || itemType === 'injury') return true;
    if (itemType === 'universal-gear') return true;
    const isAllowedItem = fighter.allowed_items?.includes(item.name);
    const isAllowedTalent = fighter.talents?.includes(itemType);
    return isAllowedItem || isAllowedTalent;
  };

  const gearOptions = allTraitsData.filter(t => 
    t.type?.toLowerCase() === 'gear' || t.type?.toLowerCase() === 'universal-gear'
  );
  const abilityOptions = allTraitsData.filter(t => {
    const type = t.type?.toLowerCase() || '';
    return type === 'fighter-trait' || type.endsWith('-talent');
  });
  const advancementOptions = allTraitsData.filter(t => t.type?.toLowerCase() === 'advancement');
  const injuryOptions = allTraitsData.filter(t => t.type?.toLowerCase() === 'injury');

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setRoster((prev) => {
      const newRoster = [...prev];
      const sourceGroup = newRoster.filter(f => f.groupId === source.droppableId);
      const movedFighter = sourceGroup[source.index];
      const globalRemoveIdx = newRoster.findIndex(f => f.instanceId === movedFighter.instanceId);
      newRoster.splice(globalRemoveIdx, 1);
      
      movedFighter.groupId = destination.droppableId;

      if (destination.droppableId === 'Roster') {
        if (movedFighter.selectedWeapons) movedFighter.selectedWeapons.forEach(w => delete w.suppressed);
        if (movedFighter.selectedExtras) movedFighter.selectedExtras.forEach(e => delete e.suppressed);
      }

      const destGroup = newRoster.filter(f => f.groupId === destination.droppableId);
      const pivot = destGroup[destination.index];
      if (pivot) {
        const globalInsertIdx = newRoster.findIndex(f => f.instanceId === pivot.instanceId);
        newRoster.splice(globalInsertIdx, 0, movedFighter);
      } else {
        const lastInDestIdx = newRoster.findLastIndex(f => f.groupId === destination.droppableId);
        newRoster.splice(lastInDestIdx + 1, 0, movedFighter);
      }
      return newRoster;
    });
  };

  const saveToFile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ masterRosterName, warbandName, selectedFaction, roster, houseRulesOverride }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${warbandName.replace(/\s+/g, '_')}_roster.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (json.masterRosterName) setMasterRosterName(json.masterRosterName);
        if (json.warbandName) setWarbandName(json.warbandName);
        if (json.selectedFaction) setSelectedFaction(json.selectedFaction);
        if (json.houseRulesOverride !== undefined) setHouseRulesOverride(json.houseRulesOverride);
        setRoster(json.roster || []);
      } catch (err) { alert("Error loading file."); }
    };
    reader.readAsText(file);
  };

  const addFighter = (template) => {
    const newFighter = {
      ...template,
      customName: template.name, 
      instanceId: Math.random().toString(36).substr(2, 9),
      groupId: 'Roster', 
      selectedWeapons: [], 
      selectedExtras: []   
    };

    if (template.starting_gear && Array.isArray(template.starting_gear)) {
      template.starting_gear.forEach(itemName => {
        const weaponData = allWeapons.find(w => w.name === itemName);
        if (weaponData) {
          newFighter.selectedWeapons.push({ ...weaponData });
        } else {
          const gearData = allTraitsData.find(g => g.name === itemName);
          if (gearData) {
            newFighter.selectedExtras.push({ ...gearData });
          }
        }
      });
    }

    setRoster(prev => [...prev, newFighter]);
  };

  const updateFighterName = (id, newName) => {
    setRoster(prev => prev.map(f => f.instanceId === id ? { ...f, customName: newName } : f));
  };

  const duplicateFighter = (fighter) => {
    setRoster(prev => [...prev, { ...fighter, instanceId: Math.random().toString(36).substr(2, 9) }]);
  };

  const removeFighter = (id) => setRoster(prev => prev.filter(f => f.instanceId !== id));

  const moveToGroup = (id, targetGroup = 'A') => {
    setRoster(prev => prev.map(f => {
      if (f.instanceId === id) {
        const updated = { ...f, groupId: targetGroup };
        if (targetGroup === 'Roster') {
          if (updated.selectedWeapons) updated.selectedWeapons.forEach(w => delete w.suppressed);
          if (updated.selectedExtras) updated.selectedExtras.forEach(e => delete e.suppressed);
        }
        return updated;
      }
      return f;
    }));
  };

  const addItem = (instanceId, itemName, listType) => {
    const sourceList = listType === 'weapon' ? allWeapons : allTraitsData;
    const item = sourceList.find(i => i.name === itemName);
    if (!item) return;
    setRoster(prev => prev.map(f => {
      if (f.instanceId === instanceId) {
        const newItem = { ...item }; 
        return listType === 'weapon' 
          ? { ...f, selectedWeapons: [...(f.selectedWeapons || []), newItem] }
          : { ...f, selectedExtras: [...(f.selectedExtras || []), newItem] };
      }
      return f;
    }));
  };
  
  const removeItem = (instanceId, itemName, listType) => {
    setRoster(prev => prev.map(f => {
      if (f.instanceId === instanceId) {
        const key = listType === 'weapon' ? 'selectedWeapons' : 'selectedExtras';
        const newList = [...f[key]];
        
        if (activeTab === 'build') {
          // Find the index of the first item that matches the name
          const targetIndex = newList.findIndex(item => item.name === itemName);
          if (targetIndex !== -1) {
            newList.splice(targetIndex, 1);
          }
        } else {
          // Handle suppression for Warband mode
          const activeItems = newList.filter(i => !i.suppressed);
          const itemToSuppress = activeItems.find(i => i.name === itemName);
          const realIndex = newList.findIndex(i => i === itemToSuppress);
          if (realIndex !== -1) {
            newList[realIndex] = { ...newList[realIndex], suppressed: true };
          }
        }
        return { ...f, [key]: newList };
      }
      return f;
    }));
  };

  const calculateFighterTotal = (f, useWarband = false) => {
    const baseCost = parseCost(f.cost, useWarband);
    const activeWeapons = (f.selectedWeapons || []).filter(w => !w.suppressed);
    let weaponCost = 0;
    if (activeWeapons.length > 0) {
      if (useWarband) {
        weaponCost = Math.max(...activeWeapons.map(w => parseCost(w.cost, true)));
      } else {
        weaponCost = activeWeapons.reduce((sum, w) => sum + parseCost(w.cost, false), 0);
      }
    }
    const eCost = (f.selectedExtras || []).filter(e => !e.suppressed).reduce((sum, e) => sum + parseCost(e.cost, useWarband), 0);
    return baseCost + weaponCost + eCost;
  };

  const getDisplayCost = (f) => {
    const rosterCost = calculateFighterTotal(f, false);
    const warbandCost = calculateFighterTotal(f, true);
    if (activeTab === 'build') {
      return (rosterCost !== warbandCost) ? `${warbandCost}/${rosterCost}` : warbandCost;
    }
    return warbandCost;
  };

  const warbandTotalPoints = roster
    .filter(f => ['A', 'B', 'C'].includes(f.groupId))
    .reduce((acc, f) => acc + calculateFighterTotal(f, true), 0);

  const armorySummary = useMemo(() => {
    const seen = new Set();
    const list = [];
    roster.forEach(f => {
      if (activeTab === 'warband' && f.groupId === 'Roster') return;
      const allFighterWeapons = (f.selectedWeapons || []).filter(w => !w.suppressed);
      (Array.isArray(f.traits) ? f.traits : []).forEach(tName => {
        const wMatch = allWeapons.find(w => w.name === tName);
        if (wMatch) allFighterWeapons.push(wMatch);
      });
      allFighterWeapons.forEach(w => {
        if (!seen.has(w.name)) { seen.add(w.name); list.push(w); }
      });
    });
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [roster, allWeapons, activeTab]);

  
  const uniqueTraitData = useMemo(() => {
    const rosterNames = new Set();
    roster.forEach(f => {
      if (activeTab === 'warband' && f.groupId === 'Roster') return;
      const ft = Array.isArray(f.traits) ? f.traits : [f.traits];
      ft.forEach(t => { if (t && t !== "-") rosterNames.add(t.trim()); });
      (f.selectedExtras || []).filter(e => !e.suppressed).forEach(e => rosterNames.add(e.name.trim()));
    });
    armorySummary.forEach(w => {
      const wt = Array.isArray(w.traits) ? w.traits : [w.traits];
      wt.forEach(t => { if (t && t !== "-") rosterNames.add(t.trim()); });
    });
    return allTraitsData
      .filter(t => (t.type?.toLowerCase() === 'universal' || rosterNames.has(t.name)))
      .map(t => ({
        ...t,
        displayType: t.type ? t.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Trait"
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); 
  }, [roster, armorySummary, allTraitsData, activeTab]);

  const standardBtnStyle = {
    padding: '6px 14px', cursor: 'pointer', backgroundColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-color-content)', border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold'
  };

  return (
    <div className="roster-builder-main-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>{`
        @media print { 
          body * { visibility: hidden; }
          .roster-builder-main-container, .roster-builder-main-container * { visibility: visible; }
          .roster-builder-main-container { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; } 
          .reference-container { break-before: page; margin-top: 0 !important; display: block !important; }
          input { border: none !important; background: transparent !important; padding: 0 !important; }
          body { background: white !important; color: black !important; }
        }
        .editable-input { border: 1px solid transparent; background: transparent; color: inherit; font-family: inherit; width: 100%; }
        .editable-input:hover { border-bottom: 1px dashed var(--ifm-color-primary); }
        .trait-pill { background-color: var(--ifm-color-emphasis-200); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; display: inline-block; }
        .trait-pill a { text-decoration: none !important; color: inherit !important; }
        .inline-flex { display: inline-flex; align-items: center; }
        .remove-btn { margin-left: 6px; cursor: pointer; color: var(--ifm-color-danger); font-weight: bold; }
        .group-header { 
          background-color: var(--ifm-color-emphasis-200); padding: 8px 15px; margin-top: 30px; 
          font-weight: bold; text-transform: uppercase; border-bottom: 2px solid var(--ifm-color-emphasis-300);
          display: flex; justify-content: space-between; font-size: 0.9rem;
        }
        .tab-button { padding: 10px 20px; cursor: pointer; border: none; background: var(--ifm-color-emphasis-200); font-weight: bold; border-radius: 4px 4px 0 0; }
        .tab-button.active { background: var(--ifm-color-primary); color: #000; }
        .action-btn-text { font-size: 0.65rem; padding: 3px 8px; border: none; border-radius: 3px; font-weight: bold; cursor: pointer; text-transform: uppercase; transition: filter 0.1s ease; }
        .field-btn { background-color: #28a745; color: white; }
        .return-btn { background-color: #ffc107; color: black; }
        .copy-btn { background-color: var(--ifm-color-emphasis-300); color: var(--ifm-color-content); }
        .del-btn { background-color: var(--ifm-color-danger); color: white; }
        .name-gen-btn:hover { filter: brightness(1.2); }
        .action-btn-text:disabled { opacity: 0.3; cursor: not-allowed; filter: grayscale(1); }
        .action-btn-text:hover:not(:disabled) { filter: brightness(1.1); }
        .deployed-row { opacity: 0.8; background-color: var(--ifm-color-emphasis-100); }
        .deployed-badge { font-size: 0.6rem; background: var(--ifm-color-primary); color: #000; padding: 1px 4px; border-radius: 3px; margin-left: 5px; vertical-align: middle; font-weight: bold; }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{ display: 'flex', gap: '15px', padding: '12px', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', flexWrap: 'wrap', alignItems: 'center', border: '1px solid var(--ifm-color-emphasis-300)' }}>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select value={selectedFaction} onChange={(e) => setSelectedFaction(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px' }}>
            <option value="">-- Select Faction --</option>
            {factions.map(fac => <option key={fac} value={fac}>{fac}</option>)}
          </select>
        </div>
        <button style={standardBtnStyle} onClick={saveToFile}>💾 Save</button>
        <label style={{ ...standardBtnStyle, display: 'inline-block', margin: 0 }}>
          📂 Load <input type="file" onChange={loadFromFile} style={{ display: 'none' }} accept=".json" />
        </label>
        <button style={standardBtnStyle} onClick={() => window.print()}>🖨️ PDF</button>
        <button style={{ ...standardBtnStyle, backgroundColor: 'var(--ifm-color-danger)', color: 'white' }} onClick={() => { if(window.confirm("Clear roster?")) setRoster([]); }}>🗑️ Reset</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', backgroundColor: 'var(--ifm-color-emphasis-200)', padding: '4px 10px', borderRadius: '4px' }}>
            <input type="checkbox" id="houseRules" checked={houseRulesOverride} onChange={(e) => setHouseRulesOverride(e.target.checked)} />
            <label htmlFor="houseRules" style={{ fontWeight: 'bold', cursor: 'pointer' }}>🏠 House Rules</label>
        </div>
      </div>

      <div className="no-print" style={{ display: 'flex', gap: '2px' }}>
        <button className={`tab-button ${activeTab === 'build' ? 'active' : ''}`} onClick={() => setActiveTab('build')}>Roster</button>
        <button className={`tab-button ${activeTab === 'warband' ? 'active' : ''}`} onClick={() => setActiveTab('warband')}>Warband Groups</button>
      </div>

      {activeTab === 'build' && (
        <div className="no-print" style={{ padding: '15px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {availableFighters.map(f => (
                <button key={f.name} onClick={() => addFighter(f)} style={{ ...standardBtnStyle, backgroundColor: 'var(--ifm-color-primary)', color: '#000' }}>+ {f.name}</button>
            ))}
            </div>
        </div>
      )}

      <div className="roster-container" style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--ifm-color-primary)', paddingBottom: '8px', marginBottom: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <h3 style={{ margin: 0, textTransform: 'uppercase' }}>{activeTab === 'build' ? 'Roster:' : 'Warband:'}</h3>
            {activeTab === 'build' ? (
                <input className="editable-input" style={{ fontSize: '1.5rem', fontWeight: 'bold' }} value={masterRosterName} onChange={(e) => setMasterRosterName(e.target.value)} placeholder="Enter Roster Name..."/>
            ) : (
                <input className="editable-input" style={{ fontSize: '1.5rem', fontWeight: 'bold' }} value={warbandName} onChange={(e) => setWarbandName(e.target.value)} placeholder="Enter Warband Name..."/>
            )}
          </div>
          {activeTab === 'warband' && (
            <h3 style={{ margin: 0, color: 'var(--ifm-color-primary)' }}>{warbandTotalPoints}</h3>
          )}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
        {(activeTab === 'build' ? ['Roster'] : ['A', 'B', 'C']).map((groupId) => {
          const groupFighters = (activeTab === 'build' && groupId === 'Roster') 
            ? roster 
            : roster.filter(f => f.groupId === groupId);

          const groupTotal = groupFighters.reduce((sum, f) => sum + calculateFighterTotal(f, activeTab === 'warband'), 0);

          return (
            <div key={groupId} style={{ marginBottom: '20px' }}>
              <div className="group-header">
                <span>{groupId === 'Roster' ? 'Master Roster List' : `Group ${groupId}`} ({groupFighters.length})</span>
                {groupFighters.length > 0 && <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>{groupTotal} Points</span>}
              </div>
              <StrictModeDroppable droppableId={groupId}>
              {(provided) => (
              <table ref={provided.innerRef} {...provided.droppableProps} style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
                    <th style={{ textAlign: 'left', padding: '10px', width: '25%' }}>Fighter</th>
                    <th>M</th><th>WS</th><th>BS</th><th>Def</th><th>W</th>
                    <th style={{ width: '40%' }}>Gear & Traits</th><th>Cost</th><th className="no-print">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupFighters.length === 0 ? (
                    <tr><td colSpan="9" style={{ padding: '20px', opacity: 0.4, fontStyle: 'italic', fontSize: '0.75rem' }}>Empty</td></tr>
                  ) : (
                    groupFighters.map((f, index) => {
                      const isDeployedToAnotherGroup = groupId === 'Roster' && f.groupId !== 'Roster';
                      
                      const sharedProps = {
                        f,
                        activeTab,
                        allWeapons,
                        gearOptions,
                        abilityOptions,
                        advancementOptions,
                        injuryOptions,
                        isAvailableForFighter,
                        allTraitsData,
                        basePath,
                        updateFighterName,
                        addItem,
                        removeItem,
                        getDisplayCost,
                        duplicateFighter,
                        removeFighter,
                        moveToGroup,
                        namesData: names // Passing name data to each row
                      };

                      if (isDeployedToAnotherGroup) {
                        return <FighterRow key={`${f.instanceId}-shadow`} {...sharedProps} isDraggable={false} isDeployed={true} />;
                      }
                      return (
                        <Draggable key={f.instanceId} draggableId={f.instanceId} index={index}>
                          {(provided) => (
                            <FighterRow 
                              {...sharedProps}
                              isDraggable={true} 
                              provided={provided} 
                              isDeployed={false} 
                            />
                          )}
                        </Draggable>
                      );
                    })
                  )}
                  {provided.placeholder}
                </tbody>
              </table>
              )}
              </StrictModeDroppable>
            </div>
          );
        })}
        </DragDropContext>
      </div>

      {roster.length > 0 && (
        <div className="reference-container" style={{ marginTop: '30px', padding: '20px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '10px', textTransform: 'uppercase' }}>Weapon Reference</h4>
          <table style={{ width: '100%', fontSize: '0.8rem', marginBottom: '30px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
                <th style={{ padding: '8px', textAlign: 'left', width: '25%' }}>Weapon</th>
                <th style={{ width: '11%', textAlign: 'center' }}>Rng</th><th style={{ width: '7%', textAlign: 'center' }}>Att</th><th style={{ width: '7%', textAlign: 'center' }}>Dmg</th>
                <th style={{ textAlign: 'left', width: '40%', padding: '8px' }}>Traits</th><th style={{ width: '10%', textAlign: 'center' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {armorySummary.map(w => (
                <tr key={w.name} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
                  <td style={{ padding: '8px' }}><strong>{w.name}</strong></td>
                  <td style={{ textAlign: 'center' }}>{w.range}</td><td style={{ textAlign: 'center' }}>{w.att}</td><td style={{ textAlign: 'center' }}>{w.dmg}</td>
                  <td style={{ textAlign: 'left', padding: '8px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {Array.isArray(w.traits) && w.traits.length > 0 && w.traits[0] !== "-" ? w.traits.join(", ") : "-"}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{w.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 style={{ marginBottom: '10px', textTransform: 'uppercase' }}>Trait Reference</h4>
          <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
                <th style={{ padding: '8px', textAlign: 'left', width: '25%' }}>Name</th><th style={{ width: '12%' }}>Ability Cost</th>
                <th style={{ textAlign: 'left', width: '53%' }}>Effect</th><th style={{ width: '10%' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {uniqueTraitData.map(t => (
                <tr key={t.name} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
                  <td style={{ padding: '8px' }}><strong>{t.name}</strong><div style={{ fontSize: '0.65rem', opacity: 0.7, fontStyle: 'italic' }}>{t.displayType}</div></td>
                  <td style={{ textAlign: 'center' }}><code>{t.ability_cost || "-"}</code></td>
                  <td style={{ textAlign: 'left', padding: '8px' }}>{t.effect}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{t.cost && t.cost !== "-" ? `${t.cost}` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};