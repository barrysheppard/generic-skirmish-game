---
sidebar_label: '7.6 Attack action'
sidebar_position: 7.6
---

import { TraitGallery } from '../js/settings';


# Attack Action

## 7.6 Attack action


<TraitGallery include={["Attack"]} showCost={false} />

The **Attack** action is used to damage enemy players. Each fighter has at least one attack profile on their card. Some rules will reference whether an attack is a Melee attack or a **Ranged** attack, if the max range of the weapon is 3 or less this is considered a **Melee** attack if the weapon has a max range of 3 or more it is considered a Ranged attack.

**Attack Sequence**

1. Choose a weapon profile for the acting fighter.
2. Choose a legal target:  
   - The target must be beyond the minimum range and within the maximum range of the weapon.
   - If the target is at range 3" or further, then the target cannot be within 1" of a friendly fighter.
   - The fighter must have a line of sight to the target.
   - The target must be an enemy fighter.
3. Roll a number of dice equal to the Attacks (Att) value of the weapon.
4. Compare Skill (WS or BS) of attacker vs Defence (Def) of target:  

         | Skill vs Defence | ❌ Miss | ✅ Hit | 💥 Crit |
         | :--- | :---: | :---: | :---: |
         | 🔵 **Overwhelming** *(Skill ≥ Def+3)* | 1–2 | 3–4 | **5–6** |
         | 🟢 **Superior** *(Skill > Def)* | 1–2 | 3–5 | **6** |
         | ⚪ **Matched**  *(Skill = Def)* | 1–3 | 4–5 | **6** |
         | 🟠 **Challenging** *(Skill < Def)* | 1–4 | 5 | **6** |
         | 🔴 **Desperate** *(Skill+3 ≤ Def)* | 1–4 | 5–6 | **—** |

   Note \- If the attack is a ranged attack and the best straight line for the attacker goes through an obstacle, then the defender is considered in cover and gets \+1 toughness.

5. Calculate damage, hits do the damage before the slash and crits do damage after the slash.
6. Apply damage to the target, a Fighter is considered incapacitated if damage taken is equal or greater than Wounds. Incapacitated fighters are removed from the game. If a fighter is removed, that fighter's controller gains one wild dice that can be immediately spent to change a single to a double or retained for a later turn.


:::warning Change from Warcry
The Overhwleming and Desperate options are new to Warcry. The goal is to hopefully make the comparisons more important. The suggestion often is to use bloodbowls double comparison, but in this case I felt +3 might be a better approach.
Oh and we also get a wild die when a fighter dies, just as a little claw back mechanic.
:::

:::info Philosophy
The attack process should involve looking at the Attacks stat and rolling that number of dice. After that, we work out the damage. To keep this quick, we want to avoid any rerolls so it’s just one roll and done.
:::

:::info Philosophy
Gaining a wild dice when one of your fighters dies is a catch up mechanic. If it is used immediately, it can only change a single to a double, this is to avoid accidentally using two wild dice on a group in a single turn.
:::

### Skill vs Defence Matrix

| S \ D | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| :---: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **1** | ⚪ | 🟠 | 🟠 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| **2** | 🟢 | ⚪ | 🟠 | 🟠 | 🔴 | 🔴 | 🔴 | 🔴 | 🔴 |
| **3** | 🟢 | 🟢 | ⚪ | 🟠 | 🟠 | 🔴 | 🔴 | 🔴 | 🔴 |
| **4** | 🔵 | 🟢 | 🟢 | ⚪ | 🟠 | 🟠 | 🔴 | 🔴 | 🔴 |
| **5** | 🔵 | 🔵 | 🟢 | 🟢 | ⚪ | 🟠 | 🟠 | 🔴 | 🔴 |
| **6** | 🔵 | 🔵 | 🔵 | 🟢 | 🟢 | ⚪ | 🟠 | 🟠 | 🔴 |
| **7** | 🔵 | 🔵 | 🔵 | 🔵 | 🟢 | 🟢 | ⚪ | 🟠 | 🟠 |
| **8** | 🔵 | 🔵 | 🔵 | 🔵 | 🔵 | 🟢 | 🟢 | ⚪ | 🟠 |
| **9** | 🔵 | 🔵 | 🔵 | 🔵 | 🔵 | 🔵 | 🟢 | 🟢 | ⚪ |

---

:::info Quick Reference
* 🔵 **Overwhelming** (3–4 Hit / 5–6 Crit)
* 🟢 **Superior** (3–5 Hit / 6 Crit)
* ⚪ **Matched** (4–5 Hit / 6 Crit)
* 🟠 **Challenging** (5 Hit / 6 Crit)
* 🔴 **Desperate** (5–6 Hit / No Crit)
:::
