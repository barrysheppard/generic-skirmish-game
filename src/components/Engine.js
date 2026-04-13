import React from 'react';
import Link from '@docusaurus/Link';

/**
 * UTILITY: Merges universal data with setting-specific overrides.
 * Updated to use .name as the unique identifier.
 */
export const mergeDataById = (universal, specific) => {
  const mergedMap = new Map();
  // Use .name (or .id if it exists) to ensure compatibility
  universal.forEach(item => {
    const key = item.name || item.id;
    mergedMap.set(key, item);
  });
  specific.forEach(item => {
    const key = item.name || item.id;
    mergedMap.set(key, item);
  });
  return Array.from(mergedMap.values());
};

/**
 * COMPONENT: TraitLink
 * Renders a link with a tooltip. Requires the master 'traits' list and 'basePath' as props.
 */
export const TraitLink = ({ trait, traits, basePath }) => {
  if (!trait || trait === '-') return <span>-</span>;

  const traitData = traits.find(
    (t) => t.name.toLowerCase() === trait.toLowerCase()
  );

  const slug = trait
    .toLowerCase()
    .replace(/\(.*\)/, '')
    .trim()
    .replace(/\s+/g, '-');

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

/**
 * COMPONENT: WeaponGallery
 * Renders the full weapons table filtered by category.
 */
export const WeaponGallery = ({ category, weapons, traits, basePath }) => {
  const filteredWeapons = weapons
    .filter(w => {
      const rangeStr = w.range.toString();
      const rangeParts = rangeStr.split('-');
      const maxRange = parseInt(rangeParts[rangeParts.length - 1]);
      const isMelee = rangeStr === "1" || (rangeStr.startsWith("0-") && maxRange <= 3);
      
      if (category === "melee") return isMelee;
      if (category === "short") return !isMelee && maxRange <= 12;
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
        {filteredWeapons.map(weapon => (
          <tr key={weapon.id} id={weapon.id} className="weapon-row">
            <td><strong>{weapon.name}</strong></td>
            <td style={{ textAlign: 'center' }}>{weapon.range}</td>
            <td style={{ textAlign: 'center' }}>{weapon.att}</td>
            <td style={{ textAlign: 'center' }}>{weapon.dmg}</td>
            <td>
              {weapon.traits && weapon.traits.length > 0 && weapon.traits[0] !== "-" ? (
                weapon.traits.map((t, i) => (
                  <React.Fragment key={i}>
                    <TraitLink trait={t} traits={traits} basePath={basePath} />
                    {i < weapon.traits.length - 1 && ', '}
                  </React.Fragment>
                ))
              ) : '-'}
            </td>
            <td style={{ textAlign: 'center' }}>{weapon.cost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * COMPONENT: FactionTable
 * Renders the fighter profile table.
 */
export function FactionTable({ faction, fighters, traits, basePath }) {
  const factionFighters = fighters.filter(f => 
    Array.isArray(f.faction) ? f.faction.includes(faction) : f.faction === faction
  );

  if (factionFighters.length === 0) return <p>No fighters found for {faction}.</p>;

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
            <td id={f.id}><strong>{f.name}</strong></td>
            <td style={{ textAlign: 'center' }}>{f.m}</td>
            <td style={{ textAlign: 'center' }}>{f.ws}</td>
            <td style={{ textAlign: 'center' }}>{f.bs}</td>
            <td style={{ textAlign: 'center' }}>{f.def}</td>
            <td style={{ textAlign: 'center' }}>{f.w}</td>
            <td>
              {f.traits?.map((t, i) => (
                <React.Fragment key={i}>
                  <TraitLink trait={t} traits={traits} basePath={basePath} />
                  {i < f.traits.length - 1 && ', '}
                </React.Fragment>
              )) || "-"}
            </td>
            <td style={{ textAlign: 'center' }}>{f.cost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
/**
 * COMPONENT: FactionGearTable
 * Displays gear items available to a specific faction.
 * Supports both single-string and array-based factions.
 */
export function FactionGearTable({ faction, fighters = [], traits = [] }) {
  // 1. Identify fighters belonging to this faction (Support string or array)
  const factionFighters = fighters.filter(f => {
    if (Array.isArray(f.faction)) {
      return f.faction.includes(faction);
    }
    return f.faction === faction;
  });

  // 2. Collect all names from allowed_items and static traits
  const allReferencedNames = [...new Set(factionFighters.flatMap(f => [
    ...(f.allowed_items || []),
    ...(f.traits || [])
  ]))];

  // 3. Filter traits for 'gear' that match the referenced names
  const factionGear = traits
    .filter(t => t.type?.toLowerCase() === 'gear' && allReferencedNames.includes(t.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (factionGear.length === 0) return null;

  return (
    <div className="faction-gear-table-container" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
            <th style={{ width: '20%', padding: '10px', textAlign: 'left' }}>Gear Item</th>
            <th style={{ width: '15%', padding: '10px' }}>Usage</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Effect</th>
            <th style={{ width: '12%', padding: '10px' }}>Cost</th>
          </tr>
        </thead>
        <tbody>
          {factionGear.map((item) => (
            <tr key={item.id} id={item.id} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-300)' }}>
              <td style={{ padding: '10px' }}><strong>{item.name}</strong></td>
              <td style={{ textAlign: 'center', padding: '10px' }}>
                <code>{item.ability_cost || '[passive]'}</code>
              </td>
              <td style={{ fontSize: '0.9rem', padding: '10px' }}>{item.effect}</td>
              <td style={{ textAlign: 'center', padding: '10px', fontWeight: 'bold' }}>
                {/* Removed the 'c' to align with Roster changes */}
                {item.cost && item.cost !== "-" ? item.cost : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
/**
 * COMPONENT: FactionAbilityTable
 * Displays innate abilities (fighter-traits) for a faction.
 * Supports both single-string and array-based factions.
 */
export function FactionAbilityTable({ faction, fighters = [], traits = [] }) {
  // 1. Identify fighters belonging to this faction (Support string or array)
  const factionFighters = fighters.filter(f => {
    if (Array.isArray(f.faction)) {
      return f.faction.includes(faction);
    }
    return f.faction === faction;
  });

  // 2. Collect names listed in the "traits" field of the fighter JSON
  const innateNames = [...new Set(factionFighters.flatMap(f => f.traits || []))];

  // 3. Filter traits for 'fighter-trait' that match those names
  const factionAbilities = traits
    .filter(t => innateNames.includes(t.name) && t.type?.toLowerCase() === 'fighter-trait')
    .sort((a, b) => a.name.localeCompare(b.name));

  if (factionAbilities.length === 0) return null;

  return (
    <div className="faction-ability-table-container" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
            <th style={{ width: '25%', padding: '10px', textAlign: 'left' }}>Innate Ability</th>
            <th style={{ width: '15%', padding: '10px' }}>Usage</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Effect</th>
          </tr>
        </thead>
        <tbody>
          {factionAbilities.map((ability) => (
            <tr key={ability.id} id={ability.id} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-300)' }}>
              <td style={{ padding: '10px' }}>
                <strong>{ability.name}</strong>
              </td>
              <td style={{ textAlign: 'center', padding: '10px' }}>
                <code>{ability.ability_cost || '[passive]'}</code>
              </td>
              <td style={{ padding: '10px', fontSize: '0.9rem', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {ability.effect}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export const TraitGallery = ({ type, traits = [] }) => {
  // Debug: Uncomment the line below to see what data is actually arriving
  // console.log('Gallery Type:', type, 'Traits Count:', traits?.length);

  const filteredTraits = traits.filter(t => {
    // Handle potential undefined types or case mismatch
    return t.type?.toLowerCase() === type?.toLowerCase();
  });

  if (filteredTraits.length === 0) return <p>No traits found for {type}.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Usage</th>
          <th>Effect</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        {filteredTraits
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(trait => {
            const safeId = trait.name.toLowerCase().replace(/\s+/g, '-');
            
            // 1. Get the raw type
            const rawType = trait.displayType || trait.type || "";

            // 2. Format: replace hyphens with spaces and capitalize each word
            const formattedType = rawType
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            return (
              <tr key={safeId} id={safeId} className="trait-row">
                <td style={{ padding: '8px' }}>
                  <strong>{trait.name}</strong>
                  <div style={{ 
                    fontSize: '0.65rem', 
                    opacity: 0.7, 
                    fontStyle: 'italic', 
                    marginTop: '2px',
                    textTransform: 'none' // Ensures our manual capitalization stays exact
                  }}>
                    {formattedType}
                  </div>
                </td>
                <td><code>{trait.ability_cost || '[passive]'}</code></td>
                <td>{trait.effect}</td>
                <td>{trait.cost && trait.cost !== "-" ? trait.cost : '-'}</td>
              </tr>
            );
        })}
      </tbody>
    </table>
  );
};


export function Total({ fighterId, weapons: chosenWeaponNames = [], fighters = [], weaponsLibrary = [] }) {
  // 1. Find Fighter by ID (This remains ID-based as it's the unique key)
  const selectedFighter = fighters.find(f => f.id === fighterId);
  if (!selectedFighter) return <span>0</span>;
  
  const fighterBaseCost = Number(selectedFighter.cost) || 0;

  // 2. Normalize weapon names from MDX
  const weaponNamesToCalculate = Array.isArray(chosenWeaponNames) ? chosenWeaponNames : [chosenWeaponNames];

  // 3. Calculate Weapon Costs based on NAME
  const totalWeaponCost = weaponNamesToCalculate.reduce((runningSum, inputName) => {
    if (!inputName) return runningSum;

    // We search the library for a weapon where the 'name' matches exactly.
    // We use .toLowerCase() on both sides to ensure "Autogun" matches "autogun"
    const foundWeapon = weaponsLibrary.find(w => 
      String(w.name || '').toLowerCase().trim() === String(inputName).toLowerCase().trim()
    );

    const price = foundWeapon ? (Number(foundWeapon.cost) || 0) : 0;
    return runningSum + price;
  }, 0);

  // 4. Final Math
  return <span>{fighterBaseCost + totalWeaponCost}</span>;
}


/**
 * COMPONENT: FactionWeaponTable
 * Lists all weapons allowed for a specific faction based on fighter availability.
 * Supports both single-string and array-based factions.
 */
export function FactionWeaponTable({ faction, fighters = [], weapons = [], traits = [], basePath }) {
  // 1. Identify fighters belonging to this faction (Support string or array)
  const factionFighters = fighters.filter(f => {
    if (Array.isArray(f.faction)) {
      return f.faction.includes(faction);
    }
    return f.faction === faction;
  });

  // 2. Collect all item names allowed for these specific fighters
  const allowedNames = [...new Set(factionFighters.flatMap(f => f.allowed_items || []))];

  // 3. Filter the master weapon list against those allowed names
  const factionWeapons = weapons
    .filter(w => allowedNames.includes(w.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (factionWeapons.length === 0) return null;

  return (
    <div className="faction-weapon-table-container">
      <WeaponGallery 
        weapons={factionWeapons} 
        traits={traits} 
        basePath={basePath} 
        category="all" 
      />
    </div>
  );
}
/**
 * COMPONENT: FactionEquipmentSummary
 * Updated for Name-based identification and unique key stability.
 */
export function FactionEquipmentSummary({ faction, fighters = [], weapons = [], traits = [] }) {
  // 1. Get all fighters for this faction
  const factionFighters = fighters.filter(f => {
    if (Array.isArray(f.faction)) {
      return f.faction.includes(faction);
    }
    return f.faction === faction;
  });
  
  const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

  if (factionFighters.length === 0) return <p>No fighters found for {faction}.</p>;

  return (
    <ul className="faction-equipment-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
      {factionFighters.map(f => {
        // Use name as backup if id is missing to ensure a stable React key
        const fighterKey = f.id || f.name.toLowerCase().replace(/\s+/g, '-');
        const items = f.allowed_items || [];
        
        // Filter Weapons using the 'name' field
        const allowedWeapons = weapons
          .filter(w => items.includes(w.name))
          .map(w => w.name);

        // Filter Gear from traits prop using the 'name' field
        const allowedGear = traits
          .filter(t => items.includes(t.name) && t.type?.toLowerCase() === 'gear')
          .map(t => t.name);

        let equipmentText = "";
        
        if (allowedWeapons.length > 0) {
          equipmentText += `can be equipped with ${formatter.format(allowedWeapons)}`;
        }

        if (allowedGear.length > 0) {
          equipmentText += allowedWeapons.length > 0 
            ? ` and has access to ${formatter.format(allowedGear)}`
            : `has access to ${formatter.format(allowedGear)}`;
        }

        if (!equipmentText) {
          equipmentText = "has no additional equipment options";
        }

        return (
          <li key={fighterKey} style={{ marginBottom: '0.5rem', lineHeight: '1.4' }}>
            <strong style={{ marginRight: '4px' }}>
              {f.name}
            </strong> 
            {equipmentText}.
          </li>
        );
      })}
    </ul>
  );
}
/**
 * COMPONENT: TraitStat
 * Accesses specific fields (stat) of a trait by ID or Name.
 */
export const TraitStat = ({ id, stat, traits = [] }) => {
  if (!id) return <span>N/A</span>;

  // 1. Standardize search string (handle IDs like "rapid-fire" or Names like "Rapid Fire")
  const searchId = id.trim().toLowerCase().replace(/-/g, ' ');

  // 2. Find the item using the same robust matching logic
  const item = traits.find((t) => {
    const traitId = (t.id || "").toLowerCase().replace(/-/g, ' ');
    const traitName = (t.name || "").toLowerCase().replace(/-/g, ' ');
    return traitId === searchId || traitName === searchId;
  });

  // 3. Error handling if the trait is missing from JSON
  if (!item) {
    return <span style={{ color: 'var(--ifm-color-danger)' }}>[{id} not found]</span>;
  }

  // 4. Return the specific property requested (ability_cost, effect, etc.)
  // We access the property directly from the item object
  const value = item[stat];

  return <span>{value || '-'}</span>;
};

/**
 * COMPONENT: FighterStat
 * Renders a specific stat or the list of traits for a fighter.
 */
export function FighterStat({ fighterId, stat, fighters = [], traits = [], basePath }) {
  // 1. Find the fighter using the passed-in fighters array
  const fighter = fighters.find(f => f.id === fighterId);
  
  if (!fighter) return <span style={{color: 'red'}}>N/A</span>;

  const value = fighter[stat];

  // 2. Specialized logic for the 'traits' stat
  if (stat === 'traits' && Array.isArray(value)) {
    if (value.length === 0) return <span>-</span>;
    return (
      <>
        {value.map((t, i) => (
          <React.Fragment key={i}>
            <TraitLink trait={t} traits={traits} basePath={basePath} />
            {i < value.length - 1 && ', '}
          </React.Fragment>
        ))}
      </>
    );
  }

  // 3. Return standard stats (M, WS, BS, etc.)
  return <span>{value !== undefined ? value : '-'}</span>;
}