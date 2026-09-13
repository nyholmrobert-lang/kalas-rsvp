// Klistra in din Google Apps Script Web App URL här efter att du publicerat scriptet.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvs1Do6VkqCIo4JkFO1wH8HWU1BjUu_-SlciXxSzCFrYpER9jXr_Sv02SK2FJSCs-l-A/exec";

const form = document.getElementById("rsvpForm");
const extra = document.getElementById("extraFields");
const status = document.getElementById("status");

document.querySelectorAll('input[name="attendance"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const coming = document.querySelector('input[name="attendance"]:checked')?.value.startsWith("Ja");
    extra.style.display = coming ? "block" : "none";
    extra.querySelectorAll("input, textarea").forEach(el => el.required = coming && el.name !== "notes");
  });
});

extra.style.display = "none";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (SCRIPT_URL.includes("KLISTRA_IN")) {
    status.textContent = "Formuläret är inte kopplat till svarstabellen ännu.";
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  const button = form.querySelector("button");
  button.disabled = true;
  status.textContent = "Skickar ditt svar…";

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type":"application/x-www-form-urlencoded"},
      body: new URLSearchParams(data)
    });
    form.innerHTML = '<div style="text-align:center;padding:20px 4px"><h2>Tack! 🎉</h2><p>Ditt svar är registrerat. Vi ser fram emot att fira tillsammans! 💕</p></div>';
  } catch (err) {
    button.disabled = false;
    status.textContent = "Något gick fel. Försök igen.";
  }
});
