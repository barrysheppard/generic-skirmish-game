---
sidebar_label: '8.4. Injuries and Death'
sidebar_position: 4
---
import { TraitStat } from '../js/settings';

# 8.4 Injuries and Death

Each fighter taken down in the Mission must roll on an injury table.

Most Fighters have a simple table, roll a single D6

|D6|Injury Effect|
|:--:|:--|
|1-2|The Fighter has died and is removed.|
|3-4|The Fighter has been injured and misses the next game.|
|5-6|The Fighter has survived without injuries.|

**Leaders** and **Champions** have a more detailed table roll two D6 in order D66. In cases where there is a long term effect in the Injury Effect, this is treated as a passive Ability of the same name as the injury and can be added to the Fighter profile as a Trait.


| <div style={{width: '55px'}}>D66</div> | <div style={{width: '125px'}}>Injury Name</div> | Injury Effect |
| :--- | :--- | :--- |
| **11-16** | **Death** | The Fighter has died and is removed from the Roster along with their Gear. |
| **21-23** | <TraitStat id="▼ Gut Wound" stat="name" /> | <TraitStat id="▼ Gut Wound" stat="effect" /> |
| **24-26** | <TraitStat id="▼ Cracked Rib" stat="name" />  | <TraitStat id="▼ Cracked Rib" stat="effect" /> |
| **31-33** | <TraitStat id="▼ Eye Injury" stat="name" />  | <TraitStat id="▼ Eye Injury" stat="effect" /> |
| **34-36** | <TraitStat id="▼ Broken Arm" stat="name" />  | <TraitStat id="▼ Broken Arm" stat="effect" /> |
| **41-43** | <TraitStat id="▼ Leg Fracture" stat="name" />  | <TraitStat id="▼ Leg Fracture" stat="effect" /> |
| **44-46** |<TraitStat id="▼ Head Trauma" stat="name" />  | <TraitStat id="▼ Head Trauma" stat="effect" /> |
| **51-65** | **Flesh Wound** | This Fighter suffers no effects. This is not considered an injury. |
| **66** | **Lucky Escape** | Survival against the odds, the Fighter gains 1 experience point and receives no injury. |

A Fighter can have at most 3 <span style={{color: 'red', fontSize: '1.2em'}}>▼</span> injuries, if they would take a 4th injury with a lasting negative effect (eg. 21-26 <span style={{color: 'red', fontSize: '1.2em'}}>▼</span>) treat it as Death instead.

:::info Philosophy
A discount of 5 definitely isn't enough, often the actual impact will be 10 or even 20. Rather than try get a perfect number, we've given the lowest discount option so having this injury will never be a benefit.
:::
