import React from 'react';
import * as Engine from '@site/src/components/Engine';
import { RosterBuilder as RosterBuilderLib } from '@site/src/components/RosterBuilder';

// 1. Load the Data files
import masterData from '../data/data.json';
import uMasterData from '@site/src/components/data/data.json';

// 2. Map and Merge the data
export const fighters = masterData.fighters;

// MERGE NAMES: Combine faction names with Universal fallback names
export const names = { 
  ...uMasterData.names, 
  ...masterData.names    
};

// WEAPONS: Merge universal weapon list with master list
export const weapons = Engine.mergeDataById(uMasterData.weapons, masterData.weapons);

// TRAITS: Combine abilities, gear, and traits into one library
const allBaseTraits = [
  ...(uMasterData.abilities || []), 
  ...(uMasterData.gear || []),      
  ...(masterData.gear || []), 
  ...(masterData.fighter_traits || []), 
  ...(masterData.weapon_traits || [])
];
export const traits = Engine.mergeDataById(allBaseTraits, allBaseTraits);

// Use 'traitPath' consistently
const traitPath = "/docs/universes/modern/traits";

// Define a unique key for this specific page/version
const rosterStorageKey = "modern"; 

export const RosterBuilder = (props) => (
  <RosterBuilderLib 
    {...props}
    storageKey={rosterStorageKey} // Pass the key here
    fighters={fighters}
    traits={traits}
    weapons={weapons}
    names={names} 
    basePath={traitPath}
  />
);

export const WeaponGallery = (props) => (
  <Engine.WeaponGallery {...props} weapons={weapons} traits={traits} basePath={traitPath} />
);

export const FactionTable = (props) => (
  <Engine.FactionTable {...props} fighters={fighters} traits={traits} basePath={traitPath} />
);

export const FactionGearTable = (props) => (
  <Engine.FactionGearTable {...props} fighters={fighters} traits={traits} />
);

export const FactionAbilityTable = (props) => (
  <Engine.FactionAbilityTable {...props} fighters={fighters} traits={traits} />
);

export const TraitGallery = (props) => (
  <Engine.TraitGallery {...props} traits={traits} />
);

export const TraitLink = (props) => (
  <Engine.TraitLink {...props} traits={traits} basePath={traitPath} />
);

export const Total = (p) => (
  <Engine.Total 
    {...p} 
    fighters={fighters} 
    weaponsLibrary={weapons} 
  />
);

export const FighterStat = (p) => (
  <Engine.FighterStat {...p} fighters={fighters} traits={traits} basePath={traitPath} />
);

export const FactionWeaponTable = (p) => (
  <Engine.FactionWeaponTable 
    {...p} 
    fighters={fighters} 
    weapons={weapons} 
    traits={traits} 
    basePath={traitPath} 
  />
);

export const FactionEquipmentSummary = (p) => (
  <Engine.FactionEquipmentSummary 
    {...p} 
    fighters={fighters} 
    weapons={weapons} 
    traits={traits}
  />
);

export const TraitStat = (p) => (
  <Engine.TraitStat 
    {...p} 
    traits={traits}
  />
);

export const FactionAutoRegistry = (props) => (
  <Engine.FactionAutoRegistry 
    {...props} 
    fighters={fighters} 
    traits={traits} 
    weapons={weapons} 
    basePath={traitPath} 
  />
);