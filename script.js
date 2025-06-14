// offense definitions and logic for the admin punishment tool

// command generation function
function generateCommands(punishment, offense, details, updatedPoints, playerName = "[PLAYER]") {
  const playerPlaceholder = playerName || "[PLAYER]";
  let punishmentCommand = "";
  let noteCommand = `/note ${playerPlaceholder} ${offense.label} - ${updatedPoints} points total`;
  
  // generate punishment command based on punishment type
  if (punishment.includes("warning")) {
    punishmentCommand = `/warn ${playerPlaceholder} ${offense.label}`;
  } else if (punishment.includes("kick")) {
    punishmentCommand = `/kick ${playerPlaceholder} ${offense.label}`;
  } else if (punishment.includes("15 minute mute")) {
    punishmentCommand = `/tempmute ${playerPlaceholder} 15m ${offense.label}`;
  } else if (punishment.includes("30 minute mute")) {
    punishmentCommand = `/tempmute ${playerPlaceholder} 30m ${offense.label}`;
  } else if (punishment.includes("1 hour mute")) {
    punishmentCommand = `/tempmute ${playerPlaceholder} 1h ${offense.label}`;
  } else if (punishment.includes("2 hour mute")) {
    punishmentCommand = `/tempmute ${playerPlaceholder} 2h ${offense.label}`;
  } else if (punishment.includes("1 day mute")) {
    punishmentCommand = `/tempmute ${playerPlaceholder} 1d ${offense.label}`;
  } else if (punishment.includes("2 day tempban")) {
    punishmentCommand = `/tempban ${playerPlaceholder} 2d ${offense.label}`;
  } else if (punishment.includes("3 day")) {
    punishmentCommand = `/tempban ${playerPlaceholder} 3d ${offense.label}`;
  } else if (punishment.includes("5 day")) {
    punishmentCommand = `/tempban ${playerPlaceholder} 5d ${offense.label}`;
  } else if (punishment.includes("1 week") || punishment.includes("one week")) {
    punishmentCommand = `/tempban ${playerPlaceholder} 7d ${offense.label}`;
  } else if (punishment.includes("2 week")) {
    punishmentCommand = `/tempban ${playerPlaceholder} 14d ${offense.label}`;
  } else if (punishment.includes("4 week") || punishment.includes("four weeks") || punishment.includes("1 month")) {
    punishmentCommand = `/tempban ${playerPlaceholder} 30d ${offense.label}`;
  } else if (punishment.includes("permanent ban") || punishment.includes("immediate permanent ban")) {
    punishmentCommand = `/ban ${playerPlaceholder} ${offense.label}`;
  } else if (punishment.includes("1 hour ban from voice chat")) {
    punishmentCommand = `/note ${playerPlaceholder} VC ban 1 hour - ${offense.label}`;
  } else if (punishment.includes("1 day ban from voice chat")) {
    punishmentCommand = `/note ${playerPlaceholder} VC ban 1 day - ${offense.label}`;
  } else if (punishment.includes("permanent ban from voice chat")) {
    punishmentCommand = `/note ${playerPlaceholder} VC ban permanent - ${offense.label}`;
  } else if (punishment.includes("wipe inventory")) {
    punishmentCommand = `/note ${playerPlaceholder} Wipe inventory and ender chest - ${offense.label}`;
  } else if (punishment.includes("demotion")) {
    punishmentCommand = `/note ${playerPlaceholder} Demotion required - ${offense.label}`;
  } else {
    punishmentCommand = `/note ${playerPlaceholder} Manual action required: ${punishment} - ${offense.label}`;
  }
  
  return {
    punishment: punishmentCommand,
    note: noteCommand
  };
}

// copy to clipboard function
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // could add visual feedback here
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

// copy command from element
function copyCommand(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    copyToClipboard(element.textContent);
  }
}

// update commands with player name
function updateCommands() {
  const playerNameInput = document.getElementById("player-name");
  const punishmentElement = document.getElementById("punishment-command");
  const noteElement = document.getElementById("note-command");
  
  if (playerNameInput && punishmentElement && noteElement && window.currentCommands) {
    const playerName = playerNameInput.value.trim() || "[PLAYER]";
    const updatedCommands = generateCommands(
      window.currentPunishment,
      window.currentOffense,
      window.currentDetails,
      window.currentUpdatedPoints,
      playerName
    );
    
    punishmentElement.textContent = updatedCommands.punishment;
    noteElement.textContent = updatedCommands.note;
  }
}

// offense data structure for each class and type
const offenses = {
  item: [
    {
      key: "inappropriate_item_name",
      label: "inappropriate item name",
      points: 1,
      dynamic: false,
      punishment: [
        { min: 1, max: 5, result: "warning" },
        { min: 6, max: 8, result: "tempban one week" },
        { min: 9, max: Infinity, result: "tempban four weeks" }
      ]
    },
    {
      key: "inappropriate_book",
      label: "inappropriate book contents",
      points: 1,
      dynamic: false,
      punishment: [
        { min: 1, max: Infinity, result: "warning" }
      ]
    },
    {
      key: "minor_theft",
      label: "minor theft (less than 50 item points)",
      points: 1,
      dynamic: true,
      itemPoints: 50,
      punishment: [
        { min: 0, max: 3, result: "warning" },
        { min: 4, max: 5, result: "2 day tempban" },
        { min: 6, max: 10, result: "1 week tempban" },
        { min: 11, max: 15, result: "2 week tempban" },
        { min: 16, max: Infinity, result: "4 week tempban" }
      ]
    },
    {
      key: "moderate_theft",
      label: "moderate theft (50-500 item points)",
      points: 3,
      dynamic: true,
      itemPoints: 500,
      punishment: [
        { min: 0, max: 5, result: "warning" },
        { min: 6, max: 10, result: "5 day tempban" },
        { min: 11, max: 15, result: "2 week tempban" },
        { min: 16, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "severe_theft",
      label: "severe theft (over 500 item points)",
      points: 5,
      dynamic: true,
      itemPoints: Infinity,
      punishment: [
        { min: 0, max: 5, result: "warning" },
        { min: 6, max: 10, result: "1 week tempban" },
        { min: 11, max: 15, result: "2 week tempban" },
        { min: 16, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "unconsensual_killing",
      label: "unconsensual killing (2+ times)",
      points: 2,
      dynamic: false,
      punishment: [
        { min: 0, max: 5, result: "warning" },
        { min: 6, max: 10, result: "3 days tempban" },
        { min: 11, max: 15, result: "1 week tempban" },
        { min: 16, max: Infinity, result: "2 week tempban" }
      ]
    },
    {
      key: "illegal_item_use",
      label: "using illegal item without reporting",
      points: 1,
      dynamic: false,
      punishment: [
        { min: 1, max: Infinity, result: "warning" }
      ]
    }
  ],
  block: [
    {
      key: "vandalism",
      label: "vandalism (less than 10 blocks)",
      points: 1,
      dynamic: true,
      blockType: "general",
      punishment: [
        { min: 1, max: Infinity, result: "warning" }
      ]
    },
    {
      key: "theft_grief",
      label: "theft-grief (less than 100 blocks, valuables)",
      points: null,
      dynamic: true,
      blockType: "valuables",
      punishment: [
        { min: 0, max: 5, result: "warning" },
        { min: 6, max: 8, result: "3 day temp ban" },
        { min: 9, max: 10, result: "5 day temp ban" },
        { min: 11, max: 15, result: "2 week ban" },
        { min: 16, max: 20, result: "1 month ban" },
        { min: 21, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "minor_grief",
      label: "minor grief (less than 100 blocks)",
      points: 2,
      dynamic: true,
      blockType: "general",
      punishment: [
        { min: 0, max: 5, result: "warning" },
        { min: 6, max: 8, result: "3 day temp ban" },
        { min: 9, max: 10, result: "5 day temp ban" },
        { min: 11, max: 15, result: "2 week ban" },
        { min: 16, max: 20, result: "1 month ban" },
        { min: 21, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "public_infra_vandalism",
      label: "vandalism of public infrastructure",
      points: 3,
      dynamic: false,
      punishment: [
        { min: 0, max: 5, result: "warning" },
        { min: 6, max: 8, result: "3 day temp ban" },
        { min: 9, max: 10, result: "5 day temp ban" },
        { min: 11, max: 15, result: "2 week ban" },
        { min: 16, max: 20, result: "1 month ban" },
        { min: 21, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "moderate_grief",
      label: "moderate grief (100-1000 blocks)",
      points: 5,
      dynamic: true,
      blockType: "general",
      punishment: [
        { min: 0, max: 5, result: "warning" },
        { min: 6, max: 8, result: "3 day temp ban" },
        { min: 9, max: 10, result: "5 day temp ban" },
        { min: 11, max: 15, result: "2 week ban" },
        { min: 16, max: 20, result: "1 month ban" },
        { min: 21, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "large_grief",
      label: "large grief (1000-100000 blocks)",
      points: 8,
      dynamic: true,
      blockType: "general",
      punishment: [
        { min: 0, max: 5, result: "warning" },
        { min: 6, max: 8, result: "3 day temp ban" },
        { min: 9, max: 10, result: "5 day temp ban" },
        { min: 11, max: 15, result: "2 week ban" },
        { min: 16, max: 20, result: "1 month ban" },
        { min: 21, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "massive_grief",
      label: "massive grief (over 100000 blocks)",
      points: 25,
      dynamic: true,
      blockType: "general",
      punishment: [
        { min: 0, max: Infinity, result: "immediate permanent ban" }
      ]
    }
  ],
  hacking: [
    {
      key: "xray",
      label: "x-raying",
      points: 1,
      dynamic: false,
      punishment: [
        { min: 0, max: 9, result: "warning" },
        { min: 10, max: Infinity, result: "wipe inventory and ender chest" }
      ]
    },
    {
      key: "hacking_client",
      label: "use of hacking client",
      points: 5,
      dynamic: false,
      punishment: [
        { min: 0, max: 5, result: "kick (turn off your hacking client)" },
        { min: 6, max: 15, result: "3 day temp ban" },
        { min: 16, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "finding_exploit",
      label: "finding an exploit",
      points: 0,
      dynamic: false,
      punishment: [
        { min: 0, max: Infinity, result: "award for bugfinding (if trusted), otherwise ban until patched" }
      ]
    },
    {
      key: "abuse_exploit",
      label: "abuse of exploits",
      points: 10,
      dynamic: false,
      punishment: [
        { min: 0, max: 10, result: "5 day ban" },
        { min: 11, max: 15, result: "1 week ban" },
        { min: 16, max: 25, result: "2 week ban" },
        { min: 26, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "light_admin_abuse",
      label: "light admin abuse",
      points: 0,
      dynamic: false,
      punishment: [
        { min: 1, max: 1, result: "warning" },
        { min: 2, max: 2, result: "demotion to trusted" }
      ]
    },
    {
      key: "moderate_admin_abuse",
      label: "moderate admin abuse",
      points: 5,
      dynamic: false,
      punishment: [
        { min: 0, max: Infinity, result: "immediate demotion to standard player" }
      ]
    },
    {
      key: "severe_admin_abuse",
      label: "severe admin abuse",
      points: 0,
      dynamic: false,
      punishment: [
        { min: 0, max: Infinity, result: "immediate permanent ban and demotion" }
      ]
    }
  ],
  communication: [
    {
      key: "abusive_chat",
      label: "abusive chat",
      points: 1,
      dynamic: false,
      punishment: [
        { min: 0, max: 3, result: "warning" },
        { min: 4, max: 5, result: "15 minute mute" },
        { min: 6, max: 10, result: "1 hour mute" },
        { min: 11, max: Infinity, result: "1 day mute" }
      ]
    },
    {
      key: "inciting_verbal_conflict",
      label: "inciting verbal conflict",
      points: 2,
      dynamic: false,
      punishment: [
        { min: 0, max: 3, result: "warning" },
        { min: 4, max: 5, result: "30 minute mute" },
        { min: 6, max: 10, result: "2 hour mute" },
        { min: 11, max: Infinity, result: "1 day mute" }
      ]
    },
    {
      key: "abusive_vc_language",
      label: "abusive vc language",
      points: 1,
      dynamic: false,
      punishment: [
        { min: 0, max: 3, result: "warning" },
        { min: 4, max: 5, result: "1 hour ban from voice chat" },
        { min: 6, max: 10, result: "1 day ban from voice chat" },
        { min: 11, max: Infinity, result: "permanent ban from voice chat" }
      ]
    },
    {
      key: "lying_to_staff",
      label: "lying to staff member",
      points: 1,
      dynamic: false,
      punishment: [
        { min: 0, max: 5, result: "warning" },
        { min: 6, max: 10, result: "1 day ban" },
        { min: 11, max: Infinity, result: "3 day ban" }
      ]
    },
    {
      key: "manipulation",
      label: "manipulation",
      points: 5,
      dynamic: false,
      punishment: [
        { min: 0, max: 5, result: "3 day ban" },
        { min: 6, max: 10, result: "1 week ban" },
        { min: 11, max: Infinity, result: "2 week ban" }
      ]
    },
    {
      key: "grand_manipulation",
      label: "grand manipulation",
      points: 20,
      dynamic: false,
      punishment: [
        { min: 0, max: Infinity, result: "permanent ban" }
      ]
    },
    {
      key: "corruption",
      label: "corruption",
      points: 0,
      dynamic: false,
      punishment: [
        { min: 0, max: Infinity, result: "warning, tempban, or permanent ban (staff discretion)" }
      ]
    }
  ]
};

// item point values for theft calculation
const itemPointValues = [
  { label: "elytra, nether star, beacon, heavy core, mace, netherite block, special award", value: 20 },
  { label: "netherite derivatives, diamond block, gold block, emerald block, shulker box", value: 10 },
  { label: "diamonds/derivatives, iron block, potions", value: 5 },
  { label: "any tool/armor, any ore/ingot, firework rockets", value: 2 },
  { label: "other", value: 1 }
];

// helper to get offense list for a class
function getOffensesForClass(classKey) {
  return offenses[classKey] || [];
}

// helper to get offense object by key
function getOffense(classKey, offenseKey) {
  return (offenses[classKey] || []).find(o => o.key === offenseKey);
}

// populate offense type dropdown
const offenseClassSelect = document.getElementById("offense-class");
const offenseTypeSelect = document.getElementById("offense-type");
const dynamicInputsDiv = document.getElementById("dynamic-inputs");
const resultDiv = document.getElementById("result");

offenseClassSelect.addEventListener("change", function() {
  const classKey = this.value;
  offenseTypeSelect.innerHTML = '<option value="">Select offense</option>';
  dynamicInputsDiv.innerHTML = "";
  if (!classKey) return;
  const list = getOffensesForClass(classKey);
  list.forEach(off => {
    const opt = document.createElement("option");
    opt.value = off.key;
    opt.textContent = off.label.toLowerCase();
    offenseTypeSelect.appendChild(opt);
  });
});

// show dynamic inputs if needed
offenseTypeSelect.addEventListener("change", function() {
  const classKey = offenseClassSelect.value;
  const offenseKey = this.value;
  dynamicInputsDiv.innerHTML = "";
  if (!classKey || !offenseKey) return;
  const offense = getOffense(classKey, offenseKey);

  // for theft, show item point calculator
  if (classKey === "item" && offense.dynamic) {
    const theftDiv = document.createElement("div");
    theftDiv.className = "form-group";
    theftDiv.innerHTML = "<label>item points calculator</label>";
    itemPointValues.forEach((item, idx) => {
      const group = document.createElement("div");
      group.style.display = "flex";
      group.style.alignItems = "center";
      group.style.marginBottom = "0.3rem";
      const label = document.createElement("span");
      label.style.flex = "1";
      label.textContent = item.label.toLowerCase();
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.value = "0";
      input.id = "itempoints-" + idx;
      input.style.width = "60px";
      input.style.marginLeft = "0.5rem";
      group.appendChild(label);
      group.appendChild(input);
      theftDiv.appendChild(group);
    });
    dynamicInputsDiv.appendChild(theftDiv);
  }

  // for block offenses, show block count input
  if (classKey === "block" && offense.dynamic) {
    const blockDiv = document.createElement("div");
    blockDiv.className = "form-group";
    blockDiv.innerHTML = `
      <label>block count</label>
      <input type="number" id="block-count" min="1" value="1">
    `;
    dynamicInputsDiv.appendChild(blockDiv);
  }
});

// main calculation logic
document.getElementById("punishment-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const classKey = offenseClassSelect.value;
  const offenseKey = offenseTypeSelect.value;
  const priorPoints = parseInt(document.getElementById("prior-points").value, 10) || 0;
  const monthsSince = parseInt(document.getElementById("months-since").value, 10) || 0;
  const offense = getOffense(classKey, offenseKey);
  if (!offense) {
    resultDiv.textContent = "please select a valid offense.";
    return;
  }

  // calculate point decay
  let decayedPoints = priorPoints - (2 * monthsSince);
  if (decayedPoints < 0) decayedPoints = 0;

  // calculate new offense points
  let newPoints = offense.points;
  let details = "";

  // handle item theft dynamic calculation
  if (classKey === "item" && offense.dynamic) {
    let totalItemPoints = 0;
    itemPointValues.forEach((item, idx) => {
      const val = parseInt(document.getElementById("itempoints-" + idx).value, 10) || 0;
      totalItemPoints += val * item.value;
    });
    details += `item points: ${totalItemPoints}. `;
    if (offense.key === "minor_theft" && totalItemPoints >= 50) {
      resultDiv.textContent = "item points exceed minor theft threshold. select moderate or severe theft.";
      return;
    }
    if (offense.key === "moderate_theft" && (totalItemPoints < 50 || totalItemPoints > 500)) {
      resultDiv.textContent = "item points not in moderate theft range. select correct theft type.";
      return;
    }
    if (offense.key === "severe_theft" && totalItemPoints <= 500) {
      resultDiv.textContent = "item points do not meet severe theft threshold. select correct theft type.";
      return;
    }
    newPoints = offense.points;
  }

  // handle block offenses dynamic calculation
  if (classKey === "block" && offense.dynamic) {
    const blockCount = parseInt(document.getElementById("block-count").value, 10) || 0;
    details += `block count: ${blockCount}. `;
    if (offense.key === "vandalism" && blockCount >= 10) {
      resultDiv.textContent = "block count exceeds vandalism threshold. select correct offense.";
      return;
    }
    if (offense.key === "theft_grief") {
      let theftGriefPoints = Math.max(2, Math.floor(blockCount / 20));
      newPoints = theftGriefPoints;
      details += `theft-grief points: ${theftGriefPoints}. `;
      if (blockCount >= 100) {
        resultDiv.textContent = "block count exceeds theft-grief threshold. select correct offense.";
        return;
      }
    }
    if (offense.key === "minor_grief" && blockCount >= 100) {
      resultDiv.textContent = "block count exceeds minor grief threshold. select correct offense.";
      return;
    }
    if (offense.key === "moderate_grief" && (blockCount < 100 || blockCount >= 1000)) {
      resultDiv.textContent = "block count not in moderate grief range. select correct offense.";
      return;
    }
    if (offense.key === "large_grief" && (blockCount < 1000 || blockCount >= 100000)) {
      resultDiv.textContent = "block count not in large grief range. select correct offense.";
      return;
    }
    if (offense.key === "massive_grief" && blockCount < 100000) {
      resultDiv.textContent = "block count does not meet massive grief threshold. select correct offense.";
      return;
    }
  }

  // calculate updated points
  let updatedPoints = decayedPoints + newPoints;

  // find punishment
  let punishment = "no punishment found.";
  for (let p of offense.punishment) {
    if (updatedPoints >= p.min && updatedPoints <= p.max) {
      punishment = p.result;
      break;
    }
  }

  // generate commands with placeholder
  const commands = generateCommands(punishment, offense, details, updatedPoints);

  // store data globally for real-time updates
  window.currentPunishment = punishment;
  window.currentOffense = offense;
  window.currentDetails = details;
  window.currentUpdatedPoints = updatedPoints;

  // show result, all lowercase
  resultDiv.innerHTML = `
    <strong>offense:</strong> ${offense.label.toLowerCase()}<br>
    <strong>prior points (after decay):</strong> ${decayedPoints}<br>
    <strong>points for this offense:</strong> ${newPoints}<br>
    <strong>updated points:</strong> ${updatedPoints}<br>
    <strong>recommended punishment:</strong> ${punishment.toLowerCase()}<br>
    <span style="color:#7fd7ff">${details.toLowerCase()}</span>
    <div class="commands-section">
      <strong>commands:</strong><br>
      <div class="command-box">
        <span class="command-label">punishment:</span><br>
        <code class="command-text" id="punishment-command">${commands.punishment}</code>
        <button class="copy-btn" onclick="copyCommand('punishment-command')" type="button">copy</button>
      </div>
      <div class="command-box">
        <span class="command-label">note:</span><br>
        <code class="command-text" id="note-command">${commands.note}</code>
        <button class="copy-btn" onclick="copyCommand('note-command')" type="button">copy</button>
      </div>
    </div>
  `;
});
