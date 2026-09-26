/* =========================================================
   DOM ELEMENTS
========================================================= */

const opening = document.getElementById("opening");
const openBtn = document.getElementById("openInvitation");

const site = document.getElementById("site");

const audio = document.getElementById("weddingAudio");

const bottomMusic = document.getElementById("bottomMusic");
const bottomMusicButton = document.getElementById("bottomMusicButton");

const countdownSection = document.getElementById("countdownSection");

const rsvpForm = document.getElementById("rsvpForm");


/* =========================================================
   OPEN INVITATION
========================================================= */

let invitationOpened = false;

openBtn.addEventListener("click", async () => {

  if (invitationOpened) {
    return;
  }

  invitationOpened = true;


  /*
   * Start the opening animation.
   */

  opening.classList.add("is-hidden");


  /*
   * Make the main invitation accessible.
   */

  site.setAttribute("aria-hidden", "false");


  /*
   * Try to start the wedding music.
   *
   * Because this happens directly after a user click,
   * mobile browsers are much more likely to allow playback.
   */

  try {

    await audio.play();

    setMusicState(true);

  } catch (error) {

    /*
     * Some browsers may still block audio.
     * The bottom music button remains available.
     */

    setMusicState(false);

  }

});


/* =========================================================
   MUSIC
========================================================= */

function setMusicState(isPlaying) {

  if (!bottomMusic || !bottomMusicButton) {
    return;
  }


  if (isPlaying) {

    bottomMusic.classList.add("is-playing");

    bottomMusicButton.setAttribute(
      "aria-pressed",
      "true"
    );

    bottomMusicButton.setAttribute(
      "aria-label",
      "إيقاف الموسيقى"
    );

  } else {

    bottomMusic.classList.remove("is-playing");

    bottomMusicButton.setAttribute(
      "aria-pressed",
      "false"
    );

    bottomMusicButton.setAttribute(
      "aria-label",
      "تشغيل الموسيقى"
    );

  }

}


/* =========================================================
   MUSIC BUTTON
========================================================= */

bottomMusicButton.addEventListener("click", async () => {

  if (audio.paused) {

    try {

      await audio.play();

      setMusicState(true);

    } catch (error) {

      setMusicState(false);

    }

  } else {

    audio.pause();

    setMusicState(false);

  }

});


/* =========================================================
   AUDIO EVENTS
========================================================= */

audio.addEventListener("play", () => {

  setMusicState(true);

});


audio.addEventListener("pause", () => {

  setMusicState(false);

});


audio.addEventListener("ended", () => {

  setMusicState(false);

});


/* =========================================================
   COUNTDOWN
========================================================= */

/*
 * Wedding date:
 *
 * 1 October 2026
 *
 * 20:00
 *
 * UTC +03:00
 */

const weddingDate =
  new Date(
    "2026-10-01T20:00:00+03:00"
  ).getTime();


const daysElement =
  document.getElementById("days");

const hoursElement =
  document.getElementById("hours");

const minutesElement =
  document.getElementById("minutes");

const secondsElement =
  document.getElementById("seconds");


function updateCountdown() {

  const now = Date.now();

  let difference =
    weddingDate - now;


  /*
   * Wedding date has passed.
   */

  if (difference <= 0) {

    difference = 0;

  }


  const days =
    Math.floor(
      difference / 86400000
    );


  difference %= 86400000;


  const hours =
    Math.floor(
      difference / 3600000
    );


  difference %= 3600000;


  const minutes =
    Math.floor(
      difference / 60000
    );


  const seconds =
    Math.floor(
      (difference % 60000) / 1000
    );


  if (daysElement) {

    daysElement.textContent =
      String(days).padStart(2, "0");

  }


  if (hoursElement) {

    hoursElement.textContent =
      String(hours).padStart(2, "0");

  }


  if (minutesElement) {

    minutesElement.textContent =
      String(minutes).padStart(2, "0");

  }


  if (secondsElement) {

    secondsElement.textContent =
      String(seconds).padStart(2, "0");

  }

}


/*
 * Run immediately.
 */

updateCountdown();


/*
 * Update every second.
 */

const countdownTimer =
  setInterval(
    updateCountdown,
    1000
  );


/* =========================================================
   RSVP
========================================================= */

if (rsvpForm) {

  rsvpForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const name =
        document
          .getElementById("guestName")
          .value
          .trim();


      const attendance =
        document
          .getElementById("attendance")
          .value;


      const message =
        document.getElementById(
          "formMessage"
        );


      if (!name || !attendance) {

        message.textContent =
          "من فضلك أكمل البيانات أولًا.";

        return;

      }


      if (attendance === "yes") {

        message.textContent =
          `شكرًا ${name} 🤍 تم تسجيل رغبتك في الحضور.`;

      } else {

        message.textContent =
          `شكرًا ${name}، نتمنى أن نلتقي في مناسبة قادمة.`;

      }


      /*
       * Clear the form after successful submission.
       */

      rsvpForm.reset();

    }
  );

}


/* =========================================================
   SCROLL TO TOP WHEN OPENING
========================================================= */

window.addEventListener(
  "load",
  () => {

    window.scrollTo(
      0,
      0
    );

  }
);


/* =========================================================
   PREVENT BACKGROUND SCROLL WHILE COVER IS OPEN
========================================================= */

function updateOpeningScrollLock() {

  if (!opening) {
    return;
  }


  if (!opening.classList.contains("is-hidden")) {

    document.body.style.overflow = "hidden";

  } else {

    document.body.style.overflow = "";

  }

}


updateOpeningScrollLock();


/*
 * Observe opening state changes.
 */

const openingObserver =
  new MutationObserver(() => {

    updateOpeningScrollLock();

  });


openingObserver.observe(
  opening,
  {
    attributes: true,
    attributeFilter: ["class"]
  }
);