  const envelopeBox = document.getElementById("envelopeBox");
  const paperMessage = document.getElementById("paperMessage");
  const errorText = document.getElementById("errorText");
  const linkBox = document.getElementById("linkBox");
  const formSection = document.getElementById("form-section");
  const arrowSection = document.getElementById("arrowSection");
  const shareLinkText = document.getElementById("shareLinkText");
  const copyPopup = document.getElementById("copyPopup");

  envelopeBox.addEventListener("click", () => {
    envelopeBox.classList.toggle("open");
  });

  function sendMessage() {
    const name = document.getElementById("nameInput").value.trim().toLowerCase();
    const message = document.getElementById("msgInput").value.trim();
    errorText.textContent = "";

    if (!name || !message) {
      errorText.textContent = "Please enter both name and message.";
      return;
    }

    const messages = JSON.parse(localStorage.getItem("messages") || "{}");

    if (messages[name]) {
      errorText.textContent = "Please use another name because someone already owns this name.";
      return;
    }

    messages[name] = message;
    localStorage.setItem("messages", JSON.stringify(messages));

    paperMessage.innerHTML = `<strong>Name:</strong> ${name}<br><strong>Message:</strong><br>${message}`;
    envelopeBox.classList.add("open");

    const link = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(name)}`;
    shareLinkText.innerHTML = `🔗 Share this link:<br><a href="${link}" target="_blank">${link}</a>`;
    linkBox.style.display = "block";
  }

  function showForm() {
    formSection.style.display = "block";
    arrowSection.style.display = "none";
  }

  function copyLink() {
    const linkElement = document.querySelector("#shareLinkText a");

    if (linkElement) {
      const link = linkElement.href;
      navigator.clipboard.writeText(link)
        .then(() => {
          copyPopup.style.display = "block";
          setTimeout(() => {
            copyPopup.style.display = "none";
          }, 2000);
        })
        .catch(() => {
          alert("❌ Failed to copy the link. Please try manually.");
        });
    } else {
      alert("⚠️ Link not found.");
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");

    if (name) {
      const messages = JSON.parse(localStorage.getItem("messages") || "{}");
      const message = messages[name.toLowerCase()];
      formSection.style.display = "none";
      arrowSection.style.display = "block";

      if (message) {
        paperMessage.innerHTML = `<strong>Name:</strong> ${name}<br><strong>Message:</strong><br>${message}`;
        envelopeBox.classList.add("open");
      } else {
        paperMessage.innerHTML = `<em>Message not found for this name.</em>`;
      }
    }
  });
