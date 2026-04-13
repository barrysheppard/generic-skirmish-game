import React from 'react';
import * as Engine from '@site/src/components/Engine';
import { RosterBuilder as RosterBuilderLib } from '@site/src/components/RosterBuilder';

// 1. Load Data
import uTraits from '@site/src/components/data/universal_traits.json';
import uWeapons from '@site/src/components/data/universal_weapons.json';

// Local Setting Data
import sFighters from '../data/fighters.json';
import sWeapons from '../data/weapons.json';
import gearData from '../data/gear.json';
import fTraitsData from '../data/fighter_traits.json';
import wTraitsData from '../data/weapon_traits.json';


// 2. Merge Logic
export const fighters = sFighters;
export const weapons = Engine.mergeDataById(uWeapons, sWeapons);

const allBaseTraits = [
  ...uTraits, 
  ...gearData, 
  ...fTraitsData, 
  ...wTraitsData
];

// Merge all base traits. 
// Note: If you have a local traits.json override file, replace the second 'allBaseTraits' with 'sTraits'
export const traits = Engine.mergeDataById(allBaseTraits, allBaseTraits);

// We use 'traitPath' consistently now
const traitPath = "/docs/universes/grimdark/traits";

// 3. PARAMETERIZED EXPORTS

export const RosterBuilder = (props) => (
  <RosterBuilderLib 
    {...props}
    fighters={fighters}
    traits={traits}
    weapons={weapons}
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
    traits={traits} // Add this line!
  />
);

export const TraitStat = (p) => (
  <Engine.TraitStat 
    {...p} 
    traits={traits} // This passes the merged traits list to the function
  />
);