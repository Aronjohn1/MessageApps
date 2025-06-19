const envelopeBox  = document.getElementById("envelopeBox");
const paperMessage = document.getElementById("paperMessage");
const errorText    = document.getElementById("errorText");
const linkBox      = document.getElementById("linkBox");
const formSection  = document.getElementById("form-section");
const arrowSection = document.getElementById("arrowSection");

envelopeBox.addEventListener("click", () => envelopeBox.classList.toggle("open"));

async function sendMessage() {
  const name    = document.getElementById("nameInput").value.trim().toLowerCase();
  const message = document.getElementById("msgInput").value.trim();
  errorText.textContent = "";
  linkBox.innerHTML = "";

  if (!name || !message) {
    errorText.textContent = "Please enter both name and message.";
    return;
  }

  try {
    const response = await fetch("save_message.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, message })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || "Something went wrong.");

    paperMessage.innerHTML = `<strong>${name}</strong><br>${message}`;
    envelopeBox.classList.add("open");

    const link = `${location.origin}${location.pathname}?name=${encodeURIComponent(name)}`;
    linkBox.innerHTML = `🔗 Share this link copy mo lang:<br><a href="${link}">${link}</a>`;
  } catch (error) {
    errorText.textContent = error.message;
  }
}

function showForm() {
  formSection.style.display = "block";
  arrowSection.style.display = "none";
}

window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const name = params.get("name");
  if (!name) return;

  formSection.style.display = "none";
  arrowSection.style.display = "block";

  try {
   const link = `${location.origin}${location.pathname}?name=${encodeURIComponent(data.name)}`;

    const data = await response.json();

    if (!response.ok) throw new Error(data.msg || "Message not found.");
    paperMessage.innerHTML = `<strong>Name:</strong> ${data.name}<br><strong>Message:</strong><br>${data.message}`;
    envelopeBox.classList.add("open");
  } catch (error) {
    paperMessage.innerHTML = `<em>${error.message}</em>`;
  }
});
