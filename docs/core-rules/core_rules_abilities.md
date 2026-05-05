---
sidebar_label: '4. Abilities'
sidebar_position: 4
---

import { TraitGallery } from './js/settings';

# Abilities

Abilities are special effects that help push the Warband a little further than just their raw stats. They can be used by a Fighter during their activation. Each Ability must be fully resolved before another Ability can be triggered. Each Ability can only be triggered once per activation, so you cannot trigger the same ability twice for the same Fighter's activation.

:::info Philosophy
In the default Warcry rules, only one Ability can be triggered per activation. In this variation, that restriction is lifted. This does mean we need to be a little more careful when designing abilities to avoid stacking abilities that are multiplicative.
:::


## 4.1 Ability Activation

Activating an ability requires a cost which is represented in between the square brackets at the start of the description. The main resource to power abilities are the Ability Dice which are generated during the Initiative step at the start of each turn. During that step 8 dice are rolled and dice with the same number are grouped together into Double, Triple, and Quad groups.

- **[double]**: Two matching dice.
- **[triple]**: Three matching dice.
- **[quad]**: Four or more matching dice.

<TraitGallery include={["Leader"]} showCost={false} />

A dice set can be used to activate a lower ability, so a [triple] can be used to activate a [double].

The value of the dice (the number on it) is referred to as the Ability Value, certain abilities may reference this value by referring to X.

:::info Philosophy
The Ability dice limit the number of abilities that can be used in a turn. As long as the abilities are roughly balanced and the profiles are well-costed, then the game shouldn't break!
:::

If you have five or six matching dice, these count as a [quad]. After using a lower ability, remove the total number of dice used and if a [double], [triple], or [quad] remains then retain that for later use. As such, a [quad] can be used to power a [double] and later another [double].

:::warning Change from Warcry
We've increased the total number of ability dice rolled to 8. So we're more likely to get bigger groupings. 
:::

There are also two types of ability that do not require ability dice.

- **[action]**: Requires spending an action to activate.
- **[passive]**: Is always active.

:::warning Change from Warcry
While most abilities can be covered under the Ability Dice system, there can be other situations we want to cover. The Fly trait for example in this format can be represented as a [Passive] ability. Similarly reactions from the normal Warcry rules become [Action] abilities as that is the cost. We also can introduce mission actions using the exact same format.
:::


## 4.2 Reactions

Reactions are abilities that have a special timing trigger, often during an enemy fighter's activation. Unlike with normal Abilities, a Fighter can take a Reaction outside of their own activation. These are indicated by a 'Reaction' at the start of the ability text. A Warband can only react once to each trigger. The exact timing for the reaction will be detailed in the text of the ability.

<TraitGallery include={["Overwatch"]} showCost={false} />

:::warning Change from Warcry
Always having to spend actions for reactions was too steep a cost, by costing these Ability dice we bring them back into the core concept of the game. It is important that timings respect game play, a reaction to being targeted is to be avoided as often players will pick up dice, point at a target, and roll. Instead, the reaction for a similar situation should be after the dice have rolled and balanced accordingly.
:::


## 4.3 Passive Abilities

The abilities that do not require initiative dice and are always on are referred to as [passive] abilities. As they are always active, they do not fall into limitations on triggering abilities. They also cannot be turned off and some of these [passive] abilities are actually penalties.


<TraitGallery include={["Fly", "Beast", "Champion"]} showCost={false} />


## 4.4 Universal Abilities

These are abilities that are available to every Fighter even though the trait isn't listed. Settings may add or remove from this list.

<TraitGallery type="universal" showCost={false}/>


:::warning Change from Warcry
These Universal abilities replace (or modify) the normal Universal abilities in Warcry
:::

:::info Philosophy
**Charge!** is intended to be a bonus for Fighters who move into combat and risk the double attack in response.
**Overwatch** benefits the defender but it also costs a triple to take an action you could just take later anyway. Hopefully this will make the game a little more dynamic without causing too much of a mess.
:::

