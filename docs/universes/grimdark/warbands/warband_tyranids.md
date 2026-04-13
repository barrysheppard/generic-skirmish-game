---
sidebar_label: 'Tyranids'
sidebar_position: 15
---

import { 
  Total, 
  FactionTable, 
  FactionWeaponTable, 
  FactionGearTable, 
  FactionEquipmentSummary, 
  FactionAbilityTable 
} from '../js/settings';

# Tyranids

The Tyranid Hive Fleet relies on specialized bio-forms. These fighters often trade defense and range for overwhelming speed and attack volume.

### Hive Fleet Organisms

<FactionTable faction="Tyranids" /> 

<FactionEquipmentSummary faction="Tyranids" />

### Biological Weaponry

<FactionWeaponTable faction="Adeptus Astartes" />

### Hive Fleet Logistics (Gear)

<FactionGearTable faction="Adeptus Astartes" />

### Hive Fleet Abilities

<FactionAbilityTable faction="Adeptus Astartes" />



# Hive Fleet Loadouts

Standard biological configurations for Hive Fleet organisms based on strict stat-to-point calculations.

:::info Swarm & Chaff
- **Termagant (Skirmisher):** Termagant + Fleshborer — **<Total fighterId="termagant" weapons={['fleshborer']} /> Credits**
- **Hormagaunt (Slasher):** Hormagaunt + Scything Talons — **<Total fighterId="hormagaunt" weapons={['scything-talons']} /> Credits**
- **Spine-Gaunt (Horde):** Termagant + Spinefists — **<Total fighterId="termagant" weapons={['spinefists']} /> Credits**
- **Gargoyle (Harasser):** Gargoyle + Fleshborer — **<Total fighterId="gargoyle" weapons={['fleshborer']} /> Credits**
:::

:::info Specialized Bio-Forms
- **Genestealer (Assassin):** Genestealer + Rending Claws — **<Total fighterId="genestealer" weapons={['rending-claws']} /> Credits**
- **Ravener (Striker):** Ravener + Scything Talons + Devourer — **<Total fighterId="ravener" weapons={['scything-talons', 'devourer']} /> Credits**
- **Lictor (Stalker):** Lictor + Rending Claws + Scything Talons — **<Total fighterId="lictor" weapons={['rending-claws', 'scything-talons']} /> Credits**
:::

:::info Warrior Strains (Apex Organisms)
- **Standard Warrior:** Warrior + Scything Talons + Deathspitter — **<Total fighterId="tyranid-warrior" weapons={['scything-talons', 'deathspitter']} /> Credits**
- **Assault Duelist:** Warrior + Boneswords + Lash Whip — **<Total fighterId="tyranid-warrior" weapons={['boneswords', 'lash-whip']} /> Credits**
- **Bio-Artillery:** Warrior + Venom Cannon + Scything Talons — **<Total fighterId="tyranid-warrior" weapons={['venom-cannon', 'scything-talons']} /> Credits**
- **Siege-Breaker:** Warrior + Crushing Claws + Deathspitter — **<Total fighterId="tyranid-warrior" weapons={['crushing-claws', 'deathspitter']} /> Credits**
:::