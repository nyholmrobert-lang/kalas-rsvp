const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzvs1Do6VkqCIo4JkFO1wH8HWU1BjUu_-SlciXxSzCFrYpER9jXr_Sv02SK2FJSCs-l-A/exec";

const form = document.getElementById("rsvpForm");
const extra = document.getElementById("extraFields");
const status = document.getElementById("status");


// --------------------------------------------------
// Visa/dölj extra information beroende på JA/NEJ
// --------------------------------------------------

document
  .querySelectorAll('input[name="attendance"]')
  .forEach((radio) => {

    radio.addEventListener("change", () => {

      const coming =
        document.querySelector(
          'input[name="attendance"]:checked'
        )?.value.startsWith("Ja");

      extra.style.display = coming ? "block" : "none";

      extra
        .querySelectorAll("input, textarea")
        .forEach((el) => {
          el.required = coming && el.name !== "notes";
        });

    });

  });


// Börja med att dölja kontaktinformationen
extra.style.display = "none";


// --------------------------------------------------
// Skapa kalenderfil
// --------------------------------------------------

function createCalendarFile() {

  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Alicia 9 ar//RSVP//SV
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:alicia-9-kalas-20260926@kalas-rsvp
DTSTAMP:20260915T120000Z
DTSTART:20260926T091500Z
DTEND:20260926T113000Z
SUMMARY:Alicias 9-årskalas 🎳
LOCATION:BowlingBull i Jakobsberg\\, Hammarvägen 61\\, Järfälla
DESCRIPTION:Samling kl. 11:15 så att tjejerna hinner välja bowlingskor innan bowlingen börjar. Bowling med discotema och mat. Kalaset avslutas omkring kl. 13:30.
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob(
    [ics],
    { type: "text/calendar;charset=utf-8" }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "Alicias-9-arskalas.ics";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}


// --------------------------------------------------
// Skicka RSVP
// --------------------------------------------------

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const data =
    Object.fromEntries(
      new FormData(form).entries()
    );

  const button =
    form.querySelector("button");

  const coming =
    data.attendance === "Ja, hon kommer!";

  button.disabled = true;

  status.textContent =
    "Skickar ditt svar…";


  try {

    await fetch(
      SCRIPT_URL,
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body:
          new URLSearchParams(data)
      }
    );


    // ------------------------------------------------
    // JA
    // ------------------------------------------------

    if (coming) {

      form.innerHTML = `
        <div style="text-align:center;padding:20px 4px">

          <h2>🎉 Vad roligt!</h2>

          <p>
            Tack för ditt svar!<br>
            Alicia ser fram emot att fira tillsammans!
            🎳💕
          </p>

          <div style="
            margin-top:22px;
            padding:16px;
            border-radius:16px;
            background:#fff2f7;
            border:1px solid #e9d3df;
          ">

            <strong>📅 Glöm inte att spara kalaset!</strong>

            <p style="
              font-size:13px;
              line-height:1.5;
              margin:8px 0 14px;
            ">
              Samling 11:15<br>
              Bowling 11:30<br>
              Slut cirka 13:30
            </p>

            <button
              type="button"
              id="calendarButton"
              style="
                width:100%;
                border:0;
                border-radius:14px;
                padding:14px;
                background:#ad4772;
                color:white;
                font-weight:700;
                font-size:15px;
                cursor:pointer;
              "
            >
              📅 Lägg till i kalender
            </button>

          </div>

        </div>
      `;

      document
        .getElementById("calendarButton")
        .addEventListener(
          "click",
          createCalendarFile
        );

    }


    // ------------------------------------------------
    // NEJ
    // ------------------------------------------------

    else {

      form.innerHTML = `
        <div style="
          text-align:center;
          padding:20px 4px;
        ">

          <h2>💕 Tack för beskedet!</h2>

          <p>
            Vad tråkigt att
            <strong>${escapeHtml(data.childName)}</strong>
            inte kan komma den här gången.
          </p>

          <p>
            Vi hoppas att hon får möjlighet att vara
            med och fira en annan gång! 🌸
          </p>

        </div>
      `;

    }

  }

  catch (error) {

    button.disabled = false;

    status.textContent =
      "Något gick fel. Försök igen.";

  }

});


// --------------------------------------------------
// Säker visning av barnets namn i NEJ-svaret
// --------------------------------------------------

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
