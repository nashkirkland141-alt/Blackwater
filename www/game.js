
const $ = id => document.getElementById(id);

const intro = $("intro");
const game = $("game");
const scene = $("scene");
const player = $("player");

let evidence = [];
let observing = false;

const objects = [
  {
    name: "Desk",
    desc: "A stack of unpaid bills, a cold cup of coffee, and a case file that should have been closed three days ago.",
    x: 24, y: 69, w: 40, h: 17
  },
  {
    name: "Rain-streaked window",
    desc: "The rain has been falling for hours. Across the street, one office light is still on.",
    x: 13, y: 15, w: 37, h: 36
  },
  {
    name: "Case board",
    desc: "A photograph, two witness statements, and a name circled in red. Someone has been working this case after hours.",
    x: 69, y: 18, w: 23, h: 20
  },
  {
    name: "Office door",
    desc: "The hallway is quiet. The elevator is still running. Apartment 4B is waiting.",
    x: 81, y: 44, w: 14, h: 37
  }
];

function addHotspots() {
  const holder = $("hotspots");
  holder.innerHTML = "";

  objects.forEach((object, index) => {
    const button = document.createElement("button");

    button.className = "hotspot";
    button.style.left = object.x + "%";
    button.style.top = object.y + "%";
    button.style.width = object.w + "%";
    button.style.height = object.h + "%";

    button.setAttribute("aria-label", object.name);

    button.addEventListener("click", event => {
      event.stopPropagation();

      moveTo(
        object.x + object.w / 2,
        object.y + object.h / 2
      );

      setTimeout(() => {
        showDialog(object.name, object.desc);
      }, 350);
    });

    holder.appendChild(button);
  });
}

function moveTo(x, y) {
  player.style.left = x + "%";
  player.style.top = y + "%";
}

function showDialog(title, description) {
  $("dialogType").textContent =
    observing ? "OBSERVATION" : "INTERACTION";

  $("dialogTitle").textContent = title;
  $("dialogText").textContent = description;

  const actions = $("dialogActions");
  actions.innerHTML = "";

  const button = document.createElement("button");
  button.textContent = "RECORD OBSERVATION";

  button.onclick = () => {
    if (!evidence.includes(title)) {
      evidence.push(title);
      updateEvidence();
    }

    $("dialogText").textContent =
      "You make a mental note. Details like this may matter later.";

    button.textContent = "RECORDED";
    button.disabled = true;
  };

  actions.appendChild(button);
  $("dialog").classList.remove("hidden");
}

function updateEvidence() {
  const list = $("evidenceList");
  list.innerHTML = "";

  if (evidence.length === 0) {
    list.innerHTML = "<li>No evidence collected yet.</li>";
    return;
  }

  evidence.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

$("begin").addEventListener("click", () => {
  intro.classList.add("hidden");
  game.classList.remove("hidden");

  addHotspots();
});

$("closeDialog").onclick = () => {
  $("dialog").classList.add("hidden");
};

$("caseBtn").onclick = () => {
  $("casePanel").classList.remove("hidden");
};

$("closeCase").onclick = () => {
  $("casePanel").classList.add("hidden");
};

$("observe").onclick = () => {
  observing = !observing;

  scene.classList.toggle("observing", observing);

  $("observe").textContent =
    observing ? "OBSERVING ON" : "OBSERVE";

  $("hint").textContent = observing
    ? "LOOK FOR DETAILS THAT DO NOT BELONG."
    : "TAP A LOCATION TO MOVE. TAP OBJECTS TO EXAMINE.";
};

scene.addEventListener("click", event => {
  if (event.target.closest(".hotspot")) return;

  const rect = scene.getBoundingClientRect();

  moveTo(
    ((event.clientX - rect.left) / rect.width) * 100,
    ((event.clientY - rect.top) / rect.height) * 100
  );
});

updateEvidence();
    
