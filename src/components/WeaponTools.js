import React from 'react';
import Link from '@docusaurus/Link';

// 1. Import Universal Data
import universalTraits from '@site/src/components/data/universal_traits.json';
import universalWeapons from '@site/src/components/data/universal_weapons.json';

// 2. Import Setting Data
import settingFighters from '@site/docs/settings/grimdark/data/fighters.json';
import settingTraits from '@site/docs/settings/grimdark/data/traits.json';
import settingWeapons from '@site/docs/settings/grimdark/data/weapons.json';

// Helper function to merge arrays by ID (Grimdark overrides Universal)
const mergeData = (universal, grimdark) => {
  const mergedMap = new Map();
  
  // Add all universal items to the map
  universal.forEach(item => mergedMap.set(item.id, item));
  
  // Overwrite or add grimdark items
  setting.forEach(item => mergedMap.set(item.id, item));
  
  return Array.from(mergedMap.values());
};

// 3. Create the final datasets
const fighters = settingFighters;
const traits = mergeData(universalTraits, settingTraits);
const weapons = mergeData(universalWeapons, settingWeapons);

export { fighters, traits, weapons };



export function FighterStat({ id, stat }) {
  const fighter = fighters.find(f => f.id === id);
  if (!fighter) return <span style={{color: 'red'}}>N/A</span>;

  const value = fighter[stat];

  if (stat === 'traits' && Array.isArray(value)) {
    if (value.length === 0) return <span>-</span>;
    return (
      <>
        {value.map((t, i) => (
          <React.Fragment key={i}>
            <TraitLink trait={t} />
            {i < value.length - 1 && ', '}
          </React.Fragment>
        ))}
      </>
    );
  }

  return <span>{value}</span>;
}

export const TraitLink = ({ trait }) => {
  if (!trait || trait === '-') return <span>-</span>;

  const traitData = traits.find(
    (t) => t.name.toLowerCase() === trait.toLowerCase()
  );

  const slug = trait
    .toLowerCase()
    .replace(/\(.*\)/, '')
    .trim()
    .replace(/\s+/g, '-');

  const typePaths = {
    'weapon-trait': '/docs/settings/grimdark/traits',
    'gear': '/docs/settings/grimdark/traits',
    'fighter-trait': '/docs/settings/grimdark/traits',
  };

  const basePath = traitData ? typePaths[traitData.type] : typePaths['weapon-trait'];
  const cost = traitData?.ability_cost ? ` ${traitData.ability_cost}` : '';
  const hoverText = traitData?.effect 
    ? traitData.effect.replace(/<[^>]*>?/gm, '') 
    : 'View details';

  return (
    <span className="custom-tooltip-container" style={{ whiteSpace: 'normal' }}>
      <Link to={`${basePath}#${slug}`} className="trait-link">
        {trait}
      </Link>
      <span className="custom-tooltip-text">
        <strong>{trait}:{cost}</strong> {hoverText}
      </span>
    </span>
  );
};


export function WeaponStat({ id, stat, type }) {
  const weapon = weapons.find(w => w.id === id);
  if (!weapon) return <span style={{color: 'red'}}>N/A</span>;

  const value = weapon[stat];

  if (stat === 'traits' && Array.isArray(value)) {
    if (value.length === 0) return <span>-</span>;
    return (
      <>
        {value.map((t, i) => (
          <React.Fragment key={i}>
            <TraitLink trait={t} type={type} />
            {i < value.length - 1 && ', '}
          </React.Fragment>
        ))}
      </>
    );
  }

  return <span>{value}</span>;
}

export function WeaponRef({ id }) {
  const weapon = weapons.find(w => w.id === id);
  if (!weapon) return <span>Weapon {id} not found</span>;

  return (
    <div className="weapon-callout" style={{
      border: '1px solid var(--ifm-color-emphasis-300)',
      padding: '1rem',
      borderRadius: '8px',
      margin: '1rem 0',
      backgroundColor: 'var(--ifm-color-emphasis-100)'
    }}>
      <h4 style={{marginTop: 0}}>{weapon.name}</h4>
      <div style={{display: 'flex', gap: '15px', fontSize: '0.9rem'}}>
        <span><b>Rng:</b> {weapon.range}</span>
        <span><b>Att:</b> {weapon.att}</span>
        <span><b>Dmg:</b> {weapon.dmg}</span>
        <span><b>Cost:</b> {weapon.cost}</span>
      </div>
      <div style={{marginTop: '8px', fontSize: '0.85rem'}}>
        <i>Traits: </i>
        {weapon.traits.length > 0 
          ? weapon.traits.map((t, i) => <TraitLink key={i} trait={t} />)
          : 'None'}
      </div>
    </div>
  );
}

export const TraitStat = ({ id, stat }) => {
  if (!id) return <span>N/A</span>;
  const searchId = id.trim().toLowerCase().replace(/-/g, ' ');
  const item = traits.find((t) => {
    const traitId = (t.id || "").toLowerCase().replace(/-/g, ' ');
    const traitName = (t.name || "").toLowerCase().replace(/-/g, ' ');
    return traitId === searchId || traitName === searchId;
  });

  if (!item) return <span style={{ color: 'red' }}>[{id} not found]</span>;

  const statMap = {
    ability_cost: item.ability_cost,
    effect: item.effect,
    cost: item.cost,
    name: item.name
  };

  return <span>{statMap[stat] || '-'}</span>;
};

export function Total({ fighterId, weapons: weaponIds = [] }) {
  const fighter = fighters.find(f => f.id === fighterId);
  const fCost = fighter ? Number(fighter.cost) : 0;
  const wCost = weaponIds.reduce((acc, wId) => {
    const w = weapons.find(wpn => wpn.id === wId);
    return acc + (w ? Number(w.cost) : 0);
  }, 0);

  return <span>{fCost + wCost}</span>;
}

// Updated TraitGallery with Cost column and proper formatting
export const TraitGallery = ({ type }) => {
  const filteredTraits = traits
    .filter(t => t.type === type)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (filteredTraits.length === 0) return <p>No traits found for {type}.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: '20%' }}>Name</th>
          <th style={{ width: '15%' }}>Usage</th>
          <th>Effect</th>
          <th style={{ width: '12%' }}>Cost</th>
        </tr>
      </thead>
      <tbody>
        {filteredTraits.map(trait => {
          // Standardize ID for the # anchor
          const anchorId = trait.name.toLowerCase().trim().replace(/\s+/g, '-');
          
          return (
            <tr key={trait.id || anchorId} id={anchorId} className="trait-row">
              <td><strong>{trait.name}</strong></td>
              <td><code>{trait.ability_cost || '[passive]'}</code></td>
              <td>{trait.effect}</td>
              <td>{trait.cost ? `${trait.cost} pts` : '-'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export const WeaponGallery = ({ category }) => {
  const filteredWeapons = weapons
    .filter(w => {
      const rangeStr = w.range.toString();
      const rangeParts = rangeStr.split('-');
      // Get the last number in the range (e.g., "0-12" -> 12, "1" -> 1)
      const maxRange = parseInt(rangeParts[rangeParts.length - 1]);

      // NEW MELEE LOGIC: 
      // It's Melee if range is "1" OR if it's a spread starting with 0 (like 0-1, 0-2, 0-3)
      const isMelee = rangeStr === "1" || (rangeStr.startsWith("0-") && maxRange <= 3);
      
      if (category === "melee") return isMelee;
      
      // SHORT RANGE: Not melee, and ends at 8 or less
      if (category === "short") return !isMelee && maxRange <= 12;
      
      // LONG RANGE: Everything else
      if (category === "long") return !isMelee && maxRange > 12;

      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (filteredWeapons.length === 0) return <p>No {category} weapons found.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: '25%' }}>Name</th>
          <th style={{ width: '10%' }}>Rng</th>
          <th style={{ width: '10%' }}>Att</th>
          <th style={{ width: '10%' }}>Dmg</th>
          <th>Traits</th>
          <th style={{ width: '10%' }}>Credits</th>
        </tr>
      </thead>
      <tbody>
        {filteredWeapons.map(weapon => {
          const anchorId = weapon.id || weapon.name.toLowerCase().trim().replace(/\s+/g, '-');
          
          // Crash-proof trait logic
          const traitList = Array.isArray(weapon.traits) 
            ? weapon.traits 
            : (weapon.traits && weapon.traits !== "-" ? [weapon.traits] : []);

          return (
            <tr key={anchorId} id={anchorId} className="weapon-row">
              <td><strong>{weapon.name}</strong></td>
              <td style={{ textAlign: 'center' }}>{weapon.range}</td>
              <td style={{ textAlign: 'center' }}>{weapon.att}</td>
              <td style={{ textAlign: 'center' }}>{weapon.dmg}</td>
              <td>
                {traitList.length > 0 ? (
                  traitList.map((t, i) => (
                    <React.Fragment key={i}>
                      <TraitLink trait={t} />
                      {i < traitList.length - 1 && ', '}
                    </React.Fragment>
                  ))
                ) : '-'}
              </td>
              <td style={{ textAlign: 'center' }}>{weapon.cost}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export function FactionTable({ faction }) {
  // 1. Filter the fighters once
  const factionFighters = fighters.filter(f => f.faction === faction);

  if (factionFighters.length === 0) {
    return <p style={{color: 'red'}}>No fighters found for faction: {faction}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th style={{ textAlign: 'left' }}>Name</th>
          <th style={{ textAlign: 'center' }}>M</th>
          <th style={{ textAlign: 'center' }}>WS</th>
          <th style={{ textAlign: 'center' }}>BS</th>
          <th style={{ textAlign: 'center' }}>Def</th>
          <th style={{ textAlign: 'center' }}>W</th>
          <th style={{ textAlign: 'left' }}>Traits</th>
          <th style={{ textAlign: 'center' }}>Credits</th>
        </tr>
      </thead>
      <tbody>
        {factionFighters.map((f) => (
          <tr key={f.id}>
            {/* Name with an ID so links like #battle-sister still work */}
            <td id={f.id}><strong>{f.name}</strong></td>
            
            {/* Raw Stat Values (Fast) */}
            <td style={{ textAlign: 'center' }}>{f.m}</td>
            <td style={{ textAlign: 'center' }}>{f.ws}</td>
            <td style={{ textAlign: 'center' }}>{f.bs}</td>
            <td style={{ textAlign: 'center' }}>{f.def}</td>
            <td style={{ textAlign: 'center' }}>{f.w}</td>
            
            {/* Traits using your existing TraitLink logic for hovers */}
            <td>
              {f.traits && f.traits.length > 0 && f.traits[0] !== "-" ? (
                f.traits.map((t, i) => (
                  <React.Fragment key={i}>
                    <TraitLink trait={t} />
                    {i < f.traits.length - 1 && ', '}
                  </React.Fragment>
                ))
              ) : (
                "-"
              )}
            </td>
            
            <td style={{ textAlign: 'center' }}>{f.cost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function FactionWeaponTable({ faction }) {
  // 1. Get all fighters belonging to this faction
  const factionFighters = fighters.filter(f => f.faction === faction);
  
  // 2. Extract and flatten all unique allowed_items for these fighters
  const allAllowedItems = [
    ...new Set(factionFighters.flatMap(f => f.allowed_items || []))
  ];

  // 3. Filter the master weapons list to only those found in the allowed items
  const factionWeapons = weapons
    .filter(w => allAllowedItems.includes(w.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (factionWeapons.length === 0) {
    return <p>No specific weapons found for the {faction} faction.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: '25%', textAlign: 'left' }}>Weapon</th>
          <th style={{ width: '10%', textAlign: 'center' }}>Rng</th>
          <th style={{ width: '10%', textAlign: 'center' }}>Att</th>
          <th style={{ width: '10%', textAlign: 'center' }}>Dmg</th>
          <th style={{ textAlign: 'left' }}>Traits</th>
          <th style={{ width: '10%', textAlign: 'center' }}>Cost</th>
        </tr>
      </thead>
      <tbody>
        {factionWeapons.map((weapon) => {
          const anchorId = weapon.id || weapon.name.toLowerCase().trim().replace(/\s+/g, '-');
          
          // Ensure traits is always an array for mapping
          const traitList = Array.isArray(weapon.traits) 
            ? weapon.traits 
            : (weapon.traits && weapon.traits !== "-" ? [weapon.traits] : []);

          return (
            <tr key={anchorId} id={anchorId}>
              <td><strong>{weapon.name}</strong></td>
              <td style={{ textAlign: 'center' }}>{weapon.range}</td>
              <td style={{ textAlign: 'center' }}>{weapon.att}</td>
              <td style={{ textAlign: 'center' }}>{weapon.dmg}</td>
              <td>
                {traitList.length > 0 ? (
                  traitList.map((t, i) => (
                    <React.Fragment key={i}>
                      <TraitLink trait={t} />
                      {i < traitList.length - 1 && ', '}
                    </React.Fragment>
                  ))
                ) : '-'}
              </td>
              <td style={{ textAlign: 'center' }}>{weapon.cost}c</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function FactionEquipmentSummary({ faction }) {
  // 1. Get all fighters for this faction
  const factionFighters = fighters.filter(f => f.faction === faction);
  const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

  if (factionFighters.length === 0) return <p>No fighters found for {faction}.</p>;

  return (
    <ul className="faction-equipment-list">
      {factionFighters.map(f => {
        const items = f.allowed_items || [];
        
        // Filter Weapons from weapons.json
        const allowedWeapons = weapons
          .filter(w => items.includes(w.name))
          .map(w => w.name);

        // Filter Gear from traits.json
        const allowedGear = traits
          .filter(t => items.includes(t.name) && t.type === 'gear')
          .map(t => t.name);

        // Logic for constructing the string
        let equipmentText = "";
        
        if (allowedWeapons.length > 0) {
          equipmentText += `can be equipped with ${formatter.format(allowedWeapons)}`;
        }

        if (allowedGear.length > 0) {
          // If we already have weapons, add a bridge; otherwise start fresh
          equipmentText += allowedWeapons.length > 0 
            ? ` and has access to ${formatter.format(allowedGear)}`
            : `has access to ${formatter.format(allowedGear)}`;
        }

        // Handle units with no options
        if (!equipmentText) {
          equipmentText = "has no additional equipment options";
        }

        return (
          <li key={f.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{f.name}</strong> {equipmentText}.
          </li>
        );
      })}
    </ul>
  );
}
export function FactionGearTable({ faction }) {
  // 1. Get all fighters belonging to this faction
  const factionFighters = fighters.filter(f => f.faction === faction);
  
  // 2. Extract and flatten both allowed_items AND traits from the fighters
  const allReferencedNames = [
    ...new Set(
      factionFighters.flatMap(f => [
        ...(f.allowed_items || []),
        ...(f.traits || [])
      ])
    )
  ];

  // 3. Filter master list for items in our combined list that are classified as 'gear'
  const factionGear = traits
    .filter(t => t.type === 'gear' && allReferencedNames.includes(t.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (factionGear.length === 0) {
    return <p>No specific gear found for the {faction} faction.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th style={{ width: '20%', textAlign: 'left' }}>Gear Item</th>
          <th style={{ width: '15%', textAlign: 'center' }}>Usage</th>
          <th style={{ textAlign: 'left' }}>Effect</th>
          <th style={{ width: '12%', textAlign: 'center' }}>Cost</th>
        </tr>
      </thead>
      <tbody>
        {factionGear.map((item) => {
          // Standardize ID for the # anchor
          const anchorId = item.name.toLowerCase().trim().replace(/\s+/g, '-');
          
          return (
            <tr key={item.id || anchorId} id={anchorId}>
              <td><strong>{item.name}</strong></td>
              <td style={{ textAlign: 'center' }}>
                <code>{item.ability_cost || '[passive]'}</code>
              </td>
              <td style={{ fontSize: '0.9rem' }}>{item.effect}</td>
              <td style={{ textAlign: 'center' }}>
                {item.cost && item.cost !== '-' ? `${item.cost}c` : '-'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
export function FactionAbilityTable({ faction }) {
  // 1. Get all fighters for this faction
  const factionFighters = fighters.filter(f => f.faction === faction);
  
  // 2. Extract the innate trait names from the fighters themselves
  // This looks at f.traits (e.g., ["Acts of Faith", "Martyrdom"])
  const innateTraitNames = [
    ...new Set(
      factionFighters.flatMap(f => {
        const t = f.traits;
        if (!t || t === "-") return [];
        return Array.isArray(t) ? t : [t];
      })
    )
  ];

// 3. Find the full data for these specific traits in traits.json
  const factionAbilities = traits
    .filter(t => 
      // Rule 1: It must be in the list of names gathered from the fighters
      innateTraitNames.includes(t.name) && 
      // Rule 2: It must be a fighter-trait
      t.type === 'fighter-trait'
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  if (factionAbilities.length === 0) return null;

  return (
    <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
            <th style={{ width: '25%', textAlign: 'left', padding: '10px' }}>Innate Ability</th>
            <th style={{ width: '15%', textAlign: 'center' }}>Usage</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Effect</th>
          </tr>
        </thead>
        <tbody>
          {factionAbilities.map((ability, idx) => {
            const isUniversal = ["Sprint", "Charge!", "Overwatch", "Surge"].includes(ability.name);
            
            return (
              <tr 
                key={`${ability.name}-${idx}`}
                style={{ 
                  borderBottom: '1px solid var(--ifm-color-emphasis-300)',
                  backgroundColor: isUniversal ? 'var(--ifm-color-emphasis-100)' : 'transparent'
                }}
              >
                <td style={{ padding: '10px' }}>
                  <strong>{ability.name}</strong>
                  {isUniversal && <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>CORE RULE</div>}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <code>{ability.ability_cost || '[passive]'}</code>
                </td>
                <td style={{ padding: '10px', fontSize: '0.9rem' }}>
                  {ability.effect}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}