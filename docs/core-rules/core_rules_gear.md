---
sidebar_label: '5. Gear'
sidebar_position: 5
---

import { TraitGallery, WeaponGallery } from './js/settings';


# Gear

Gear are items given to a fighter to give them bonuses or extra abilities. This can include weapons, armour, and other equipment. Gear will appear as a list of Traits for the fighter. Each Trait then is in the format of an ability. Weapons are an exception to this as they follow a non-ability format but they essentially modify the Attack action.

Gear given to a Fighter stays with that Fighter and cannot be moved to another Fighter.

## 5.1 Weapon Profiles {#4.1-weapon-profiles}

A weapon profile determines how that weapon functions in combat, including how far it can strike, how many attack dice are rolled, and how much damage it deals.

| Characteristic | Description |
| :---- | :---- |
| **Range (Rng)** | Minimum and maximum range of the weapon in inches. A **Melee** weapon typically has a range of 0–1. Melee reach weapons will be 0-2. Weapons with greater than 2” range are considered **Ranged** weapons. |
| **Attacks (Att)** | Number of dice rolled when this weapon is used to make an attack action. A weapon with high attacks will average out while a weapon with low attacks can be more swingy. |
| **Damage (Dmg)** | The amount of damage dealt by each successful hit or crit. Hits are the first value and crits are the value after the slash. |
| **Traits** | Special rules relating to the weapon are referenced here, each trait will have a corresponding rule. |
| **Cost** | The cost of equipping a fighter with this weapon. Used during Warband creation to maintain balance between Warbands. Depending on the setting, this might be Silver pieces or Imperial Credits|

A typical weapon will have the following characteristics

<WeaponGallery/>

Weapons may vary depending on the setting, a bow in a fantasy setting may have very different characteristics to a bow in a sci-fi setting. A list of available weapons will be provided in the setting pack which is separate to this core rules document.

:::warning Change from Warcry
Weapons are largely unchanged from Warcry, although the weapon strength is now found as WS or BS on the fighter profile. Also Weapons now have Traits and can have abilities that apply to attacks with that weapon.
:::

## **5.2 Weapon Traits** {#4.2-weapon-traits}

Depending on the setting, weapons may have Traits which align to Abilities. Each ability will have a name, cost, and effect as normal. Most Weapon abilities are tied to their Weapon profile, so when an ability mentions 'this attack' it can only be triggered when the weapons attack profile is used.


<TraitGallery include={["Assault", "Parry", "Reliable"]} showCost={false} />

:::info Philosophy
Weapon traits can be a big boost for an attack. If they are passive and are always active, work out a points adjustment for the weapon base profile. If the ability is triggered using Ability Dice, it should be well balanced but does not need to increase the cost as it should be balanced within the Ability system.
:::


## **5.3 General Gear** {#4.3-general-gear}

Fighters may have additional gear modifying their traits or giving abilities. Typically this will be represented as an ability.

<TraitGallery include={["Light Armour", "Field Rations"]}/>

In some cases gear may be slightly more complicated and comprise of several traits each of which provide an ability.
