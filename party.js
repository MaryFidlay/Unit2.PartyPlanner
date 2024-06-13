const COHORT = "2405-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  party: [],
};

const partyList = document.querySelector("#party-list");
const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

////////Sync state with the API and rerender//////////

async function render() {
  await getParty();
  renderParty();
}
render();

/////////Update state with parties from API///////////

async function getParty() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.party = json.data;
  } catch (error) {
    console.error(error);
  }
}

/////////////Render parties from state////////////////

function renderParty() {
  if (!state.party.length) {
    partyList.innerHTML = "<li>No Parties to display</li>";
    return;
  }

  const partyCards = state.party.map((party) => {
    const card = document.createElement("div");
    card.className = "card mb-3";
    card.innerHTML = `
          <h2>${party.name}</h2>
          <p>${party.date}</p>
          <p>${party.time}</p>
          <p>${party.location}</p>
          <p>${party.description}</p>
          <button class="btn btn-danger" onclick="deleteParty('${party.id}')">Delete</button>
        </div>
    `;
    return card;
  });

  partyList.replaceChildren(...partyCards);
}

///////Ask the API to create a new party based on form data///////////////

///////////////////////ADD PARTY///////////////////////////

async function addParty(event) {
  event.preventDefault();
  console.log("Adding party...");

  const partyData = {
    name: document.getElementById("name").value,
    date: new Date(
      document.getElementById("date").value +
        "T" +
        document.getElementById("time").value
    ).toISOString(),
    location: document.getElementById("location").value,
    description: document.getElementById("description").value,
    cohortId: 219,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partyData),
    });

    const responseData = await response.json();
    console.log("Response data:", responseData);

    if (!response.ok) {
      throw new Error(
        responseData.error ? responseData.error.message : "Failed to add party"
      );
    }
    render();
  } catch (error) {
    console.error("Error", error);
  }
}

/////////to delete party////////////////

async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete party");
    }

    render();
  } catch (error) {
    console.error("Error", error);
  }
}
