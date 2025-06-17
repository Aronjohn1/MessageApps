async function sendMessage() {
  const name = document.getElementById("nameInput").value.trim().toLowerCase();
  const message = document.getElementById("msgInput").value.trim();
  const errorText = document.getElementById("errorText");
  const paperMessage = document.getElementById("paperMessage");
  const linkBox = document.getElementById("linkBox");
  const envelopeBox = document.getElementById("envelopeBox");

  errorText.textContent = "";

  if (!name || !message) {
    errorText.textContent = "Please enter both name and message.";
    return;
  }

  try {
    const resp = await fetch("save_message.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ name, message })
    });

    const text = await resp.text();
    console.log("Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Server returned invalid JSON");
    }

    if (!resp.ok) throw new Error(data.msg || "Unknown server error");

    // Show message visually
    paperMessage.innerHTML = `<strong>Name:</strong> ${name}<br><strong>Message:</strong><br>${message}`;
    envelopeBox.classList.add("open");

    // Generate link to retrieve
    const link = `${location.origin}${location.pathname}?name=${encodeURIComponent(name)}`;
    linkBox.innerHTML = `🔗 Share this link:<br><a href="${link}">${link}</a>`;
  } catch (err) {
    errorText.textContent = err.message;
  }
}


window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const name = params.get("name");
  const paperMessage = document.getElementById("paperMessage");
  const formSection = document.getElementById("form-section");
  const arrowSection = document.getElementById("arrowSection");

  if (!name) return;

  formSection.style.display = "none";
  arrowSection.style.display = "block";
  document.getElementById("envelopeWrapper").classList.add("bottom");

  try {
    const resp = await fetch(`save_message.php?name=${encodeURIComponent(name)}`);
    const data = await resp.json();

    if (!resp.ok) throw new Error(data.msg);
    paperMessage.innerHTML = `<strong>Name:</strong> ${data.name}<br><strong>Message:</strong><br>${data.message}`;
  } catch (err) {
    paperMessage.innerHTML = `<em>${err.message}</em>`;
  }
});

