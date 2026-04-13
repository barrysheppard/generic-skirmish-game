import React, { useState } from 'react';

export const PointCalculator = () => {
  const [stats, setStats] = useState({ m: 4, def: 3, bs: 3, ws: 3, w: 10 });

  const movementTable = { 2: -15, 3: -10, 4: 0, 5: 10, 6: 25, 7: 35, 8: 45, 9: 50 };
  const combatTable = { 2: -5, 3: 0, 4: 5, 5: 10, 6: 20, 7: 30, 8: 40, 9: 50 };

  const calculateTotal = () => {
    const mPoints = movementTable[stats.m] || 0;
    const defPoints = combatTable[stats.def] || 0;
    const bsPoints = combatTable[stats.bs] || 0;
    const wsPoints = combatTable[stats.ws] || 0;
    const wPoints = stats.w * 4;
    const rawTotal = mPoints + defPoints + bsPoints + wsPoints + wPoints - 10;
    return Math.max(20, rawTotal);
  };

  const updateStat = (stat, val) => {
    setStats(prev => ({ ...prev, [stat]: parseInt(val) || 0 }));
  };

  const inputStyle = {
    padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)',
    backgroundColor: 'var(--ifm-background-color)', color: 'var(--ifm-font-color-base)',
    width: '50px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold'
  };

  const labelStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--ifm-color-emphasis-600)'
  };

  return (
    <div style={{ 
      padding: '12px 20px', 
      border: '1px solid var(--ifm-color-emphasis-200)', 
      borderRadius: '6px', 
      backgroundColor: 'var(--ifm-color-emphasis-100)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '24px',
      marginBottom: '24px' // Added spacing here
    }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <label style={labelStyle}>M <input type="number" min="2" max="9" value={stats.m} onChange={(e) => updateStat('m', e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>WS <input type="number" min="2" max="9" value={stats.ws} onChange={(e) => updateStat('ws', e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>BS <input type="number" min="2" max="9" value={stats.bs} onChange={(e) => updateStat('bs', e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>Def <input type="number" min="2" max="9" value={stats.def} onChange={(e) => updateStat('def', e.target.value)} style={inputStyle} /></label>
        {/* Wounds (W) only has a minimum, no maximum */}
        <label style={labelStyle}>W <input type="number" min="2" value={stats.w} onChange={(e) => updateStat('w', e.target.value)} style={inputStyle} /></label>
      </div>
      <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--ifm-color-emphasis-300)' }} />
      <div style={{ textAlign: 'center', minWidth: '80px' }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Credits</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--ifm-color-primary)', lineHeight: '1' }}>{calculateTotal()}</div>
      </div>
    </div>
  );
};

export const WeaponCalculator = () => {
  const [weapon, setWeapon] = useState({ att: 1, dmg: '1/2', range: 'melee' });

  const weaponCostTable = {
    '1/2': { melee: 7, reach: 8, pistol: 10, long: 12 },
    '1/3': { melee: 9, reach: 10, pistol: 13, long: 15 },
    '1/4': { melee: 12, reach: 13, pistol: 15, long: 17 },
    '2/2': { melee: 12, reach: 13, pistol: 15, long: 17 },
    '2/3': { melee: 14, reach: 15, pistol: 18, long: 20 },
    '2/4': { melee: 16, reach: 17, pistol: 20, long: 23 },
    '3/3': { melee: 18, reach: 19, pistol: 23, long: 26 },
    '3/4': { melee: 20, reach: 21, pistol: 25, long: 29 },
    '3/5': { melee: 22, reach: 23, pistol: 28, long: 32 },
    '4/5': { melee: 26, reach: 27, pistol: 33, long: 38 },
  };

  const calculateTotal = () => (weaponCostTable[weapon.dmg]?.[weapon.range] || 0) * weapon.att;

  const selectStyle = {
    padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)',
    backgroundColor: 'var(--ifm-background-color)', color: 'var(--ifm-font-color-base)',
    fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer'
  };

  const labelStyle = {
    display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.7rem',
    textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--ifm-color-emphasis-600)'
  };

  return (
    <div style={{ 
      padding: '12px 20px', 
      border: '1px solid var(--ifm-color-emphasis-200)', 
      borderRadius: '6px', 
      backgroundColor: 'var(--ifm-color-emphasis-100)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '24px' // Added spacing here
    }}>
      <label style={labelStyle}>Range
        <select value={weapon.range} onChange={(e) => setWeapon({...weapon, range: e.target.value})} style={selectStyle}>
          <option value="melee">Melee (0-1)</option>
          <option value="reach">Reach (0-2)</option>
          <option value="pistol">Pistol (0-8)</option>
          <option value="long">Ranged (3-15+)</option>
        </select>
      </label>
      <label style={labelStyle}>Damage
        <select value={weapon.dmg} onChange={(e) => setWeapon({...weapon, dmg: e.target.value})} style={selectStyle}>
          {Object.keys(weaponCostTable).map(dmg => (<option key={dmg} value={dmg}>{dmg}</option>))}
        </select>
      </label>
      <label style={labelStyle}>Attacks
        <input type="number" value={weapon.att} onChange={(e) => setWeapon({...weapon, att: parseInt(e.target.value) || 0})} style={{...selectStyle, width: '50px', textAlign: 'center'}} />
      </label>
      <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--ifm-color-emphasis-300)' }} />
      <div style={{ textAlign: 'center', minWidth: '80px' }}>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Cost</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--ifm-color-primary)', lineHeight: '1' }}>{calculateTotal()}</div>
      </div>
    </div>
  );
};