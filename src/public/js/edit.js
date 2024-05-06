const interestButtons = document.getElementsByClassName("remove");
const interestValues = document.getElementsByName("interests")[0];

const interests = [];

for (const interest of interestButtons) {
  interests.push(interest.querySelector(".interest-field").innerText);
}

updateInterests();

function addInterest(e) {
  if (interests.includes(e)) {
    alert(`${e} is already an interest!`);
    return;
  } else if (e.includes(";")) {
    // Semicolons are used to separate interests
    // This is a very basic check against SQL injection
    // It's better than nothing but easily bypassed
    alert("Interest cannot contain semicolons!");
    return;
  }

  console.log(e);
  const badges = document.getElementsByClassName("remove");
  /** @type HTMLSpanElement */
  const lastBadge = badges[badges.length - 1];
  /** @type HTMLSpanElement */
  const newBadge = lastBadge.cloneNode(true);
  newBadge.querySelector(".interest-field").innerText = e;

  lastBadge.after(newBadge);
  interests.push(e);
  updateInterests();
}

/** @param {HTMLButtonElement} e */
function removeInterest(e) {
  const index = interests.indexOf(e.querySelector(".interest-field").innerText);
  interests.splice(index, 1);
  e.remove();
  updateInterests();
}

function updateInterests() {
  interestValues.value = interests.join(";");
}
