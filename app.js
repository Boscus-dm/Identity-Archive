(function () {
  "use strict";

  var STORAGE_KEY = "limbus-identity-archive-v1";
  var EGO_STORAGE_KEY = "limbus-ego-archive-v1";
  var ANNOUNCER_STORAGE_KEY = "limbus-announcer-archive-v1";
  var STATUS_EFFECT_STORAGE_KEY = "limbus-status-effect-archive-v1";
  var CHARACTER_STORAGE_KEY = "limbus-character-manager-v1";
  var COMBAT_STORAGE_KEY = "limbus-combat-manager-v1";
  var EGO_SCHEMA_VERSION = 3;
  var ANNOUNCER_SCHEMA_VERSION = 2;
  var STATUS_EFFECT_SCHEMA_VERSION = 1;
  var CHARACTER_SCHEMA_VERSION = 1;
  var STATUS_EFFECT_DEFAULT_SEED_VERSION = 3;
  var COMBAT_ACCESS_SESSION_KEY = "limbus-combat-beta-unlocked";
  var COMBAT_ACCESS_CODE_SHA256 = "3ffbd6eb3a8d0c8530edeb023f75e766150a81cc9607e575da5e4e7dcc0bb363";
  var STATE_VERSION = 6;
  var DEFAULT_THEME = "minimalist-dark";
  var DEFAULT_STATUS_EFFECTS = [
    {
      name: "Bleed",
      identifier: "bleed",
      description: "When tossing an Attack Coin, take fixed damage equal to the effect's Potency, then reduce its Count by 1."
    },
    {
      name: "Burn",
      identifier: "burn",
      description: "At the end of the turn, take fixed damage equal to the effect's Potency, then reduce its Count by 1."
    },
    {
      name: "Tremor",
      identifier: "tremor",
      description: "When attacked by a skill that bursts Tremor, raise the Stagger Threshold by the effect's Potency. At the end of the turn, reduce its Count by 1."
    },
    {
      name: "Rupture",
      identifier: "rupture",
      description: "When hit by an attack, take fixed damage equal to the effect's Potency, then reduce its Count by 1."
    },
    {
      name: "Sinking",
      identifier: "sinking",
      description: "When hit by an attack, take fixed SP damage equal to the effect's Potency. Units without SP take Gloom damage instead. Then, reduce its Count by 1."
    },
    {
      name: "Poise",
      identifier: "poise",
      description: "Gain a critical hit chance of 5% per Potency. A Poise critical doubles the damage of each damage die rolled. Consume Count equal to the skill's number of damage dice on a Poise critical; Count also decreases by 1 at turn end."
    },
    {
      name: "Charge",
      identifier: "charge",
      description: "A resource used by certain skills for additional effects. Its Count decreases by 1 at the end of the turn and normally has a maximum of 20."
    },
    {
      name: "Power Up",
      identifier: "power-up",
      description: "All skills gain Final Power by the effect's Count for one turn."
    },
    {
      name: "Attack Power Up",
      identifier: "attack-power-up",
      description: "Attack skills gain Final Power by the effect's Count for one turn."
    },
    {
      name: "Defense Power Up",
      identifier: "defense-power-up",
      description: "Defense skills gain Final Power by the effect's Count for one turn."
    },
    {
      name: "Clash Power Up",
      identifier: "clash-power-up",
      description: "Gain Clash Power by the effect's Count for one turn."
    },
    {
      name: "Offense Level Up",
      identifier: "offense-level-up",
      description: "Offense level increases based on the effect's Potency for one turn."
    },
    {
      name: "Defense Level Up",
      identifier: "defense-level-up",
      description: "Defense Level increases based on the effect's Potency for one turn."
    },
    {
      name: "Damage Up",
      identifier: "damage-up",
      description: "Deal 10% more damage with skills based on the effect's Count for one turn. (Max 10)"
    },
    {
      name: "Haste",
      identifier: "haste",
      description: "Speed increases by the effect's Count for one turn."
    },
    {
      name: "Protection",
      identifier: "protection",
      description: "Take 10% less damage per Count from attacks for one turn. (Max 10)"
    },
    {
      name: "Plus Coin Boost",
      identifier: "plus-coin-boost",
      description: "Raise the Power of Plus Coins by the effect's Count for one turn."
    },
    {
      name: "Minus Coin Drop",
      identifier: "minus-coin-drop",
      description: "Reduce the Power of Minus Coins by the effect's Count for one turn."
    }
  ];
  var ADDITIONAL_DEFAULT_STATUS_EFFECTS = [
    {
      name: "Power Down",
      identifier: "power-down",
      description: "All skills lose Final Power by the effect's Potency for one turn."
    },
    {
      name: "Attack Power Down",
      identifier: "attack-power-down",
      description: "Attack skills lose Final Power by the effect's Potency for one turn."
    },
    {
      name: "Defense Power Down",
      identifier: "defense-power-down",
      description: "Defense skills lose Final Power by the effect's Potency for one turn."
    },
    {
      name: "Clash Power Down",
      identifier: "clash-power-down",
      description: "Lose Clash Power by the effect's Potency for one turn."
    },
    {
      name: "Offense Level Down",
      identifier: "offense-level-down",
      description: "Offense level decreases based on the effect's Potency for one turn."
    },
    {
      name: "Defense Level Down",
      identifier: "defense-level-down",
      description: "Defense Level decreases based on the effect's Potency for one turn."
    },
    {
      name: "Damage Down",
      identifier: "damage-down",
      description: "Deal 10% less damage with skills per Count for one turn. (Max 10)"
    },
    {
      name: "Bind",
      identifier: "bind",
      description: "Speed decreases by the effect's Potency for one turn."
    },
    {
      name: "Fragile",
      identifier: "fragile",
      description: "Take 10% more damage from skills per Count for one turn. (Max 10)"
    },
    {
      name: "Paralyze",
      identifier: "paralyze",
      description: "Fix the Power of X Coin(s) to 0 for one turn."
    },
    {
      name: "Plus Coin Drop",
      identifier: "plus-coin-drop",
      description: "Reduce the Power of Plus Coins by the effect's Count for one turn."
    },
    {
      name: "Minus Coin Boost",
      identifier: "minus-coin-boost",
      description: "Raise the Power of Minus Coins by the effect's Count for one turn."
    },
    {
      name: "Clashable Guard",
      identifier: "clashable-guard",
      description: "- On Clash Win: raise the target's Stagger Threshold by this unit's Final Clash Power.\n- On Clash Lose: when hit, reduce the attacker's Final Skill Power by this unit's Final Power.\n- On Clash Lose: this unit does not gain Final Power from the following sources: Resonance and Level disparity against the Attack Skill."
    },
    {
      name: "Unfocused Volley",
      identifier: "unfocused-volley",
      description: "- When this Skill flips Coins, each Coin flips against a random enemy among its targets.\n- The first Coin always targets the main target.\n- All On Hit effects and damage from each Coin are inflicted only against the random target selected for that Coin."
    },
    {
      name: "SP Heal Efficiency",
      identifier: "sp-heal-efficiency",
      description: "Amount of SP healed due to the Identity's base factors increasing Sanity (SP).\n\nThat is, +(Potency) to all SP healed by allies this turn. Potency may be a negative number."
    },
    {
      name: "SP Loss Efficiency",
      identifier: "sp-loss-efficiency",
      description: "Amount of SP lost due to the Identity's base factors decreasing Sanity (SP).\n\nThat is, +(Potency) to all SP lost by allies this turn. Potency may be a negative number."
    },
    {
      name: "Aggro",
      identifier: "aggro",
      description: "Makes this unit more likely to be targeted by enemies."
    },
    {
      name: "Discard",
      identifier: "discard",
      description: "- Delete Skills that fit the condition and are selectable during the Chaining Phase on the Dashboard. Defensive and E.G.O Skills do not count. This does not delete the Skill from the upcoming Skills list.\n- Discarded Skills do not activate Skill or Coin effects other than effects from Discard, and do not give E.G.O resources."
    },
    {
      name: "Fixed Panic",
      identifier: "fixed-panic",
      description: "This unit's Panic Type does not change when inflicted with an effect that changes Panic Types. Instead, this unit is inflicted with the effect that would be inflicted against targets without SP."
    },
    {
      name: "Unbreakable Coin",
      identifier: "unbreakable-coin",
      description: "- This Coin does not break upon Clash Lose.\n- If an Attack Skill has this Coin, attack with this Coin after getting hit.\n- Upon Clash Lose, fix this unbroken Coin's Power to 1."
    },
    {
      name: "Excision Coin",
      identifier: "excision-coin",
      description: "- This Coin can destroy Unbreakable Coins in a Clash.\n- This Coin does not break upon Clash Lose.\n- If an Attack Skill has this Coin, attack with this Coin after getting hit.\n- Upon Clash Lose, fix this unbroken Coin's Power to 1."
    },
    {
      name: "Amplitude Conversion",
      identifier: "amplitude-conversion",
      description: "Converts Tremor, or already converted Tremor on the target, to a different kind of Tremor. Potency and Count values do not change during conversion."
    },
    {
      name: "Amplitude Entanglement",
      identifier: "amplitude-entanglement",
      description: "- Fuses the effects of the Tremor type added by Amplitude Entanglement and the Tremor type currently on the target under Tremor - Superposition.\n- Potency and Count values do not change during Entanglement.\n- When Amplitude Conversion is triggered on Tremor - Superposition, it activates as Amplitude Entanglement instead.\n- Turn End: converts into base Tremor."
    },
    {
      name: "Bloodfeast",
      identifier: "bloodfeast",
      description: "- Max Value: 999\n- Stores all Bleed damage dealt in this Zone.\n- Resets when moving to a different Zone.\n- This value is shared by all characters.\n- Among allies, if there is a higher Kindred who also consumes Bloodfeast in the same turn, this unit cannot consume Bloodfeast until that ally consumes it first."
    },
    {
      name: "Total Bloodfeast Consumed",
      identifier: "total-bloodfeast-consumed",
      description: "- Max Value: 999\n- Displays the total amount of Bloodfeast consumed in this Encounter."
    },
    {
      name: "Ammo",
      identifier: "ammo",
      description: "Spent by certain Skills. Some attacks cancel if this unit lacks Ammo."
    },
    {
      name: "Reload",
      identifier: "reload",
      description: "Lose all currently owned Ammo, then reload back to full."
    },
    {
      name: "Assist Defense",
      identifier: "assist-defense",
      description: "- Max Stack: 3\n- When an ally is about to take an Unopposed Attack from an enemy, consume 1 Stack to redirect the enemy's targeting to this unit, then use the unique Skill that activates for Assist Defense.\n- If multiple allies have Assist Defense Stacks, the ally with the highest Stack has the highest activation priority.\n- Does not activate for allies who equipped Defense Skills.\n- Expires at Turn End."
    }
  ];
  var DEFAULT_STATUS_EFFECT_SEEDS = [
    { version: 1, effects: DEFAULT_STATUS_EFFECTS },
    { version: 2, effects: ADDITIONAL_DEFAULT_STATUS_EFFECTS },
    {
      version: 3,
      effects: [],
      updates: [{
        identifier: "poise",
        previousDescription: "Gain a Potency-based chance to deal a Critical Hit (5% per Potency). On a Critical Hit, reduce the Count by 1; the Count also decreases by 1 at the end of the turn. Critical Hits deal 1.2x damage.",
        description: "Gain a critical hit chance of 5% per Potency. A Poise critical doubles the damage of each damage die rolled. Consume Count equal to the skill's number of damage dice on a Poise critical; Count also decreases by 1 at turn end."
      }]
    }
  ];
  var form = document.getElementById("identity-form");
  var dialog = document.getElementById("identity-dialog");
  var egoForm = document.getElementById("ego-form");
  var egoDialog = document.getElementById("ego-dialog");
  var announcerForm = document.getElementById("announcer-form");
  var announcerDialog = document.getElementById("announcer-dialog");
  var statusEffectForm = document.getElementById("status-effect-form");
  var statusEffectDialog = document.getElementById("status-effect-dialog");
  var characterForm = document.getElementById("character-form");
  var characterDialog = document.getElementById("character-dialog");
  var skillFields = document.getElementById("skill-fields");
  var passiveFields = document.getElementById("passive-fields");
  var voiceLineFields = document.getElementById("voice-line-fields");
  var listElement = document.getElementById("identity-list");
  var detailElement = document.getElementById("detail-pane");
  var egoSkillFields = document.getElementById("ego-skill-fields");
  var egoPassiveRequirements = document.getElementById("ego-passive-requirements");
  var egoListElement = document.getElementById("ego-list");
  var egoDetailElement = document.getElementById("ego-detail-pane");
  var announcerVoiceLineFields = document.getElementById("announcer-voice-line-fields");
  var announcerListElement = document.getElementById("announcer-list");
  var announcerDetailElement = document.getElementById("announcer-detail-pane");
  var statusEffectListElement = document.getElementById("status-effect-list");
  var statusEffectDetailElement = document.getElementById("status-effect-detail-pane");
  var statusEffectTooltipElement = document.getElementById("status-effect-tooltip");
  var selectedId = null;
  var editingId = null;
  var egoSelectedId = null;
  var egoEditingId = null;
  var announcerSelectedId = null;
  var announcerEditingId = null;
  var statusEffectSelectedId = null;
  var statusEffectEditingId = null;
  var characterSelectedId = null;
  var characterEditingId = null;
  var statusEffectTooltipTimer = null;
  var statusEffectTooltipAnchor = null;
  var EGO_SINS = ["Wrath", "Lust", "Sloth", "Gluttony", "Gloom", "Pride", "Envy", "Angst", "Madness"];
  var EGO_RISK_LEVELS = ["ZAYIN", "TETH", "HE", "WAW", "ALEPH"];
  var COMBAT_SINS = EGO_SINS;
  var COIN_TYPES = ["Normal", "Unbreakable", "Excision", "Concentration"];
  var ANNOUNCER_CATEGORIES = [
    "Equipping Announcer", "Rally", "Situational Rally", "Victory Cry", "Defeat Wail",
    "Enemy Staggered", "Ally Staggered", "Enemy Kill", "Ally Death", "Enemy Advantage",
    "Ally Advantage", "Ally Turnabout", "Danger", "Powerful Enemy Skill Warning", "Enemy Gimmick Warning",
    "Advantageous Attack Type", "Disadvantageous Attack Type", "Advantageous Affinity Type", "Disadvantageous Affinity Type",
    "Buffed Enemies", "Debuffed Enemies", "Buffed Allies", "Debuffed Allies", "Breaking Enemy Part",
    "Starting Turn after Breaking Enemy Part", "Taking Devastating Damage", "Starting Turn after Taking Devastating Damage",
    "Dealing Devastating Damage", "Starting Turn after Dealing Devastating Damage", "Ally Multikill"
  ];
  var state = loadState();
  applyTheme(state.settings.theme);
  var egoState = loadEgoState();
  var announcerState = loadAnnouncerState();
  var statusEffectState = loadStatusEffectState();
  var characterState = loadCharacterState();
  var combatState = loadCombatState();
  var KEYWORD_COLORS = [
    { text: "Clashable Counter", color: "#ff6000" },
    { text: "Heads Attack End", color: "#ff59c2" },
    { text: "Crit Attack End", color: "#ff59c2" },
    { text: "Tails Attack End", color: "#cb0080" },
    { text: "Indiscriminate", color: "#ff0000" },
    { text: "Unclashable", color: "#ff0000" },
    { text: "Start Battle", color: "#c9fe98" },
    { text: "Clash Win", color: "#ff7e00" },
    { text: "Clash Lose", color: "#e30000" },
    { text: "Heads Hit", color: "#c7ff94" },
    { text: "Tails Hit", color: "#64ab23" },
    { text: "On Use", color: "#26cfff" },
    { text: "On Hit", color: "#94f140" },
    { text: "AoE", color: "#ffe71b" }
  ];
  var VOICE_LINE_CUSTOM_OPTION = "__custom_category__";
  var VOICE_LINE_CATEGORIES = [
    "Identity Acquisition", "Morning Greeting", "Afternoon Greeting", "Evening Greeting",
    "Chatter #1", "Chatter #2", "Chatter #3", "Post-Uptie Chat 1", "Post-Uptie Chat 2",
    "Idle", "Uptying", "Deployment", "Stage Entry", "Viewed in Battle", "Commencing Attack",
    "Enemy Stagger", "Staggered", "Enemy Killed", "Death", "Check Passed", "Check Failed",
    "Victory Cry", "Extra Conditions Fulfilled (Overwhelming Victory)", "Defeat Wail"
  ];
  var SORTED_KEYWORD_COLORS = KEYWORD_COLORS.slice().sort(function (left, right) { return right.text.length - left.text.length; });
  var KEYWORD_COLOR_PATTERN = new RegExp(SORTED_KEYWORD_COLORS.map(function (entry) {
    var phrase = entry.text.split(" ").map(function (part) { return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("[\\s_-]+");
    return "\\[\\s*" + phrase + "\\s*\\]|\\b" + phrase + "\\b";
  }).join("|"), "gi");

  function newId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return "local-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }

  function coinCountValue(value) {
    var count = Number(value);
    return Number.isInteger(count) && count > 0 && count <= 20 ? count : 0;
  }

  function normalizeCoinTypes(types, count) {
    var normalized = Array.isArray(types) ? types.slice(0, count).map(function (coin) {
      if (typeof coin === "string") {
        return { type: COIN_TYPES.indexOf(coin) !== -1 ? coin : "Normal" };
      }
      coin = coin || {};
      var type = COIN_TYPES.indexOf(coin.type) !== -1 ? coin.type :
        (COIN_TYPES.indexOf(coin.coinType) !== -1 ? coin.coinType : "");
      if (!type && COIN_TYPES.indexOf(coin.special) !== -1 && coin.special !== "Normal") type = coin.special;
      return { type: type || "Normal" };
    }) : [];
    while (normalized.length < count) normalized.push({ type: "Normal" });
    return normalized;
  }

  function renderCoinTypeFields(container, countValue, coinTypes) {
    var count = coinCountValue(countValue);
    container.textContent = "";
    container.hidden = count === 0;
    if (!count) return;
    normalizeCoinTypes(coinTypes, count).forEach(function (coin, index) {
      var label = document.createElement("label");
      label.className = "coin-type-field";
      var name = document.createElement("span");
      name.textContent = "Coin " + (index + 1);
      var typeSelect = document.createElement("select");
      typeSelect.dataset.coinTypeIndex = String(index);
      typeSelect.hidden = true;
      COIN_TYPES.forEach(function (type) {
        var option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
      });
      typeSelect.value = coin.type;
      var typeMenu = document.createElement("details");
      typeMenu.className = "rpg-menu coin-type-menu";
      var typeSummary = document.createElement("summary");
      typeSummary.textContent = coin.type + " Coin";
      typeSummary.setAttribute("aria-label", "Coin " + (index + 1) + " type: " + coin.type);
      var typeChoices = document.createElement("div");
      typeChoices.className = "rpg-menu-options";
      COIN_TYPES.forEach(function (type) {
        var choice = document.createElement("button");
        choice.type = "button";
        choice.textContent = type + " Coin";
        choice.setAttribute("aria-pressed", type === coin.type ? "true" : "false");
        choice.addEventListener("click", function () {
          typeSelect.value = type;
          typeSummary.textContent = type + " Coin";
          typeSummary.setAttribute("aria-label", "Coin " + (index + 1) + " type: " + type);
          typeChoices.querySelectorAll("button").forEach(function (button) {
            button.setAttribute("aria-pressed", button.textContent === type + " Coin" ? "true" : "false");
          });
          typeMenu.open = false;
          typeSelect.dispatchEvent(new Event("change", { bubbles: true }));
        });
        typeChoices.appendChild(choice);
      });
      typeMenu.appendChild(typeSummary);
      typeMenu.appendChild(typeChoices);
      label.appendChild(name);
      label.appendChild(typeSelect);
      label.appendChild(typeMenu);
      container.appendChild(label);
    });
  }

  function readCoinTypeFields(container, countValue) {
    var count = coinCountValue(countValue);
    var coins = [];
    for (var index = 0; index < count; index += 1) {
      coins.push({
        type: container.querySelector('[data-coin-type-index="' + index + '"]') ?
          container.querySelector('[data-coin-type-index="' + index + '"]').value : "Normal"
      });
    }
    return normalizeCoinTypes(coins, count);
  }

  function coinTypeLabel(coin) {
    coin = normalizeCoinTypes([coin], 1)[0];
    return coin.type + " Coin";
  }

  function normalizeTheme(theme) {
    return [
      DEFAULT_THEME,
      "minimalist-light",
      "persona-5",
      "limbus-wiki",
      "cyberpunk-2077"
    ].indexOf(theme) !== -1 ? theme : DEFAULT_THEME;
  }

  function applyTheme(theme) {
    var selectedTheme = normalizeTheme(theme);
    document.documentElement.dataset.theme = selectedTheme;
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      var themeColors = {
        "minimalist-dark": "#121515",
        "minimalist-light": "#f6f7f4",
        "persona-5": "#111111",
        "limbus-wiki": "#242222",
        "cyberpunk-2077": "#080d16"
      };
      themeColor.content = themeColors[selectedTheme] || themeColors[DEFAULT_THEME];
    }
  }

  function parseStaggerThresholds(value) {
    if (Array.isArray(value)) return value.map(function (item) { return String(item).trim().replace(/%$/, ""); }).filter(Boolean);
    if (value && typeof value === "object") {
      return Object.keys(value).sort(function (left, right) {
        return Number(String(left).replace(/\D/g, "")) - Number(String(right).replace(/\D/g, ""));
      }).map(function (key) {
        return String(value[key] === undefined || value[key] === null ? "" : value[key]).trim().replace(/%$/, "");
      }).filter(Boolean);
    }
    var text = String(value || "").trim();
    if (/^n\/a$/i.test(text)) return ["N/A"];
    return text.split("/").map(function (item) { return item.trim().replace(/%$/, ""); }).filter(Boolean);
  }

  function resistanceValue(value) {
    var text = String(value === undefined || value === null ? "" : value).trim();
    if (!text || /^n\/a$/i.test(text)) return "";
    var legacyValues = { fatal: 1.51, weak: 1.01, normal: 1, endure: 0.99, "ineff.": 0.74, ineffective: 0.74, immune: 0 };
    var legacyValue = legacyValues[text.toLocaleLowerCase()];
    if (legacyValue !== undefined) return legacyValue;
    var numeric = Number(text);
    return Number.isFinite(numeric) && numeric >= 0 ? numeric : "";
  }

  function resistanceName(value) {
    if (value === "" || value === null || value === undefined) return "—";
    var multiplier = Number(value);
    if (!Number.isFinite(multiplier) || multiplier < 0) return "—";
    if (multiplier === 0) return "Immune";
    if (multiplier < 0.75) return "Ineff.";
    if (multiplier < 1) return "Endure";
    if (multiplier === 1) return "Normal";
    if (multiplier <= 1.5) return "Weak";
    return "Fatal";
  }

  function resistanceDisplay(value) {
    var name = resistanceName(value);
    return name === "—" ? name : name + " (x" + value + ")";
  }

  function blankStats(stats) {
    var current = stats || {};
    var resistances = current.resistances || {};
    var stagger = current.staggerThresholds !== undefined ? current.staggerThresholds : current.stagger;
    return {
      hp: current.hp === undefined ? "" : current.hp,
      hpGrowth: current.hpGrowth === undefined ? "" : current.hpGrowth,
      staggerThresholds: parseStaggerThresholds(stagger),
      speed: current.speed || "",
      defense: current.defense === undefined ? "" : current.defense,
      resistances: {
        slash: resistanceValue(resistances.slash),
        pierce: resistanceValue(resistances.pierce),
        blunt: resistanceValue(resistances.blunt)
      }
    };
  }

  function migratePassive(passive) {
    var migrated = Object.assign({}, passive || {});
    var oldSinText = String(migrated.sin || "");
    var oldRequirement = String(migrated.requirement || "");
    var oldCombined = oldSinText + " " + oldRequirement;
    var oldSinNames = ["Wrath", "Lust", "Sloth", "Gluttony", "Gloom", "Pride", "Envy", "Angst", "Madness"];
    var requirements = Array.isArray(migrated.requirements) ? migrated.requirements.map(function (requirement) {
      requirement = requirement || {};
      return {
        sinType: requirement.sinType || "",
        sinAmount: requirement.sinAmount === undefined || requirement.sinAmount === null ? "" : requirement.sinAmount,
        sinMode: requirement.sinMode || ""
      };
    }) : [];
    if (!requirements.length && (migrated.sinType || migrated.sinAmount || migrated.sinMode || oldSinText || oldRequirement)) {
      var sinType = migrated.sinType || oldSinNames.find(function (sin) {
        return new RegExp("\\b" + sin + "\\b", "i").test(oldCombined);
      }) || "";
      var oldAmount = migrated.sinAmount;
      if (oldAmount === undefined || oldAmount === null || oldAmount === "") {
        var amount = oldCombined.match(/\b(\d+)\b/);
        oldAmount = amount ? amount[1] : "";
      }
      var sinMode = migrated.sinMode || "";
      if (!sinMode) {
        var mode = oldCombined.match(/\b(Owned|Resonance)\b/i);
        sinMode = mode ? (mode[1].toLocaleLowerCase() === "owned" ? "Owned" : "Resonance") : "";
      }
      requirements.push({ sinType: sinType, sinAmount: oldAmount, sinMode: sinMode });
    }
    migrated.requirements = requirements;
    migrated.effect = migrated.effect || migrated.description || "";
    delete migrated.sin;
    delete migrated.requirement;
    delete migrated.sinType;
    delete migrated.sinAmount;
    delete migrated.sinMode;
    delete migrated.description;
    return migrated;
  }

  function migrateIdentity(identity) {
    var migrated = Object.assign({}, identity);
    migrated.characterId = String(migrated.characterId || "");
    var legacyCharacterName = String(migrated.character || migrated.sinner || "").trim();
    if (!migrated.characterId && legacyCharacterName) migrated.character = legacyCharacterName;
    else delete migrated.character;
    var savedLevel = Number(migrated.level);
    migrated.level = /^n\/a$/i.test(String(migrated.level || "")) ? "N/A" :
      (Number.isInteger(savedLevel) && savedLevel > 0 ? savedLevel : 40);
    migrated.panicDescription = migrated.panicDescription || "";
    migrated.uptieStory = String(migrated.uptieStory || "");
    var voiceLines = Array.isArray(migrated.voiceLines) ? migrated.voiceLines :
      (Array.isArray(migrated.voicelines) ? migrated.voicelines : []);
    migrated.voiceLines = voiceLines.map(function (voiceLine) {
      if (typeof voiceLine === "string") return { category: "Uncategorized", text: voiceLine };
      voiceLine = voiceLine || {};
      var text = String(voiceLine.text || voiceLine.line || "");
      return {
        category: String(voiceLine.category || (text ? "Uncategorized" : "")).trim(),
        text: text
      };
    }).filter(function (voiceLine) { return voiceLine.category && voiceLine.text; });
    delete migrated.voicelines;
    migrated.stats = blankStats(migrated.stats);
    migrated.skills = (Array.isArray(migrated.skills) ? migrated.skills : []).map(function (skill) {
      var updated = Object.assign({}, skill);
      updated.skillLevel = updated.skillLevel === undefined || updated.skillLevel === null ? "" : String(updated.skillLevel);
      updated.amount = updated.amount === undefined || updated.amount === null || updated.amount === "" ? 1 : numberOrEmpty(updated.amount);
      updated.flatDamage = numberOrEmpty(updated.flatDamage);
      updated.coinTypes = normalizeCoinTypes(updated.coinTypes, coinCountValue(updated.coins));
      delete updated.powerModifier;
      if (updated.type !== "Guard" && updated.type !== "Counter") delete updated.clashable;
      else updated.clashable = updated.clashable === true || String(updated.clashable).toLocaleLowerCase() === "true";
      return updated;
    });
    migrated.passives = (Array.isArray(migrated.passives) ? migrated.passives : []).map(migratePassive);
    migrated.rarityVariant = [2, 3].indexOf(Number(migrated.rarity)) !== -1 && migrated.rarityVariant === "Walpurgis" ? "Walpurgis" : "";
    migrated.tags = Array.isArray(migrated.tags) ? migrated.tags :
      (Array.isArray(migrated.keywords) ? migrated.keywords :
        (typeof migrated.keywords === "string" ? migrated.keywords.split(",").map(function (tag) { return tag.trim(); }).filter(Boolean) : []));
    ["sinner", "source", "season", "worldType", "mostRecentRateUp", "positiveSanity", "negativeSanity", "wikiUrl", "keywords"].forEach(function (key) {
      delete migrated[key];
    });
    return migrated;
  }

  function migrateEgo(ego) {
    var migrated = Object.assign({}, ego || {});
    migrated.id = migrated.id === undefined || migrated.id === null ? newId() : String(migrated.id);
    migrated.name = String(migrated.name || "").trim();
    migrated.characterId = String(migrated.characterId || "");
    var legacyCharacterName = String(migrated.character || migrated.sinner || "").trim();
    if (!migrated.characterId && legacyCharacterName) migrated.character = legacyCharacterName;
    else delete migrated.character;
    migrated.riskLevel = String(migrated.riskLevel || migrated.risk || "").toUpperCase();
    migrated.sinAffinity = String(migrated.sinAffinity || migrated.affinity || "");
    migrated.sourceAbnormality = String(migrated.sourceAbnormality || migrated.abnormality || "");
    migrated.releaseDate = String(migrated.releaseDate || "");
    migrated.acquisition = String(migrated.acquisition || migrated.obtained || "");
    migrated.baseEgo = migrated.baseEgo === true || String(migrated.baseEgo).toLocaleLowerCase() === "true";
    migrated.passiveAlwaysActive = migrated.passiveAlwaysActive === true ||
      String(migrated.passiveAlwaysActive).toLocaleLowerCase() === "true";
    migrated.awakeningSanityCost = numberOrEmpty(migrated.awakeningSanityCost);
    migrated.corrosionSanityCost = numberOrEmpty(migrated.corrosionSanityCost);
    migrated.resourceCosts = Object.assign({}, migrated.resourceCosts || {});
    migrated.sinResistances = Object.assign({}, migrated.sinResistances || {});
    EGO_SINS.forEach(function (sin) {
      var cost = migrated.resourceCosts[sin];
      migrated.resourceCosts[sin] = numberOrEmpty(cost);
      var storedResistance = migrated.sinResistances[sin];
      migrated.sinResistances[sin] = storedResistance === "" || storedResistance === undefined || storedResistance === null ?
        (sin === "Angst" || sin === "Madness" ? 1.51 : "") : resistanceValue(storedResistance);
    });
    migrated.awakeningQuote = String(migrated.awakeningQuote || "");
    migrated.corrosionQuote = String(migrated.corrosionQuote || "");
    migrated.skills = (Array.isArray(migrated.skills) ? migrated.skills : []).map(function (skill) {
      skill = skill || {};
      var skillEffect = String(skill.effect || "").trim();
      var oldCoinEffects = String(skill.coinEffects || "").trim();
      var skillThreadspin = Number(skill.threadspin);
      return {
        mode: skill.mode === "Corrosion" ? "Corrosion" : "Awakening",
        threadspin: String(Number.isInteger(skillThreadspin) && skillThreadspin >= 1 && skillThreadspin <= 4 ?
          skillThreadspin : 4),
        name: String(skill.name || ""),
        sinAffinity: String(skill.sinAffinity || ""),
        attackType: String(skill.attackType || ""),
        basePower: String(skill.basePower === undefined || skill.basePower === null ? "" : skill.basePower),
        coinPower: String(skill.coinPower || ""),
        coinCount: numberOrEmpty(skill.coinCount),
        coinTypes: normalizeCoinTypes(skill.coinTypes, coinCountValue(skill.coinCount)),
        attackWeight: numberOrEmpty(skill.attackWeight),
        amount: skill.amount === undefined || skill.amount === null || skill.amount === "" ? 1 : numberOrEmpty(skill.amount),
        flatDamage: numberOrEmpty(skill.flatDamage),
        effect: [skillEffect, oldCoinEffects].filter(Boolean).join("\n\n")
      };
    }).filter(function (skill) {
      return Boolean(skill.name || skill.effect || skill.basePower || skill.coinPower ||
        skill.amount !== 1 || Number(skill.flatDamage) > 0);
    });
    migrated.skills.forEach(function (skill) { delete skill.offenseModifier; });
    migrated.passiveName = String(migrated.passiveName || "");
    var passiveThreadspin = Number(migrated.passiveThreadspin);
    migrated.passiveThreadspin = Number.isInteger(passiveThreadspin) && passiveThreadspin >= 1 && passiveThreadspin <= 4 ?
      String(passiveThreadspin) : "";
    migrated.passiveRequirement = String(migrated.passiveRequirement || "");
    migrated.passiveEffect = String(migrated.passiveEffect || "");
    migrated.passiveRequirements = Array.isArray(migrated.passiveRequirements) ?
      migratePassive({ requirements: migrated.passiveRequirements }).requirements : [];
    migrated.notes = String(migrated.notes || "");
    migrated.createdAt = String(migrated.createdAt || migrated.updatedAt || "");
    migrated.updatedAt = String(migrated.updatedAt || migrated.createdAt || "");
    delete migrated.sinner;
    delete migrated.risk;
    delete migrated.affinity;
    delete migrated.abnormality;
    delete migrated.obtained;
    delete migrated.season;
    return migrated;
  }

  function loadEgoState() {
    try {
      var raw = localStorage.getItem(EGO_STORAGE_KEY);
      if (!raw) return { schemaVersion: EGO_SCHEMA_VERSION, egos: [] };
      var parsed = JSON.parse(raw);
      var entries = Array.isArray(parsed) ? parsed : parsed && parsed.egos;
      if (Array.isArray(entries)) {
        var migratedState = { schemaVersion: EGO_SCHEMA_VERSION, egos: entries.filter(function (ego) {
          return ego && typeof ego === "object";
        }).map(migrateEgo) };
        if (JSON.stringify(migratedState) !== JSON.stringify(parsed)) {
          try { localStorage.setItem(EGO_STORAGE_KEY, JSON.stringify(migratedState)); }
          catch (migrationError) { console.warn("Could not save E.G.O data migration in browser storage.", migrationError); }
        }
        return migratedState;
      }
    } catch (error) {
      console.warn("Could not read saved E.G.O records; loading an empty archive.", error);
    }
    return { schemaVersion: EGO_SCHEMA_VERSION, egos: [] };
  }

  function saveEgoState() {
    try {
      localStorage.setItem(EGO_STORAGE_KEY, JSON.stringify(egoState));
      return true;
    } catch (error) {
      alert("E.G.O records could not be saved in this browser. Export the E.G.O JSON file to keep a copy.");
      return false;
    }
  }

  function migrateAnnouncer(announcer) {
    var migrated = Object.assign({}, announcer);
    migrated.id = String(migrated.id || newId());
    migrated.name = String(migrated.name || "").trim();
    migrated.characterId = String(migrated.characterId || "");
    migrated.source = String(migrated.source || "");
    migrated.notes = String(migrated.notes || "");
    migrated.voiceLines = (Array.isArray(migrated.voiceLines) ? migrated.voiceLines : []).map(function (line) {
      return {
        category: String(line && line.category || ""),
        text: String(line && line.text || "")
      };
    }).filter(function (line) {
      return ANNOUNCER_CATEGORIES.includes(line.category) && line.text.trim();
    });
    migrated.createdAt = String(migrated.createdAt || migrated.updatedAt || "");
    migrated.updatedAt = String(migrated.updatedAt || migrated.createdAt || "");
    return migrated;
  }

  function loadAnnouncerState() {
    try {
      var raw = localStorage.getItem(ANNOUNCER_STORAGE_KEY);
      if (!raw) return { schemaVersion: ANNOUNCER_SCHEMA_VERSION, announcers: [] };
      var parsed = JSON.parse(raw);
      var entries = Array.isArray(parsed) ? parsed : parsed && parsed.announcers;
      if (Array.isArray(entries)) {
        var migratedState = {
          schemaVersion: ANNOUNCER_SCHEMA_VERSION,
          announcers: entries.filter(function (announcer) { return announcer && typeof announcer === "object"; }).map(migrateAnnouncer)
        };
        if (JSON.stringify(migratedState) !== JSON.stringify(parsed)) {
          try { localStorage.setItem(ANNOUNCER_STORAGE_KEY, JSON.stringify(migratedState)); }
          catch (migrationError) { console.warn("Could not save announcer data migration in browser storage.", migrationError); }
        }
        return migratedState;
      }
    } catch (error) {
      console.warn("Could not read saved announcers; loading an empty archive.", error);
    }
    return { schemaVersion: ANNOUNCER_SCHEMA_VERSION, announcers: [] };
  }

  function saveAnnouncerState() {
    try {
      localStorage.setItem(ANNOUNCER_STORAGE_KEY, JSON.stringify(announcerState));
      return true;
    } catch (error) {
      alert("Announcers could not be saved in this browser.");
      return false;
    }
  }

  function migrateStatusEffect(effect) {
    var migrated = Object.assign({}, effect);
    migrated.id = String(migrated.id || newId());
    migrated.name = String(migrated.name || "").trim();
    migrated.identifier = String(migrated.identifier || "").trim();
    migrated.description = String(migrated.description || migrated.effect || "");
    migrated.notes = String(migrated.notes || "");
    migrated.createdAt = String(migrated.createdAt || migrated.updatedAt || "");
    migrated.updatedAt = String(migrated.updatedAt || migrated.createdAt || "");
    delete migrated.effect;
    return migrated;
  }

  function seedDefaultStatusEffects(statusState) {
    var seededState = statusState || { schemaVersion: STATUS_EFFECT_SCHEMA_VERSION, statusEffects: [] };
    seededState.statusEffects = Array.isArray(seededState.statusEffects) ? seededState.statusEffects : [];
    var now = new Date().toISOString();
    var appliedSeedVersion = Number(seededState.defaultSeedVersion) || 0;
    DEFAULT_STATUS_EFFECT_SEEDS.forEach(function (seed) {
      if (seed.version > STATUS_EFFECT_DEFAULT_SEED_VERSION || appliedSeedVersion >= seed.version) return;
      (seed.updates || []).forEach(function (update) {
        var existing = seededState.statusEffects.find(function (effect) {
          return effect.identifier === update.identifier;
        });
        if (existing && existing.description === update.previousDescription) {
          existing.description = update.description;
          existing.updatedAt = now;
        }
      });
      seed.effects.forEach(function (defaultEffect) {
        var defaultKeys = [defaultEffect.name, defaultEffect.identifier].map(function (value) {
          return String(value).trim().toLocaleLowerCase();
        });
        var alreadyExists = seededState.statusEffects.some(function (effect) {
          return [effect.name, effect.identifier].some(function (value) {
            return defaultKeys.includes(String(value || "").trim().toLocaleLowerCase());
          });
        });
        if (alreadyExists) return;
        seededState.statusEffects.push(migrateStatusEffect(Object.assign({}, defaultEffect, {
          id: newId(),
          notes: "",
          createdAt: now,
          updatedAt: now
        })));
      });
      appliedSeedVersion = seed.version;
      seededState.defaultSeedVersion = appliedSeedVersion;
    });
    return seededState;
  }

  function loadStatusEffectState() {
    try {
      var raw = localStorage.getItem(STATUS_EFFECT_STORAGE_KEY);
      if (!raw) {
        var initialState = seedDefaultStatusEffects({
          schemaVersion: STATUS_EFFECT_SCHEMA_VERSION,
          defaultSeedVersion: 0,
          statusEffects: []
        });
        try { localStorage.setItem(STATUS_EFFECT_STORAGE_KEY, JSON.stringify(initialState)); }
        catch (initialSaveError) { console.warn("Could not save default status effects in browser storage.", initialSaveError); }
        return initialState;
      }
      var parsed = JSON.parse(raw);
      var entries = Array.isArray(parsed) ? parsed : parsed && parsed.statusEffects;
      if (Array.isArray(entries)) {
        var migratedState = seedDefaultStatusEffects({
          schemaVersion: STATUS_EFFECT_SCHEMA_VERSION,
          defaultSeedVersion: Number(parsed && parsed.defaultSeedVersion) || 0,
          statusEffects: entries.filter(function (effect) { return effect && typeof effect === "object"; }).map(migrateStatusEffect)
        });
        if (JSON.stringify(migratedState) !== JSON.stringify(parsed)) {
          try { localStorage.setItem(STATUS_EFFECT_STORAGE_KEY, JSON.stringify(migratedState)); }
          catch (migrationError) { console.warn("Could not save status effect data migration in browser storage.", migrationError); }
        }
        return migratedState;
      }
    } catch (error) {
      console.warn("Could not read saved status effects; loading the built-in defaults.", error);
    }
    return seedDefaultStatusEffects({
      schemaVersion: STATUS_EFFECT_SCHEMA_VERSION,
      defaultSeedVersion: 0,
      statusEffects: []
    });
  }

  function saveStatusEffectState() {
    try {
      localStorage.setItem(STATUS_EFFECT_STORAGE_KEY, JSON.stringify(statusEffectState));
      return true;
    } catch (error) {
      alert("Status effects could not be saved in this browser.");
      return false;
    }
  }

  function normalizedCharacterName(name) {
    return String(name || "").trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  }

  var DEFAULT_STATUS_EFFECT_KEYS = new Set();
  var COMMON_STATUS_EFFECT_IDS = new Set();
  DEFAULT_STATUS_EFFECT_SEEDS.forEach(function (seed) {
    seed.effects.forEach(function (effect) {
      DEFAULT_STATUS_EFFECT_KEYS.add(String(effect.name).trim().toLocaleLowerCase());
      DEFAULT_STATUS_EFFECT_KEYS.add(String(effect.identifier).trim().toLocaleLowerCase());
      COMMON_STATUS_EFFECT_IDS.add(normalizedCharacterName(effect.identifier));
    });
  });

  function migrateCharacter(character) {
    var migrated = Object.assign({}, character || {});
    migrated.id = String(migrated.id || newId());
    migrated.name = String(migrated.name || "").trim();
    migrated.affiliation = String(migrated.affiliation || "");
    migrated.introduction = String(migrated.introduction || migrated.profile || "");
    migrated.personality = String(migrated.personality || "");
    migrated.history = String(migrated.history || "");
    migrated.relationships = String(migrated.relationships || "");
    migrated.trivia = String(migrated.trivia || "");
    migrated.notes = String(migrated.notes || "");
    migrated.equippedEgoIds = Object.assign({}, migrated.equippedEgoIds || {});
    migrated.equippedEgoThreadspins = Object.assign({}, migrated.equippedEgoThreadspins || {});
    migrated.usedEgoPassiveIds = Array.isArray(migrated.usedEgoPassiveIds) ?
      Array.from(new Set(migrated.usedEgoPassiveIds.map(String).filter(Boolean))) : [];
    EGO_RISK_LEVELS.forEach(function (risk) {
      var threadspin = Number(migrated.equippedEgoThreadspins[risk]);
      migrated.equippedEgoThreadspins[risk] = Number.isInteger(threadspin) && threadspin >= 1 && threadspin <= 4 ?
        threadspin : 4;
    });
    migrated.createdAt = String(migrated.createdAt || migrated.updatedAt || "");
    migrated.updatedAt = String(migrated.updatedAt || migrated.createdAt || "");
    delete migrated.profile;
    return migrated;
  }

  function loadCharacterState() {
    var raw = null;
    var parsed = null;
    try {
      raw = localStorage.getItem(CHARACTER_STORAGE_KEY);
      parsed = raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Could not read saved character profiles; rebuilding them from archive records.", error);
    }
    var savedCharacters = Array.isArray(parsed) ? parsed : parsed && parsed.characters;
    var characters = [];
    function addCharacter(input) {
      var record = migrateCharacter(input);
      if (!record.name) return null;
      var now = new Date().toISOString();
      record.createdAt = record.createdAt || now;
      record.updatedAt = record.updatedAt || record.createdAt;
      var existingByName = characters.find(function (character) {
        return normalizedCharacterName(character.name) === normalizedCharacterName(record.name);
      });
      if (existingByName) return existingByName;
      if (characters.some(function (character) { return character.id === record.id; })) record.id = newId();
      characters.push(record);
      return record;
    }
    (Array.isArray(savedCharacters) ? savedCharacters : []).forEach(addCharacter);

    var oldIdentities = JSON.stringify(state.identities);
    var oldEgos = JSON.stringify(egoState.egos);
    var oldAnnouncers = JSON.stringify(announcerState.announcers);
    function linkCharacter(record) {
      var legacyName = String(record.character || record.sinner || "").trim();
      var character = characters.find(function (entry) { return entry.id === record.characterId; }) ||
        (legacyName ? characters.find(function (entry) {
          return normalizedCharacterName(entry.name) === normalizedCharacterName(legacyName);
        }) : null);
      if (!character && legacyName) character = addCharacter({ name: legacyName });
      record.characterId = character ? character.id : "";
      delete record.character;
      delete record.sinner;
    }
    state.identities.forEach(linkCharacter);
    egoState.egos.forEach(linkCharacter);
    announcerState.announcers.forEach(function (announcer) {
      var character = characters.find(function (entry) { return entry.id === announcer.characterId; }) ||
        (announcer.source ? characters.find(function (entry) {
          return normalizedCharacterName(entry.name) === normalizedCharacterName(announcer.source);
        }) : null);
      announcer.characterId = character ? character.id : "";
    });

    var characterState = { schemaVersion: CHARACTER_SCHEMA_VERSION, characters: characters };
    if (!raw || JSON.stringify(characterState) !== JSON.stringify(parsed)) {
      try { localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(characterState)); }
      catch (saveError) { console.warn("Could not save migrated character profiles in browser storage.", saveError); }
    }
    if (oldIdentities !== JSON.stringify(state.identities)) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
      catch (saveError) { console.warn("Could not save identity character references in browser storage.", saveError); }
    }
    if (oldEgos !== JSON.stringify(egoState.egos)) {
      try { localStorage.setItem(EGO_STORAGE_KEY, JSON.stringify(egoState)); }
      catch (saveError) { console.warn("Could not save E.G.O character references in browser storage.", saveError); }
    }
    if (oldAnnouncers !== JSON.stringify(announcerState.announcers)) {
      try { localStorage.setItem(ANNOUNCER_STORAGE_KEY, JSON.stringify(announcerState)); }
      catch (saveError) { console.warn("Could not save announcer character references in browser storage.", saveError); }
    }
    return characterState;
  }

  function saveCharacterState() {
    try {
      localStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(characterState));
      return true;
    } catch (error) {
      alert("Characters could not be saved in this browser.");
      return false;
    }
  }

  function characterById(id) {
    return characterState.characters.find(function (character) { return character.id === id; }) || null;
  }

  function characterName(characterId) {
    var character = characterById(characterId);
    return character ? character.name : "";
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { schemaVersion: STATE_VERSION, settings: defaultSettings(), identities: [] };
      var parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.identities)) {
        var savedIdentities = parsed.identities.filter(function (identity) {
          return identity && typeof identity === "object" && identity.source !== "wiki";
        }).map(migrateIdentity);
        var settings = normalizeSettings(parsed.settings);
        var migratedState = { schemaVersion: STATE_VERSION, settings: settings, identities: savedIdentities };
        if (JSON.stringify(migratedState) !== JSON.stringify(parsed)) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedState));
          } catch (migrationError) {
            console.warn("Could not save the archive data migration in browser storage.", migrationError);
          }
        }
        return migratedState;
      }
    } catch (error) {
      console.warn("Could not read the saved archive; loading an empty archive.", error);
    }
    return { schemaVersion: STATE_VERSION, settings: defaultSettings(), identities: [] };
  }

  function defaultSettings() {
    return { maxLevel: 40, theme: DEFAULT_THEME, combatActivePassivesOnly: false, flatDamageMode: "per-skill" };
  }

  function normalizeSettings(settings) {
    var normalized = defaultSettings();
    settings = settings || {};
    var maxLevel = Number(settings.maxLevel);
    normalized.maxLevel = Number.isInteger(maxLevel) && maxLevel > 0 ? maxLevel : 40;
    normalized.theme = normalizeTheme(settings.theme);
    normalized.combatActivePassivesOnly = Boolean(settings.combatActivePassivesOnly);
    normalized.flatDamageMode = settings.flatDamageMode === "per-die" ? "per-die" : "per-skill";
    return normalized;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      alert("The archive could not be saved in this browser. Export the JSON file to keep a copy.");
      return false;
    }
  }

  function byId(id) {
    return state.identities.find(function (identity) { return identity.id === id; }) || null;
  }

  function statusEffectById(id) {
    return statusEffectState.statusEffects.find(function (effect) { return effect.id === id; }) || null;
  }

  function statusEffectByReference(reference) {
    var key = String(reference || "").trim().toLocaleLowerCase();
    if (!key) return null;
    return statusEffectState.statusEffects.find(function (effect) {
      return effect.name.toLocaleLowerCase() === key || effect.identifier.toLocaleLowerCase() === key;
    }) || null;
  }

  function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function renderKeywordText(value) {
    var text = String(value || "");
    var output = "";
    var lastIndex = 0;
    var match;
    KEYWORD_COLOR_PATTERN.lastIndex = 0;
    while ((match = KEYWORD_COLOR_PATTERN.exec(text))) {
      output += escapeHtml(text.slice(lastIndex, match.index));
      var normalized = match[0].replace(/[\[\]]/g, "").replace(/[\s_-]+/g, " ").trim().toLocaleLowerCase();
      var keyword = SORTED_KEYWORD_COLORS.find(function (entry) { return entry.text.toLocaleLowerCase() === normalized; });
      output += keyword ? '<span class="formatted-keyword" style="color:' + keyword.color + '">' + escapeHtml(match[0]) + "</span>" : escapeHtml(match[0]);
      lastIndex = match.index + match[0].length;
    }
    return output + escapeHtml(text.slice(lastIndex));
  }

  function renderStatusEffectReference(reference) {
    var effect = statusEffectByReference(reference);
    if (!effect) return renderKeywordText("{{" + reference + "}}");
    return '<a class="status-effect-link" href="#" data-status-effect-id="' + escapeHtml(effect.id) +
      '" aria-label="Open status effect: ' + escapeHtml(effect.name) + '">' + escapeHtml(effect.name) + '</a>';
  }

  function hideStatusEffectTooltip() {
    if (statusEffectTooltipTimer !== null) window.clearTimeout(statusEffectTooltipTimer);
    statusEffectTooltipTimer = null;
    if (statusEffectTooltipAnchor) statusEffectTooltipAnchor.removeAttribute("aria-describedby");
    statusEffectTooltipAnchor = null;
    statusEffectTooltipElement.hidden = true;
    statusEffectTooltipElement.textContent = "";
  }

  function positionStatusEffectTooltip(anchor) {
    statusEffectTooltipElement.hidden = false;
    statusEffectTooltipElement.style.left = "0px";
    statusEffectTooltipElement.style.top = "0px";
    var anchorRect = anchor.getBoundingClientRect();
    var tooltipRect = statusEffectTooltipElement.getBoundingClientRect();
    var margin = 10;
    var left = Math.max(margin, Math.min(window.innerWidth - tooltipRect.width - margin, anchorRect.left));
    var top = anchorRect.bottom + 8;
    if (top + tooltipRect.height > window.innerHeight - margin) top = Math.max(margin, anchorRect.top - tooltipRect.height - 8);
    statusEffectTooltipElement.style.left = left + "px";
    statusEffectTooltipElement.style.top = top + "px";
  }

  function scheduleStatusEffectTooltip(anchor) {
    if (statusEffectTooltipAnchor === anchor && (statusEffectTooltipTimer !== null || !statusEffectTooltipElement.hidden)) return;
    hideStatusEffectTooltip();
    statusEffectTooltipAnchor = anchor;
    statusEffectTooltipTimer = window.setTimeout(function () {
      statusEffectTooltipTimer = null;
      var effect = statusEffectById(anchor.dataset.statusEffectId);
      if (!effect || !anchor.isConnected) {
        hideStatusEffectTooltip();
        return;
      }
      var description = effect.description ? renderMarkdown(effect.description) : '<span class="quiet-copy">No effect description recorded.</span>';
      statusEffectTooltipElement.innerHTML = '<strong class="status-effect-tooltip-title">' + escapeHtml(effect.name) +
        '</strong><div class="status-effect-tooltip-body markdown-content">' + description + '</div>';
      statusEffectTooltipElement.querySelectorAll("a").forEach(function (link) {
        link.replaceWith(document.createTextNode(link.textContent));
      });
      anchor.setAttribute("aria-describedby", "status-effect-tooltip");
      positionStatusEffectTooltip(anchor);
    }, 550);
  }

  function renderStatusEffectLinks(value) {
    var text = String(value || "");
    var token = /\{\{([^{}]+)\}\}/g;
    var output = "";
    var lastIndex = 0;
    var match;
    while ((match = token.exec(text))) {
      output += renderKeywordText(text.slice(lastIndex, match.index));
      output += renderStatusEffectReference(match[1]);
      lastIndex = match.index + match[0].length;
    }
    return output + renderKeywordText(text.slice(lastIndex));
  }

  function renderInlineMarkdown(value) {
    var text = String(value || "");
    var tokens = /`([^`\n]+)`|\{\{([^{}\n]+)\}\}|\[([^\]\n]+)\]\(([^)\s]+)\)|\*\*([\s\S]+?)\*\*|__([\s\S]+?)__|\*([^*\n]+)\*|_([^_\n]+)_/g;
    var output = "";
    var lastIndex = 0;
    var match;
    while ((match = tokens.exec(text))) {
      output += renderStatusEffectLinks(text.slice(lastIndex, match.index));
      if (match[1] !== undefined) {
        output += "<code>" + escapeHtml(match[1]) + "</code>";
      } else if (match[2] !== undefined) {
        output += renderStatusEffectReference(match[2]);
      } else if (match[3] !== undefined) {
        var url;
        try { url = new URL(match[4], window.location.href); } catch (error) { url = null; }
        if (url && (url.protocol === "http:" || url.protocol === "https:")) {
          output += '<a href="' + escapeHtml(url.href) + '" target="_blank" rel="noreferrer">' +
            renderInlineMarkdown(match[3]) + "</a>";
        } else {
          output += renderStatusEffectLinks(match[0]);
        }
      } else if (match[5] !== undefined) {
        output += "<strong>" + renderInlineMarkdown(match[5]) + "</strong>";
      } else if (match[6] !== undefined) output += "<strong>" + renderInlineMarkdown(match[6]) + "</strong>";
      else if (match[7] !== undefined) output += "<em>" + renderInlineMarkdown(match[7]) + "</em>";
      else output += "<em>" + renderInlineMarkdown(match[8]) + "</em>";
      lastIndex = match.index + match[0].length;
    }
    return output + renderStatusEffectLinks(text.slice(lastIndex));
  }

  function renderMarkdown(value) {
    var lines = String(value || "").replace(/\r\n?/g, "\n").split("\n");
    var output = [];
    var paragraph = [];
    var listItems = [];
    var listTag = "";
    var codeLines = [];
    var inCode = false;
    function flushParagraph() {
      if (!paragraph.length) return;
      var paragraphHtml = paragraph.map(function (line, index) {
        var hardBreak = /(?: {2,}|\\)$/.test(line);
        var content = hardBreak ? line.replace(/(?: {2,}|\\)$/, "") : line;
        return renderInlineMarkdown(content) + (index < paragraph.length - 1 ? (hardBreak ? "<br>" : " ") : "");
      }).join("");
      output.push("<p>" + paragraphHtml + "</p>");
      paragraph = [];
    }
    function flushList() {
      if (!listItems.length) return;
      output.push("<" + listTag + ">" + listItems.map(function (item) {
        return "<li>" + renderInlineMarkdown(item) + "</li>";
      }).join("") + "</" + listTag + ">");
      listItems = [];
      listTag = "";
    }
    lines.forEach(function (line) {
      if (/^\s*```/.test(line)) {
        flushParagraph();
        flushList();
        if (inCode) {
          output.push("<pre><code>" + escapeHtml(codeLines.join("\n")) + "</code></pre>");
          codeLines = [];
          inCode = false;
        } else inCode = true;
        return;
      }
      if (inCode) { codeLines.push(line); return; }
      if (!line.trim()) { flushParagraph(); flushList(); return; }
      var heading = line.match(/^\s*(#{1,6})\s+(.+)$/);
      if (heading) {
        flushParagraph(); flushList();
        var level = heading[1].length;
        output.push("<h" + level + ">" + renderInlineMarkdown(heading[2]) + "</h" + level + ">");
        return;
      }
      var quote = line.match(/^\s*>\s?(.*)$/);
      if (quote) {
        flushParagraph(); flushList();
        output.push("<blockquote>" + renderInlineMarkdown(quote[1]) + "</blockquote>");
        return;
      }
      var list = line.match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
      if (list) {
        flushParagraph();
        var nextListTag = list[2] ? "ol" : "ul";
        if (listTag && listTag !== nextListTag) flushList();
        listTag = nextListTag;
        listItems.push(list[3]);
        return;
      }
      flushList();
      paragraph.push(line);
    });
    if (inCode) output.push("<pre><code>" + escapeHtml(codeLines.join("\n")) + "</code></pre>");
    flushParagraph();
    flushList();
    return output.join("");
  }

  function formatDate(value) {
    if (!value) return "—";
    var date = new Date(value + (String(value).length === 10 ? "T12:00:00" : ""));
    return Number.isNaN(date.getTime()) ? escapeHtml(value) :
      date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function rarityText(value, variant) {
    if (/^n\/a$/i.test(String(value || ""))) return "N/A";
    var rarity = Number(value);
    if (rarity < 1 || rarity > 3) return "Not set";
    return "★".repeat(rarity) + (variant === "Walpurgis" && (rarity === 2 || rarity === 3) ? " · Walpurgis" : "");
  }

  function hpDisplay(identity, stats) {
    if (stats.hp === "" || stats.hp === undefined || stats.hp === null) return "—";
    if (/^n\/a$/i.test(String(stats.hp)) || /^n\/a$/i.test(String(stats.hpGrowth)) || /^n\/a$/i.test(String(identity.level))) return "N/A";
    var baseHp = Number(stats.hp);
    if (!Number.isFinite(baseHp)) return escapeHtml(stats.hp);
    var growth = stats.hpGrowth === "" || stats.hpGrowth === undefined || stats.hpGrowth === null ? 0 : Number(stats.hpGrowth);
    if (!Number.isFinite(growth)) growth = 0;
    var level = Number(identity.level) || 40;
    var calculatedHp = baseHp + level * growth;
    var formattedHp = String(Number.isInteger(calculatedHp) ? calculatedHp : Math.ceil(calculatedHp));
    return escapeHtml(formattedHp) + ' <span class="base-hp-value">(' + escapeHtml(stats.hp) + ")</span>";
  }

  function normalizedKey(identity) {
    return (identity.characterId || "") + "|" +
      (identity.name || "").trim().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  }

  function populateCharacterSelect(select, placeholder) {
    if (!select) return;
    var selected = select.value;
    select.textContent = "";
    var emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = placeholder;
    select.appendChild(emptyOption);
    characterState.characters.slice().sort(function (left, right) {
      return left.name.localeCompare(right.name);
    }).forEach(function (character) {
      var option = document.createElement("option");
      option.value = character.id;
      option.textContent = character.name;
      select.appendChild(option);
    });
    select.value = characterState.characters.some(function (character) { return character.id === selected; }) ? selected : "";
  }

  function setupCharacterOptions() {
    populateCharacterSelect(document.getElementById("character-filter"), "All characters");
    populateCharacterSelect(form.elements.namedItem("character"), "Select a character");
    populateCharacterSelect(egoForm.elements.namedItem("character"), "Select a character");
    populateCharacterSelect(announcerForm.elements.namedItem("character"), "Not linked");
  }

  function compareByCharacter(left, right) {
    return characterName(left.characterId).localeCompare(characterName(right.characterId)) || left.name.localeCompare(right.name);
  }

  function searchableText(identity) {
    var skillText = (identity.skills || []).map(function (skill) {
      return Object.values(skill).join(" ");
    }).join(" ");
    var passiveText = (identity.passives || []).map(function (passive) {
      var requirements = (passive.requirements || []).map(function (requirement) {
        return [requirement.sinType, requirement.sinAmount, requirement.sinMode].join(" ");
      }).join(" ");
      return [passive.name, passive.effect, requirements].join(" ");
    }).join(" ");
    return [identity.name, characterName(identity.characterId), identity.mirrorWorld, identity.notes,
      identity.prefix, identity.panic, identity.panicDescription, identity.uptieStory,
      (identity.voiceLines || []).map(function (voiceLine) { return [voiceLine.category, voiceLine.text].join(" "); }).join(" "),
      (identity.tags || []).join(" "),
      skillText, passiveText].join(" ").toLocaleLowerCase();
  }

  function filteredIdentities() {
    var query = document.getElementById("search-input").value.trim().toLocaleLowerCase();
    var character = document.getElementById("character-filter").value;
    var rarity = document.getElementById("rarity-filter").value;
    var sort = document.getElementById("sort-filter").value;
    var matches = state.identities.filter(function (identity) {
      return (!query || searchableText(identity).includes(query)) &&
        (!character || identity.characterId === character) &&
        (!rarity || (rarity.endsWith("-walpurgis") ?
          String(identity.rarity) === rarity.charAt(0) && identity.rarityVariant === "Walpurgis" :
          String(identity.rarity) === rarity));
    });
    if (sort === "rarity") matches.sort(function (a, b) {
      return (Number(b.rarity) || 0) - (Number(a.rarity) || 0) ||
        String(a.rarityVariant || "").localeCompare(String(b.rarityVariant || "")) || compareByCharacter(a, b);
    });
    else if (sort === "name") matches.sort(function (a, b) { return a.name.localeCompare(b.name); });
    else if (sort === "recent") matches.sort(function (a, b) {
      return String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""));
    });
    else matches.sort(compareByCharacter);
    return matches;
  }

  function renderList() {
    var matches = filteredIdentities();
    listElement.textContent = "";
    document.getElementById("result-count").textContent =
      matches.length + " shown · " + state.identities.length + " total";
    document.getElementById("empty-state").hidden = matches.length !== 0;

    matches.forEach(function (identity) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "identity-item" + (identity.id === selectedId ? " is-selected" : "");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", identity.id === selectedId ? "true" : "false");
      item.dataset.id = identity.id;
      var rarity = Number(identity.rarity);
      item.innerHTML =
        '<span class="identity-item-copy"><span class="identity-item-name">' + escapeHtml(identity.name) +
        '</span><span class="identity-item-character">' + escapeHtml(characterName(identity.characterId) || "No character") + '</span></span>' +
        '<span class="identity-item-side">' +
        (rarity ? '<span class="mini-rarity">' + "★".repeat(Math.min(3, rarity)) + '</span>' : "") +
        (identity.rarityVariant === "Walpurgis" ? '<span class="rarity-variant-mark" title="Walpurgis">W</span>' : "") + "</span>";
      listElement.appendChild(item);
    });
  }

  function renderDetail() {
    var identity = byId(selectedId);
    if (!identity) {
      detailElement.innerHTML = '<div class="empty-detail"><span class="empty-glyph" aria-hidden="true">◇</span>' +
        "<h2>Select an identity</h2><p>Choose a record from the archive or add a new one.</p></div>";
      return;
    }

    var stats = blankStats(identity.stats);
    var resistances = stats.resistances;
    var skills = Array.isArray(identity.skills) ? identity.skills : [];
    var passives = Array.isArray(identity.passives) ? identity.passives : [];
    var voiceLines = Array.isArray(identity.voiceLines) ? identity.voiceLines : [];
    var tags = Array.isArray(identity.tags) ? identity.tags : [];
    var skillContent = skills.length ? skills.map(function (skill) {
      var detail = [skill.sin, skill.type, skill.skillLevel ? "Skill " + skill.skillLevel : "",
        skill.clashable ? "Clashable" : "",
        skill.skillPower ? "Power " + skill.skillPower : "", skill.coinPower ? "Coin " + skill.coinPower : "",
        skill.coins ? skill.coins + " coins" : "", skill.amount ? "Pool weight " + skill.amount : "",
        skill.coins && skill.coinTypes && skill.coinTypes.length ? normalizeCoinTypes(skill.coinTypes, coinCountValue(skill.coins)).map(coinTypeLabel).join(", ") : "",
        Number(skill.flatDamage) > 0 ? "Flat damage +" + skill.flatDamage : "",
        skill.attackWeight ? "Weight " + skill.attackWeight : ""]
        .filter(Boolean).join(" · ");
      return '<div class="skill-card"><div class="skill-card-heading"><strong>' +
        escapeHtml(skill.name || "Unnamed skill") + '</strong><span>' + escapeHtml(detail || "No skill values") +
        "</span></div>" + (skill.effect ? '<div class="markdown-content">' + renderMarkdown(skill.effect) + "</div>" : "") + "</div>";
    }).join("") : '<p class="quiet-copy">No skills recorded yet.</p>';
    var passiveContent = passives.length ? passives.map(function (passive) {
      var details = (passive.requirements || []).map(function (requirement) {
        return [requirement.sinAmount, requirement.sinType, requirement.sinMode].filter(function (value) {
          return value !== undefined && value !== null && String(value).trim() !== "";
        }).join(" ");
      }).filter(Boolean).join(" + ");
      return '<div class="passive-card"><div class="passive-card-heading"><strong>' +
        escapeHtml(passive.name || "Unnamed passive") + '</strong><span>' + escapeHtml(details || "No activation requirement") +
        "</span></div>" + (passive.effect ? '<div class="markdown-content">' + renderMarkdown(passive.effect) + "</div>" : "") + "</div>";
    }).join("") : '<p class="quiet-copy">No passives recorded yet.</p>';
    var voiceLineContent = voiceLines.length ? voiceLines.map(function (voiceLine) {
      return '<div class="voice-line-card"><strong>' + escapeHtml(voiceLine.category || "Uncategorized") +
        '</strong><div class="markdown-content">' + renderMarkdown(voiceLine.text || "") + "</div></div>";
    }).join("") : '<p class="quiet-copy">No voicelines recorded yet.</p>';
    var uptieStoryContent = identity.uptieStory ? renderMarkdown(identity.uptieStory) :
      '<span class="quiet-copy">No uptie story recorded.</span>';
    var tagContent = tags.length ? tags.map(function (tag) {
      return '<span class="keyword-chip">' + renderKeywordText(tag) + "</span>";
    }).join("") : '<span class="quiet-copy">No tags recorded.</span>';
    var staggerContent = stats.staggerThresholds.length ? stats.staggerThresholds.map(function (threshold) {
      return /^n\/a$/i.test(String(threshold)) ? "N/A" : escapeHtml(threshold) + "%";
    }).join(" / ") : "—";
    var noteContent = identity.notes ? renderMarkdown(identity.notes) :
      '<span class="quiet-copy">No notes recorded.</span>';

    detailElement.innerHTML =
      '<div class="detail-topline"><span class="record-label">' +
      "IDENTITY RECORD" +
      '</span><div class="detail-actions"><button class="button button-quiet" type="button" data-action="export">Export JSON</button><button class="button button-quiet" type="button" data-action="edit">Edit</button>' +
      '<button class="button button-danger-quiet" type="button" data-action="delete">Delete</button></div></div>' +
      '<header class="detail-header"><div><p class="eyebrow">' + escapeHtml(characterName(identity.characterId) || "No character") +
      '</p><h2>' + escapeHtml(identity.name) + '</h2><p class="detail-subtitle">' +
      escapeHtml(identity.mirrorWorld || "Mirror World / affiliation not set") + '</p></div>' +
      '<span class="rarity-badge">' + escapeHtml(rarityText(identity.rarity, identity.rarityVariant)) + '</span></header>' +
      '<div class="metadata-grid">' +
      '<div><span>Rarity</span><strong>' + escapeHtml(rarityText(identity.rarity, identity.rarityVariant)) + '</strong></div>' +
      '<div><span>Release</span><strong>' + formatDate(identity.releaseDate) + '</strong></div>' +
      '</div>' +
      '<section class="detail-section"><h3>Panic</h3><div class="metadata-grid">' +
      '<div><span>Panic type</span><strong>' + escapeHtml(identity.panic || "—") + '</strong></div>' +
      '<div><span>Effect</span><div class="markdown-content">' + renderMarkdown(identity.panicDescription || "—") + '</div></div>' +
      '<div><span>Prefix / faction</span><strong>' + escapeHtml(identity.prefix || "—") + '</strong></div>' +
      '</div></section>' +
      '<section class="detail-section"><h3>Base stats</h3><div class="stats-grid">' +
      '<div><span>Level</span><strong>' + escapeHtml(identity.level || 40) + '</strong></div>' +
      '<div><span>HP</span><strong>' + hpDisplay(identity, stats) + '</strong></div>' +
      '<div><span>HP growth</span><strong>' + escapeHtml(stats.hpGrowth || "—") + '</strong></div>' +
      '<div><span>Stagger thresholds</span><strong>' + staggerContent + '</strong></div>' +
      '<div><span>Speed</span><strong>' + escapeHtml(stats.speed || "—") + '</strong></div>' +
      '<div><span>Defense mod</span><strong>' + escapeHtml(stats.defense || "—") + '</strong></div>' +
      '<div><span>Slash</span><strong>' + escapeHtml(resistanceDisplay(resistances.slash)) + '</strong></div>' +
      '<div><span>Pierce</span><strong>' + escapeHtml(resistanceDisplay(resistances.pierce)) + '</strong></div>' +
      '<div><span>Blunt</span><strong>' + escapeHtml(resistanceDisplay(resistances.blunt)) + '</strong></div>' +
      '</div></section>' +
      '<section class="detail-section"><div class="section-title-row"><h3>Skills</h3><span class="section-count">' +
      skills.length + '</span></div><div class="skill-list">' + skillContent + '</div></section>' +
      '<section class="detail-section"><div class="section-title-row"><h3>Passives</h3><span class="section-count">' +
      passives.length + '</span></div><div class="passive-list">' + passiveContent + '</div></section>' +
      '<section class="detail-section"><h3>Uptie Story</h3><div class="markdown-content uptie-story-content">' + uptieStoryContent + '</div></section>' +
      '<section class="detail-section"><div class="section-title-row"><h3>Voicelines</h3><span class="section-count">' +
      voiceLines.length + '</span></div><div class="voice-line-list">' + voiceLineContent + '</div></section>' +
      '<section class="detail-section"><h3>Tags</h3><div class="keyword-list">' + tagContent + '</div></section>' +
      '<section class="detail-section"><h3>Notes</h3><div class="notes-content markdown-content">' + noteContent + '</div></section>' +
      '<div class="detail-bottom"><span>Identity record</span>' +
      '<span>Updated ' + formatDate(String(identity.updatedAt || identity.createdAt || "").slice(0, 10)) + '</span></div>';
  }

  function render() {
    setupCharacterOptions();
    renderList();
    renderDetail();
  }

  function egoById(id) {
    return egoState.egos.find(function (ego) { return ego.id === id; }) || null;
  }

  function announcerById(id) {
    return announcerState.announcers.find(function (announcer) { return announcer.id === id; }) || null;
  }

  function egoSearchableText(ego) {
    var costs = EGO_SINS.map(function (sin) { return [sin, ego.resourceCosts && ego.resourceCosts[sin]].join(" "); }).join(" ");
    var resistances = EGO_SINS.map(function (sin) { return [sin, ego.sinResistances && ego.sinResistances[sin]].join(" "); }).join(" ");
    var skills = (ego.skills || []).map(function (skill) { return Object.values(skill).join(" "); }).join(" ");
    return [ego.name, characterName(ego.characterId), ego.riskLevel, ego.sinAffinity, ego.sourceAbnormality,
      ego.acquisition, ego.awakeningQuote, ego.corrosionQuote, ego.passiveName, ego.passiveRequirement,
      (ego.passiveRequirements || []).map(function (requirement) {
        return [requirement.sinType, requirement.sinAmount, requirement.sinMode].join(" ");
      }).join(" "),
      ego.passiveEffect, ego.notes, costs, resistances, skills].join(" ").toLocaleLowerCase();
  }

  function filteredEgos() {
    var query = document.getElementById("ego-search-input").value.trim().toLocaleLowerCase();
    var character = document.getElementById("ego-character-filter").value;
    var risk = document.getElementById("ego-risk-filter").value;
    var affinity = document.getElementById("ego-affinity-filter").value;
    var sort = document.getElementById("ego-sort-filter").value;
    var matches = egoState.egos.filter(function (ego) {
      return (!query || egoSearchableText(ego).includes(query)) &&
        (!character || ego.characterId === character) && (!risk || ego.riskLevel === risk) &&
        (!affinity || ego.sinAffinity === affinity);
    });
    if (sort === "risk") {
      var riskOrder = { ZAYIN: 0, TETH: 1, HE: 2, WAW: 3, ALEPH: 4 };
      matches.sort(function (left, right) {
        return (riskOrder[right.riskLevel] === undefined ? -1 : riskOrder[right.riskLevel]) -
          (riskOrder[left.riskLevel] === undefined ? -1 : riskOrder[left.riskLevel]) ||
          characterName(left.characterId).localeCompare(characterName(right.characterId)) || left.name.localeCompare(right.name);
      });
    } else if (sort === "affinity") {
      matches.sort(function (left, right) {
        return EGO_SINS.indexOf(left.sinAffinity) - EGO_SINS.indexOf(right.sinAffinity) ||
          characterName(left.characterId).localeCompare(characterName(right.characterId)) || left.name.localeCompare(right.name);
      });
    } else if (sort === "name") matches.sort(function (left, right) { return left.name.localeCompare(right.name); });
    else if (sort === "recent") matches.sort(function (left, right) { return String(right.updatedAt).localeCompare(String(left.updatedAt)); });
    else matches.sort(function (left, right) {
      return characterName(left.characterId).localeCompare(characterName(right.characterId)) || left.name.localeCompare(right.name);
    });
    return matches;
  }

  function renderEgoList() {
    var matches = filteredEgos();
    egoListElement.textContent = "";
    document.getElementById("ego-result-count").textContent = matches.length + " shown · " + egoState.egos.length + " total";
    document.getElementById("ego-empty-state").hidden = matches.length !== 0;
    matches.forEach(function (ego) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "identity-item" + (ego.id === egoSelectedId ? " is-selected" : "");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", ego.id === egoSelectedId ? "true" : "false");
      item.dataset.egoId = ego.id;
      item.innerHTML = '<span class="identity-item-copy"><span class="identity-item-name">' + escapeHtml(ego.name || "Unnamed E.G.O") +
        '</span><span class="identity-item-character">' + escapeHtml(characterName(ego.characterId) || "Character not set") + '</span></span>' +
        '<span class="ego-list-badges"><span class="ego-risk-mark">' + escapeHtml(ego.riskLevel || "—") + '</span>' +
        (ego.sinAffinity ? '<span class="ego-sin-mark">' + escapeHtml(ego.sinAffinity) + '</span>' : "") + "</span>";
      egoListElement.appendChild(item);
    });
  }

  function renderEgoDetail() {
    var ego = egoById(egoSelectedId);
    if (!ego) {
      egoDetailElement.innerHTML = '<div class="empty-detail"><span class="empty-glyph" aria-hidden="true">✧</span>' +
        "<h2>Select an E.G.O</h2><p>Choose a record or add a new one.</p></div>";
      return;
    }
    var costContent = EGO_SINS.map(function (sin) {
      var cost = ego.resourceCosts && ego.resourceCosts[sin];
      return /^n\/a$/i.test(String(cost || "")) ?
        '<div><span>' + escapeHtml(sin) + '</span><strong>N/A</strong></div>' :
        cost !== "" && cost !== undefined && cost !== null && Number(cost) > 0 ?
          '<div><span>' + escapeHtml(sin) + '</span><strong>' + escapeHtml(cost) + '</strong></div>' : "";
    }).filter(Boolean).join("") || '<p class="quiet-copy">No E.G.O resource cost recorded.</p>';
    var resistanceContent = EGO_SINS.map(function (sin) {
      return '<div><span>' + escapeHtml(sin) + '</span><strong>' +
        escapeHtml(resistanceDisplay(ego.sinResistances && ego.sinResistances[sin])) + '</strong></div>';
    }).join("");
    var skillContent = (ego.skills || []).length ? ego.skills.map(function (skill) {
      var skillDetails = [skill.sinAffinity, skill.attackType,
        skill.basePower ? "Base " + skill.basePower : "", skill.coinPower ? "Coin " + skill.coinPower : "",
        skill.coinCount ? skill.coinCount + " coins" : "", skill.amount ? "Pool weight " + skill.amount : "",
        skill.coinCount && skill.coinTypes && skill.coinTypes.length ? normalizeCoinTypes(skill.coinTypes, coinCountValue(skill.coinCount)).map(coinTypeLabel).join(", ") : "",
        Number(skill.flatDamage) > 0 ? "Flat damage +" + skill.flatDamage : "",
        skill.attackWeight ? "Weight " + skill.attackWeight : ""].filter(Boolean).join(" · ");
      return '<div class="skill-card"><div class="skill-card-heading"><strong>' +
        escapeHtml((skill.mode || "Awakening") + " · Threadspin " + (skill.threadspin || "4") + (skill.name ? " · " + skill.name : "")) +
        '</strong><span>' + escapeHtml(skillDetails || "No skill values") + '</span></div>' +
        (skill.effect ? '<div class="markdown-content">' + renderMarkdown(skill.effect) + '</div>' : "") + "</div>";
    }).join("") : '<p class="quiet-copy">No skill tiers recorded yet.</p>';
    var awakeningQuote = ego.awakeningQuote ? renderMarkdown(ego.awakeningQuote) : '<span class="quiet-copy">No Awakening quote recorded.</span>';
    var corrosionQuote = ego.corrosionQuote ? renderMarkdown(ego.corrosionQuote) : '<span class="quiet-copy">No Corrosion quote recorded.</span>';
    var passiveRequirements = (ego.passiveRequirements || []).map(function (requirement) {
      return [requirement.sinAmount, requirement.sinType, requirement.sinMode].filter(function (value) {
        return value !== undefined && value !== null && String(value).trim() !== "";
      }).join(" ");
    }).filter(Boolean).join(" + ");
    var passiveContent = ego.passiveName || ego.passiveRequirement || ego.passiveEffect || passiveRequirements || ego.passiveAlwaysActive ?
      '<div class="passive-card"><div class="passive-card-heading"><strong>' + escapeHtml(ego.passiveName || "E.G.O Passive") +
      '</strong><span>' + escapeHtml([ego.passiveThreadspin ? "Threadspin " + ego.passiveThreadspin : "",
        ego.passiveAlwaysActive ? "Always active" : "", ego.passiveRequirement, passiveRequirements]
        .filter(Boolean).join(" · ") || "No activation requirement") +
      '</span></div>' + (ego.passiveEffect ? '<div class="markdown-content">' + renderMarkdown(ego.passiveEffect) + '</div>' : "") + "</div>" :
      '<p class="quiet-copy">No E.G.O Passive recorded.</p>';
    var notes = ego.notes ? renderMarkdown(ego.notes) : '<span class="quiet-copy">No notes recorded.</span>';
    var subtitle = [ego.sinAffinity, ego.sourceAbnormality].filter(Boolean).join(" · ") || "Sin affinity or source not set";

    egoDetailElement.innerHTML =
      '<div class="detail-topline"><span class="record-label">E.G.O RECORD</span><div class="detail-actions">' +
      '<button class="button button-quiet" type="button" data-ego-action="export">Export JSON</button><button class="button button-quiet" type="button" data-ego-action="edit">Edit</button>' +
      '<button class="button button-danger-quiet" type="button" data-ego-action="delete">Delete</button></div></div>' +
      '<header class="detail-header"><div><p class="eyebrow">' + escapeHtml(characterName(ego.characterId) || "Character not set") +
      '</p><h2>' + escapeHtml(ego.name || "Unnamed E.G.O") + '</h2><p class="detail-subtitle">' + escapeHtml(subtitle) + '</p></div>' +
      '<span class="rarity-badge ego-grade-badge">' + escapeHtml(ego.riskLevel || "Not set") + '</span></header>' +
      '<div class="metadata-grid ego-metadata-grid">' +
      '<div><span>Type</span><strong>' + (ego.baseEgo ? "Base / personal E.G.O" : "Abnormality E.G.O") + '</strong></div>' +
      '<div><span>Release</span><strong>' + formatDate(ego.releaseDate) + '</strong></div>' +
      '<div><span>Acquisition</span><strong>' + escapeHtml(ego.acquisition || "—") + '</strong></div>' +
      '</div>' +
      '<section class="detail-section"><h3>Resource costs</h3><div class="metadata-grid ego-cost-grid">' +
      '<div><span>Awakening SP</span><strong>' + escapeHtml(ego.awakeningSanityCost || "—") + '</strong></div>' +
      '<div><span>Corrosion SP</span><strong>' + escapeHtml(ego.corrosionSanityCost || "—") + '</strong></div>' +
      costContent + '</div></section>' +
      '<section class="detail-section"><h3>Sin resistances</h3><div class="stats-grid ego-resistance-grid">' + resistanceContent + '</div></section>' +
      '<section class="detail-section"><div class="section-title-row"><h3>Skills by Threadspin</h3><span class="section-count">' +
      (ego.skills || []).length + '</span></div><div class="skill-list">' + skillContent + '</div></section>' +
      '<section class="detail-section"><h3>E.G.O Passive</h3><div class="passive-list">' + passiveContent + '</div></section>' +
      '<section class="detail-section"><h3>Quotes</h3><div class="ego-quotes-grid"><div><strong>Awakening</strong><div class="markdown-content">' + awakeningQuote +
      '</div></div><div><strong>Corrosion</strong><div class="markdown-content">' + corrosionQuote + '</div></div></div></section>' +
      '<section class="detail-section"><h3>Notes</h3><div class="notes-content markdown-content">' + notes + '</div></section>' +
      '<div class="detail-bottom"><span>E.G.O record</span><span>Updated ' + formatDate(String(ego.updatedAt || ego.createdAt || "").slice(0, 10)) + '</span></div>';
  }

  function setupEgoCharacterFilter() {
    populateCharacterSelect(document.getElementById("ego-character-filter"), "All characters");
  }

  function renderEgoArchive() {
    setupCharacterOptions();
    setupEgoCharacterFilter();
    if (!egoSelectedId || !egoById(egoSelectedId)) egoSelectedId = egoState.egos.length ? egoState.egos[0].id : null;
    renderEgoList();
    renderEgoDetail();
  }

  function filteredAnnouncers() {
    var query = document.getElementById("announcer-search-input").value.trim().toLocaleLowerCase();
    var sort = document.getElementById("announcer-sort-filter").value;
    var matches = announcerState.announcers.filter(function (announcer) {
      var searchable = [announcer.name, characterName(announcer.characterId), announcer.source, announcer.notes]
        .concat((announcer.voiceLines || []).map(function (line) { return line.category + " " + line.text; }))
        .join(" ").toLocaleLowerCase();
      return !query || searchable.includes(query);
    });
    if (sort === "recent") matches.sort(function (left, right) { return String(right.updatedAt).localeCompare(String(left.updatedAt)); });
    else matches.sort(function (left, right) { return left.name.localeCompare(right.name); });
    return matches;
  }

  function renderAnnouncerList() {
    var matches = filteredAnnouncers();
    announcerListElement.textContent = "";
    document.getElementById("announcer-result-count").textContent = matches.length + " shown · " + announcerState.announcers.length + " total";
    document.getElementById("announcer-empty-state").hidden = matches.length !== 0;
    matches.forEach(function (announcer) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "identity-item" + (announcer.id === announcerSelectedId ? " is-selected" : "");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", announcer.id === announcerSelectedId ? "true" : "false");
      item.dataset.announcerId = announcer.id;
      item.innerHTML = '<span class="identity-item-copy"><span class="identity-item-name">' + escapeHtml(announcer.name || "Unnamed announcer") +
        '</span><span class="identity-item-character">' + escapeHtml([characterName(announcer.characterId), announcer.source].filter(Boolean).join(" · ") || "No character / source set") + '</span></span>' +
        '<span class="ego-list-badges"><span class="ego-risk-mark">' + (announcer.voiceLines || []).length + ' lines</span></span>';
      announcerListElement.appendChild(item);
    });
  }

  function renderAnnouncerDetail() {
    var announcer = announcerById(announcerSelectedId);
    if (!announcer) {
      announcerDetailElement.innerHTML = '<div class="empty-detail"><span class="empty-glyph" aria-hidden="true">♫</span>' +
        "<h2>Select an announcer</h2><p>Choose a record or add a new announcer.</p></div>";
      return;
    }
    var voiceLinesByCategory = new Map();
    ANNOUNCER_CATEGORIES.forEach(function (category) { voiceLinesByCategory.set(category, []); });
    (announcer.voiceLines || []).forEach(function (line) {
      var categoryLines = voiceLinesByCategory.get(line.category);
      if (categoryLines) categoryLines.push(line);
    });
    var voiceLineSections = ANNOUNCER_CATEGORIES.map(function (category) {
      var lines = voiceLinesByCategory.get(category);
      if (!lines.length) return "";
      return '<section class="detail-section"><div class="section-title-row"><h3>' + escapeHtml(category) +
        '</h3><span class="section-count">' + lines.length + '</span></div><div class="voice-line-list">' +
        lines.map(function (line) { return '<div class="voice-line-card"><div class="markdown-content">' + renderMarkdown(line.text) + '</div></div>'; }).join("") +
        '</div></section>';
    }).join("") || '<p class="quiet-copy">No voicelines recorded yet.</p>';
    var notes = announcer.notes ? renderMarkdown(announcer.notes) : '<span class="quiet-copy">No notes recorded.</span>';
    var announcerCharacter = characterName(announcer.characterId);
    announcerDetailElement.innerHTML =
      '<div class="detail-topline"><span class="record-label">BATTLE ANNOUNCER</span><div class="detail-actions">' +
      '<button class="button button-quiet" type="button" data-announcer-action="export">Export JSON</button><button class="button button-quiet" type="button" data-announcer-action="edit">Edit</button>' +
      '<button class="button button-danger-quiet" type="button" data-announcer-action="delete">Delete</button></div></div>' +
      '<header class="detail-header"><div><p class="eyebrow">' + escapeHtml(announcerCharacter || announcer.source || "Announcer") +
      '</p><h2>' + escapeHtml(announcer.name || "Unnamed announcer") + '</h2><p class="detail-subtitle">' +
      escapeHtml([announcer.source, (announcer.voiceLines || []).length + " voiceline(s)"].filter(Boolean).join(" · ")) + '</p></div></header>' +
      '<section class="detail-section"><h3>Voicelines</h3>' + voiceLineSections + '</section>' +
      '<section class="detail-section"><h3>Notes</h3><div class="notes-content markdown-content">' + notes + '</div></section>' +
      '<div class="detail-bottom"><span>Announcer record</span><span>Updated ' + formatDate(String(announcer.updatedAt || announcer.createdAt || "").slice(0, 10)) + '</span></div>';
  }

  function renderAnnouncerArchive() {
    setupCharacterOptions();
    if (!announcerSelectedId || !announcerById(announcerSelectedId)) {
      announcerSelectedId = announcerState.announcers.length ? announcerState.announcers[0].id : null;
    }
    renderAnnouncerList();
    renderAnnouncerDetail();
  }

  function statusEffectSearchableText(effect) {
    return [effect.name, effect.identifier, effect.description, effect.notes].join(" ").toLocaleLowerCase();
  }

  function isDefaultStatusEffect(effect) {
    return [effect.name, effect.identifier].some(function (value) {
      return DEFAULT_STATUS_EFFECT_KEYS.has(String(value || "").trim().toLocaleLowerCase());
    });
  }

  function filteredStatusEffects() {
    var query = document.getElementById("status-effect-search-input").value.trim().toLocaleLowerCase();
    var sort = document.getElementById("status-effect-sort-filter").value;
    var matches = statusEffectState.statusEffects.filter(function (effect) {
      return !query || statusEffectSearchableText(effect).includes(query);
    });
    if (sort === "recent") matches.sort(function (left, right) { return String(right.updatedAt).localeCompare(String(left.updatedAt)); });
    else matches.sort(function (left, right) { return left.name.localeCompare(right.name); });
    return matches;
  }

  function renderStatusEffectList() {
    var matches = filteredStatusEffects();
    statusEffectListElement.textContent = "";
    document.getElementById("status-effect-result-count").textContent = matches.length + " shown · " + statusEffectState.statusEffects.length + " total";
    document.getElementById("status-effect-empty-state").hidden = matches.length !== 0;
    matches.forEach(function (effect) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "identity-item" + (effect.id === statusEffectSelectedId ? " is-selected" : "");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", effect.id === statusEffectSelectedId ? "true" : "false");
      item.dataset.statusEffectId = effect.id;
      item.innerHTML = '<span class="identity-item-copy"><span class="identity-item-name">' + escapeHtml(effect.name || "Unnamed status effect") +
        '</span><span class="identity-item-character">' + escapeHtml(effect.identifier || "No identifier") + '</span></span>';
      statusEffectListElement.appendChild(item);
    });
  }

  function renderStatusEffectDetail() {
    var effect = statusEffectById(statusEffectSelectedId);
    if (!effect) {
      statusEffectDetailElement.innerHTML = '<div class="empty-detail"><span class="empty-glyph" aria-hidden="true">◈</span>' +
        "<h2>Select a status effect</h2><p>Choose a record or add a new status effect.</p></div>";
      return;
    }
    var description = effect.description ? renderMarkdown(effect.description) : '<span class="quiet-copy">No effect description recorded.</span>';
    var notes = effect.notes ? renderMarkdown(effect.notes) : '<span class="quiet-copy">No notes recorded.</span>';
    statusEffectDetailElement.innerHTML =
      '<div class="detail-topline"><span class="record-label">STATUS EFFECT</span><div class="detail-actions">' +
      '<button class="button button-quiet" type="button" data-status-effect-action="export">Export JSON</button><button class="button button-quiet" type="button" data-status-effect-action="edit">Edit</button>' +
      (isDefaultStatusEffect(effect) ? "" : '<button class="button button-danger-quiet" type="button" data-status-effect-action="delete">Delete</button>') + '</div></div>' +
      '<header class="detail-header"><div><p class="eyebrow">IDENTIFIER</p><h2>' + escapeHtml(effect.name || "Unnamed status effect") +
      '</h2><p class="detail-subtitle"><code>' + escapeHtml(effect.identifier) + '</code></p></div></header>' +
      '<section class="detail-section"><h3>Effect</h3><div class="markdown-content">' + description + '</div></section>' +
      '<section class="detail-section"><h3>Notes</h3><div class="notes-content markdown-content">' + notes + '</div></section>' +
      '<div class="detail-bottom"><span>Status effect record</span><span>Updated ' + formatDate(String(effect.updatedAt || effect.createdAt || "").slice(0, 10)) + '</span></div>';
  }

  function renderStatusEffectArchive() {
    if (!statusEffectSelectedId || !statusEffectById(statusEffectSelectedId)) {
      statusEffectSelectedId = statusEffectState.statusEffects.length ? statusEffectState.statusEffects[0].id : null;
    }
    renderStatusEffectList();
    renderStatusEffectDetail();
  }

  function characterSearchableText(character) {
    return [character.name, character.affiliation, character.introduction, character.personality,
      character.history, character.relationships, character.trivia, character.notes].join(" ").toLocaleLowerCase();
  }

  function filteredCharacters() {
    var query = document.getElementById("character-search-input").value.trim().toLocaleLowerCase();
    return characterState.characters.filter(function (character) {
      return !query || characterSearchableText(character).includes(query);
    }).sort(function (left, right) { return left.name.localeCompare(right.name); });
  }

  function identitiesForCharacter(characterId) {
    return state.identities.filter(function (identity) { return identity.characterId === characterId; })
      .sort(function (left, right) { return left.name.localeCompare(right.name); });
  }

  function egosForCharacter(characterId) {
    return egoState.egos.filter(function (ego) { return ego.characterId === characterId; })
      .sort(function (left, right) { return left.name.localeCompare(right.name); });
  }

  function announcersForCharacter(characterId) {
    return announcerState.announcers.filter(function (announcer) { return announcer.characterId === characterId; })
      .sort(function (left, right) { return left.name.localeCompare(right.name); });
  }

  function collectIdentityStatusEffectReferences(value, references) {
    if (typeof value === "string") {
      var token = /\{\{([^{}]+)\}\}/g;
      var match;
      while ((match = token.exec(value))) references.push(match[1].trim());
    } else if (Array.isArray(value)) {
      value.forEach(function (item) { collectIdentityStatusEffectReferences(item, references); });
    } else if (value && typeof value === "object") {
      Object.keys(value).forEach(function (key) { collectIdentityStatusEffectReferences(value[key], references); });
    }
  }

  function uniqueStatusEffectsForCharacter(characterId) {
    var allowedDefaults = new Set(["bloodfeast", "discard"]);
    var found = new Map();
    identitiesForCharacter(characterId).forEach(function (identity) {
      var references = [];
      collectIdentityStatusEffectReferences(identity, references);
      references.forEach(function (reference) {
        var effect = statusEffectByReference(reference);
        if (!effect) return;
        var identifier = normalizedCharacterName(effect.identifier);
        if (identifier === "total-bloodfeast-consumed" || normalizedCharacterName(effect.name) === "total bloodfeast consumed") return;
        if (COMMON_STATUS_EFFECT_IDS.has(identifier) && !allowedDefaults.has(identifier)) return;
        found.set(effect.id, effect);
      });
    });
    return Array.from(found.values()).sort(function (left, right) { return left.name.localeCompare(right.name); });
  }

  function renderCharacterList() {
    var matches = filteredCharacters();
    var list = document.getElementById("character-list");
    var identityCounts = {};
    var egoCounts = {};
    var announcerCounts = {};
    state.identities.forEach(function (identity) { identityCounts[identity.characterId] = (identityCounts[identity.characterId] || 0) + 1; });
    egoState.egos.forEach(function (ego) { egoCounts[ego.characterId] = (egoCounts[ego.characterId] || 0) + 1; });
    announcerState.announcers.forEach(function (announcer) { announcerCounts[announcer.characterId] = (announcerCounts[announcer.characterId] || 0) + 1; });
    list.textContent = "";
    document.getElementById("character-result-count").textContent = matches.length + " shown · " + characterState.characters.length + " total";
    document.getElementById("character-empty-state").hidden = matches.length !== 0;
    matches.forEach(function (character) {
      var identityCount = identityCounts[character.id] || 0;
      var egoCount = egoCounts[character.id] || 0;
      var announcerCount = announcerCounts[character.id] || 0;
      var item = document.createElement("button");
      item.type = "button";
      item.className = "identity-item" + (character.id === characterSelectedId ? " is-selected" : "");
      item.setAttribute("role", "option");
      item.setAttribute("aria-selected", character.id === characterSelectedId ? "true" : "false");
      item.dataset.characterId = character.id;
      item.innerHTML = '<span class="identity-item-copy"><span class="identity-item-name">' + escapeHtml(character.name) +
        '</span><span class="identity-item-character">' + escapeHtml(character.affiliation || "Character profile") +
        '</span></span><span class="ego-list-badges"><span class="ego-risk-mark">' + identityCount + ' ID</span><span class="ego-sin-mark">' + egoCount + ' E.G.O</span>' +
        (announcerCount ? '<span class="ego-risk-mark">' + announcerCount + ' Announcer</span>' : '') + '</span>';
      list.appendChild(item);
    });
  }

  function renderCharacterDetail() {
    var character = characterById(characterSelectedId);
    var detail = document.getElementById("character-detail-pane");
    if (!character) {
      detail.innerHTML = '<div class="empty-detail"><span class="empty-glyph" aria-hidden="true">♙</span>' +
        "<h2>Select a character</h2><p>Create a character profile or choose one from the list.</p></div>";
      return;
    }
    function loreSection(title, value) {
      return '<section class="detail-section"><h3>' + escapeHtml(title) + '</h3><div class="markdown-content">' +
        (value ? renderMarkdown(value) : '<span class="quiet-copy">No ' + escapeHtml(title.toLocaleLowerCase()) + ' recorded.</span>') + '</div></section>';
    }
    var identities = identitiesForCharacter(character.id);
    var egos = egosForCharacter(character.id);
    var announcers = announcersForCharacter(character.id);
    function relatedRecord(record, kind) {
      var subtext = kind === "identity" ?
        (Number(record.rarity) ? "★".repeat(Math.min(3, Number(record.rarity))) + (record.rarityVariant === "Walpurgis" ? " · Walpurgis" : "") : "Identity") :
        (kind === "ego" ? [record.riskLevel, record.sinAffinity].filter(Boolean).join(" · ") || "E.G.O" :
          [record.source, "Announcer"].filter(Boolean).join(" · "));
      return '<button class="character-record-link" type="button" data-character-record-kind="' + kind + '" data-character-record-id="' +
        escapeHtml(record.id) + '"><span><strong>' + escapeHtml(record.name || "Unnamed record") + '</strong><small>' + escapeHtml(subtext) +
        '</small></span><span aria-hidden="true">→</span></button>';
    }
    var identityContent = identities.length ? '<div class="character-record-list">' + identities.map(function (identity) {
      return relatedRecord(identity, "identity");
    }).join("") + '</div>' : '<p class="quiet-copy">No identities associated with this character.</p>';
    var egoContent = egos.length ? '<div class="character-record-list">' + egos.map(function (ego) {
      return relatedRecord(ego, "ego");
    }).join("") + '</div>' : '<p class="quiet-copy">No E.G.O associated with this character.</p>';
    var equippedEgos = EGO_RISK_LEVELS.map(function (risk) {
      return egoById(character.equippedEgoIds && character.equippedEgoIds[risk]);
    }).filter(function (ego) { return ego && ego.characterId === character.id; });
    var equippedEgoContent = equippedEgos.length ? '<div class="character-record-list">' + equippedEgos.map(function (ego) {
      return relatedRecord(ego, "ego");
    }).join("") + '</div>' : '<p class="quiet-copy">No E.G.O equipped.</p>';
    var announcerContent = announcers.length ? '<div class="character-record-list">' + announcers.map(function (announcer) {
      return relatedRecord(announcer, "announcer");
    }).join("") + '</div>' : '<p class="quiet-copy">No announcers associated with this character.</p>';
    var uniqueEffects = uniqueStatusEffectsForCharacter(character.id);
    var effectContent = uniqueEffects.length ? '<div class="character-status-effect-list">' + uniqueEffects.map(function (effect) {
      return '<div class="character-status-effect-item">' + renderStatusEffectReference(effect.name) + '</div>';
    }).join("") + '</div>' : '<p class="quiet-copy">No linked unique status effects found in this character\'s identities.</p>';
    detail.innerHTML =
      '<div class="detail-topline"><span class="record-label">CHARACTER PROFILE</span><div class="detail-actions">' +
      '<button class="button button-quiet" type="button" data-character-action="edit">Edit</button>' +
      '<button class="button button-danger-quiet" type="button" data-character-action="delete">Delete</button></div></div>' +
      '<header class="detail-header"><div><p class="eyebrow">' + escapeHtml(character.affiliation || "CHARACTER ARCHIVE") +
      '</p><h2>' + escapeHtml(character.name) + '</h2><p class="detail-subtitle">' + identities.length + ' identity/identities · ' +
      egos.length + ' E.G.O · ' + announcers.length + ' announcer(s)</p></div></header>' +
      loreSection("Introduction", character.introduction) + loreSection("Personality", character.personality) +
      loreSection("History", character.history) + loreSection("Relationships", character.relationships) + loreSection("Trivia", character.trivia) +
      '<section class="detail-section"><div class="section-title-row"><h3>Identities</h3><span class="section-count">' + identities.length +
      '</span></div>' + identityContent + '</section>' +
      '<section class="detail-section"><div class="section-title-row"><h3>E.G.O</h3><span class="section-count">' + egos.length +
      '</span></div>' + egoContent + '</section>' +
      '<section class="detail-section"><div class="section-title-row"><h3>Equipped E.G.O</h3><span class="section-count">' + equippedEgos.length +
      '</span></div>' + equippedEgoContent + '</section>' +
      '<section class="detail-section"><div class="section-title-row"><h3>Announcers</h3><span class="section-count">' + announcers.length +
      '</span></div>' + announcerContent + '</section>' +
      '<section class="detail-section"><div class="section-title-row"><h3>Unique status effects</h3><span class="section-count">' + uniqueEffects.length +
      '</span></div><p class="help-copy">Derived from status effect links in this character\'s identities.</p>' +
      effectContent + '</section>' +
      '<section class="detail-section"><h3>Notes</h3><div class="notes-content markdown-content">' +
      (character.notes ? renderMarkdown(character.notes) : '<span class="quiet-copy">No notes recorded.</span>') + '</div></section>' +
      '<div class="detail-bottom"><span>Character profile</span><span>Updated ' + formatDate(String(character.updatedAt || character.createdAt || "").slice(0, 10)) + '</span></div>';
  }

  function renderCharacterArchive() {
    if (!characterSelectedId || !characterById(characterSelectedId)) {
      characterSelectedId = characterState.characters.length ? characterState.characters[0].id : null;
    }
    setupCharacterOptions();
    renderCharacterList();
    renderCharacterDetail();
  }

  function addEgoSkillRow(skill, defaultMode) {
    var template = document.getElementById("ego-skill-row-template");
    var row = template.content.firstElementChild.cloneNode(true);
    row.querySelectorAll("[data-key]").forEach(function (field) {
      var key = field.dataset.key;
      if (skill && skill[key] !== undefined && skill[key] !== null) field.value = skill[key];
    });
    if (defaultMode) row.querySelector('[data-key="mode"]').value = defaultMode;
    var coinCountField = row.querySelector('[data-key="coinCount"]');
    var coinTypesContainer = row.querySelector("[data-coin-types]");
    var updateCoinTypes = function () {
      var currentTypes = coinTypesContainer.querySelector("[data-coin-type-index]") ?
        readCoinTypeFields(coinTypesContainer, coinCountField.value) : (skill && skill.coinTypes);
      renderCoinTypeFields(coinTypesContainer, coinCountField.value, currentTypes);
    };
    renderCoinTypeFields(coinTypesContainer, coinCountField.value, skill && skill.coinTypes);
    coinCountField.addEventListener("input", updateCoinTypes);
    coinCountField.addEventListener("change", updateCoinTypes);
    var updateLegend = function () {
      row.querySelector(".ego-skill-legend").textContent =
        row.querySelector('[data-key="mode"]').value + " · Threadspin " + row.querySelector('[data-key="threadspin"]').value;
    };
    row.querySelector('[data-key="mode"]').addEventListener("change", updateLegend);
    row.querySelector('[data-key="threadspin"]').addEventListener("change", updateLegend);
    updateLegend();
    row.querySelector(".remove-ego-skill").addEventListener("click", function () { row.remove(); });
    egoSkillFields.appendChild(row);
  }

  function openEgoForm(ego) {
    egoForm.reset();
    egoSkillFields.textContent = "";
    egoPassiveRequirements.textContent = "";
    setupCharacterOptions();
    egoEditingId = ego ? ego.id : null;
    document.getElementById("ego-dialog-title").textContent = ego ? "Edit E.G.O" : "Add E.G.O";
    if (ego) {
      ["name", "riskLevel", "sinAffinity", "sourceAbnormality", "releaseDate", "acquisition",
        "awakeningSanityCost", "corrosionSanityCost", "awakeningQuote", "corrosionQuote", "passiveName", "passiveThreadspin",
        "passiveRequirement", "passiveEffect", "notes"].forEach(function (key) {
        var field = egoForm.elements.namedItem(key);
        if (field) field.value = ego[key] === undefined || ego[key] === null ? "" : ego[key];
      });
      (ego.passiveRequirements || []).forEach(function (requirement) {
        addPassiveRequirement(egoPassiveRequirements, requirement);
      });
      egoForm.elements.namedItem("character").value = ego.characterId || "";
      egoForm.elements.namedItem("baseEgo").checked = Boolean(ego.baseEgo);
      egoForm.elements.namedItem("passiveAlwaysActive").checked = Boolean(ego.passiveAlwaysActive);
      egoForm.querySelectorAll("[data-resource-cost]").forEach(function (field) {
        field.value = ego.resourceCosts && ego.resourceCosts[field.dataset.resourceCost] !== undefined ? ego.resourceCosts[field.dataset.resourceCost] : "";
      });
      egoForm.querySelectorAll("[data-resistance]").forEach(function (field) {
        var value = ego.sinResistances && ego.sinResistances[field.dataset.resistance];
        field.value = value === undefined || value === null ? "" : value;
      });
      (ego.skills || []).forEach(function (skill) { addEgoSkillRow(skill); });
    } else {
      ["Angst", "Madness"].forEach(function (sin) {
        egoForm.querySelector('[data-resistance="' + sin + '"]').value = "1.51";
      });
    }
    egoDialog.showModal();
    egoForm.elements.namedItem("name").focus();
  }

  function addAnnouncerVoiceLineRow(line) {
    var template = document.getElementById("announcer-voice-line-row-template");
    var row = template.content.firstElementChild.cloneNode(true);
    var categoryField = row.querySelector('[data-key="category"]');
    ANNOUNCER_CATEGORIES.forEach(function (category) {
      var option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryField.appendChild(option);
    });
    if (line) {
      categoryField.value = line.category || "";
      row.querySelector('[data-key="text"]').value = line.text || "";
    }
    row.querySelector(".remove-voice-line").addEventListener("click", function () { row.remove(); });
    announcerVoiceLineFields.appendChild(row);
  }

  function openAnnouncerForm(announcer) {
    announcerForm.reset();
    announcerVoiceLineFields.textContent = "";
    setupCharacterOptions();
    announcerEditingId = announcer ? announcer.id : null;
    document.getElementById("announcer-dialog-title").textContent = announcer ? "Edit announcer" : "Add announcer";
    if (announcer) {
      ["name", "source", "notes"].forEach(function (key) {
        announcerForm.elements.namedItem(key).value = announcer[key] || "";
      });
      announcerForm.elements.namedItem("character").value = announcer.characterId || "";
      (announcer.voiceLines || []).forEach(addAnnouncerVoiceLineRow);
    }
    announcerDialog.showModal();
    announcerForm.elements.namedItem("name").focus();
  }

  function readAnnouncerVoiceLines() {
    return Array.from(announcerVoiceLineFields.querySelectorAll(".announcer-voice-line-row")).map(function (row) {
      return {
        category: row.querySelector('[data-key="category"]').value,
        text: row.querySelector('[data-key="text"]').value.trim()
      };
    }).filter(function (line) {
      return ANNOUNCER_CATEGORIES.includes(line.category) && Boolean(line.text);
    });
  }

  function openStatusEffectForm(effect) {
    statusEffectForm.reset();
    statusEffectEditingId = effect ? effect.id : null;
    document.getElementById("status-effect-dialog-title").textContent = effect ? "Edit status effect" : "Add status effect";
    if (effect) ["name", "identifier", "description", "notes"].forEach(function (key) {
      statusEffectForm.elements.namedItem(key).value = effect[key] || "";
    });
    statusEffectDialog.showModal();
    statusEffectForm.elements.namedItem("name").focus();
  }

  function openCharacterForm(character) {
    characterForm.reset();
    characterEditingId = character ? character.id : null;
    document.getElementById("character-dialog-title").textContent = character ? "Edit character" : "Add character";
    if (character) ["name", "affiliation", "introduction", "personality", "history", "relationships", "trivia", "notes"].forEach(function (key) {
      characterForm.elements.namedItem(key).value = character[key] || "";
    });
    var loadout = document.getElementById("character-ego-loadout");
    loadout.textContent = "";
    EGO_RISK_LEVELS.forEach(function (risk) {
      var riskSlot = document.createElement("section");
      riskSlot.className = "character-ego-slot";
      var heading = document.createElement("strong");
      heading.textContent = risk;
      var egoLabel = document.createElement("label");
      egoLabel.className = "field";
      egoLabel.textContent = "Equipped E.G.O";
      var select = document.createElement("select");
      select.dataset.equippedEgoRisk = risk;
      var emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "None equipped";
      select.appendChild(emptyOption);
      egoState.egos.filter(function (ego) {
        return character && ego.characterId === character.id && ego.riskLevel === risk;
      }).sort(function (left, right) { return left.name.localeCompare(right.name); }).forEach(function (ego) {
        var option = document.createElement("option");
        option.value = ego.id;
        option.textContent = ego.name;
        select.appendChild(option);
      });
      if (character && character.equippedEgoIds) select.value = character.equippedEgoIds[risk] || "";
      egoLabel.appendChild(select);
      var threadspinLabel = document.createElement("label");
      threadspinLabel.className = "field";
      threadspinLabel.textContent = "Threadspin";
      var threadspinSelect = document.createElement("select");
      threadspinSelect.dataset.equippedEgoThreadspinRisk = risk;
      [1, 2, 3, 4].forEach(function (value) {
        var option = document.createElement("option");
        option.value = String(value);
        option.textContent = "Threadspin " + value;
        threadspinSelect.appendChild(option);
      });
      threadspinSelect.value = character && character.equippedEgoThreadspins ?
        String(character.equippedEgoThreadspins[risk] || 4) : "4";
      threadspinSelect.disabled = !select.value;
      select.addEventListener("change", function () { threadspinSelect.disabled = !select.value; });
      threadspinLabel.appendChild(threadspinSelect);
      riskSlot.appendChild(heading);
      riskSlot.appendChild(egoLabel);
      riskSlot.appendChild(threadspinLabel);
      loadout.appendChild(riskSlot);
    });
    characterDialog.showModal();
    characterForm.elements.namedItem("name").focus();
  }

  function findStatusEffectConflict(name, identifier, excludeId) {
    var keys = [name, identifier].map(function (value) { return value.trim().toLocaleLowerCase(); });
    return statusEffectState.statusEffects.find(function (effect) {
      if (effect.id === excludeId) return false;
      return [effect.name, effect.identifier].some(function (value) {
        return keys.includes(String(value || "").trim().toLocaleLowerCase());
      });
    }) || null;
  }

  function readEgoSkills() {
    return Array.from(egoSkillFields.querySelectorAll(".ego-skill-row")).map(function (row) {
      var skill = {};
      row.querySelectorAll("[data-key]").forEach(function (field) { skill[field.dataset.key] = field.value.trim(); });
      skill.coinTypes = readCoinTypeFields(row.querySelector("[data-coin-types]"), skill.coinCount);
      ["coinCount", "attackWeight", "amount", "flatDamage"].forEach(function (key) {
        if (skill[key] !== "") skill[key] = numberOrEmpty(skill[key]);
      });
      delete skill.offenseModifier;
      return skill;
    }).filter(function (skill) {
      return Boolean(skill.name || skill.sinAffinity || skill.attackType || skill.basePower || skill.coinPower ||
        skill.effect || skill.coinCount !== "" || skill.attackWeight !== "" ||
        (skill.amount !== "" && Number(skill.amount) !== 1) || Number(skill.flatDamage) > 0);
    });
  }

  function addSkillRow(skill) {
    var template = document.getElementById("skill-row-template");
    var row = template.content.firstElementChild.cloneNode(true);
    var index = skillFields.children.length + 1;
    row.querySelector(".skill-row-legend").textContent = "Skill " + index;
    row.querySelectorAll("[data-key]").forEach(function (field) {
      var key = field.dataset.key;
      if (field.type === "checkbox") field.checked = Boolean(skill && skill[key]);
      else if (skill && skill[key] !== undefined) field.value = skill[key];
    });
    var coinCountField = row.querySelector('[data-key="coins"]');
    var coinTypesContainer = row.querySelector("[data-coin-types]");
    renderCoinTypeFields(coinTypesContainer, coinCountField.value, skill && skill.coinTypes);
    function updateCoinTypes() {
      var currentTypes = coinTypesContainer.querySelector("[data-coin-type-index]") ?
        readCoinTypeFields(coinTypesContainer, coinCountField.value) : (skill && skill.coinTypes);
      renderCoinTypeFields(coinTypesContainer, coinCountField.value, currentTypes);
    }
    coinCountField.addEventListener("input", updateCoinTypes);
    coinCountField.addEventListener("change", updateCoinTypes);
    var typeField = row.querySelector('[data-key="type"]');
    var clashableControl = row.querySelector(".clashable-control");
    var updateClashableControl = function () {
      var canClash = typeField.value === "Guard" || typeField.value === "Counter";
      clashableControl.hidden = !canClash;
      if (!canClash) clashableControl.querySelector("input").checked = false;
    };
    typeField.addEventListener("change", updateClashableControl);
    updateClashableControl();
    row.querySelector(".remove-skill").addEventListener("click", function () {
      row.remove();
      Array.from(skillFields.children).forEach(function (element, position) {
        element.querySelector(".skill-row-legend").textContent = "Skill " + (position + 1);
      });
    });
    skillFields.appendChild(row);
  }

  function addPassiveRequirement(container, requirement) {
    var template = document.getElementById("passive-requirement-template");
    var row = template.content.firstElementChild.cloneNode(true);
    row.querySelectorAll("[data-requirement-key]").forEach(function (field) {
      var key = field.dataset.requirementKey;
      if (requirement && requirement[key] !== undefined) field.value = requirement[key];
    });
    row.querySelector(".remove-passive-requirement").addEventListener("click", function () {
      row.remove();
    });
    container.appendChild(row);
  }

  function addPassiveRow(passive) {
    var template = document.getElementById("passive-row-template");
    var row = template.content.firstElementChild.cloneNode(true);
    var index = passiveFields.children.length + 1;
    row.querySelector(".passive-row-legend").textContent = "Passive " + index;
    row.querySelectorAll("[data-key]").forEach(function (field) {
      var key = field.dataset.key;
      if (passive && passive[key] !== undefined) field.value = passive[key];
    });
    var requirementsContainer = row.querySelector(".passive-requirements");
    var requirements = passive && Array.isArray(passive.requirements) ? passive.requirements : [];
    if (requirements.length) requirements.forEach(function (requirement) {
      addPassiveRequirement(requirementsContainer, requirement);
    });
    else addPassiveRequirement(requirementsContainer, null);
    row.querySelector(".add-passive-requirement").addEventListener("click", function () {
      addPassiveRequirement(requirementsContainer, null);
    });
    row.querySelector(".remove-passive").addEventListener("click", function () {
      row.remove();
      Array.from(passiveFields.children).forEach(function (element, position) {
        element.querySelector(".passive-row-legend").textContent = "Passive " + (position + 1);
      });
    });
    passiveFields.appendChild(row);
  }

  function addVoiceLineRow(voiceLine, forceCustom) {
    var template = document.getElementById("voice-line-row-template");
    var row = template.content.firstElementChild.cloneNode(true);
    var categoryField = row.querySelector('[data-key="category"]');
    var customOption = categoryField.querySelector('option[value="' + VOICE_LINE_CUSTOM_OPTION + '"]');
    VOICE_LINE_CATEGORIES.forEach(function (category) {
      var option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryField.insertBefore(option, customOption);
    });
    var customCategory = row.querySelector(".voice-line-custom-category");
    var customCategoryField = row.querySelector("[data-custom-category]");
    var category = voiceLine && String(voiceLine.category || "").trim();
    if (forceCustom) categoryField.value = VOICE_LINE_CUSTOM_OPTION;
    else if (category && VOICE_LINE_CATEGORIES.indexOf(category) === -1) {
      categoryField.value = VOICE_LINE_CUSTOM_OPTION;
      customCategoryField.value = category;
    } else if (category) categoryField.value = category;
    row.querySelector('[data-key="text"]').value = voiceLine && voiceLine.text ? voiceLine.text : "";
    function updateCustomCategory() {
      customCategory.hidden = categoryField.value !== VOICE_LINE_CUSTOM_OPTION;
    }
    categoryField.addEventListener("change", updateCustomCategory);
    updateCustomCategory();
    row.querySelector(".remove-voice-line").addEventListener("click", function () { row.remove(); });
    voiceLineFields.appendChild(row);
  }

  function setField(name, value) {
    form.elements.namedItem(name).value = value === undefined || value === null ? "" : value;
  }

  function openForm(identity) {
    form.reset();
    skillFields.textContent = "";
    passiveFields.textContent = "";
    voiceLineFields.textContent = "";
    setupCharacterOptions();
    editingId = identity ? identity.id : null;
    document.getElementById("dialog-title").textContent = identity ? "Edit identity" : "Add identity";
    var levelField = form.elements.namedItem("level");
    levelField.max = state.settings.maxLevel;
    setField("level", identity ? identity.level : Math.min(40, state.settings.maxLevel));
    if (identity) {
      setField("name", identity.name);
      setField("character", identity.characterId);
      setField("rarity", identity.rarityVariant === "Walpurgis" ? identity.rarity + "-walpurgis" : identity.rarity);
      setField("mirrorWorld", identity.mirrorWorld);
      setField("prefix", identity.prefix);
      setField("panic", identity.panic);
      setField("panicDescription", identity.panicDescription);
      setField("uptieStory", identity.uptieStory);
      setField("releaseDate", identity.releaseDate);
      var stats = blankStats(identity.stats);
      setField("hp", stats.hp);
      setField("hpGrowth", stats.hpGrowth);
      setField("speed", stats.speed);
      setField("defense", stats.defense);
      setField("slash", stats.resistances.slash);
      setField("pierce", stats.resistances.pierce);
      setField("blunt", stats.resistances.blunt);
      setField("stagger", stats.staggerThresholds.join(" / "));
      setField("tags", (identity.tags || []).join(", "));
      setField("notes", identity.notes);
      (identity.skills || []).forEach(addSkillRow);
      (identity.passives || []).forEach(addPassiveRow);
      (identity.voiceLines || []).forEach(function (voiceLine) { addVoiceLineRow(voiceLine); });
    }
    dialog.showModal();
    form.elements.namedItem("name").focus();
  }

  function numberOrEmpty(value) {
    if (value === "" || value === null || value === undefined) return "";
    var text = String(value).trim();
    if (/^n\/a$/i.test(text)) return "N/A";
    var numeric = Number(text);
    return Number.isFinite(numeric) ? numeric : text;
  }

  function readSkills() {
    return Array.from(skillFields.querySelectorAll(".skill-row")).map(function (row) {
      var skill = {};
      row.querySelectorAll("[data-key]").forEach(function (field) {
        skill[field.dataset.key] = field.type === "checkbox" ? field.checked : field.value.trim();
      });
      skill.coinTypes = readCoinTypeFields(row.querySelector("[data-coin-types]"), skill.coins);
      ["coins", "amount", "attackWeight", "flatDamage"].forEach(function (key) {
        if (skill[key] !== "") skill[key] = numberOrEmpty(skill[key]);
      });
      if (skill.type !== "Guard" && skill.type !== "Counter") delete skill.clashable;
      return skill;
    }).filter(function (skill) {
      return Object.keys(skill).some(function (key) {
        if (key === "coinTypes") return false;
        if (key === "amount") return skill.amount !== "" && Number(skill.amount) !== 1;
        if (key === "flatDamage") return Number(skill.flatDamage) > 0;
        return typeof skill[key] === "boolean" ? skill[key] : skill[key] !== "";
      });
    });
  }

  function readPassives() {
    return Array.from(passiveFields.querySelectorAll(".passive-row")).map(function (row) {
      var passive = {};
      row.querySelectorAll("[data-key]").forEach(function (field) {
        passive[field.dataset.key] = field.value.trim();
      });
      passive.requirements = readPassiveRequirements(row);
      return passive;
    }).filter(function (passive) {
      return Boolean(passive.name || passive.effect || passive.requirements.length);
    });
  }

  function readPassiveRequirements(container) {
    return Array.from(container.querySelectorAll(".passive-requirement-row")).map(function (requirementRow) {
      var requirement = {};
      requirementRow.querySelectorAll("[data-requirement-key]").forEach(function (field) {
        requirement[field.dataset.requirementKey] = field.value.trim();
      });
      if (requirement.sinAmount !== "") requirement.sinAmount = numberOrEmpty(requirement.sinAmount);
      return requirement;
    }).filter(function (requirement) {
      return Object.values(requirement).some(function (value) {
        return value !== undefined && value !== null && String(value).trim() !== "";
      });
    });
  }

  function readVoiceLines() {
    return Array.from(voiceLineFields.querySelectorAll(".voice-line-row")).map(function (row) {
      var categoryField = row.querySelector('[data-key="category"]');
      var category = categoryField.value === VOICE_LINE_CUSTOM_OPTION ?
        row.querySelector("[data-custom-category]").value.trim() : categoryField.value.trim();
      var text = row.querySelector('[data-key="text"]').value.trim();
      return { category: category, text: text };
    }).filter(function (voiceLine) {
      return Boolean(voiceLine.category && voiceLine.text);
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var characterId = String(data.get("character") || "");
    var levelValue = String(data.get("level") || "").trim();
    var numericLevel = Number(levelValue);
    if (!/^n\/a$/i.test(levelValue) && (!Number.isInteger(numericLevel) || numericLevel < 1 || numericLevel > state.settings.maxLevel)) {
      alert("Level must be N/A or a whole number between 1 and the maximum level in Settings.");
      return;
    }
    if (!characterById(characterId)) {
      alert("Select a character from the Character Manager before saving this identity.");
      return;
    }
    var draft = { name: name, characterId: characterId };
    var duplicate = state.identities.find(function (identity) {
      return identity.id !== editingId && normalizedKey(identity) === normalizedKey(draft);
    });
    if (duplicate) {
      alert("An identity with this name is already in the archive for that character.");
      return;
    }

    var previous = editingId ? byId(editingId) : null;
    var now = new Date().toISOString();
    var selectedRarity = String(data.get("rarity") || "");
    var walpurgisRarity = selectedRarity.match(/^([23])-walpurgis$/);
    var record = Object.assign({}, previous || {}, {
      id: editingId || newId(),
      name: name,
      characterId: characterId,
      level: /^n\/a$/i.test(levelValue) ? "N/A" : numericLevel,
      rarity: walpurgisRarity ? walpurgisRarity[1] : selectedRarity,
      rarityVariant: walpurgisRarity ? "Walpurgis" : "",
      mirrorWorld: String(data.get("mirrorWorld") || "").trim(),
      prefix: String(data.get("prefix") || "").trim(),
      panic: String(data.get("panic") || "").trim(),
      panicDescription: String(data.get("panicDescription") || "").trim(),
      uptieStory: String(data.get("uptieStory") || "").trim(),
      voiceLines: readVoiceLines(),
      releaseDate: data.get("releaseDate") || "",
      stats: {
        hp: numberOrEmpty(data.get("hp")),
        hpGrowth: numberOrEmpty(data.get("hpGrowth")),
        staggerThresholds: parseStaggerThresholds(data.get("stagger")),
        speed: String(data.get("speed") || "").trim(),
        defense: String(data.get("defense") || "").trim(),
        resistances: {
          slash: resistanceValue(data.get("slash")),
          pierce: resistanceValue(data.get("pierce")),
          blunt: resistanceValue(data.get("blunt"))
        }
      },
      skills: readSkills(),
      passives: readPassives(),
      tags: String(data.get("tags") || "").split(",").map(function (tag) { return tag.trim(); }).filter(Boolean),
      notes: String(data.get("notes") || "").trim(),
      createdAt: previous ? previous.createdAt : now,
      updatedAt: now
    });
    delete record.character;
    delete record.sinner;

    if (previous) {
      state.identities = state.identities.map(function (identity) { return identity.id === editingId ? record : identity; });
    } else {
      state.identities.push(record);
    }
    selectedId = record.id;
    saveState();
    dialog.close();
    render();
  });

  egoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(egoForm);
    var name = String(data.get("name") || "").trim();
    var characterId = String(data.get("character") || "");
    if (!characterById(characterId)) {
      alert("Select a character from the Character Manager before saving this E.G.O.");
      return;
    }
    var key = normalizedKey({ name: name, characterId: characterId });
    var duplicate = egoState.egos.find(function (ego) {
      return ego.id !== egoEditingId && normalizedKey(ego) === key;
    });
    if (duplicate) {
      alert("An E.G.O with this name is already in the archive for that character.");
      return;
    }
    var previous = egoEditingId ? egoById(egoEditingId) : null;
    var now = new Date().toISOString();
    var resourceCosts = {};
    egoForm.querySelectorAll("[data-resource-cost]").forEach(function (field) {
      resourceCosts[field.dataset.resourceCost] = numberOrEmpty(field.value);
    });
    var sinResistances = {};
    egoForm.querySelectorAll("[data-resistance]").forEach(function (field) {
      sinResistances[field.dataset.resistance] = resistanceValue(field.value);
    });
    var record = migrateEgo(Object.assign({}, previous || {}, {
      id: egoEditingId || newId(),
      name: name,
      characterId: characterId,
      riskLevel: String(data.get("riskLevel") || ""),
      sinAffinity: String(data.get("sinAffinity") || ""),
      sourceAbnormality: String(data.get("sourceAbnormality") || "").trim(),
      releaseDate: data.get("releaseDate") || "",
      acquisition: String(data.get("acquisition") || "").trim(),
      baseEgo: egoForm.elements.namedItem("baseEgo").checked,
      awakeningSanityCost: numberOrEmpty(data.get("awakeningSanityCost")),
      corrosionSanityCost: numberOrEmpty(data.get("corrosionSanityCost")),
      resourceCosts: resourceCosts,
      sinResistances: sinResistances,
      awakeningQuote: String(data.get("awakeningQuote") || "").trim(),
      corrosionQuote: String(data.get("corrosionQuote") || "").trim(),
      skills: readEgoSkills(),
      passiveName: String(data.get("passiveName") || "").trim(),
      passiveThreadspin: String(data.get("passiveThreadspin") || ""),
      passiveAlwaysActive: egoForm.elements.namedItem("passiveAlwaysActive").checked,
      passiveRequirement: String(data.get("passiveRequirement") || "").trim(),
      passiveEffect: String(data.get("passiveEffect") || "").trim(),
      passiveRequirements: readPassiveRequirements(egoPassiveRequirements),
      notes: String(data.get("notes") || "").trim(),
      createdAt: previous ? previous.createdAt : now,
      updatedAt: now
    }));
    delete record.character;
    delete record.sinner;
    if (previous) egoState.egos = egoState.egos.map(function (ego) { return ego.id === egoEditingId ? record : ego; });
    else egoState.egos.push(record);
    egoSelectedId = record.id;
    saveEgoState();
    egoDialog.close();
    renderEgoArchive();
  });

  announcerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(announcerForm);
    var name = String(data.get("name") || "").trim();
    var characterId = String(data.get("character") || "");
    if (characterId && !characterById(characterId)) {
      alert("Select a character from the Character Manager or leave the Character field unlinked.");
      return;
    }
    var duplicate = announcerState.announcers.find(function (announcer) {
      return announcer.id !== announcerEditingId && announcer.name.toLocaleLowerCase() === name.toLocaleLowerCase();
    });
    if (duplicate) {
      alert("An announcer with this name is already in the archive.");
      return;
    }
    var previous = announcerEditingId ? announcerById(announcerEditingId) : null;
    var now = new Date().toISOString();
    var record = migrateAnnouncer(Object.assign({}, previous || {}, {
      id: announcerEditingId || newId(),
      name: name,
      characterId: characterId,
      source: String(data.get("source") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
      voiceLines: readAnnouncerVoiceLines(),
      createdAt: previous ? previous.createdAt : now,
      updatedAt: now
    }));
    if (previous) announcerState.announcers = announcerState.announcers.map(function (announcer) {
      return announcer.id === announcerEditingId ? record : announcer;
    });
    else announcerState.announcers.push(record);
    announcerSelectedId = record.id;
    saveAnnouncerState();
    announcerDialog.close();
    renderAnnouncerArchive();
    renderCharacterArchive();
  });

  statusEffectForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(statusEffectForm);
    var name = String(data.get("name") || "").trim();
    var identifier = String(data.get("identifier") || "").trim();
    if (!name || !identifier) {
      alert("Status effect name and identifier are required.");
      return;
    }
    var conflict = findStatusEffectConflict(name, identifier, statusEffectEditingId);
    if (conflict) {
      alert('The name or identifier conflicts with "' + conflict.name + '". Names and identifiers must be unique across status effects.');
      return;
    }
    var previous = statusEffectEditingId ? statusEffectById(statusEffectEditingId) : null;
    var now = new Date().toISOString();
    var record = migrateStatusEffect(Object.assign({}, previous || {}, {
      id: statusEffectEditingId || newId(),
      name: name,
      identifier: identifier,
      description: String(data.get("description") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
      createdAt: previous ? previous.createdAt : now,
      updatedAt: now
    }));
    if (previous) statusEffectState.statusEffects = statusEffectState.statusEffects.map(function (effect) {
      return effect.id === statusEffectEditingId ? record : effect;
    });
    else statusEffectState.statusEffects.push(record);
    statusEffectSelectedId = record.id;
    saveStatusEffectState();
    hideStatusEffectTooltip();
    statusEffectDialog.close();
    renderStatusEffectArchive();
    render();
    renderEgoArchive();
    renderAnnouncerArchive();
  });

  characterForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(characterForm);
    var name = String(data.get("name") || "").trim();
    var duplicate = characterState.characters.find(function (character) {
      return character.id !== characterEditingId && normalizedCharacterName(character.name) === normalizedCharacterName(name);
    });
    if (duplicate) {
      alert("A character with this name already exists.");
      return;
    }
    var previous = characterEditingId ? characterById(characterEditingId) : null;
    var now = new Date().toISOString();
    var equippedEgoIds = {};
    var equippedEgoThreadspins = {};
    characterForm.querySelectorAll("[data-equipped-ego-risk]").forEach(function (field) {
      if (field.value) equippedEgoIds[field.dataset.equippedEgoRisk] = field.value;
    });
    characterForm.querySelectorAll("[data-equipped-ego-threadspin-risk]").forEach(function (field) {
      if (equippedEgoIds[field.dataset.equippedEgoThreadspinRisk]) {
        equippedEgoThreadspins[field.dataset.equippedEgoThreadspinRisk] = Number(field.value) || 4;
      }
    });
    var record = migrateCharacter(Object.assign({}, previous || {}, {
      id: characterEditingId || newId(),
      name: name,
      affiliation: String(data.get("affiliation") || "").trim(),
      introduction: String(data.get("introduction") || "").trim(),
      personality: String(data.get("personality") || "").trim(),
      history: String(data.get("history") || "").trim(),
      relationships: String(data.get("relationships") || "").trim(),
      trivia: String(data.get("trivia") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
      equippedEgoIds: equippedEgoIds,
      equippedEgoThreadspins: equippedEgoThreadspins,
      createdAt: previous ? previous.createdAt : now,
      updatedAt: now
    }));
    if (previous) characterState.characters = characterState.characters.map(function (character) {
      return character.id === characterEditingId ? record : character;
    });
    else characterState.characters.push(record);
    characterSelectedId = record.id;
    if (!saveCharacterState()) return;
    characterDialog.close();
    renderCharacterArchive();
    render();
    renderEgoArchive();
  });

  document.getElementById("character-add-button").addEventListener("click", function () { openCharacterForm(null); });
  document.getElementById("close-character-dialog").addEventListener("click", function () { characterDialog.close(); });
  document.getElementById("cancel-character-dialog").addEventListener("click", function () { characterDialog.close(); });
  document.getElementById("character-list").addEventListener("click", function (event) {
    var item = event.target.closest("[data-character-id]");
    if (!item) return;
    characterSelectedId = item.dataset.characterId;
    renderCharacterArchive();
  });
  document.getElementById("character-detail-pane").addEventListener("click", function (event) {
    var action = event.target.closest("[data-character-action]");
    if (action) {
      var character = characterById(characterSelectedId);
      if (!character) return;
      if (action.dataset.characterAction === "edit") openCharacterForm(character);
      if (action.dataset.characterAction === "delete") {
        if (identitiesForCharacter(character.id).length || egosForCharacter(character.id).length || announcersForCharacter(character.id).length) {
          alert("This character is used by saved identities, E.G.O, or announcers. Reassign or delete those records before deleting the character.");
          return;
        }
        if (confirm('Delete the character profile for "' + character.name + '"?')) {
          characterState.characters = characterState.characters.filter(function (record) { return record.id !== character.id; });
          characterSelectedId = null;
          if (!saveCharacterState()) return;
          renderCharacterArchive();
          render();
          renderEgoArchive();
        }
      }
      return;
    }
    var related = event.target.closest("[data-character-record-kind]");
    if (!related) return;
    if (related.dataset.characterRecordKind === "identity") {
      selectedId = related.dataset.characterRecordId;
      document.getElementById("search-input").value = "";
      document.getElementById("character-filter").value = byId(selectedId).characterId;
      document.getElementById("rarity-filter").value = "";
      render();
      showPage("archive");
    } else if (related.dataset.characterRecordKind === "ego") {
      egoSelectedId = related.dataset.characterRecordId;
      document.getElementById("ego-search-input").value = "";
      document.getElementById("ego-character-filter").value = egoById(egoSelectedId).characterId;
      document.getElementById("ego-risk-filter").value = "";
      document.getElementById("ego-affinity-filter").value = "";
      renderEgoArchive();
      showPage("ego-archive");
    } else if (related.dataset.characterRecordKind === "announcer") {
      announcerSelectedId = related.dataset.characterRecordId;
      document.getElementById("announcer-search-input").value = "";
      renderAnnouncerArchive();
      showPage("announcer-archive");
    }
  });
  document.getElementById("character-search-input").addEventListener("input", renderCharacterArchive);

  listElement.addEventListener("click", function (event) {
    var item = event.target.closest("[data-id]");
    if (!item) return;
    selectedId = item.dataset.id;
    render();
  });

  detailElement.addEventListener("click", function (event) {
    var action = event.target.closest("[data-action]");
    if (!action) return;
    var identity = byId(selectedId);
    if (!identity) return;
    if (action.dataset.action === "export") {
      exportSingleArchiveRecord("identity", identity);
      return;
    }
    if (action.dataset.action === "edit") openForm(identity);
    if (action.dataset.action === "delete" && confirm('Delete "' + identity.name + '" from this archive?')) {
      state.identities = state.identities.filter(function (item) { return item.id !== identity.id; });
      selectedId = null;
      saveState();
      render();
    }
  });

  ["search-input", "character-filter", "rarity-filter", "sort-filter"].forEach(function (id) {
    document.getElementById(id).addEventListener(id === "search-input" ? "input" : "change", render);
  });

  document.getElementById("add-button").addEventListener("click", function () { openForm(null); });
  document.getElementById("add-skill-button").addEventListener("click", function () { addSkillRow(null); });
  document.getElementById("add-passive-button").addEventListener("click", function () { addPassiveRow(null); });
  document.getElementById("add-voice-line-button").addEventListener("click", function () { addVoiceLineRow(null, false); });
  document.getElementById("add-custom-voice-category-button").addEventListener("click", function () { addVoiceLineRow(null, true); });
  document.getElementById("close-dialog").addEventListener("click", function () { dialog.close(); });
  document.getElementById("cancel-dialog").addEventListener("click", function () { dialog.close(); });
  document.getElementById("ego-add-button").addEventListener("click", function () { openEgoForm(null); });
  document.getElementById("add-ego-passive-requirement").addEventListener("click", function () {
    addPassiveRequirement(egoPassiveRequirements, null);
  });
  document.getElementById("announcer-add-button").addEventListener("click", function () { openAnnouncerForm(null); });
  document.getElementById("add-announcer-voice-line").addEventListener("click", function () { addAnnouncerVoiceLineRow(null); });
  document.getElementById("close-announcer-dialog").addEventListener("click", function () { announcerDialog.close(); });
  document.getElementById("cancel-announcer-dialog").addEventListener("click", function () { announcerDialog.close(); });
  announcerListElement.addEventListener("click", function (event) {
    var item = event.target.closest("[data-announcer-id]");
    if (!item) return;
    announcerSelectedId = item.dataset.announcerId;
    renderAnnouncerArchive();
  });
  announcerDetailElement.addEventListener("click", function (event) {
    var action = event.target.closest("[data-announcer-action]");
    if (!action) return;
    var announcer = announcerById(announcerSelectedId);
    if (!announcer) return;
    if (action.dataset.announcerAction === "export") {
      exportSingleArchiveRecord("announcer", announcer);
      return;
    }
    if (action.dataset.announcerAction === "edit") openAnnouncerForm(announcer);
    if (action.dataset.announcerAction === "delete" && confirm('Delete "' + announcer.name + '" from the Announcer Archive?')) {
      announcerState.announcers = announcerState.announcers.filter(function (record) { return record.id !== announcer.id; });
      announcerSelectedId = null;
      saveAnnouncerState();
      renderAnnouncerArchive();
      renderCharacterArchive();
    }
  });
  ["announcer-search-input", "announcer-sort-filter"].forEach(function (id) {
    document.getElementById(id).addEventListener(id === "announcer-search-input" ? "input" : "change", renderAnnouncerArchive);
  });
  document.getElementById("status-effect-add-button").addEventListener("click", function () { openStatusEffectForm(null); });
  document.getElementById("close-status-effect-dialog").addEventListener("click", function () { statusEffectDialog.close(); });
  document.getElementById("cancel-status-effect-dialog").addEventListener("click", function () { statusEffectDialog.close(); });
  statusEffectListElement.addEventListener("click", function (event) {
    var item = event.target.closest("[data-status-effect-id]");
    if (!item) return;
    statusEffectSelectedId = item.dataset.statusEffectId;
    renderStatusEffectArchive();
  });
  statusEffectDetailElement.addEventListener("click", function (event) {
    var action = event.target.closest("[data-status-effect-action]");
    if (!action) return;
    var effect = statusEffectById(statusEffectSelectedId);
    if (!effect) return;
    if (action.dataset.statusEffectAction === "export") {
      exportSingleArchiveRecord("statusEffect", effect);
      return;
    }
    if (action.dataset.statusEffectAction === "edit") openStatusEffectForm(effect);
    if (action.dataset.statusEffectAction === "delete" && confirm('Delete "' + effect.name + '" from the Status Effect Archive?')) {
      statusEffectState.statusEffects = statusEffectState.statusEffects.filter(function (record) { return record.id !== effect.id; });
      statusEffectSelectedId = null;
      saveStatusEffectState();
      hideStatusEffectTooltip();
      renderStatusEffectArchive();
      render();
      renderEgoArchive();
      renderAnnouncerArchive();
    }
  });
  ["status-effect-search-input", "status-effect-sort-filter"].forEach(function (id) {
    document.getElementById(id).addEventListener(id === "status-effect-search-input" ? "input" : "change", renderStatusEffectArchive);
  });
  document.getElementById("ego-list").addEventListener("click", function (event) {
    var item = event.target.closest("[data-ego-id]");
    if (!item) return;
    egoSelectedId = item.dataset.egoId;
    renderEgoArchive();
  });
  document.getElementById("ego-detail-pane").addEventListener("click", function (event) {
    var action = event.target.closest("[data-ego-action]");
    if (!action) return;
    var ego = egoById(egoSelectedId);
    if (!ego) return;
    if (action.dataset.egoAction === "export") {
      exportSingleArchiveRecord("ego", ego);
      return;
    }
    if (action.dataset.egoAction === "edit") openEgoForm(ego);
    if (action.dataset.egoAction === "delete" && confirm('Delete "' + ego.name + '" from the E.G.O archive?')) {
      egoState.egos = egoState.egos.filter(function (record) { return record.id !== ego.id; });
      characterState.characters.forEach(function (character) {
        Object.keys(character.equippedEgoIds || {}).forEach(function (risk) {
          if (character.equippedEgoIds[risk] === ego.id) delete character.equippedEgoIds[risk];
        });
      });
      egoSelectedId = null;
      saveEgoState();
      saveCharacterState();
      renderEgoArchive();
      renderCharacterArchive();
    }
  });
  ["ego-search-input", "ego-character-filter", "ego-risk-filter", "ego-affinity-filter", "ego-sort-filter"].forEach(function (id) {
    document.getElementById(id).addEventListener(id === "ego-search-input" ? "input" : "change", renderEgoArchive);
  });
  document.getElementById("add-ego-awakening-skill").addEventListener("click", function () { addEgoSkillRow(null, "Awakening"); });
  document.getElementById("add-ego-corrosion-skill").addEventListener("click", function () { addEgoSkillRow(null, "Corrosion"); });
  document.getElementById("close-ego-dialog").addEventListener("click", function () { egoDialog.close(); });
  document.getElementById("cancel-ego-dialog").addEventListener("click", function () { egoDialog.close(); });

  var activePage = "main-menu";
  var pages = {
    "main-menu": document.getElementById("main-menu-page"),
    "archive": document.getElementById("archive-page"),
    "ego-archive": document.getElementById("ego-archive-page"),
    "announcer-archive": document.getElementById("announcer-archive-page"),
    "status-archive": document.getElementById("status-archive-page"),
    "character-manager": document.getElementById("character-manager-page"),
    "combat-tracker": document.getElementById("combat-tracker-page"),
    "rules-mechanics": document.getElementById("rules-mechanics-page"),
    "settings": document.getElementById("settings-page")
  };
  function freshCombatState() {
    return {
      round: 1,
      combatants: [freshCombatant("Ally", "Group 1"), freshCombatant("Opponent", "Group 2")],
      log: []
    };
  }
  function freshCombatant(name, group) {
    var ownedSins = {};
    var roundSins = {};
    COMBAT_SINS.forEach(function (sin) { ownedSins[sin] = 0; roundSins[sin] = 0; });
    return {
      id: newId(), source: "manual", name: name, group: group || "Group 1", identityId: "", skillKey: "", skillDataKey: "", sanity: 0,
      basePower: 4, coinPower: 2, coinCount: 2,
      coinTypes: [{ type: "Normal" }, { type: "Normal" }],
      sin: "", skillType: "", rank: 1, die: 12, speedRange: "1-6", initiative: null, initiativeRound: 0,
      egoId: "", egoMode: "", defensiveEgoId: "", currentHp: 100, maxHp: 100, shield: 0, staggerThresholds: "70 / 50 / 30",
      staggeredThroughRound: 0, evadeRound: 0, evadePower: 0, counterReady: null, skillUsedRound: 0,
      ownedSins: ownedSins, roundSins: roundSins, drawnSkillKeys: []
    };
  }
  function parseSpeedRange(value) {
    var text = String(value || "").trim().toLocaleLowerCase();
    if (text === "high") return { min: 2, max: 8, fallback: false };
    if (text === "mid" || text === "medium") return { min: 1, max: 6, fallback: false };
    if (text === "low") return { min: 1, max: 3, fallback: false };
    var match = text.match(/^(-?\d+)\s*(?:-|–|—|to)\s*(-?\d+)$/i);
    if (match) {
      var first = Number(match[1]);
      var second = Number(match[2]);
      return { min: Math.min(first, second), max: Math.max(first, second), fallback: false };
    }
    match = text.match(/^(-?\d+)$/);
    if (match) return { min: Number(match[1]), max: Number(match[1]), fallback: false };
    return { min: 1, max: 6, fallback: true };
  }
  function rollInitiative(combatant) {
    var speed = parseSpeedRange(combatant.speedRange);
    return Math.floor(Math.random() * (speed.max - speed.min + 1)) + speed.min;
  }
  function normalizeCombatState(saved) {
    if (!saved || typeof saved !== "object" || !Array.isArray(saved.combatants) || !saved.combatants.length) {
      return freshCombatState();
    }
    var combatants = saved.combatants.map(function (entry, index) {
      var defaultGroup = index === 0 ? "Group 1" : "Group 2";
      var combatant = Object.assign(freshCombatant("Combatant " + (index + 1), defaultGroup), entry || {});
      combatant.id = String(combatant.id || newId());
      combatant.source = combatant.source === "identity" ? "identity" : "manual";
      combatant.name = String(combatant.name || "Combatant " + (index + 1));
      combatant.skillKey = String(combatant.skillKey || "");
      combatant.skillDataKey = String(combatant.skillDataKey || "");
      combatant.egoId = String(combatant.egoId || "");
      combatant.egoMode = combatant.egoMode === "Corrosion" ? "Corrosion" : "Awakening";
      combatant.group = String(combatant.group || defaultGroup).trim().slice(0, 40) || defaultGroup;
      combatant.speedRange = String(combatant.speedRange || "1-6").slice(0, 30);
      combatant.initiative = combatant.initiative !== null && combatant.initiative !== "" &&
        Number.isFinite(Number(combatant.initiative)) ? Math.floor(Number(combatant.initiative)) : null;
      combatant.initiativeRound = Math.max(0, Math.floor(Number(combatant.initiativeRound) || 0));
      combatant.defensiveEgoId = String(combatant.defensiveEgoId || "");
      combatant.staggeredThroughRound = Math.max(0, Math.floor(Number(combatant.staggeredThroughRound) || 0));
      combatant.evadeRound = Math.max(0, Math.floor(Number(combatant.evadeRound) || 0));
      combatant.evadePower = Math.max(0, Number(combatant.evadePower) || 0);
      combatant.counterReady = combatant.counterReady && typeof combatant.counterReady === "object" ?
        combatant.counterReady : null;
      combatant.counterReadyRound = combatant.counterReady ?
        Math.max(0, Math.floor(Number(combatant.counterReadyRound) || 0)) : 0;
      combatant.skillUsedRound = Math.max(0, Math.floor(Number(combatant.skillUsedRound) || 0));
      var maxHp = Number(combatant.maxHp);
      combatant.maxHp = Number.isFinite(maxHp) && maxHp > 0 ? Math.floor(maxHp) : 100;
      var currentHp = Number(combatant.currentHp);
      combatant.currentHp = Number.isFinite(currentHp) ? Math.min(combatant.maxHp, Math.max(0, Math.floor(currentHp))) : combatant.maxHp;
      combatant.shield = Math.max(0, Math.floor(Number(combatant.shield) || 0));
      var linkedIdentity = combatant.source === "identity" ? byId(combatant.identityId) : null;
      if (linkedIdentity) {
        var derivedHp = identityMaxHp(linkedIdentity);
        if (derivedHp > 0) {
          if (combatant.currentHp >= combatant.maxHp) combatant.currentHp = derivedHp;
          combatant.maxHp = derivedHp;
          combatant.currentHp = Math.min(combatant.currentHp, combatant.maxHp);
        }
        combatant.speedRange = String(blankStats(linkedIdentity.stats).speed || combatant.speedRange);
      }
      combatant.staggerThresholds = String(combatant.staggerThresholds || "").slice(0, 100);
      combatant.drawnSkillKeys = Array.isArray(combatant.drawnSkillKeys) ?
        combatant.drawnSkillKeys.map(String).slice(0, 2) : [];
      combatant.coinTypes = normalizeCoinTypes(combatant.coinTypes, coinCountValue(combatant.coinCount));
      ["ownedSins", "roundSins"].forEach(function (key) {
        var counts = {};
        COMBAT_SINS.forEach(function (sin) {
          counts[sin] = Math.max(0, Math.floor(Number(combatant[key] && combatant[key][sin]) || 0));
        });
        combatant[key] = counts;
      });
      return combatant;
    });
    var log = Array.isArray(saved.log) ? saved.log.filter(function (entry) {
      return entry && typeof entry === "object";
    }).map(function (entry) {
      return { round: Math.max(1, Math.floor(Number(entry.round) || 1)), message: String(entry.message || "").slice(0, 500) };
    }).slice(-100) : [];
    return {
      round: Math.max(1, Math.floor(Number(saved.round) || 1)),
      combatants: combatants,
      log: log
    };
  }
  function loadCombatState() {
    try {
      var raw = localStorage.getItem(COMBAT_STORAGE_KEY);
      if (!raw) return freshCombatState();
      return normalizeCombatState(JSON.parse(raw));
    } catch (error) {
      console.warn("Could not read the saved combat encounter; starting a new encounter.", error);
      return freshCombatState();
    }
  }
  function saveCombatState() {
    try {
      localStorage.setItem(COMBAT_STORAGE_KEY, JSON.stringify(combatState));
      return true;
    } catch (error) {
      alert("The combat encounter could not be saved in this browser.");
      return false;
    }
  }
  function addCombatSelectOption(select, value, label) {
    var option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  }
  function equippedEgosForCharacter(characterId) {
    var character = characterById(characterId);
    if (!character) return [];
    return EGO_RISK_LEVELS.map(function (risk) {
      var ego = egoById(character.equippedEgoIds && character.equippedEgoIds[risk]);
      return ego && ego.characterId === characterId && ego.riskLevel === risk ? ego : null;
    }).filter(Boolean);
  }
  function equippedEgoThreadspin(characterId, egoId) {
    var character = characterById(characterId);
    if (!character) return 4;
    var ego = egoById(egoId);
    if (!ego) return 4;
    var risk = ego.riskLevel;
    var value = Number(character.equippedEgoThreadspins && character.equippedEgoThreadspins[risk]);
    return Number.isInteger(value) && value >= 1 && value <= 4 ? value : 4;
  }
  function availableCombatSkills(identity) {
    if (!identity) return [];
    var skills = (identity.skills || []).map(function (skill, index) {
      return {
        key: "identity:" + index, name: skill.name || "Skill " + (index + 1), sin: skill.sin || "",
        basePower: skill.skillPower, coinPower: skill.coinPower, coinCount: skill.coins,
        coinTypes: skill.coinTypes, rank: skill.skillLevel, amount: skill.amount, flatDamage: skill.flatDamage,
        type: skill.type || "", clashable: Boolean(skill.clashable), attackWeight: skill.attackWeight
      };
    });
    equippedEgosForCharacter(identity.characterId).forEach(function (ego) {
      var equippedThreadspin = equippedEgoThreadspin(identity.characterId, ego.id);
      (ego.skills || []).forEach(function (skill, index) {
        var requiredThreadspin = Number(skill.threadspin) || 4;
        if (requiredThreadspin > equippedThreadspin) return;
        skills.push({
          key: "ego:" + ego.id + ":" + index,
          name: ego.name + " · " + (skill.mode || "Awakening") + " · " + (skill.name || "Threadspin " + (skill.threadspin || "4")),
          sin: skill.sinAffinity || ego.sinAffinity || "", basePower: skill.basePower, coinPower: skill.coinPower, coinCount: skill.coinCount,
          coinTypes: skill.coinTypes, rank: "1", ego: ego.name, egoId: ego.id,
          egoMode: skill.mode || "Awakening", threadspin: requiredThreadspin,
          egoSanityCost: skill.mode === "Corrosion" ? ego.corrosionSanityCost : ego.awakeningSanityCost,
          resourceCosts: ego.resourceCosts,
          type: skill.attackType || "", amount: skill.amount, flatDamage: skill.flatDamage,
          attackWeight: skill.attackWeight
        });
      });
    });
    return skills;
  }
  function availableIdentityCombatSkills(identity) {
    return availableCombatSkills(identity).filter(function (skill) { return !skill.egoId; });
  }
  function availableEgoCombatSkills(identity, egoId) {
    return availableCombatSkills(identity).filter(function (skill) { return skill.egoId === egoId; });
  }
  function selectedEgoCombatSkill(identity, egoId, mode) {
    return availableEgoCombatSkills(identity, egoId).filter(function (skill) {
      return skill.egoMode === mode;
    }).sort(function (left, right) { return right.threadspin - left.threadspin; })[0] || null;
  }
  function combatSkillPoolWeight(skill) {
    if (skill.amount === "" || skill.amount === null || skill.amount === undefined) return 1;
    var weight = Number(skill.amount);
    return Number.isFinite(weight) && weight > 0 ? weight : 0;
  }
  function drawCombatSkills(identity, excludedKeys, count) {
    var excluded = new Set(excludedKeys || []);
    var pool = availableIdentityCombatSkills(identity).map(function (skill) {
      return { skill: skill, weight: combatSkillPoolWeight(skill) };
    }).filter(function (entry) {
      return entry.weight > 0 && !excluded.has(entry.skill.key);
    });
    var drawn = [];
    var drawLimit = Math.max(0, Math.min(2, Number(count) || 0));
    while (pool.length && drawn.length < drawLimit) {
      var totalWeight = pool.reduce(function (total, entry) { return total + entry.weight; }, 0);
      var roll = Math.random() * totalWeight;
      var selectedIndex = pool.findIndex(function (entry) {
        roll -= entry.weight;
        return roll < 0;
      });
      if (selectedIndex < 0) selectedIndex = pool.length - 1;
      drawn.push(pool.splice(selectedIndex, 1)[0].skill);
    }
    return drawn;
  }
  function combatantHasUsedSkillThisRound(combatant) {
    return combatant.skillUsedRound === combatState.round;
  }
  function combatantCanUseSkill(combatant, skill) {
    if (!skill || combatantHasUsedSkillThisRound(combatant)) return false;
    return combatant.source !== "identity" || Boolean(skill.egoId) || combatant.drawnSkillKeys.includes(skill.key);
  }
  function consumeCombatantSkill(combatant, skill) {
    combatant.skillUsedRound = combatState.round;
    if (combatant.source !== "identity") return;
    if (skill.egoId) return;
    combatant.drawnSkillKeys = combatant.drawnSkillKeys.filter(function (key) { return key !== skill.key; });
    combatant.skillKey = combatant.drawnSkillKeys[0] || "";
  }
  function passiveRequirementText(passive) {
    var requirements = Array.isArray(passive.requirements) ? passive.requirements : [];
    var structured = requirements.map(function (requirement) {
      return [requirement.sinAmount, requirement.sinType, requirement.sinMode].filter(function (value) {
        return value !== undefined && value !== null && String(value).trim() !== "";
      }).join(" ");
    }).filter(Boolean).join(" + ");
    return structured || String(passive.requirementText || passive.passiveRequirement || "").trim() ||
      "No activation requirement recorded";
  }
  function combatPassivesFor(combatant) {
    var identity = byId(combatant.identityId);
    if (!identity) return [];
    var passives = (identity.passives || []).map(function (passive) {
      return { passive: passive, source: identity.name };
    });
    var character = characterById(identity.characterId);
    var activatedEgoIds = character ? character.usedEgoPassiveIds || [] : [];
    egoState.egos.filter(function (ego) {
      return ego.characterId === identity.characterId;
    }).forEach(function (ego) {
      var isEquipped = equippedEgosForCharacter(identity.characterId).some(function (equipped) {
        return equipped.id === ego.id;
      });
      var permanentlyActive = activatedEgoIds.includes(ego.id);
      if (!isEquipped && !permanentlyActive && !ego.passiveAlwaysActive) return;
      var threadspin = isEquipped ? equippedEgoThreadspin(identity.characterId, ego.id) : 0;
      var passiveUnlock = Number(ego.passiveThreadspin);
      if (!Number.isInteger(passiveUnlock) || passiveUnlock < 1 || passiveUnlock > 4) passiveUnlock = 1;
      if ((threadspin >= passiveUnlock || permanentlyActive || ego.passiveAlwaysActive) &&
        (ego.passiveName || ego.passiveRequirement || ego.passiveEffect || ego.passiveAlwaysActive ||
          (ego.passiveRequirements || []).length)) {
        passives.push({
          passive: {
            name: ego.passiveName || ego.name + " Passive",
            requirements: ego.passiveRequirements,
            requirementText: ego.passiveRequirement,
            effect: ego.passiveEffect,
            permanentlyActive: permanentlyActive,
            alwaysActive: Boolean(ego.passiveAlwaysActive)
          },
          source: ego.name
        });
      }
    });
    return passives;
  }
  function combatantCard(id) {
    return document.querySelector('.combatant-card[data-combatant-id="' + id + '"]');
  }
  function syncCombatantFromCard(combatant, card) {
    if (!card) return;
    function field(name) { return card.querySelector('[data-field="' + name + '"]'); }
    combatant.source = field("source").value;
    combatant.identityId = field("identity").value;
    var linkedIdentity = combatant.source === "identity" ? byId(combatant.identityId) : null;
    combatant.name = linkedIdentity ? linkedIdentity.name : (field("name").value.trim() || "Combatant");
    combatant.group = String(field("group").value || "").trim().slice(0, 40) || "Group 1";
    combatant.speedRange = linkedIdentity ? String(blankStats(linkedIdentity.stats).speed || "1-6") :
      String(field("speedRange").value || "1-6");
    combatant.skillKey = field("skill").value;
    combatant.egoId = field("ego").value;
    combatant.egoMode = field("egoMode").value;
    combatant.defensiveEgoId = field("defensiveEgo").value;
    combatant.sanity = Number(field("sanity").value);
    combatant.currentHp = Math.max(0, Math.floor(Number(field("currentHp").value) || 0));
    combatant.maxHp = Math.max(1, Math.floor(Number(field("maxHp").value) || 1));
    combatant.currentHp = Math.min(combatant.maxHp, combatant.currentHp);
    combatant.staggerThresholds = field("staggerThresholds").value;
    combatant.basePower = field("basePower").value;
    combatant.coinPower = field("coinPower").value;
    combatant.coinCount = field("coinCount").value;
    combatant.coinTypes = readCoinTypeFields(card.querySelector('[data-view="combat-coin-types"]'), combatant.coinCount);
    combatant.skillType = field("skillType").value;
    combatant.flatDamage = field("flatDamage").value;
    combatant.sin = field("sin").value;
    combatant.rank = field("rank").value;
    combatant.die = field("die").value;
    combatant.targetId = field("target").value;
  }
  function selectedCombatSkill(combatant, card) {
    function field(name) { return card.querySelector('[data-field="' + name + '"]'); }
    var identity = combatant.source === "identity" ? byId(combatant.identityId) : null;
    var archivedSkill = identity && (combatant.egoId ?
      selectedEgoCombatSkill(identity, combatant.egoId, combatant.egoMode) :
      availableIdentityCombatSkills(identity).find(function (skill) { return skill.key === combatant.skillKey; }));
    if (combatant.source === "identity" && !archivedSkill) return null;
    var basePower = Number(field("basePower").value);
    var coinPower = Number(field("coinPower").value);
    var coinCount = Number(field("coinCount").value);
    var rank = Number(field("rank").value);
    var die = Number(field("die").value);
    var flatDamage = Number(field("flatDamage").value || 0);
    return {
      key: archivedSkill ? archivedSkill.key : "",
      name: archivedSkill ? archivedSkill.name : "Manual skill",
      sin: archivedSkill ? archivedSkill.sin : field("sin").value,
      type: archivedSkill ? archivedSkill.type : field("skillType").value,
      clashable: Boolean(archivedSkill && archivedSkill.clashable),
      attackWeight: archivedSkill ? archivedSkill.attackWeight : "",
      egoId: archivedSkill ? archivedSkill.egoId : "",
      ego: archivedSkill && archivedSkill.ego ? {
        id: archivedSkill.egoId,
        name: archivedSkill.ego,
        mode: archivedSkill.egoMode,
        sanityCost: archivedSkill.egoSanityCost,
        resourceCosts: archivedSkill.resourceCosts || {}
      } : null,
      coinTypes: readCoinTypeFields(card.querySelector('[data-view="combat-coin-types"]'), coinCount),
      valid: field("basePower").value !== "" && field("coinCount").value !== "" &&
        Number.isFinite(basePower) && basePower >= 0 && Number.isFinite(coinPower) &&
        Number.isFinite(flatDamage) && flatDamage >= 0 &&
        Number.isInteger(coinCount) && coinCount >= 0 && coinCount <= 20 &&
        Number.isInteger(rank) && rank >= 1 && rank <= 3 &&
        [4, 6, 8, 10, 12, 20].indexOf(die) !== -1,
      basePower: basePower,
      coinPower: coinPower,
      coinCount: coinCount,
      rank: rank,
      die: die,
      flatDamage: flatDamage
    };
  }
  function parseCombatValue(value) {
    var match = String(value === undefined || value === null ? "" : value).replace(/\s/g, "").match(/^[+-]?\d+(?:\.\d+)?$/);
    return match ? Number(match[0]) : "";
  }
  function applyArchivedCombatSkill(combatant, card) {
    var identity = byId(combatant.identityId);
    var skill = identity && (combatant.egoId ?
      selectedEgoCombatSkill(identity, combatant.egoId, combatant.egoMode) :
      availableIdentityCombatSkills(identity).find(function (entry) { return entry.key === combatant.skillKey; }));
    if (!skill) return;
    combatant.name = identity.name;
    combatant.skillDataKey = skill.key;
    combatant.basePower = parseCombatValue(skill.basePower);
    combatant.coinPower = parseCombatValue(skill.coinPower);
    combatant.coinCount = parseCombatValue(skill.coinCount);
    combatant.coinTypes = normalizeCoinTypes(skill.coinTypes, coinCountValue(skill.coinCount));
    combatant.sin = skill.sin || "";
    combatant.skillType = skill.type || "";
    combatant.flatDamage = parseCombatValue(skill.flatDamage);
    var rank = String(skill.rank || "").match(/[123]/);
    if (rank) combatant.rank = Number(rank[0]);
    var fields = ["name", "basePower", "coinPower", "coinCount", "sin", "skillType", "rank", "flatDamage"];
    fields.forEach(function (name) {
      var field = card.querySelector('[data-field="' + name + '"]');
      field.value = combatant[name];
    });
    renderCoinTypeFields(card.querySelector('[data-view="combat-coin-types"]'), combatant.coinCount, combatant.coinTypes);
  }
  function appendCombatLog(message) {
    combatState.log.push({ round: combatState.round, message: message });
    if (combatState.log.length > 100) combatState.log.shift();
  }
  function identityMaxHp(identity) {
    var stats = blankStats(identity.stats);
    if (stats.hp === "" || stats.hp === undefined || stats.hp === null ||
      /^n\/a$/i.test(String(stats.hp)) || /^n\/a$/i.test(String(stats.hpGrowth)) ||
      /^n\/a$/i.test(String(identity.level))) return 0;
    var baseHp = Number(stats.hp);
    if (!Number.isFinite(baseHp)) return 0;
    var growth = stats.hpGrowth === "" || stats.hpGrowth === undefined || stats.hpGrowth === null ? 0 : Number(stats.hpGrowth);
    var level = Number(identity.level) || 40;
    if (!Number.isFinite(growth)) growth = 0;
    return Math.ceil(baseHp + growth * level);
  }
  function identityCombatVitals(combatant) {
    synchronizeIdentityVitals(combatant, true);
  }
  function synchronizeIdentityVitals(combatant, restoreFullHealth) {
    var identity = byId(combatant.identityId);
    if (!identity) return false;
    var stats = blankStats(identity.stats);
    var maxHp = identityMaxHp(identity);
    var changed = false;
    if (Number.isFinite(maxHp) && maxHp > 0) {
      var previousMax = Number(combatant.maxHp) || maxHp;
      var currentHp = Number(combatant.currentHp);
      var nextMax = Math.floor(maxHp);
      if (combatant.maxHp !== nextMax) {
        combatant.currentHp = restoreFullHealth || currentHp >= previousMax ?
          nextMax : Math.min(Math.max(0, Math.floor(currentHp) || 0), nextMax);
        combatant.maxHp = nextMax;
        changed = true;
      } else if (restoreFullHealth && combatant.currentHp !== nextMax) {
        combatant.currentHp = nextMax;
        changed = true;
      }
    }
    var speedRange = String(stats.speed || "1-6");
    if (combatant.speedRange !== speedRange) {
      combatant.speedRange = speedRange;
      changed = true;
    }
    var thresholds = stats.staggerThresholds.filter(function (threshold) {
      var number = Number(threshold);
      return Number.isFinite(number) && number >= 0 && number <= 100;
    }).join(" / ");
    if (combatant.staggerThresholds !== thresholds) {
      combatant.staggerThresholds = thresholds;
      changed = true;
    }
    return changed;
  }
  function combatStaggerThresholds(combatant) {
    return String(combatant.staggerThresholds || "").split(/[\/,]/).map(function (value) {
      return Number(String(value).trim().replace(/%$/, ""));
    }).filter(function (value) {
      return Number.isFinite(value) && value >= 0 && value <= 100;
    }).sort(function (left, right) { return right - left; });
  }
  function renderCombatantVitals(combatant, card) {
    var currentHp = Math.max(0, Number(combatant.currentHp) || 0);
    var maxHp = Math.max(1, Number(combatant.maxHp) || 1);
    var percentage = Math.min(100, currentHp / maxHp * 100);
    var track = card.querySelector(".combat-hp-track");
    var fill = card.querySelector('[data-view="hp-fill"]');
    var markers = card.querySelector('[data-view="stagger-markers"]');
    var thresholds = combatStaggerThresholds(combatant);
    var stage = thresholds.filter(function (threshold) { return percentage <= threshold; }).length;
    fill.style.width = percentage + "%";
    fill.classList.toggle("is-low", percentage <= 25);
    track.setAttribute("aria-valuemax", String(maxHp));
    track.setAttribute("aria-valuenow", String(currentHp));
    markers.textContent = "";
    thresholds.forEach(function (threshold) {
      var marker = document.createElement("span");
      marker.className = "combat-stagger-marker";
      marker.style.left = threshold + "%";
      marker.setAttribute("aria-hidden", "true");
      markers.appendChild(marker);
    });
    card.querySelector('[data-view="stagger-level"]').textContent = thresholds.length ?
      (stage ? "Staggered · " + stage + " threshold" + (stage === 1 ? "" : "s") : "Not staggered") : "No stagger thresholds";
    card.classList.toggle("is-staggered", stage > 0);
  }
  function recordSinUse(combatant, skill) {
    if (!COMBAT_SINS.includes(skill.sin)) return;
    combatant.ownedSins[skill.sin] = (Number(combatant.ownedSins[skill.sin]) || 0) + 1;
    combatant.roundSins[skill.sin] = (Number(combatant.roundSins[skill.sin]) || 0) + 1;
  }
  function egoCostFailure(combatant, skill) {
    if (!skill.ego) return "";
    var missing = EGO_SINS.filter(function (sin) {
      var cost = Number(skill.ego.resourceCosts[sin]) || 0;
      return cost > (Number(combatant.ownedSins[sin]) || 0);
    });
    if (missing.length) {
      return "Not enough E.G.O resources: " + missing.map(function (sin) {
        return sin + " " + (Number(combatant.ownedSins[sin]) || 0) + "/" +
          (Number(skill.ego.resourceCosts[sin]) || 0);
      }).join(", ") + ".";
    }
    return "";
  }
  function payEgoCost(combatant, skill) {
    if (!skill.ego) return;
    EGO_SINS.forEach(function (sin) {
      var cost = Number(skill.ego.resourceCosts[sin]) || 0;
      combatant.ownedSins[sin] = Math.max(0, (Number(combatant.ownedSins[sin]) || 0) - cost);
    });
    combatant.sanity = Math.max(-45, combatant.sanity - (Number(skill.ego.sanityCost) || 0));
  }
  function combatantIdentity(combatant) {
    return combatant.source === "identity" ? byId(combatant.identityId) : null;
  }
  function combatStaggerStage(combatant) {
    var percentage = Math.max(0, Number(combatant.currentHp) || 0) /
      Math.max(1, Number(combatant.maxHp) || 1) * 100;
    return combatStaggerThresholds(combatant).filter(function (threshold) {
      return percentage <= threshold;
    }).length;
  }
  function combatStaggerDamageMultiplier(stage) {
    return stage === 1 ? 2 : (stage === 2 ? 2.5 : (stage >= 3 ? 3 : 1));
  }
  function combatResistanceMultiplier(value, fallback) {
    var multiplier = Number(value);
    return Number.isFinite(multiplier) && multiplier >= 0 ? multiplier : fallback;
  }
  function combatDamageMultiplier(defender, skill) {
    var identity = combatantIdentity(defender);
    var physicalType = String(skill.type || "").toLocaleLowerCase();
    var physicalValue = identity && identity.stats && identity.stats.resistances ?
      identity.stats.resistances[physicalType] : "";
    var staggerStage = combatStaggerStage(defender);
    var physicalMultiplier = staggerStage ?
      combatStaggerDamageMultiplier(staggerStage) :
      combatResistanceMultiplier(physicalValue, 1);
    var defensiveEgo = egoById(defender.defensiveEgoId);
    var sinValue = defensiveEgo && skill.sin ? defensiveEgo.sinResistances[skill.sin] : "";
    return {
      physical: physicalMultiplier,
      sin: combatResistanceMultiplier(sinValue, 1),
      staggerStage: staggerStage
    };
  }
  function applyCombatDamage(defender, skill, rawDamage, attackerPower) {
    if (defender.evadeRound === combatState.round) {
      var evadePower = Number(defender.evadePower) || 0;
      defender.evadeRound = 0;
      defender.evadePower = 0;
      if (evadePower >= attackerPower) {
        return { rawDamage: rawDamage, damage: 0, absorbed: 0, dodged: true, staggered: false };
      }
    }
    var multipliers = combatDamageMultiplier(defender, skill);
    var identity = combatantIdentity(defender);
    var defenseMod = identity ? parseCombatValue(blankStats(identity.stats).defense) : 0;
    if (!Number.isFinite(defenseMod)) defenseMod = 0;
    var afterDefense = Math.max(0, rawDamage - defenseMod);
    var damage = Math.floor(afterDefense * multipliers.physical * multipliers.sin);
    var absorbed = Math.min(defender.shield, damage);
    defender.shield -= absorbed;
    var hpDamage = damage - absorbed;
    var previousStage = combatStaggerStage(defender);
    defender.currentHp = Math.max(0, defender.currentHp - hpDamage);
    var nextStage = combatStaggerStage(defender);
    var newlyStaggered = hpDamage > 0 && defender.shield === 0 && nextStage > previousStage;
    if (newlyStaggered) {
      defender.staggeredThroughRound = Math.max(defender.staggeredThroughRound, combatState.round + 1);
    }
    return {
      rawDamage: rawDamage,
      defenseMod: defenseMod,
      damage: damage,
      hpDamage: hpDamage,
      absorbed: absorbed,
      dodged: false,
      staggered: newlyStaggered,
      staggerStage: nextStage,
      multipliers: multipliers
    };
  }
  function combatDamageExplanation(result) {
    if (result.dodged) return "evaded";
    var details = [];
    if (result.defenseMod) details.push("Defense " + (result.defenseMod > 0 ? "-" : "+") + Math.abs(result.defenseMod));
    if (result.multipliers.physical !== 1) details.push("physical ×" + result.multipliers.physical);
    if (result.multipliers.sin !== 1) details.push("Sin ×" + result.multipliers.sin);
    if (result.multipliers.staggerStage) details.push("Stagger ×" + combatStaggerDamageMultiplier(result.multipliers.staggerStage));
    return result.damage + " after" + (details.length ? " " + details.join(", ") : " modifiers");
  }
  function resolvePreparedCounter(defender, attacker) {
    if (!defender.counterReady || defender.counterReadyRound !== combatState.round) return null;
    var skill = defender.counterReady;
    defender.counterReady = null;
    defender.counterReadyRound = 0;
    var threshold = combatCoinThreshold(defender.sanity);
    if (threshold === null) return { message: defender.name + "'s Counter could not resolve at this Sanity value." };
    var coins = normalizeCoinTypes(skill.coinTypes, skill.coinCount).map(function (coin, index) {
      return { index: index, special: coin.special, cracked: false };
    });
    var attack = resolveCombatAttack(skill, threshold, coins);
    var result = applyCombatDamage(attacker, skill, attack.damage, attack.clashPower);
    return {
      attack: attack,
      result: result,
      message: defender.name + " counters " + attacker.name + " for " + attack.damage +
        " damage" + (result.dodged ? ", but the attack is evaded" :
          (" (" + combatDamageExplanation(result) + "); " +
            (result.absorbed ? attacker.name + " shield absorbs " + result.absorbed + ", " : "") +
            attacker.name + " HP " + attacker.currentHp + "/" + attacker.maxHp + "."))
    };
  }
  function combatantIsStaggerLocked(combatant) {
    return Number(combatant.staggeredThroughRound) >= combatState.round;
  }
  function groupRoundSinCount(combatant, sin) {
    return combatState.combatants.reduce(function (total, member) {
      return total + (member.group === combatant.group ? Number(member.roundSins[sin]) || 0 : 0);
    }, 0);
  }
  function passiveIsActive(passive, combatant) {
    if (passive.permanentlyActive || passive.alwaysActive) return true;
    var requirements = Array.isArray(passive.requirements) ? passive.requirements : [];
    return requirements.length > 0 && requirements.every(function (requirement) {
      var sin = requirement.sinType;
      var amount = Number(requirement.sinAmount);
      if (!COMBAT_SINS.includes(sin) || !Number.isFinite(amount) || amount < 1) return false;
      var available = requirement.sinMode === "Resonance" ? groupRoundSinCount(combatant, sin) :
        (requirement.sinMode === "Owned" ? combatant.ownedSins[sin] : 0);
      return Number(available) >= amount;
    });
  }
  function markEgoPassiveUsed(combatant, skill) {
    if (!skill.ego || !skill.ego.id) return;
    var identity = byId(combatant.identityId);
    var character = identity && characterById(identity.characterId);
    if (!character) return;
    if (!character.usedEgoPassiveIds.includes(skill.ego.id)) {
      character.usedEgoPassiveIds.push(skill.ego.id);
      character.updatedAt = new Date().toISOString();
      saveCharacterState();
    }
  }
  function renderCombatantStatus(combatant, card) {
    var ledger = card.querySelector('[data-view="owned-sins"]');
    ledger.textContent = "";
    COMBAT_SINS.forEach(function (sin) {
      var item = document.createElement("span");
      var resonanceCount = groupRoundSinCount(combatant, sin);
      item.className = "combat-sin-chip" + (resonanceCount >= 2 ? " is-resonant" : "");
      item.textContent = sin + " " + (Number(combatant.ownedSins[sin]) || 0);
      item.title = combatant.group + " resonance: " + resonanceCount + " " + sin + " skill" +
        (resonanceCount === 1 ? "" : "s") + " used this round";
      ledger.appendChild(item);
    });
    var passiveList = card.querySelector('[data-view="passives"]');
    passiveList.textContent = "";
    var passives = combatPassivesFor(combatant);
    if (!passives.length) {
      passiveList.textContent = "No passives recorded.";
      return;
    }
    passives.forEach(function (entry) {
      var passive = entry.passive;
      var active = passiveIsActive(passive, combatant);
      var item = document.createElement("div");
      item.className = "combat-passive" + (active ? " is-active" : "");
      var title = document.createElement("strong");
      title.textContent = (entry.source ? entry.source + " · " : "") + (passive.name || "Unnamed passive");
      var state = document.createElement("span");
      state.textContent = active ? "ACTIVE" : "INACTIVE";
      var requirement = document.createElement("small");
      requirement.textContent = passiveRequirementText(passive);
      item.appendChild(title);
      item.appendChild(state);
      item.appendChild(requirement);
      passiveList.appendChild(item);
    });
  }
  function renderCombatPassiveSidebar() {
    var sidebar = document.getElementById("combat-passive-sidebar");
    var empty = document.getElementById("combat-passive-sidebar-empty");
    var filterNote = document.getElementById("combat-passive-filter-note");
    var activeOnly = state.settings.combatActivePassivesOnly;
    sidebar.textContent = "";
    filterNote.hidden = !activeOnly;
    var total = 0;
    combatState.combatants.forEach(function (combatant) {
      var entries = combatPassivesFor(combatant).map(function (entry) {
        return { passive: entry.passive, source: entry.source, active: passiveIsActive(entry.passive, combatant) };
      }).filter(function (entry) {
        return !activeOnly || entry.active;
      });
      if (!entries.length) return;
      var group = document.createElement("section");
      group.className = "combat-sidebar-passive-group";
      var heading = document.createElement("h3");
      heading.textContent = combatant.name;
      group.appendChild(heading);
      entries.forEach(function (entry) {
        total += 1;
        var item = document.createElement("article");
        item.className = "combat-passive" + (entry.active ? " is-active" : "");
        var title = document.createElement("strong");
        title.textContent = (entry.source ? entry.source + " · " : "") + (entry.passive.name || "Unnamed passive");
        var status = document.createElement("span");
        status.textContent = entry.active ? "ACTIVE" : "INACTIVE";
        var requirement = document.createElement("small");
        requirement.textContent = passiveRequirementText(entry.passive);
        item.appendChild(title);
        item.appendChild(status);
        item.appendChild(requirement);
        group.appendChild(item);
      });
      sidebar.appendChild(group);
    });
    empty.hidden = total > 0;
    if (!total) empty.textContent = activeOnly ? "No active passives." : "No passives recorded for the encounter.";
  }
  function renderCombatResonanceSidebar() {
    var sidebar = document.getElementById("combat-resonance-sidebar");
    var empty = document.getElementById("combat-resonance-sidebar-empty");
    sidebar.textContent = "";
    var groups = {};
    combatState.combatants.forEach(function (combatant) {
      var name = combatant.group || "Group 1";
      if (!groups[name]) groups[name] = [];
      groups[name].push(combatant);
    });
    var visible = 0;
    Object.keys(groups).sort(function (left, right) { return left.localeCompare(right); }).forEach(function (name) {
      var resonances = COMBAT_SINS.map(function (sin) {
        return { sin: sin, count: groups[name].reduce(function (total, combatant) {
          return total + (Number(combatant.roundSins[sin]) || 0);
        }, 0) };
      }).filter(function (entry) { return entry.count >= 2; });
      if (!resonances.length) return;
      var group = document.createElement("section");
      group.className = "combat-resonance-group";
      var heading = document.createElement("h3");
      heading.textContent = name;
      var counts = document.createElement("div");
      counts.className = "combat-resonance-counts";
      resonances.forEach(function (entry) {
        var item = document.createElement("span");
        item.textContent = entry.sin + " × " + entry.count;
        counts.appendChild(item);
        visible += 1;
      });
      group.appendChild(heading);
      group.appendChild(counts);
      sidebar.appendChild(group);
    });
    empty.hidden = visible > 0;
  }
  function ensureCombatInitiative() {
    var changed = false;
    combatState.combatants.forEach(function (combatant) {
      if (combatant.initiativeRound === combatState.round && combatant.initiative !== null) return;
      combatant.initiative = rollInitiative(combatant);
      combatant.initiativeRound = combatState.round;
      changed = true;
    });
    if (changed) saveCombatState();
  }
  function renderCombatLog() {
    var log = document.getElementById("combat-log");
    var empty = document.getElementById("combat-log-empty");
    log.textContent = "";
    combatState.log.slice().reverse().forEach(function (entry) {
      var item = document.createElement("li");
      item.textContent = "R" + entry.round + " · " + entry.message;
      log.appendChild(item);
    });
    empty.hidden = combatState.log.length > 0;
  }
  function renderCombatant(combatant, animation) {
    var card = document.getElementById("combatant-template").content.firstElementChild.cloneNode(true);
    card.dataset.combatantId = combatant.id;
    card.classList.add("combat-card-enter");
    var animationClass = animation && animation[combatant.id];
    if (animationClass) card.classList.add(animationClass);
    function field(name) { return card.querySelector('[data-field="' + name + '"]'); }
    var identitySelect = field("identity");
    addCombatSelectOption(identitySelect, "", state.identities.length ? "Choose identity…" : "No identities available");
    state.identities.slice().sort(function (left, right) { return left.name.localeCompare(right.name); }).forEach(function (identity) {
      addCombatSelectOption(identitySelect, identity.id, identity.name + (characterName(identity.characterId) ? " — " + characterName(identity.characterId) : ""));
    });
    var sourceSelect = field("source");
    var linkedIdentityForName = combatant.source === "identity" ? byId(combatant.identityId) : null;
    if (combatant.source === "identity") combatant.name = linkedIdentityForName ? linkedIdentityForName.name : "Identity combatant";
    if (linkedIdentityForName) combatant.speedRange = String(blankStats(linkedIdentityForName.stats).speed || "1-6");
    field("name").readOnly = combatant.source === "identity";
    field("name").title = combatant.source === "identity" ? "Managed by the selected Identity." : "";
    field("speedRange").readOnly = combatant.source === "identity";
    var speedRange = parseSpeedRange(combatant.speedRange);
    field("speedRange").setAttribute("aria-invalid", speedRange.fallback ? "true" : "false");
    field("speedRange").title = combatant.source === "identity" ? "Managed by the selected Identity." :
      (speedRange.fallback ? "Unrecognized Speed range; initiative uses 1–6." : "");
    var linkedMaxHp = linkedIdentityForName ? identityMaxHp(linkedIdentityForName) : 0;
    field("maxHp").readOnly = linkedMaxHp > 0;
    field("maxHp").title = linkedMaxHp > 0 ? "Calculated from Base Health, HP growth, and Level." : "";
    card.querySelector(".combatant-name-label").firstChild.textContent =
      combatant.source === "identity" ? "Identity name (managed) " : "Combatant name ";
    var identityControls = card.querySelectorAll(".combat-identity-control");
    card.querySelector('[data-action="remove"]').addEventListener("click", function () {
      if (combatState.combatants.length <= 1) return;
      combatState.combatants = combatState.combatants.filter(function (entry) { return entry.id !== combatant.id; });
      saveCombatState();
      renderCombatManager();
    });
    Array.from(card.querySelectorAll("[data-field]")).forEach(function (control) {
      control.value = combatant[control.dataset.field] === undefined ? control.value : combatant[control.dataset.field];
      control.addEventListener("change", function () {
        syncCombatantFromCard(combatant, card);
        if (control.dataset.field === "identity") {
          combatant.skillKey = "";
          combatant.skillDataKey = "";
          combatant.drawnSkillKeys = [];
          combatant.name = (byId(combatant.identityId) || {}).name || "Identity combatant";
          identityCombatVitals(combatant);
        }
        if (control.dataset.field === "identity" || control.dataset.field === "skill" ||
          control.dataset.field === "ego" || control.dataset.field === "egoMode") {
          if (control.dataset.field === "identity") {
            combatant.egoId = "";
            combatant.egoMode = "Awakening";
          }
          if (control.dataset.field === "skill") {
            combatant.skillKey = control.value;
            combatant.egoId = "";
          }
          if (control.dataset.field === "ego") {
            combatant.egoId = control.value;
            var egoModes = availableEgoCombatSkills(byId(combatant.identityId), combatant.egoId)
              .map(function (skill) { return skill.egoMode; });
            combatant.egoMode = egoModes.indexOf("Awakening") !== -1 ? "Awakening" : (egoModes[0] || "Awakening");
          }
          if (control.dataset.field === "egoMode") combatant.egoMode = control.value;
          if (control.dataset.field !== "identity") applyArchivedCombatSkill(combatant, card);
          saveCombatState();
          renderCombatManager();
          return;
        }
        if (control.dataset.field === "source") {
          if (combatant.source !== "identity") {
            combatant.egoId = "";
            combatant.egoMode = "Awakening";
          }
          saveCombatState();
          renderCombatManager();
          return;
        }
        if (control.dataset.field === "group") {
          renderCombatManager();
          saveCombatState();
          return;
        }
        if (control.dataset.field === "coinCount") {
          combatant.coinTypes = normalizeCoinTypes(combatant.coinTypes, coinCountValue(combatant.coinCount));
          renderCoinTypeFields(card.querySelector('[data-view="combat-coin-types"]'), combatant.coinCount, combatant.coinTypes);
          card.querySelectorAll('[data-view="combat-coin-types"] [data-coin-type-index]').forEach(function (coinSelect) {
            coinSelect.addEventListener("change", function () {
              syncCombatantFromCard(combatant, card);
              saveCombatState();
            });
          });
          saveCombatState();
          return;
        }
        if (control.dataset.field === "currentHp" || control.dataset.field === "maxHp" ||
          control.dataset.field === "staggerThresholds") {
          syncCombatantFromCard(combatant, card);
          field("currentHp").value = combatant.currentHp;
          field("maxHp").value = combatant.maxHp;
          renderCombatantVitals(combatant, card);
          saveCombatState();
          return;
        }
        renderCombatantStatus(combatant, card);
        saveCombatState();
      });
    });
    identitySelect.value = combatant.identityId || "";
    sourceSelect.value = combatant.source;
    identityControls.forEach(function (control) {
      control.hidden = combatant.source !== "identity";
      var input = control.querySelector("select");
      if (input) input.disabled = combatant.source !== "identity";
      var button = control.querySelector("button");
      if (button) button.disabled = combatant.source !== "identity";
    });
    var skillSelect = field("skill");
    var chosenIdentity = byId(combatant.identityId);
    var options = chosenIdentity ? availableIdentityCombatSkills(chosenIdentity) : [];
    var validSkillKeys = options.map(function (skill) { return skill.key; });
    var filteredDrawnSkillKeys = combatant.drawnSkillKeys.filter(function (key) {
      return validSkillKeys.indexOf(key) !== -1;
    });
    if (filteredDrawnSkillKeys.length !== combatant.drawnSkillKeys.length) {
      combatant.drawnSkillKeys = filteredDrawnSkillKeys;
      saveCombatState();
    }
    if (combatant.skillKey && validSkillKeys.indexOf(combatant.skillKey) === -1) {
      combatant.skillKey = "";
      combatant.skillDataKey = "";
    }
    addCombatSelectOption(skillSelect, "", options.length ? "Choose a skill…" : "No available skills");
    options.forEach(function (skill) { addCombatSelectOption(skillSelect, skill.key, skill.name); });
    skillSelect.value = options.some(function (skill) { return skill.key === combatant.skillKey; }) ? combatant.skillKey : "";
    skillSelect.disabled = combatant.source !== "identity" || !options.length;
    if (!skillSelect.value && combatant.skillKey) {
      combatant.skillKey = "";
      combatant.skillDataKey = "";
    }
    var egoSelect = field("ego");
    addCombatSelectOption(egoSelect, "", "No E.G.O selected");
    var egoChoices = chosenIdentity ? equippedEgosForCharacter(chosenIdentity.characterId).filter(function (ego) {
      return availableEgoCombatSkills(chosenIdentity, ego.id).length > 0;
    }) : [];
    egoChoices.forEach(function (ego) { addCombatSelectOption(egoSelect, ego.id, ego.name); });
    egoSelect.value = egoChoices.some(function (ego) { return ego.id === combatant.egoId; }) ? combatant.egoId : "";
    if (!egoSelect.value && combatant.egoId) {
      combatant.egoId = "";
      combatant.egoMode = "Awakening";
    }
    egoSelect.disabled = combatant.source !== "identity" || !egoChoices.length;
    var egoModeSelect = field("egoMode");
    var egoModeControl = card.querySelector('[data-view="ego-mode-control"]');
    var selectedEgoSkills = egoSelect.value ? availableEgoCombatSkills(chosenIdentity, egoSelect.value) : [];
    var egoModes = [];
    selectedEgoSkills.forEach(function (skill) {
      if (egoModes.indexOf(skill.egoMode) === -1) egoModes.push(skill.egoMode);
    });
    addCombatSelectOption(egoModeSelect, "", "Choose mode…");
    egoModes.forEach(function (mode) { addCombatSelectOption(egoModeSelect, mode, mode); });
    if (egoModes.indexOf(combatant.egoMode) === -1) {
      combatant.egoMode = egoModes.indexOf("Awakening") !== -1 ? "Awakening" : (egoModes[0] || "Awakening");
    }
    egoModeSelect.value = egoModes.indexOf(combatant.egoMode) !== -1 ? combatant.egoMode : "";
    egoModeSelect.disabled = egoModes.length < 2;
    egoModeControl.hidden = egoModes.length < 2;
    var activeSkill = egoSelect.value ? selectedEgoCombatSkill(chosenIdentity, egoSelect.value, egoModeSelect.value) :
      (options.find(function (skill) { return skill.key === skillSelect.value; }) || null);
    if (activeSkill && combatant.skillDataKey !== activeSkill.key) applyArchivedCombatSkill(combatant, card);
    var defensiveEgoSelect = field("defensiveEgo");
    addCombatSelectOption(defensiveEgoSelect, "", "Use Identity resistances");
    var defensiveEgos = chosenIdentity ? equippedEgosForCharacter(chosenIdentity.characterId) : [];
    defensiveEgos.forEach(function (ego) {
      addCombatSelectOption(defensiveEgoSelect, ego.id, ego.name);
    });
    defensiveEgoSelect.value = defensiveEgos.some(function (ego) { return ego.id === combatant.defensiveEgoId; }) ?
      combatant.defensiveEgoId : "";
    defensiveEgoSelect.disabled = combatant.source !== "identity" || !defensiveEgos.length;
    field("name").value = combatant.name;
    field("speedRange").value = combatant.speedRange;
    card.querySelector('[data-view="initiative"]').textContent = "SPD " + combatant.initiative + " · " + combatant.speedRange +
      (speedRange.fallback ? " (using 1–6)" : "");
    renderCoinTypeFields(card.querySelector('[data-view="combat-coin-types"]'), combatant.coinCount, combatant.coinTypes);
    card.querySelectorAll('[data-view="combat-coin-types"] [data-coin-type-index]').forEach(function (coinSelect) {
      coinSelect.addEventListener("change", function () {
        syncCombatantFromCard(combatant, card);
        saveCombatState();
      });
    });
    var drawButton = card.querySelector('[data-action="draw-skills"]');
    var drawnSkillsContainer = card.querySelector('[data-view="drawn-skills"]');
    var drawStatus = card.querySelector('[data-view="draw-status"]');
    var drawnSkills = combatant.drawnSkillKeys.map(function (key) {
      return options.find(function (skill) { return skill.key === key; });
    }).filter(Boolean);
    drawnSkillsContainer.textContent = "";
    drawnSkillsContainer.hidden = !drawnSkills.length;
    drawnSkills.forEach(function (skill) {
      var choice = document.createElement("button");
      choice.type = "button";
      choice.className = "combat-drawn-skill" + (combatant.skillKey === skill.key ? " is-queued" : "");
      choice.textContent = skill.name + " · weight " + combatSkillPoolWeight(skill) +
        (combatant.skillKey === skill.key ? " · QUEUED" : "");
      choice.addEventListener("click", function () {
        combatant.skillKey = skill.key;
        applyArchivedCombatSkill(combatant, card);
        saveCombatState();
        renderCombatManager();
      });
      drawnSkillsContainer.appendChild(choice);
    });
    var weightedOptionCount = options.filter(function (skill) { return combatSkillPoolWeight(skill) > 0; }).length;
    if (combatant.source === "identity" && !drawnSkills.length) {
      drawStatus.textContent = !options.length ? "This identity has no skills in its pool." :
        (weightedOptionCount ? "Draw " + Math.min(2, weightedOptionCount) + " weighted skill" +
          (weightedOptionCount === 1 ? "" : "s") + ", then queue one." : "No skills have a positive pool weight.");
    } else if (drawnSkills.length < 2) {
      drawStatus.textContent = drawnSkills.length ?
        "The remaining skill stays available; a new weighted skill is drawn next round." :
        "No drawn skills are available.";
    } else {
      drawStatus.textContent = "Choose one drawn skill to queue.";
    }
    drawButton.disabled = drawnSkills.length > 0 || combatantHasUsedSkillThisRound(combatant) ||
      !weightedOptionCount;
    drawButton.addEventListener("click", function () {
      var identity = byId(combatant.identityId);
      if (!identity || combatant.drawnSkillKeys.length || combatantHasUsedSkillThisRound(combatant)) return;
      var drawn = drawCombatSkills(identity, [], 2);
      combatant.drawnSkillKeys = drawn.map(function (skill) { return skill.key; });
      appendCombatLog(combatant.name + " drew " + drawn.length + " skill" + (drawn.length === 1 ? "" : "s") + ".");
      saveCombatState();
      renderCombatManager();
    });
    card.querySelector('[data-action="use-skill"]').addEventListener("click", function () {
      syncCombatantFromCard(combatant, card);
      if (combatantIsStaggerLocked(combatant)) {
        alert(combatant.name + " is Staggered and cannot use a skill this round.");
        return;
      }
      var skill = selectedCombatSkill(combatant, card);
      if (!skill || !skill.valid) { alert("Choose an identity skill or enter base power and coin count before using a skill."); return; }
      if (!combatantCanUseSkill(combatant, skill)) {
        alert(combatantHasUsedSkillThisRound(combatant) ?
          combatant.name + " has already used a skill this round." :
          "Draw skills from the pool and queue one before using an Identity skill.");
        return;
      }
      var costFailure = egoCostFailure(combatant, skill);
      if (costFailure) { alert(costFailure); return; }
      var threshold = combatCoinThreshold(combatant.sanity);
      if (threshold === null) { alert("Coin rolls are defined for SP 0, +25 to +45, or -45 to -25."); return; }
      var roll = resolveCombatSkill(skill, threshold);
      payEgoCost(combatant, skill);
      markEgoPassiveUsed(combatant, skill);
      recordSinUse(combatant, skill);
      var skillAnimation = {};
      skillAnimation[combatant.id] = "is-using-skill";
      skillAnimation.coinResults = {};
      skillAnimation.coinResults[combatant.id] = roll.coins;
      var message = combatant.name + " used " + skill.name + ": " + formatCoinRolls(roll) +
        " Clash Power " + roll.clashPower;
      if (skill.ego) message += " · paid " + skill.ego.mode + " cost";
      if (skill.type === "Guard") {
        var shieldGained = Math.max(0, roll.clashPower);
        combatant.shield += shieldGained;
        message += " · Guard grants " + shieldGained + " shield.";
      } else if (skill.type === "Evade") {
        combatant.evadeRound = combatState.round;
        combatant.evadePower = roll.clashPower;
        message += " · Evade prepared at power " + roll.clashPower + " for the rest of this round.";
      } else if (skill.type === "Counter") {
        combatant.counterReady = skill;
        combatant.counterReadyRound = combatState.round;
        message += " · Counter prepared for an incoming attack this round.";
      } else {
        var attack = resolveCombatAttack(skill, threshold, normalizeCoinTypes(skill.coinTypes, skill.coinCount).map(function (coin, index) {
          return { index: index, special: coin.special, cracked: false };
        }));
        var target = combatState.combatants.find(function (other) { return other.id === targetSelect.value; });
        if (target) {
          var damageResult = applyCombatDamage(target, skill, attack.damage, attack.clashPower);
          message += " · One-sided attack for " + attack.damage + " damage (" +
            combatDamageExplanation(damageResult) + ")" +
            (damageResult.dodged ? "; " + target.name + " evaded." :
              ("; " + target.name + " HP " + target.currentHp + "/" + target.maxHp +
                (damageResult.absorbed ? ", shield absorbed " + damageResult.absorbed : "") +
                (damageResult.staggered ? ", Staggered through round " + target.staggeredThroughRound : "") + "."));
          skillAnimation[target.id] = damageResult.dodged ? "" : "is-taking-damage";
          var counterResult = damageResult.dodged ? null : resolvePreparedCounter(target, combatant);
          if (counterResult) message += " " + counterResult.message;
        } else {
          message += " · one-sided attack rolled " + attack.damage + " damage, but no target is selected.";
        }
        attack.coins.forEach(function (coin) {
          if (!coin.round) coin.round = 1;
        });
        skillAnimation.coinResults[combatant.id] = roll.coins.concat(attack.coins);
      }
      consumeCombatantSkill(combatant, skill);
      appendCombatLog(message + (skill.sin && skill.sin !== "Sinless" ? " · " + skill.sin + " +1 resource" : ""));
      saveCombatState();
      renderCombatManager(skillAnimation);
    });
    var targetSelect = field("target");
    combatState.combatants.filter(function (other) { return other.id !== combatant.id; }).forEach(function (other) {
      addCombatSelectOption(targetSelect, other.id, other.name || "Combatant");
    });
    var defaultTarget = combatState.combatants.find(function (other) { return other.id !== combatant.id; });
    targetSelect.value = combatState.combatants.some(function (other) { return other.id === combatant.targetId; }) ?
      combatant.targetId : (defaultTarget ? defaultTarget.id : "");
    targetSelect.disabled = !defaultTarget;
    card.querySelector('[data-action="clash"]').disabled = !defaultTarget;
    card.querySelector('[data-action="clash"]').addEventListener("click", function () {
      syncCombatantFromCard(combatant, card);
      var opponent = combatState.combatants.find(function (other) { return other.id === targetSelect.value; });
      var opponentCard = opponent && combatantCard(opponent.id);
      if (!opponent || !opponentCard) return;
      syncCombatantFromCard(opponent, opponentCard);
      var firstSkill = selectedCombatSkill(combatant, card);
      var secondSkill = selectedCombatSkill(opponent, opponentCard);
      if (!firstSkill || !secondSkill || !firstSkill.valid || !secondSkill.valid) {
        alert("Choose skills and enter base power and coin count for both combatants before resolving a clash.");
        return;
      }
      if (!combatantCanUseSkill(combatant, firstSkill) || !combatantCanUseSkill(opponent, secondSkill)) {
        alert(combatantHasUsedSkillThisRound(combatant) || combatantHasUsedSkillThisRound(opponent) ?
          "Each combatant can use only one skill per round." :
          "Draw skills from each Identity's pool and queue one before resolving a Clash.");
        return;
      }
      if ((["Guard", "Counter"].includes(firstSkill.type) && !firstSkill.clashable) ||
        (["Guard", "Counter"].includes(secondSkill.type) && !secondSkill.clashable)) {
        alert("Guard and Counter skills can Clash only when marked Clashable in the Identity Archive.");
        return;
      }
      if (combatantIsStaggerLocked(combatant) || combatantIsStaggerLocked(opponent)) {
        alert("A Staggered combatant cannot take part in a Clash. Use a one-sided attack against a Staggered target instead.");
        return;
      }
      var firstCostFailure = egoCostFailure(combatant, firstSkill);
      var secondCostFailure = egoCostFailure(opponent, secondSkill);
      if (firstCostFailure || secondCostFailure) {
        alert([firstCostFailure && combatant.name + ": " + firstCostFailure,
          secondCostFailure && opponent.name + ": " + secondCostFailure].filter(Boolean).join("\n"));
        return;
      }
      var firstThreshold = combatCoinThreshold(combatant.sanity);
      var secondThreshold = combatCoinThreshold(opponent.sanity);
      if (firstThreshold === null || secondThreshold === null) { alert("Coin rolls are defined for SP 0, +25 to +45, or -45 to -25."); return; }
      var clash = resolveCombatClash(firstSkill, firstThreshold, secondSkill, secondThreshold);
      payEgoCost(combatant, firstSkill);
      payEgoCost(opponent, secondSkill);
      markEgoPassiveUsed(combatant, firstSkill);
      markEgoPassiveUsed(opponent, secondSkill);
      recordSinUse(combatant, firstSkill);
      recordSinUse(opponent, secondSkill);
      var names = [combatant.name, opponent.name];
      var message = clash.rounds.map(function (round) {
        var rolls = round.coins.map(function (coin, sideIndex) {
          var state = coin.outcome === "cracked" ? " cracks" :
            (coin.outcome === "excised" ? " is excised" :
              (coin.outcome === "broken" ? " breaks" : ""));
          return names[sideIndex] + " " + coinTypeLabel({ type: coin.type || coin.special }) +
            " " + coin.side + " (" + coin.clashPower + ")" + state;
        });
        var result = "Clash " + round.number + ": " + rolls.join(" vs ");
        if (round.winner !== null) result += " · " + names[round.winner] + " wins";
        else result += " · tie";
        round.coins.forEach(function (coin, sideIndex) {
          if (coin.shield) result += " · " + names[sideIndex] + " gains " + coin.shield + " shield";
        });
        return result;
      }).join(". ");
      var clashAnimation = {};
      clashAnimation.coinResults = {};
      clashAnimation.coinResults[combatant.id] = clash.sides[0].results.slice();
      clashAnimation.coinResults[opponent.id] = clash.sides[1].results.slice();
      combatant.shield += clash.shieldGained[0];
      opponent.shield += clash.shieldGained[1];
      if (clash.attack) {
        var winner = clash.winner === 0 ? combatant : opponent;
        var loser = clash.winner === 0 ? opponent : combatant;
        var winningSkill = clash.winner === 0 ? firstSkill : secondSkill;
        var damageResult = applyCombatDamage(loser, winningSkill, clash.attack.damage, clash.attack.clashPower);
        clashAnimation.coinResults[winner.id] = clashAnimation.coinResults[winner.id].concat(clash.attack.coins);
        var attackDetails = clash.attack.coins.map(function (coin) {
          return coinTypeLabel({ type: coin.type || coin.special }) + " " +
            coin.side + " (" + (coin.damageRolls || []).map(function (roll, index) {
              return roll + (coin.criticalRolls[index] ? "×2" : "");
            }).join(" + ") + ") = " + coin.damage +
            (coin.critical ? " critical" : "") + (coin.outcome === "cracked attack" ? " half damage" : "");
        });
        message += (message ? ". " : "") + winner.name + " attacks with " + attackDetails.join("; ") +
          " for " + clash.attack.damage + " damage" +
          (clash.attack.flatDamage ? " (including " + clash.attack.flatDamage + " flat)" : "") +
          (damageResult.dodged ? "; " + loser.name + " evaded." :
            (" (" + combatDamageExplanation(damageResult) +
              (damageResult.absorbed ? "; " + damageResult.absorbed + " absorbed by shield" : "") + ")" +
              "; " + loser.name + " HP " +
              loser.currentHp + "/" + loser.maxHp +
              (damageResult.staggered ? ", Staggered through round " + loser.staggeredThroughRound : "") + "."));
        if (!damageResult.dodged) {
          var counterResult = resolvePreparedCounter(loser, winner);
          if (counterResult) message += " " + counterResult.message;
        }
        clash.shieldGained.forEach(function (amount, sideIndex) {
          if (amount) message += " " + names[sideIndex] + " gains " + amount + " shield.";
        });
        clashAnimation[winner.id] = "is-winning-clash";
        clashAnimation[loser.id] = "is-taking-damage";
      } else {
        if (!message) message = "Neither skill has Coins available to clash; no damage rolled.";
        else message += ". Tie; no attack.";
      }
      consumeCombatantSkill(combatant, firstSkill);
      consumeCombatantSkill(opponent, secondSkill);
      appendCombatLog(message);
      saveCombatState();
      renderCombatManager(clashAnimation);
    });
    renderCombatantStatus(combatant, card);
    renderCombatantVitals(combatant, card);
    card.querySelector('[data-view="shield"]').textContent = "Shield " + combatant.shield;
    var coinResults = animation && animation.coinResults && animation.coinResults[combatant.id];
    if (coinResults) renderCoinRollAnimation(card, coinResults);
    return card;
  }
  function combatCoinThreshold(sanity) {
    return sanity === 0 ? 3 : (sanity >= 25 ? 2 : (sanity <= -25 ? 4 : null));
  }
  function rollCombatDie(sides) { return Math.floor(Math.random() * sides) + 1; }
  function rollCombatCoin(skill, index, threshold) {
    var result = rollCombatDie(4);
    var side = result >= threshold ? "Heads" : "Tails";
    var coin = normalizeCoinTypes(skill.coinTypes, skill.coinCount)[index];
    var powerChange = side === "Heads" ? Math.abs(skill.coinPower) : 0;
    return {
      type: coin.type,
      special: coin.type === "Normal" ? "None" : coin.type,
      index: index,
      roll: result,
      side: side,
      powerChange: powerChange
    };
  }
  function resolveCombatSkill(skill, threshold) {
    var clashPower = skill.basePower;
    var coins = [];
    for (var index = 0; index < skill.coinCount; index += 1) {
      var coin = rollCombatCoin(skill, index, threshold);
      clashPower += coin.powerChange;
      coin.powerAfter = clashPower;
      coins.push(coin);
    }
    return { coins: coins, clashPower: clashPower };
  }
  function formatCoinRolls(roll) {
    if (!roll.coins.length) return "No Coins";
    return roll.coins.map(function (coin) {
      var change = coin.powerChange > 0 ? "+" + coin.powerChange :
        (coin.powerChange < 0 ? String(coin.powerChange) : "no change");
      return coinTypeLabel({ type: coin.type || coin.special }) +
        " " + coin.side + " (d4 " + coin.roll + ", " + change + ")";
    }).join("; ");
  }
  function resolveCombatAttack(skill, threshold, coinStates) {
    var attack = { coins: [], damage: 0, rolls: [], crits: 0, flatDamage: 0, clashPower: skill.basePower };
    (coinStates || []).forEach(function (coinState) {
        var coin = rollCombatCoin(skill, coinState.index, threshold);
        coin.special = coinState.special || coin.special;
        coin.outcome = coinState.cracked ? "cracked attack" : "attack";
        coin.critical = coin.special === "Concentration" && coinState.cracked;
        var coinDamage = 0;
        coin.damageRolls = [];
        coin.criticalRolls = [];
        for (var dieIndex = 0; dieIndex < skill.rank; dieIndex += 1) {
          var dieRoll = rollCombatDie(skill.die);
          var critical = dieRoll === skill.die;
          var dieDamage = dieRoll * (critical ? 2 : 1);
          if (critical) {
            coin.critical = true;
            attack.crits += 1;
          }
          coin.criticalRolls.push(critical);
          if (state.settings.flatDamageMode === "per-die") dieDamage += skill.flatDamage;
          coin.damageRolls.push(dieRoll);
          coinDamage += dieDamage;
        }
        attack.clashPower += coin.powerChange;
        if (coinState.cracked) coinDamage = Math.floor(coinDamage / 2);
        if (coin.special === "Concentration" && coinState.cracked) {
          coinDamage *= 2;
          attack.crits += 1;
        }
        coin.damage = coinDamage;
        attack.damage += coinDamage;
        attack.coins.push(coin);
    });
    if (state.settings.flatDamageMode === "per-skill" && attack.coins.length) {
        attack.flatDamage = skill.flatDamage;
        attack.damage += attack.flatDamage;
    }
    return attack;
  }
  function resolveCombatClash(firstSkill, firstThreshold, secondSkill, secondThreshold) {
    function makeCoins(skill) {
      return normalizeCoinTypes(skill.coinTypes, skill.coinCount).map(function (coin, index) {
        return { type: coin.type, special: coin.type === "Normal" ? "None" : coin.type, index: index, broken: false, cracked: false };
      });
    }
    var sides = [
      { skill: firstSkill, threshold: firstThreshold, coins: makeCoins(firstSkill), results: [] },
      { skill: secondSkill, threshold: secondThreshold, coins: makeCoins(secondSkill), results: [] }
    ];
    var rounds = [];
    var shieldGained = [0, 0];
    var winner = null;
    for (var round = 1; round <= 40; round += 1) {
      var active = sides.map(function (side) {
        for (var index = side.coins.length - 1; index >= 0; index -= 1) {
          if (!side.coins[index].broken && !side.coins[index].cracked) return side.coins[index];
        }
        return null;
      });
      if (!active[0] || !active[1]) {
        winner = active[0] ? 0 : (active[1] ? 1 : winner);
        break;
      }
      var roundResults = sides.map(function (side, sideIndex) {
        var coin = rollCombatCoin(side.skill, active[sideIndex].index, side.threshold);
        coin.special = active[sideIndex].special;
        coin.round = round;
        coin.clashPower = side.skill.basePower + coin.powerChange;
        return coin;
      });
      var firstPower = roundResults[0].clashPower;
      var secondPower = roundResults[1].clashPower;
      var loserIndex = firstPower === secondPower ? -1 : (firstPower < secondPower ? 0 : 1);
      roundResults.forEach(function (coin, sideIndex) {
        coin.outcome = loserIndex === -1 ? "tie" : (sideIndex === loserIndex ? "lost" : "won");
      });
      var roundResult = { number: round, coins: roundResults, winner: loserIndex === -1 ? null : 1 - loserIndex };
      if (loserIndex === -1) {
        rounds.push(roundResult);
        sides.forEach(function (side, sideIndex) { side.results.push(roundResults[sideIndex]); });
        winner = null;
        break;
      }
      var winningCoin = active[1 - loserIndex];
      var losingCoin = active[loserIndex];
      var losingSide = sides[loserIndex];
      if ((losingCoin.special === "Unbreakable" || losingCoin.special === "Concentration") &&
        winningCoin.special !== "Excision") {
        losingCoin.cracked = true;
        roundResults[loserIndex].outcome = "cracked";
        if (losingCoin.special === "Concentration") {
          var shieldRoll = rollCombatCoin(losingSide.skill, losingCoin.index, losingSide.threshold);
          shieldRoll.special = losingCoin.special;
          var shield = Math.max(1, losingSide.skill.basePower + shieldRoll.powerChange);
          shieldGained[loserIndex] += shield;
          roundResults[loserIndex].shieldRoll = shieldRoll;
          roundResults[loserIndex].shield = shield;
        }
      } else {
        losingCoin.broken = true;
        roundResults[loserIndex].outcome =
          winningCoin.special === "Excision" && (losingCoin.special === "Unbreakable" || losingCoin.special === "Concentration") ?
            "excised" : "broken";
      }
      roundResult.winner = 1 - loserIndex;
      rounds.push(roundResult);
      sides.forEach(function (side, sideIndex) { side.results.push(roundResults[sideIndex]); });
      winner = 1 - loserIndex;
    }
    var attack = null;
    if (winner !== null) {
      var attackSide = sides[winner];
      var remaining = attackSide.coins.filter(function (coin) { return !coin.broken; });
      attack = resolveCombatAttack(attackSide.skill, attackSide.threshold, remaining);
      attack.side = winner;
    }
    return {
      rounds: rounds,
      sides: sides,
      winner: winner,
      attack: attack,
      shieldGained: shieldGained
    };
  }
  function renderCoinRollAnimation(card, coins) {
    var animation = document.createElement("div");
    animation.className = "coin-roll-animation";
    animation.setAttribute("aria-label", "Coin and clash results");
    var title = document.createElement("strong");
    title.textContent = coins.some(function (coin) { return coin.round; }) ? "Clash and attack Coins" : "Coin toss";
    animation.appendChild(title);
    var list = document.createElement("div");
    list.className = "coin-roll-list";
    coins.forEach(function (coin, index) {
      var token = document.createElement("div");
      var typeValue = coin.type || "Normal";
      token.className = "coin-roll-token is-" + coin.side.toLocaleLowerCase() +
        " is-" + typeValue.toLocaleLowerCase() +
        (coin.special && coin.special !== "None" ? " is-special-" + coin.special.toLocaleLowerCase() : "") +
        (coin.outcome ? " is-" + coin.outcome.replace(/\s+/g, "-") : "") +
        (coin.critical ? " is-critical" : "");
      token.style.animationDelay = index * 90 + "ms";
      token.setAttribute("aria-label", coinTypeLabel({ type: typeValue }) +
        ": " + coin.side + ", d4 " + coin.roll + (coin.outcome ? ", " + coin.outcome : ""));
      var type = document.createElement("strong");
      type.textContent = coinTypeLabel({ type: typeValue }) +
        (coin.round ? " · Clash " + coin.round : "");
      var side = document.createElement("span");
      side.textContent = coin.side;
      var result = document.createElement("small");
      result.textContent = "d4 " + coin.roll + (coin.powerChange ?
        " · " + (coin.powerChange > 0 ? "+" : "") + coin.powerChange : " · no power change") +
        (coin.outcome ? " · " + coin.outcome : "") +
        (coin.shield ? " · shield +" + coin.shield : "") +
        (coin.critical ? " · CRITICAL" : "") +
        (coin.damage !== undefined ? " · damage " + coin.damage : "");
      token.appendChild(type);
      token.appendChild(side);
      token.appendChild(result);
      list.appendChild(token);
    });
    animation.appendChild(list);
    card.insertBefore(animation, card.querySelector(".combatant-actions"));
  }
  function renderCombatManager(animations) {
    var identityVitalsChanged = combatState.combatants.reduce(function (changed, combatant) {
      return synchronizeIdentityVitals(combatant, false) || changed;
    }, false);
    if (identityVitalsChanged) saveCombatState();
    ensureCombatInitiative();
    document.getElementById("combat-round-number").textContent = combatState.round;
    var grid = document.getElementById("combatant-grid");
    grid.textContent = "";
    combatState.combatants.slice().sort(function (left, right) {
      return right.initiative - left.initiative || left.name.localeCompare(right.name);
    }).forEach(function (combatant) {
      grid.appendChild(renderCombatant(combatant, animations));
    });
    renderCombatLog();
    renderCombatResonanceSidebar();
    renderCombatPassiveSidebar();
  }
  document.getElementById("combat-add-combatant").addEventListener("click", function () {
    combatState.combatants.push(freshCombatant("Combatant " + (combatState.combatants.length + 1)));
    saveCombatState();
    renderCombatManager();
  });
  document.getElementById("combat-end-round").addEventListener("click", function () {
    combatState.round += 1;
    combatState.combatants.forEach(function (combatant) {
      COMBAT_SINS.forEach(function (sin) { combatant.roundSins[sin] = 0; });
      var identity = combatant.source === "identity" ? byId(combatant.identityId) : null;
      if (identity && combatant.drawnSkillKeys.length < 2) {
        var newSkills = drawCombatSkills(identity, combatant.drawnSkillKeys, 2 - combatant.drawnSkillKeys.length);
        combatant.drawnSkillKeys = combatant.drawnSkillKeys.concat(newSkills.map(function (skill) { return skill.key; }));
        if (newSkills.length) {
          appendCombatLog(combatant.name + " drew " + newSkills.length + " new skill" +
            (newSkills.length === 1 ? "" : "s") + " and kept any unused skill.");
        }
      }
    });
    appendCombatLog("Round " + (combatState.round - 1) + " ended.");
    saveCombatState();
    renderCombatManager();
    var roundBar = document.querySelector(".combat-round-bar");
    roundBar.classList.remove("is-round-advancing");
    void roundBar.offsetWidth;
    roundBar.classList.add("is-round-advancing");
  });
  document.getElementById("combat-reset-encounter").addEventListener("click", function () {
    if (!confirm("Reset this encounter and clear all combatants, Sin resources, and action history?")) return;
    combatState = freshCombatState();
    saveCombatState();
    renderCombatManager();
  });  var rulesSearchInput = document.getElementById("rules-search-input");
  var rulesReference = document.getElementById("rules-reference");
  var rulesSearchResults = document.getElementById("rules-search-results");
  var rulesNoResults = document.getElementById("rules-no-results");
  function filterRulesReference() {
    var query = rulesSearchInput.value.trim().toLocaleLowerCase();
    var matchingTopics = 0;
    var matchingSections = 0;

    rulesReference.querySelectorAll(".rule-section").forEach(function (section) {
      var sectionHasMatch = false;
      section.querySelectorAll(".rule-entry").forEach(function (entry) {
        var matches = !query || entry.textContent.toLocaleLowerCase().includes(query);
        entry.hidden = !matches;
        if (matches) {
          matchingTopics += 1;
          sectionHasMatch = true;
        }
      });
      section.hidden = !sectionHasMatch;
      document.querySelector('[data-rule-nav="' + section.id + '"]').hidden = !sectionHasMatch;
      if (sectionHasMatch) matchingSections += 1;
    });

    rulesNoResults.hidden = matchingTopics > 0;
    if (query) {
      rulesSearchResults.textContent = matchingTopics + " matching " +
        (matchingTopics === 1 ? "topic" : "topics") + " in " + matchingSections + " " +
        (matchingSections === 1 ? "section" : "sections");
    } else {
      rulesSearchResults.textContent = "Showing all " + matchingTopics + " topics in " + matchingSections + " sections";
    }
  }
  rulesSearchInput.addEventListener("input", filterRulesReference);
  filterRulesReference();
  var settingsReturnPage = "main-menu";
  var archiveActionButtons = ["add-button"].map(function (id) {
    return document.getElementById(id);
  });
  var egoActionButtons = ["ego-add-button"].map(function (id) {
    return document.getElementById(id);
  });
  var announcerActionButtons = ["announcer-add-button"].map(function (id) {
    return document.getElementById(id);
  });
  var statusEffectActionButtons = ["status-effect-add-button"].map(function (id) {
    return document.getElementById(id);
  });
  var characterActionButtons = ["character-add-button"].map(function (id) {
    return document.getElementById(id);
  });
  function showPage(pageName) {
    if (!pages[pageName]) return;
    if (pageName === "combat-tracker" && !combatAccessUnlocked()) {
      settingsReturnPage = "main-menu";
      pageName = "settings";
      document.getElementById("combat-access-status").textContent = "Enter the beta code in Settings to enable the Combat Manager.";
    }
    if (pageName === "settings") {
      if (activePage !== "settings") settingsReturnPage = activePage;
      maxLevelInput.value = state.settings.maxLevel;
      themeSelect.value = state.settings.theme;
      document.getElementById("flat-damage-mode").value = state.settings.flatDamageMode;
      document.getElementById("combat-active-passives-only").checked = state.settings.combatActivePassivesOnly;
    }
    if (pageName === "character-manager") renderCharacterArchive();
    if (pageName === "combat-tracker") renderCombatManager();
    Object.keys(pages).forEach(function (key) {
      pages[key].hidden = key !== pageName;
    });
    activePage = pageName;
    document.getElementById("settings-button").hidden = pageName === "settings";
    archiveActionButtons.forEach(function (button) {
      button.hidden = pageName !== "archive";
    });
    egoActionButtons.forEach(function (button) {
      button.hidden = pageName !== "ego-archive";
    });
    announcerActionButtons.forEach(function (button) {
      button.hidden = pageName !== "announcer-archive";
    });
    statusEffectActionButtons.forEach(function (button) {
      button.hidden = pageName !== "status-archive";
    });
    characterActionButtons.forEach(function (button) {
      button.hidden = pageName !== "character-manager";
    });
  }
  document.getElementById("main-menu-button").addEventListener("click", function () { showPage("main-menu"); });
  document.getElementById("archive-menu-button").addEventListener("click", function () { showPage("main-menu"); });
  document.querySelectorAll("[data-page]").forEach(function (button) {
    button.addEventListener("click", function () { showPage(button.dataset.page); });
  });
  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[data-status-effect-id]");
    if (!link) return;
    event.preventDefault();
    hideStatusEffectTooltip();
    var effect = statusEffectById(link.dataset.statusEffectId);
    if (!effect) return;
    document.getElementById("status-effect-search-input").value = "";
    statusEffectSelectedId = effect.id;
    renderStatusEffectArchive();
    showPage("status-archive");
    window.scrollTo(0, 0);
  });
  document.addEventListener("pointerover", function (event) {
    var target = event.target && event.target.closest ? event.target : event.target && event.target.parentElement;
    var link = target && target.closest ? target.closest("a.status-effect-link") : null;
    if (link) scheduleStatusEffectTooltip(link);
  });
  document.addEventListener("pointerout", function (event) {
    var target = event.target && event.target.closest ? event.target : event.target && event.target.parentElement;
    var link = target && target.closest ? target.closest("a.status-effect-link") : null;
    if (link && (!event.relatedTarget || !link.contains(event.relatedTarget)) && document.activeElement !== link) hideStatusEffectTooltip();
  });
  document.addEventListener("focusin", function (event) {
    var target = event.target && event.target.closest ? event.target : event.target && event.target.parentElement;
    var link = target && target.closest ? target.closest("a.status-effect-link") : null;
    if (link) scheduleStatusEffectTooltip(link);
  });
  document.addEventListener("focusout", function (event) {
    var target = event.target && event.target.closest ? event.target : event.target && event.target.parentElement;
    var link = target && target.closest ? target.closest("a.status-effect-link") : null;
    if (link && (!event.relatedTarget || !link.contains(event.relatedTarget))) hideStatusEffectTooltip();
  });
  window.addEventListener("scroll", hideStatusEffectTooltip, true);
  window.addEventListener("resize", hideStatusEffectTooltip);
  var maxLevelInput = document.getElementById("max-level-input");
  var themeSelect = document.getElementById("theme-select");
  function combatAccessUnlocked() {
    return sessionStorage.getItem(COMBAT_ACCESS_SESSION_KEY) === "true";
  }
  function updateCombatAccessUi() {
    var unlocked = combatAccessUnlocked();
    document.getElementById("combat-launch-card").hidden = !unlocked;
    document.getElementById("combat-access-status").textContent = unlocked ?
      "Combat Manager is enabled for this browser tab." : "Combat Manager is locked.";
    return unlocked;
  }
  async function hashCombatAccessCode(code) {
    if (!window.crypto || !window.crypto.subtle || !window.TextEncoder) {
      throw new Error("Secure code verification is unavailable in this browser context.");
    }
    var digest = await window.crypto.subtle.digest("SHA-256", new window.TextEncoder().encode(code));
    return Array.from(new Uint8Array(digest)).map(function (value) {
      return value.toString(16).padStart(2, "0");
    }).join("");
  }
  updateCombatAccessUi();
  maxLevelInput.value = state.settings.maxLevel;
  themeSelect.value = state.settings.theme;
  document.getElementById("settings-button").addEventListener("click", function () {
    showPage("settings");
  });
  document.getElementById("back-to-previous-page").addEventListener("click", function () {
    showPage(settingsReturnPage);
  });
  document.getElementById("unlock-combat-manager").addEventListener("click", async function () {
    var button = this;
    var codeField = document.getElementById("combat-access-code");
    button.disabled = true;
    try {
      var digest = await hashCombatAccessCode(codeField.value);
      if (digest !== COMBAT_ACCESS_CODE_SHA256) {
        document.getElementById("combat-access-status").textContent = "That code is not valid.";
        codeField.select();
        return;
      }
      sessionStorage.setItem(COMBAT_ACCESS_SESSION_KEY, "true");
      codeField.value = "";
      updateCombatAccessUi();
    } catch (error) {
      console.warn("Could not verify the Combat Manager access code.", error);
      document.getElementById("combat-access-status").textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
  document.getElementById("settings-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var maxLevel = Number(maxLevelInput.value);
    if (!Number.isInteger(maxLevel) || maxLevel < 1) {
      alert("Maximum level must be a whole number greater than zero.");
      return;
    }
    var highestSavedLevel = state.identities.reduce(function (highest, identity) {
      return Math.max(highest, Number(identity.level) || 0);
    }, 0);
    if (maxLevel < highestSavedLevel) {
      alert("Maximum level cannot be lower than the level of a saved identity (" + highestSavedLevel + ").");
      return;
    }
    state.settings.maxLevel = maxLevel;
    state.settings.theme = normalizeTheme(themeSelect.value);
    state.settings.flatDamageMode = document.getElementById("flat-damage-mode").value === "per-die" ? "per-die" : "per-skill";
    state.settings.combatActivePassivesOnly = document.getElementById("combat-active-passives-only").checked;
    applyTheme(state.settings.theme);
    updateCombatAccessUi();
    if (!saveState()) return;
    form.elements.namedItem("level").max = maxLevel;
    alert("Settings saved.");
  });

  var SINGLE_RECORD_TYPES = {
    identity: { label: "identity", filePrefix: "limbus-identity" },
    ego: { label: "E.G.O", filePrefix: "limbus-ego" },
    announcer: { label: "announcer", filePrefix: "limbus-announcer" },
    statusEffect: { label: "status effect", filePrefix: "limbus-status-effect" }
  };

  function downloadJsonFile(fileName, payload) {
    var blobUrl = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    var link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(blobUrl); }, 1000);
  }

  function exportSingleArchiveRecord(type, record) {
    var config = SINGLE_RECORD_TYPES[type];
    if (!config || !record) return;
    var linkedCharacter = record.characterId ? characterById(record.characterId) : null;
    var payload = {
      schemaVersion: 1,
      recordType: type,
      exportedAt: new Date().toISOString(),
      record: record,
      characters: linkedCharacter ? [linkedCharacter] : []
    };
    var safeName = String(record.name || config.label).toLocaleLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64) || config.filePrefix;
    downloadJsonFile(config.filePrefix + "-" + safeName + ".json", payload);
  }

  document.getElementById("backup-export-button").addEventListener("click", function () {
    downloadJsonFile("limbus-company-backup-" + new Date().toISOString().slice(0, 10) + ".json", {
      format: "limbus-company-archive-backup",
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      identities: state.identities,
      egos: egoState.egos,
      announcers: announcerState.announcers,
      statusEffects: statusEffectState.statusEffects,
      statusEffectDefaultSeedVersion: statusEffectState.defaultSeedVersion || 0,
      characters: characterState.characters,
      combatEncounter: combatState
    });
  });

  document.getElementById("backup-import-button").addEventListener("click", function () {
    document.getElementById("backup-import-file").click();
  });

  document.getElementById("backup-import-file").addEventListener("change", function (event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var imported = JSON.parse(String(reader.result || ""));
        if (!imported || typeof imported !== "object" || imported.format !== "limbus-company-archive-backup" ||
          imported.schemaVersion !== 1) {
          throw new Error("Choose a complete backup exported from Settings.");
        }
        ["identities", "egos", "announcers", "statusEffects", "characters"].forEach(function (key) {
          if (!Array.isArray(imported[key])) throw new Error("The backup is missing its " + key + " list.");
          if (imported[key].some(function (record) { return !record || typeof record !== "object" || Array.isArray(record); })) {
            throw new Error("The backup contains an invalid record in " + key + ".");
          }
        });
        if (!imported.settings || typeof imported.settings !== "object" || Array.isArray(imported.settings)) {
          throw new Error("The backup is missing application settings.");
        }
        if (!imported.identities.every(function (record) { return String(record.name || "").trim(); }) ||
          !imported.egos.every(function (record) { return String(record.name || "").trim(); }) ||
          !imported.announcers.every(function (record) { return String(record.name || "").trim(); }) ||
          !imported.statusEffects.every(function (record) {
            return String(record.name || "").trim() && String(record.identifier || "").trim();
          }) ||
          !imported.characters.every(function (record) { return String(record.name || "").trim(); })) {
          throw new Error("The backup contains a record with missing required fields.");
        }
        if (!confirm("Import this backup? It will replace all current archives, the combat encounter, and application settings.")) return;

        var importedIdentities = imported.identities.filter(function (identity) { return identity.source !== "wiki"; })
          .map(function (identity) {
            var record = migrateIdentity(identity);
            record.id = String(record.id || newId());
            delete record.character;
            delete record.sinner;
            return record;
          });
        var highestIdentityLevel = importedIdentities.reduce(function (highest, identity) {
          return Math.max(highest, Number(identity.level) || 0);
        }, 0);
        var importedMaxLevel = Number(imported.settings.maxLevel);
        var importedSettings = normalizeSettings(imported.settings);
        importedSettings.maxLevel = Math.max(importedSettings.maxLevel,
          Number.isInteger(importedMaxLevel) && importedMaxLevel > 0 ? importedMaxLevel : 40,
          highestIdentityLevel);
        var importedState = {
          schemaVersion: STATE_VERSION,
          settings: importedSettings,
          identities: importedIdentities
        };
        var importedEgoState = {
          schemaVersion: EGO_SCHEMA_VERSION,
          egos: imported.egos.map(function (ego) { return migrateEgo(ego); })
        };
        var importedAnnouncerState = {
          schemaVersion: ANNOUNCER_SCHEMA_VERSION,
          announcers: imported.announcers.map(function (announcer) { return migrateAnnouncer(announcer); })
        };
        var importedStatusEffectState = {
          schemaVersion: STATUS_EFFECT_SCHEMA_VERSION,
          defaultSeedVersion: Number(imported.statusEffectDefaultSeedVersion) || 0,
          statusEffects: imported.statusEffects.map(function (effect) { return migrateStatusEffect(effect); })
        };
        var importedCharacterState = {
          schemaVersion: CHARACTER_SCHEMA_VERSION,
          characters: imported.characters.map(function (character) { return migrateCharacter(character); })
        };
        var importedCombatState = normalizeCombatState(imported.combatEncounter);
        var storage = [
          [STORAGE_KEY, importedState],
          [EGO_STORAGE_KEY, importedEgoState],
          [ANNOUNCER_STORAGE_KEY, importedAnnouncerState],
          [STATUS_EFFECT_STORAGE_KEY, importedStatusEffectState],
          [CHARACTER_STORAGE_KEY, importedCharacterState],
          [COMBAT_STORAGE_KEY, importedCombatState]
        ];
        var previousStorage = storage.map(function (entry) {
          return { key: entry[0], value: localStorage.getItem(entry[0]) };
        });
        try {
          storage.forEach(function (entry) { localStorage.setItem(entry[0], JSON.stringify(entry[1])); });
        } catch (storageError) {
          var rollbackError = null;
          previousStorage.forEach(function (entry) {
            try {
              if (entry.value === null) localStorage.removeItem(entry.key);
              else localStorage.setItem(entry.key, entry.value);
            } catch (error) {
              rollbackError = rollbackError || error;
            }
          });
          if (rollbackError) throw new Error("The backup could not be saved, and previous data could not be fully restored: " + rollbackError.message);
          throw new Error("The backup could not be saved in browser storage. No changes were applied.");
        }

        state = importedState;
        egoState = importedEgoState;
        announcerState = importedAnnouncerState;
        statusEffectState = importedStatusEffectState;
        characterState = importedCharacterState;
        combatState = importedCombatState;
        selectedId = null;
        egoSelectedId = null;
        announcerSelectedId = null;
        statusEffectSelectedId = null;
        characterSelectedId = null;
        maxLevelInput.value = state.settings.maxLevel;
        themeSelect.value = state.settings.theme;
        document.getElementById("flat-damage-mode").value = state.settings.flatDamageMode;
        document.getElementById("combat-active-passives-only").checked = state.settings.combatActivePassivesOnly;
        applyTheme(state.settings.theme);
        form.elements.namedItem("level").max = state.settings.maxLevel;
        hideStatusEffectTooltip();
        render();
        renderEgoArchive();
        renderAnnouncerArchive();
        renderStatusEffectArchive();
        renderCharacterArchive();
        alert("Backup imported successfully. All data and the combat encounter were replaced.");
      } catch (error) {
        alert("Could not import this backup: " + error.message);
      } finally {
        event.target.value = "";
      }
    };
    reader.onerror = function () {
      alert("Could not read the selected backup file.");
      event.target.value = "";
    };
    reader.readAsText(file);
  });

  document.getElementById("clear-local-data-button").addEventListener("click", function () {
    if (!confirm("Clear all archive data, the combat encounter, and settings saved by this app in this browser? This cannot be undone. Export a backup first if you want to keep a copy.")) return;
    var keys = [STORAGE_KEY, EGO_STORAGE_KEY, ANNOUNCER_STORAGE_KEY, STATUS_EFFECT_STORAGE_KEY, CHARACTER_STORAGE_KEY, COMBAT_STORAGE_KEY];
    var previousStorage = keys.map(function (key) {
      return { key: key, value: localStorage.getItem(key) };
    });
    try {
      keys.forEach(function (key) { localStorage.removeItem(key); });
    } catch (storageError) {
      var rollbackError = null;
      previousStorage.forEach(function (entry) {
        if (entry.value === null) return;
        try {
          localStorage.setItem(entry.key, entry.value);
        } catch (error) {
          rollbackError = rollbackError || error;
        }
      });
      if (rollbackError) {
        alert("Local data could not be fully cleared, and some previous data could not be restored: " + rollbackError.message);
      } else {
        alert("Local data could not be cleared. No changes were applied.");
      }
      return;
    }
    window.location.reload();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey &&
      ["archive", "ego-archive", "announcer-archive", "status-archive", "character-manager"].includes(activePage) &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName) &&
      !dialog.open && !egoDialog.open && !announcerDialog.open && !statusEffectDialog.open && !characterDialog.open) {
      event.preventDefault();
      var searchInputId = activePage === "archive" ? "search-input" :
        (activePage === "ego-archive" ? "ego-search-input" :
          (activePage === "announcer-archive" ? "announcer-search-input" :
            (activePage === "status-archive" ? "status-effect-search-input" : "character-search-input")));
      document.getElementById(searchInputId).focus();
    }
  });
  selectedId = state.identities.length ? state.identities[0].id : null;
  egoSelectedId = egoState.egos.length ? egoState.egos[0].id : null;
  announcerSelectedId = announcerState.announcers.length ? announcerState.announcers[0].id : null;
  statusEffectSelectedId = statusEffectState.statusEffects.length ? statusEffectState.statusEffects[0].id : null;
  characterSelectedId = characterState.characters.length ? characterState.characters[0].id : null;
  showPage("main-menu");
  render();
  renderEgoArchive();
  renderAnnouncerArchive();
  renderStatusEffectArchive();
  renderCharacterArchive();
})();
