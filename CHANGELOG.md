# Changelog

## Unreleased

### E.G.O passives, coin types, and Combat Manager menus

- E.G.O passive activation is now stored on the linked Character. Once a Character uses an E.G.O skill, that E.G.O's passive remains permanently active and continues to appear even if the E.G.O is later unequipped.
- E.G.O records have an **Always active** option to activate their passive without first using the E.G.O. Existing Threadspin unlock levels still govern ordinary equipped passives; the permanent-use and always-active states bypass that unlock check.
- Removed Plus/Minus Coin polarity. Every Coin is now one of Normal, Unbreakable, Excision, or Concentration. Heads always adds the skill's Coin Power; legacy Plus/Minus records migrate to Normal, and their previous polarity is intentionally discarded.
- Coin type controls are now small RPG-style choice menus in the Identity and E.G.O editors. Special Coin clash and damage behavior is retained.
- Combat Manager selectors use native dropdowns again.
- Equipped E.G.O can be selected and used as a combat action independently of the Identity skill draw. If both Awakening and Corrosion are available, the combatant can choose the mode; the highest unlocked Threadspin skill in that mode is used. E.G.O skills are excluded from weighted Identity skill draws.

### Combat Manager rules audit

- One-sided attacks now resolve a damage roll and apply the target's applicable resistance profile, shield, HP, and Stagger thresholds instead of only logging the Coin roll.
- Combat damage uses the Identity's Slash, Pierce, or Blunt resistance and the selected defensive E.G.O's Sin resistance. Both multipliers apply to damage; a resistance value of zero prevents damage.
- Identity Defense modifier is applied as a signed flat reduction before the resistance multipliers. Damage cannot fall below zero. This is a provisional app rule because the reference rules do not define a Defense modifier formula.
- Damage absorbed by shield no longer reduces HP or triggers Stagger. HP damage crossing one or more configured thresholds locks the combatant out of skills for the remainder of the current round and the following round. Stagger multipliers replace physical resistance while staggered; Sin resistance still applies.
- E.G.O skills become available from a Character's equipped E.G.O only up to the selected Threadspin tier. Each Character can equip one E.G.O per risk level. An E.G.O passive is shown only when its configured Threadspin unlock is met and is highlighted when its Sin requirements are satisfied.
- Identity-backed combatants must draw and queue a skill before using it. Each combatant can use one skill per round; the unused drawn skill is retained and the pool is replenished with up to one new skill at the next round. A second draw cannot overwrite the current pair.
- Guard and Counter skills only enter Clashes when the Identity's skill is marked Clashable. Manual Guard and Counter skills cannot Clash because the manual combatant has no Clashable setting.
- E.G.O skills check their Sin resource and Sanity costs before use, then consume those resources on use. Identity and E.G.O skill use generates one owned Sin resource for the skill's affinity.
- Guard adds shield equal to non-negative Clash Power; Evade avoids an incoming attack when its defensive power meets or exceeds the attack's power; Counter retaliates when the combatant is hit. These are bounded Combat Manager interpretations of the rules' action descriptions.
- Damage and combat logs report the resolved modifiers and shield absorption so the recorded outcome can be checked against the rules.

### Fields and scope

- Identity and E.G.O combat fields with defined Combat Manager behavior are now connected: HP growth and level, Speed, Defense modifier, physical/Sin resistances, Stagger thresholds, skill type and rank, Coin definitions, skill-pool weight, flat damage, E.G.O equipment and Threadspin, resource costs, and passive requirements.
- Fields without a defined automatic rule remain archival/display data. This includes lore, panic descriptions, quotes, acquisition/release information, written skill/passive effects, and Attack Weight (its targeting and multi-target behavior are not defined by the current rules). Status effects and passive effects are not automatically simulated.
- Offense Level is not an Identity or E.G.O archive field, so its documented `+X` bonus is not currently calculated by the Combat Manager. Skill effects and Attack Weight likewise remain descriptive until their application rules are defined.
- Legacy per-skill power modifier fields are discarded during migration; skill power continues to affect Clashes, not damage, unless a separate damage rule explicitly says otherwise.
- Rules / Mechanics now records the Defense modifier assumption and equipment/Threadspin behavior.

### Beta access

- The Combat Manager launch card and route are locked until the Settings access-code field accepts the beta code. Unlocking is scoped to the current browser tab and resets when that tab's session ends.
- The source stores a SHA-256 verifier rather than the plaintext code. This is a UI gate for a client-side app, not an authorization boundary; users able to inspect or modify the running app can bypass it.
