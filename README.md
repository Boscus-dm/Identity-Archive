# Identity Archive

A small, dependency-free browser app for browsing and maintaining Limbus Company archives.

## Run

For reliable browser storage, serve this folder locally and open http://localhost:8000:

    python -m http.server 8000

Then open index.html in a modern browser. There is no build step or external dependency.

## Features

- Start at a main menu with access to the Character Manager, Identity, E.G.O, Announcer, and Status Effect archives, global Settings, a WIP Combat Tracker, and the Rules / Mechanics reference.
- Browse a searchable Rules / Mechanics reference organized into sections covering turn structure, skills and clashing, damage, Sins, Sanity, Speed, defensive skills, Stagger, and Poise.
- Record the seven Limbus Company Sins plus the system-specific Angst and Madness affinities in Identity and E.G.O records. The E.G.O archive defaults Angst and Madness resistance to Fatal.
- Create custom identities, associate them with managed characters, then filter by Character, rarity, or search text.
- Manage central character profiles with Markdown lore, linked identities, E.G.O, announcers, and unique status effects inferred from identity status links.
- Create, edit, and delete records.
- Create announcers with multiple voicelines under the game's occasion categories.
- Create status effects with unique names and identifiers. Reference them in any Markdown field with `{{Name}}` or `{{identifier}}` to open the matching status effect.
- Start with the seven core keyword effects, common buffs and debuffs, and neutral combat mechanics; add, edit, or delete records as needed.
- Record panic behavior, base stats, resistance multipliers, any number of stagger thresholds, skills, passives, uptie stories, voicelines, and tags.
- Set a maximum identity level in Settings.
- Choose between Minimalist Dark (default), Minimalist Light, Persona 5, Limbus Company Wiki, and Cyberpunk 2077 in Settings.
- Add multiple sin requirements to each passive, mark Guard and Counter skills as clashable, and use Markdown in longer effect and note fields. Read-only views support headings, lists, emphasis, links, quotes, and code.
- Automatically color the supplied combat keywords and common spelling variants in Markdown text and tags.
- Choose a Walpurgis variant of three-star rarity and sort the archive by rarity.
- Create and manage E.G.O records by Character, with risk level, sin affinity, costs, sin resistances, Threadspin Awakening/Corrosion skills, unified skill and coin effects, passives, quotes, and notes.
- Use the Status Effect Archive as a searchable, linkable reference; it does not automatically apply effects or simulate combat.
- Save records in browser local storage.
- Export a complete JSON backup of identities, E.G.O, announcers, status effects, characters, and settings from Settings, then import it to replace all app data.
- Clear all app archives and settings saved in the current browser from Settings.
- Export an individual identity, E.G.O, announcer, or status effect from its detail view as a portable JSON file.

The identity archive starts empty; new records can also be created manually. Previously saved wiki roster entries are removed on next load; custom records are kept and converted to the Character field. Imported wiki roster records are skipped.

Archive data lives in this browser's local storage. Use Settings → Export everything to create a complete backup. Importing a backup replaces the current archives and settings. Individual detail views also retain a portable Export JSON option.
