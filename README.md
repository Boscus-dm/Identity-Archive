# Identity Archive

A small, dependency-free browser app for browsing and maintaining Limbus Company archives.

## Run

For reliable browser storage, serve this folder locally and open http://localhost:8000:

    python -m http.server 8000

Then open index.html in a modern browser. There is no build step or external dependency.

## Features

- Start at a main menu with access to the Character Manager, Identity, E.G.O, Announcer, and Status Effect archives, global Settings, the Combat Manager, and the Rules / Mechanics reference.
- Browse a searchable Rules / Mechanics reference organized into sections covering turn structure, skills and clashing, damage, Sins, Sanity, Speed, defensive skills, Stagger, and Poise.
- Record the seven Limbus Company Sins plus the system-specific Angst and Madness affinities in Identity and E.G.O records. The E.G.O archive defaults Angst and Madness resistance to Fatal.
- Create custom identities, associate them with managed characters, then filter by Character, rarity, or search text.
- Manage central character profiles with Markdown lore, linked identities, E.G.O, announcers, and unique status effects inferred from identity status links.
- Equip one E.G.O per risk level on each character and choose its current Threadspin; only E.G.O skills and passives unlocked at that tier are available to the character's identities in combat.
- Create, edit, and delete records.
- Create announcers with multiple voicelines under the game's occasion categories.
- Create status effects with unique names and identifiers. Reference them in any Markdown field with `{{Name}}` or `{{identifier}}` to open the matching status effect.
- Start with the seven core keyword effects, common buffs and debuffs, and neutral combat mechanics; add, edit, or delete records as needed.
- Record panic behavior, base stats, numeric resistance multipliers, any number of stagger thresholds, skills, passives, uptie stories, voicelines, and tags. Resistance names are derived in read-only views; they do not alter combat.
- Set a maximum identity level in Settings.
- Choose between Minimalist Dark (default), Minimalist Light, Persona 5, Limbus Company Wiki, and Cyberpunk 2077 in Settings.
- Add multiple sin requirements to each passive, mark Guard and Counter skills as clashable, and use Markdown in longer effect and note fields. Read-only views support headings, lists, emphasis, links, quotes, and code.
- Automatically color the supplied combat keywords and common spelling variants in Markdown text and tags.
- Choose Walpurgis variants of two- or three-star rarity and filter or sort the archive by rarity.
- Create and manage E.G.O records by Character, with risk level, sin affinity, costs, sin resistances, Threadspin Awakening/Corrosion skills, unified skill and coin effects, passives, quotes, and notes. Equip one E.G.O per risk level on each character.
- Use the Status Effect Archive as a searchable, linkable reference; it does not automatically apply effects or simulate combat.
- Track multiple combatants and rounds in the Combat Manager, using manual combatants or identities from the archive. Identity HP is calculated as Base Health + HP growth × Level. Initiative is rolled from each combatant's numeric Speed range (or High/Mid/Low category) at the start of every round and displayed in turn order. The sidebar lists only group Resonances with at least two uses in the current round.
- Resolve one-sided attacks and clashes against HP, shields, Identity physical resistance, selected defensive E.G.O Sin resistance, and Stagger thresholds. Stagger multipliers replace physical resistance while staggered. Identity Defense modifier currently uses a documented, provisional flat-damage reduction rule.
- Set each skill Coin's Normal, Unbreakable, Excision, or Concentration type. Clashes resolve one Coin at a time; the losing Coin breaks or cracks, and the winner attacks with remaining Coins. Unbreakable Coins attack at half damage after cracking, Excision can destroy them, and cracked Concentration Coins critically hit and grant shield. Combat rolls display animated, typed Coin results. Combatants can be assigned to named groups, which scopes Resonance and its passive requirements; Identity-backed combatant names and Speed ranges follow the selected Identity automatically.
- E.G.O passives become permanently active for their Character after the corresponding E.G.O is used once. An E.G.O record can instead be marked always active; activation state is retained in character data.
- Use an equipped E.G.O as a combat action independently of the Identity skill draw. Choose Awakening or Corrosion when both are available; the selected mode uses its highest unlocked Threadspin skill.
- Set pool weights and flat damage on Identity and E.G.O skills. Draw up to two weighted skills from an identity's pool, queue a choice, use one skill per round, and carry the unused draw into the next round; configure flat damage to apply once per skill or once per damage die. The Combat Manager lists active and inactive passives with their requirements, with an optional active-only sidebar filter in Settings.
- Save records in browser local storage.
- Unlock the beta Combat Manager from Settings using the access code; access lasts for the current browser tab. The SHA-256 verifier avoids storing the plaintext code, but this client-side gate is not a security boundary.
- Export a complete JSON backup of identities, E.G.O, announcers, status effects, characters, combat encounter, and settings from Settings, then import it to replace all app data.
- Clear all app archives, the combat encounter, and settings saved in the current browser from Settings.
- Export an individual identity, E.G.O, announcer, or status effect from its detail view as a portable JSON file.

The identity archive starts empty; new records can also be created manually. Previously saved wiki roster entries are removed on next load; custom records are kept and converted to the Character field. Imported wiki roster records are skipped.

Archive data lives in this browser's local storage. Use Settings → Export everything to create a complete backup. Importing a backup replaces the current archives and settings. Individual detail views also retain a portable Export JSON option.

See [CHANGELOG.md](./CHANGELOG.md) for recent combat rules audit findings, mechanics, assumptions, and beta-access limitations.
