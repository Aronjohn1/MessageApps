const envelopeBox  = document.getElementById("envelopeBox");
const paperMessage = document.getElementById("paperMessage");
const errorText    = document.getElementById("errorText");
const linkBox      = document.getElementById("linkBox");
const formSection  = document.getElementById("form-section");
const arrowSection = document.getElementById("arrowSection");

envelopeBox.addEventListener("click", () => envelopeBox.classList.toggle("open"));

async function sendMessage() {
  const name = document.getElementById("nameInput").value.trim().toLowerCase();
  const message = document.getElementById("msgInput").value.trim();
  errorText.textContent = "";

  if (!name || !message) {
    errorText.textContent = "Please enter both name and message.";
    return;
  }

  try {
    const resp = await fetch("save_message.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, message })
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.msg);

    paperMessage.innerHTML = `<strong>Name:</strong>${name}<br><strong>Message:</strong><br>${message}`;
    envelopeBox.classList.add("open");

    const link = `${location.origin}${location.pathname}?name=${encodeURIComponent(name)}`;
    linkBox.innerHTML = `🔗 Share this link copy mo lang:<br><a href="${link}">${link}</a>`;

  } catch (err) {
    errorText.textContent = err.message;
  }
}

function showForm() {
  formSection.style.display = "block";
  arrowSection.style.display = "none";
}


window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const name   = params.get("name");

  if (!name) return;

  formSection.style.display = "none";
  arrowSection.style.display = "block";

  // Move the envelope to the bottom
  document.getElementById("envelopeWrapper").classList.add("bottom");

  try {
    const resp  = await fetch(`save_message.php?name=${encodeURIComponent(name)}`);
    const data  = await resp.json();

    if (!resp.ok) throw new Error(data.msg);
    paperMessage.innerHTML = `<strong>Name:</strong> ${data.name}<br><strong>Message:</strong><br>${data.message}`;
  } catch (err) {
    paperMessage.innerHTML = `<em>${err.message}</em>`;
  }
});
