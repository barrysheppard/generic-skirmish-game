---
sidebar_label: '8.4. Injuries and Death'
sidebar_position: 4
---
import { TraitStat } from '../js/settings';

# 8.4 Injuries and Death

Each fighter taken down in the Mission must roll on an injury table.

In cases where there is a long term effect in the Injury Effect, this is treated as a passive Ability of the same name as the injury and can be added to the Fighter profile as a Trait. Some injuries can be taken multiple times, if an injury would bring a fighter below the minimum for a trait, treat the injury as a ▼ Gut Wound instead.


| <div style={{width: '55px'}}>D66</div> | <div style={{width: '125px'}}>Injury Name</div> | Injury Effect |
| :--- | :--- | :--- |
| **11-13** | <TraitStat id="Death" stat="name" /> | <TraitStat id="Death" stat="effect" /> |
| **14-16** | <TraitStat id="Miss next mission" stat="name" /> | <TraitStat id="Miss next mission" stat="effect" /> |
| **21-23** | <TraitStat id="▼ Gut Wound" stat="name" /> | <TraitStat id="▼ Gut Wound" stat="effect" /> |
| **24-26** | <TraitStat id="▼ Cracked Rib" stat="name" />  | <TraitStat id="▼ Cracked Rib" stat="effect" /> |
| **31-33** | <TraitStat id="▼ Eye Injury" stat="name" />  | <TraitStat id="▼ Eye Injury" stat="effect" /> |
| **34-36** | <TraitStat id="▼ Broken Arm" stat="name" />  | <TraitStat id="▼ Broken Arm" stat="effect" /> |
| **41-43** | <TraitStat id="▼ Leg Fracture" stat="name" />  | <TraitStat id="▼ Leg Fracture" stat="effect" /> |
| **44-46** | <TraitStat id="▼ Head Trauma" stat="name" />  | <TraitStat id="▼ Head Trauma" stat="effect" /> |
| **51-65** | <TraitStat id="Flesh Wound" stat="name" /> | <TraitStat id="Flesh Wound" stat="effect" /> |
| **66** | <TraitStat id="Lucky Escape" stat="name" /> | <TraitStat id="Lucky Escape" stat="effect" /> |

A Fighter can have at most 3 ▼ injuries, if they would take a 4th injury with a lasting negative effect (eg. 21-26 ▼) treat it as Death instead.

When a Fighter dies, all their weapons and gear are removed with them. You cannot move gear between Fighters.

:::info Philosophy
A discount of 5 definitely isn't enough, often the actual impact will be 10 or even 20. Rather than try get a perfect number, we've given the lowest discount option so having this injury will never be a benefit.
:::
