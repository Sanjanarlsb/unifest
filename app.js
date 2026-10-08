/* =========================================================
   UNIFEST – app.js   (simple version, easy to explain)

   HOW THIS FILE IS ORGANISED (top to bottom):
     1. Settings & data       -> where events/registrations live
     2. Helper functions      -> small tools used everywhere
     3. Navigation            -> switching between pages
     4. Events page           -> showing event cards
     5. Registration          -> the form + saving a registration
     6. My Registrations      -> student sees their tickets
     7. Announcements         -> news board
     8. Admin                 -> organizer features
     9. Start-up              -> runs when the site opens

   QUICK "WHERE DO I CHANGE...?" GUIDE
     - Change admin password        -> ADMIN_PASSWORD (section 1)
     - Change the sample events     -> getDefaultEvents() (section 1)
     - Add a new form field (e.g. "College name")
           -> add an <input> in openRegisterForm() (section 5)
           -> read it + save it in submitRegistration() (section 5)
           -> show it in showMyTickets() (section 6)
     - Change max seats rule        -> submitRegistration() (section 5)
     - Change what an event card shows -> showEvents() (section 4)
   ========================================================= */


/* =========================================================
   1. SETTINGS & DATA
   ========================================================= */

var ADMIN_PASSWORD = "admin123";

// These 3 lists hold ALL the data of the website.
var events = [];          // every event
var registrations = [];   // every student registration
var announcements = [];   // every announcement
var queries = [];         // every help desk question

var adminLoggedIn = false;

// Change this number whenever you edit getDefaultEvents() so that
// browsers which already saved the old events get the new ones.
var DATA_VERSION = "2";

// Motivating messages shown after registering.
// {name} becomes the student's first name, {event} the event title.
// To add more: just add another line in quotes, separated by a comma.
var MOTIVATION_MESSAGES = [
  "Great choice, {name}! 🌟 Every big journey starts with one brave step – and you just took it by joining {event}.",
  "You're in, {name}! 🔥 Come curious, stay confident, and give {event} everything you've got.",
  "Awesome move, {name}! 🚀 Fests are where friendships, skills and memories are made. Make {event} unforgettable!",
  "Welcome aboard, {name}! 💪 You don't have to be perfect – you just have to show up. See you at {event}!",
  "Yes, {name}! 🎉 Stepping out of your comfort zone is where growth happens. Enjoy {event} to the fullest!"
];

// Quotes shown after registering (text + author)
var QUOTES = [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Nothing will work unless you do.", author: "Maya Angelou" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" }
];

// Prize money for each competition (shown on the Announcements page).
// eventId must match an event's id. Amounts are in rupees.
// To change a prize: just edit the numbers. To add one: copy a line.
// (These are sample amounts - replace them with your real ones.)
var PRIZES = [
  { eventId: "E1",  first: 50000, second: 30000, third: 20000 },   // Hackathon
  { eventId: "E3",  first: 15000, second: 10000, third: 5000 },    // Dance Fest
  { eventId: "E4",  first: 20000, second: 12000, third: 8000 },    // Cricket
  { eventId: "E6",  first: 5000,  second: 3000,  third: 2000 },    // Tech Quiz
  { eventId: "E7",  first: 25000, second: 15000, third: 10000 },   // Battle of the Bands
  { eventId: "E8",  first: 6000,  second: 4000,  third: 2000 },    // Treasure Hunt
  { eventId: "E10", first: 15000, second: 10000, third: 5000 },    // Football
  { eventId: "E11", first: 40000, second: 25000, third: 15000 },   // Startup Pitch
  { eventId: "E12", first: 4000,  second: 2500,  third: 1500 },    // Open Mic
  { eventId: "E14", first: 8000,  second: 5000,  third: 3000 },    // Photography & Reels
  { eventId: "E15", first: 30000, second: 20000, third: 10000 }    // E-Sports
];

// Sample events shown the first time the site opens.
// Dates are "today + some days" so they never look old.
function getDefaultEvents() {
  return [
    { id: "E1", title: "CodeStorm Hackathon", category: "Technical", date: daysFromNow(3), start: "09:00", end: "18:00", venue: "Main Auditorium", seats: 60, description: "Build a project in teams and win prizes. Open to all branches." },
    { id: "E2", title: "Web Development Workshop", category: "Workshop", date: daysFromNow(5), start: "10:00", end: "13:00", venue: "Lab 3, ISE Block", seats: 40, description: "Hands-on HTML, CSS and JavaScript session." },
    { id: "E3", title: "Rhythm – Dance Fest", category: "Cultural", date: daysFromNow(7), start: "16:00", end: "20:00", venue: "Open Air Theatre", seats: 150, description: "Solo and group dance performances. Come perform or cheer!" },
    { id: "E4", title: "Inter-Department Cricket", category: "Sports", date: daysFromNow(10), start: "08:00", end: "14:00", venue: "College Ground", seats: 44, description: "Knockout cricket tournament between departments." },
    { id: "E5", title: "Careers in AI & Cloud", category: "Seminar", date: daysFromNow(3), start: "14:00", end: "16:00", venue: "Seminar Hall 2", seats: 100, description: "Industry experts talk about careers and internships." },
    { id: "E6", title: "Tech Quiz Championship", category: "Technical", date: daysFromNow(12), start: "11:00", end: "13:00", venue: "Room 204", seats: 30, description: "Fast-paced multi-round tech quiz." },
    { id: "E7", title: "Battle of the Bands", category: "Cultural", date: daysFromNow(8), start: "17:00", end: "21:00", venue: "Open Air Theatre", seats: 200, description: "Live music showdown! Bands from every department fight for the crown." },
    { id: "E8", title: "Campus Treasure Hunt", category: "Sports", date: daysFromNow(6), start: "10:00", end: "13:00", venue: "Central Lawn", seats: 80, description: "Solve clues, run across campus and find the treasure before other teams." },
    { id: "E9", title: "AI & ML Bootcamp", category: "Workshop", date: daysFromNow(9), start: "09:30", end: "16:30", venue: "Lab 5, CSE Block", seats: 50, description: "A full-day beginner-friendly bootcamp: build and train your first ML model." },
    { id: "E10", title: "Football Showdown", category: "Sports", date: daysFromNow(11), start: "15:00", end: "18:00", venue: "Football Ground", seats: 60, description: "5-a-side football tournament. Bring your boots and your team spirit." },
    { id: "E11", title: "Startup Pitch Arena", category: "Technical", date: daysFromNow(13), start: "13:00", end: "17:00", venue: "Innovation Hub", seats: 40, description: "Pitch your startup idea to mentors and investors and win seed prizes." },
    { id: "E12", title: "Poetry & Open Mic Night", category: "Cultural", date: daysFromNow(4), start: "17:00", end: "19:00", venue: "Library Lawn", seats: 70, description: "Poems, stand-up, music or stories – the mic is yours." },
    { id: "E13", title: "Cybersecurity Awareness Seminar", category: "Seminar", date: daysFromNow(6), start: "14:00", end: "16:00", venue: "Seminar Hall 1", seats: 120, description: "Learn how hackers think and how to keep your data and accounts safe." },
    { id: "E14", title: "Photography & Reels Contest", category: "Cultural", date: daysFromNow(14), start: "10:00", end: "15:00", venue: "Campus-wide", seats: 100, description: "Capture the best fest moments. Best photo and best reel win exciting prizes." },
    { id: "E15", title: "E-Sports Gaming Tournament", category: "Technical", date: daysFromNow(15), start: "11:00", end: "18:00", venue: "Computer Lab 1", seats: 64, description: "Squad up for the ultimate gaming face-off. Solo and team brackets available." },
    { id: "E16", title: "Resume & Interview Prep Workshop", category: "Workshop", date: daysFromNow(2), start: "15:00", end: "17:00", venue: "Placement Cell Hall", seats: 60, description: "Build a standout resume and practise mock interviews with experts." },
    { id: "E17", title: "Grand Finale – DJ Night", category: "Cultural", date: daysFromNow(16), start: "18:00", end: "23:00", venue: "Main Ground", seats: 300, description: "The closing night of Unifest with DJ, lights and prize distribution." }
  ];
}

function getDefaultNews() {
  return [
    { id: "N1", eventId: "", title: "Welcome to Unifest! 🎉", message: "All registrations now happen online. Register, view your ticket and get updates here.", time: new Date().toLocaleString() },
    { id: "N2", eventId: "E1", title: "Hackathon: bring your laptop", message: "Carry your laptop, charger and college ID. Snacks and Wi-Fi provided.", time: new Date().toLocaleString() }
  ];
}

// Save everything into the browser's memory (localStorage)
function saveData() {
  localStorage.setItem("uf_version", DATA_VERSION);
  localStorage.setItem("uf_events", JSON.stringify(events));
  localStorage.setItem("uf_regs", JSON.stringify(registrations));
  localStorage.setItem("uf_news", JSON.stringify(announcements));
  localStorage.setItem("uf_queries", JSON.stringify(queries));
}

// Load everything from the browser's memory
function loadData() {
  var saved = localStorage.getItem("uf_events");
  var savedVersion = localStorage.getItem("uf_version");

  if (saved && savedVersion === DATA_VERSION) {
    // normal case: use what was saved
    events = JSON.parse(saved);
    registrations = JSON.parse(localStorage.getItem("uf_regs")) || [];
    announcements = JSON.parse(localStorage.getItem("uf_news")) || [];
    queries = JSON.parse(localStorage.getItem("uf_queries")) || [];
  } else if (saved) {
    // old version saved: load the new events but keep registrations & announcements
    events = getDefaultEvents();
    registrations = JSON.parse(localStorage.getItem("uf_regs")) || [];
    announcements = JSON.parse(localStorage.getItem("uf_news")) || getDefaultNews();
    queries = JSON.parse(localStorage.getItem("uf_queries")) || [];
    saveData();
  } else {
    // first time ever: use the sample data
    events = getDefaultEvents();
    registrations = [];
    announcements = getDefaultNews();
    queries = [];
    saveData();
  }
}


/* =========================================================
   2. HELPER FUNCTIONS
   ========================================================= */

// today + n days, as "YYYY-MM-DD"
function daysFromNow(n) {
  var d = new Date();
  d.setDate(d.getDate() + n);
  var month = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

// "2026-10-11" -> "Sun, 11 Oct 2026"
function formatDate(dateString) {
  var d = new Date(dateString + "T00:00:00");
  return d.toDateString();
}

// "14:30" -> "2:30 PM"
function formatTime(t) {
  var hour = Number(t.split(":")[0]);
  var min = t.split(":")[1];
  var ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) { hour = 12; }
  return hour + ":" + min + " " + ampm;
}

// Makes user-typed text safe to show on the page
function safe(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Find one event by its id
function findEvent(eventId) {
  for (var i = 0; i < events.length; i++) {
    if (events[i].id === eventId) { return events[i]; }
  }
  return null;
}

// How many students registered for this event?
function countRegistrations(eventId) {
  var count = 0;
  for (var i = 0; i < registrations.length; i++) {
    if (registrations[i].eventId === eventId) { count++; }
  }
  return count;
}

// Picks one random item from a list
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Small message at the bottom of the screen
function showToast(message) {
  var toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(function () { toast.classList.add("hidden"); }, 2500);
}

// Pop-up window open / close
function openModal(html) {
  document.getElementById("modalBody").innerHTML = html;
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal(event) {
  // if called from clicking the dark area, only close when the dark area itself was clicked
  if (event && event.target.id !== "modal") { return; }
  document.getElementById("modal").classList.add("hidden");
}


/* =========================================================
   3. NAVIGATION
   ========================================================= */

// Landing page -> main website
function enterSite() {
  var landing = document.getElementById("landing");
  landing.classList.add("leaving");
  setTimeout(function () {
    landing.classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    window.scrollTo(0, 0);
  }, 500);
}

// Switch between Events / My Registrations / Announcements / Admin
function showPage(name) {
  var pages = document.querySelectorAll(".page");
  for (var i = 0; i < pages.length; i++) { pages[i].classList.remove("active"); }
  document.getElementById("page-" + name).classList.add("active");

  var buttons = document.querySelectorAll(".nav-btn");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.toggle("active", buttons[j].dataset.page === name);
  }

  if (name === "events") { showEvents(); }
  if (name === "news") { showAnnouncements(); }
  if (name === "help") { showHelp(); }
  if (name === "admin") { showAdmin(); }
  if (name === "my") {
    var lastEmail = localStorage.getItem("uf_email");
    if (lastEmail) {
      document.getElementById("lookupEmail").value = lastEmail;
      showMyTickets(lastEmail);
    }
  }
  window.scrollTo(0, 0);
}


/* =========================================================
   4. EVENTS PAGE
   ========================================================= */

function showEvents() {
  // --- stats at the top ---
  document.getElementById("stats").innerHTML =
    '<div class="stat"><b>' + events.length + '</b><span>🎪 Events</span></div>' +
    '<div class="stat"><b>' + registrations.length + '</b><span>🎟️ Registrations</span></div>';

  // --- read the search box and category dropdown ---
  var search = document.getElementById("searchBox").value.toLowerCase();
  var category = document.getElementById("categoryBox").value;

  var html = "";
  var shown = 0;

  for (var i = 0; i < events.length; i++) {
    var e = events[i];

    // skip events that don't match the filters
    var text = (e.title + " " + e.venue + " " + e.description).toLowerCase();
    if (category !== "all" && e.category !== category) { continue; }
    if (search !== "" && text.indexOf(search) === -1) { continue; }

    shown++;

    // seats maths
    var taken = countRegistrations(e.id);
    var left = e.seats - taken;
    if (left < 0) { left = 0; }
    var percent = (taken / e.seats) * 100;

    // bar colour: green -> orange (almost full) -> red (full)
    var barClass = "";
    if (percent >= 100) { barClass = "full"; }
    else if (percent >= 75) { barClass = "almost"; }

    // button text
    var buttonText = "🎟️ Register now";
    var disabled = "";
    if (left === 0) { buttonText = "Fully booked"; disabled = "disabled"; }

    html +=
      '<div class="event-card">' +
        '<span class="tag ' + e.category + '">' + e.category + '</span>' +
        '<h3>' + safe(e.title) + '</h3>' +
        '<div class="meta">📅 ' + formatDate(e.date) + '<br>' +
          '⏰ ' + formatTime(e.start) + ' – ' + formatTime(e.end) + '<br>' +
          '📍 ' + safe(e.venue) + '</div>' +
        '<p class="desc">' + safe(e.description) + '</p>' +
        '<div class="bar ' + barClass + '"><div style="width:' + percent + '%"></div></div>' +
        '<div class="seats"><span>' + taken + ' registered</span><span>' + left + ' seats left</span></div>' +
        '<button class="btn" ' + disabled + ' onclick="openRegisterForm(\'' + e.id + '\')">' + buttonText + '</button>' +
      '</div>';
  }

  if (shown === 0) { html = '<div class="empty">😕 No events found.</div>'; }
  document.getElementById("eventList").innerHTML = html;
}


/* =========================================================
   5. REGISTRATION
   ========================================================= */

// Opens the pop-up with the registration form
function openRegisterForm(eventId) {
  var e = findEvent(eventId);
  var savedEmail = localStorage.getItem("uf_email") || "";

  openModal(
    '<h3>🎟️ Register for ' + safe(e.title) + '</h3>' +
    '<p class="summary">📅 ' + formatDate(e.date) + ' • ⏰ ' + formatTime(e.start) + ' – ' + formatTime(e.end) + ' • 📍 ' + safe(e.venue) + '</p>' +
    '<div id="formError"></div>' +
    '<form onsubmit="submitRegistration(\'' + eventId + '\'); return false;">' +
      '<label>Full name</label><input type="text" id="regName" placeholder="Your name" />' +
      '<label>Email</label><input type="email" id="regEmail" value="' + safe(savedEmail) + '" placeholder="you@example.com" />' +
      '<div class="row">' +
        '<div><label>USN / Roll no.</label><input type="text" id="regUsn" placeholder="e.g. R24XXXXX" /></div>' +
        '<div><label>Phone</label><input type="tel" id="regPhone" maxlength="10" placeholder="10 digits" /></div>' +
      '</div>' +
      '<div class="row">' +
        '<div><label>Department</label><select id="regDept"><option>ISE</option><option>CSE</option><option>AI &amp; ML</option><option>ECE</option><option>EEE</option><option>Mechanical</option><option>Civil</option><option>Other</option></select></div>' +
        '<div><label>Year</label><select id="regYear"><option>1st</option><option>2nd</option><option>3rd</option><option>4th</option></select></div>' +
      '</div>' +
      '<button type="submit" class="btn full">✅ Confirm registration</button>' +
    '</form>'
  );
}

function showFormError(message) {
  document.getElementById("formError").innerHTML = '<div class="error">⚠️ ' + message + '</div>';
}

// Runs when the student clicks "Confirm registration"
function submitRegistration(eventId) {
  var e = findEvent(eventId);

  // 1. read what the student typed
  var name = document.getElementById("regName").value.trim();
  var email = document.getElementById("regEmail").value.trim().toLowerCase();
  var usn = document.getElementById("regUsn").value.trim().toUpperCase();
  var phone = document.getElementById("regPhone").value.trim();
  var dept = document.getElementById("regDept").value;
  var year = document.getElementById("regYear").value;

  // 2. check the details are valid
  if (name === "") { showFormError("Please enter your name."); return; }
  if (email.indexOf("@") === -1 || email.indexOf(".") === -1) { showFormError("Please enter a valid email."); return; }
  if (usn === "") { showFormError("Please enter your USN / roll number."); return; }
  if (phone.length !== 10 || isNaN(phone)) { showFormError("Phone number must be exactly 10 digits."); return; }

  // 3. check the rules
  for (var i = 0; i < registrations.length; i++) {
    var r = registrations[i];

    // RULE A: same email can't register twice for the same event
    if (r.eventId === eventId && r.email === email) {
      showFormError("You have already registered for this event.");
      return;
    }

    // RULE B: schedule clash -> same email, same date, overlapping time
    if (r.email === email) {
      var other = findEvent(r.eventId);
      if (other && other.date === e.date && other.start < e.end && e.start < other.end) {
        showFormError("Clash! You are already registered for '" + safe(other.title) + "' at that time.");
        return;
      }
    }
  }

  // RULE C: event must not be full
  if (countRegistrations(eventId) >= e.seats) {
    showFormError("Sorry, this event is full.");
    return;
  }

  // 4. everything is fine -> save the registration
  var ticketId = "UF-" + Math.floor(1000 + Math.random() * 9000);
  registrations.push({
    id: ticketId,
    eventId: eventId,
    name: name,
    email: email,
    usn: usn,
    phone: phone,
    dept: dept,
    year: year
  });
  saveData();
  localStorage.setItem("uf_email", email);   // remember email for "My Registrations"

  // 5. show success message with a motivating line + a quote
  var firstName = name.split(" ")[0];
  var motivation = pickRandom(MOTIVATION_MESSAGES)
    .replace("{name}", safe(firstName))
    .replace("{event}", safe(e.title));
  var quote = pickRandom(QUOTES);

  openModal(
    '<div class="success">' +
      '<div class="big">🎉</div>' +
      '<h3>You are registered!</h3>' +
      '<p class="summary">' + safe(e.title) + '<br>' + formatDate(e.date) + ' • ' + formatTime(e.start) + '</p>' +
      '<p class="motivation">' + motivation + '</p>' +
      '<div class="quote-box">💬 "' + quote.text + '"<span>— ' + quote.author + '</span></div>' +
      '<p>Your ticket ID</p><div class="ticket-id">' + ticketId + '</div><br><br>' +
      '<button class="btn full" onclick="closeModal(); showPage(\'my\')">🧾 View my registrations</button>' +
    '</div>'
  );
  showEvents();
}


/* =========================================================
   6. MY REGISTRATIONS
   ========================================================= */

// Runs when the student clicks "Show my tickets"
function lookupTickets() {
  var email = document.getElementById("lookupEmail").value.trim().toLowerCase();
  localStorage.setItem("uf_email", email);
  showMyTickets(email);
}

function showMyTickets(email) {
  var html = "";
  var found = 0;

  for (var i = 0; i < registrations.length; i++) {
    var r = registrations[i];
    if (r.email !== email) { continue; }   // not this student's registration

    var e = findEvent(r.eventId);
    if (!e) { continue; }
    found++;

    // find announcements for this event
    var updates = "";
    for (var j = 0; j < announcements.length; j++) {
      if (announcements[j].eventId === e.id) {
        updates += "• <b>" + safe(announcements[j].title) + "</b> – " + safe(announcements[j].message) + "<br>";
      }
    }
    if (updates !== "") { updates = '<div class="update-box">📢 <b>Updates for this event</b><br>' + updates + '</div>'; }

    html +=
      '<div class="ticket">' +
        '<div>' +
          '<span class="ticket-id">' + r.id + '</span>' +
          '<h3>' + safe(e.title) + '</h3>' +
          '<div class="meta">📅 ' + formatDate(e.date) + ' • ⏰ ' + formatTime(e.start) + ' – ' + formatTime(e.end) + '<br>' +
            '📍 ' + safe(e.venue) + '<br>' +
            '👤 ' + safe(r.name) + ' • ' + safe(r.usn) + ' • ' + safe(r.dept) + ' (' + r.year + ' year)<br>' +
            '📞 ' + safe(r.phone) + ' • ✉️ ' + safe(r.email) + '</div>' +
          updates +
        '</div>' +
        '<button class="cancel-btn" onclick="cancelRegistration(\'' + r.id + '\')">❌ Cancel</button>' +
      '</div>';
  }

  if (found === 0) {
    html = '<div class="empty">😕 No registrations found for <b>' + safe(email) + '</b>.<br>Go to Events and register for something!</div>';
  }
  document.getElementById("myList").innerHTML = html;
}

function cancelRegistration(ticketId) {
  if (!confirm("Cancel this registration? Your seat will be released.")) { return; }

  var remaining = [];
  for (var i = 0; i < registrations.length; i++) {
    if (registrations[i].id !== ticketId) { remaining.push(registrations[i]); }
  }
  registrations = remaining;
  saveData();

  showMyTickets(document.getElementById("lookupEmail").value.trim().toLowerCase());
  showToast("Registration cancelled");
}


/* =========================================================
   7. ANNOUNCEMENTS
   ========================================================= */

// 12000 -> "₹12,000"
function formatMoney(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Draws the prize money cards at the top of the Announcements page
function showPrizes() {
  var total = 0;
  var cards = "";

  for (var i = 0; i < PRIZES.length; i++) {
    var p = PRIZES[i];
    var e = findEvent(p.eventId);
    if (!e) { continue; }          // skip if that event was deleted

    total += p.first + p.second + p.third;

    cards +=
      '<div class="prize-card">' +
        '<span class="tag ' + e.category + '">' + e.category + '</span>' +
        '<h4>' + safe(e.title) + '</h4>' +
        '<div class="medals">' +
          '<div>🥇<b>' + formatMoney(p.first) + '</b><span>Winner</span></div>' +
          '<div>🥈<b>' + formatMoney(p.second) + '</b><span>Runner-up</span></div>' +
          '<div>🥉<b>' + formatMoney(p.third) + '</b><span>Second runner-up</span></div>' +
        '</div>' +
      '</div>';
  }

  if (cards === "") {
    document.getElementById("prizeList").innerHTML = "";
    return;
  }

  document.getElementById("prizeList").innerHTML =
    '<div class="prize-banner">🏆 Total prize pool <b>' + formatMoney(total) + '</b> 💰</div>' +
    '<div class="prize-grid">' + cards + '</div>';
}

function showAnnouncements() {
  showPrizes();
  var html = "";

  // newest first -> loop from the end of the list
  for (var i = announcements.length - 1; i >= 0; i--) {
    var a = announcements[i];
    var e = findEvent(a.eventId);
    var forWho = e ? "Event: " + safe(e.title) : "General";

    html +=
      '<div class="news-card">' +
        '<h3>' + safe(a.title) + '</h3>' +
        '<p>' + safe(a.message) + '</p>' +
        '<small>' + forWho + ' • ' + a.time + '</small>' +
      '</div>';
  }

  if (html === "") { html = '<div class="empty">No announcements yet.</div>'; }
  document.getElementById("newsList").innerHTML = html;
}


/* =========================================================
   7b. HELP DESK  (students ask doubts, organizers reply)
   ========================================================= */

// Frequently asked questions. Edit, remove or add lines freely.
var FAQS = [
  { q: "How do I register for an event?", a: "Go to Events, click 'Register now' on the event you like, fill in your details and confirm. You get a ticket ID instantly." },
  { q: "Where can I see my registration?", a: "Open My Registrations and enter the email you used while registering. All your tickets appear there." },
  { q: "Can I register for two events at the same time?", a: "No. Unifest blocks clashing events so you never double-book yourself." },
  { q: "How do I cancel my registration?", a: "Open My Registrations and click Cancel on the ticket. Your seat is released for other students." },
  { q: "How will I get updates about an event?", a: "Check the Announcements page. Updates for events you registered for also appear on your ticket." },
  { q: "Where can I find the prize details?", a: "The prize money for every competition is listed on the Announcements page." },
  { q: "What if an event is fully booked?", a: "The Register button is disabled when all seats are taken. If someone cancels a seat opens up, so keep checking!" }
];

// Draws the Help Desk page
function showHelp() {
  // FAQ list (click a question to open the answer)
  var html = "";
  for (var i = 0; i < FAQS.length; i++) {
    html += '<details class="faq"><summary>' + safe(FAQS[i].q) + '</summary><p>' + safe(FAQS[i].a) + '</p></details>';
  }
  document.getElementById("faqList").innerHTML = html;

  // if we remember the student's email, fill it in and show their questions
  var savedEmail = localStorage.getItem("uf_email");
  if (savedEmail) {
    if (document.getElementById("qEmail").value === "") { document.getElementById("qEmail").value = savedEmail; }
    document.getElementById("qLookupEmail").value = savedEmail;
    showMyQueries(savedEmail);
  } else {
    document.getElementById("myQueries").innerHTML = "";
  }
}

// Runs when the student clicks "Send question"
function askQuestion() {
  var email = document.getElementById("qEmail").value.trim().toLowerCase();

  queries.push({
    id: "HD-" + String(Date.now()).slice(-6),
    name: document.getElementById("qName").value.trim(),
    email: email,
    topic: document.getElementById("qTopic").value,
    question: document.getElementById("qText").value.trim(),
    answer: "",                         // empty until an organizer replies
    time: new Date().toLocaleString()
  });
  saveData();
  localStorage.setItem("uf_email", email);

  document.getElementById("qText").value = "";
  document.getElementById("qLookupEmail").value = email;
  showMyQueries(email);
  showToast("Question sent! We'll reply soon 🙋");
}

// "Check replies" button
function checkMyQueries() {
  var email = document.getElementById("qLookupEmail").value.trim().toLowerCase();
  localStorage.setItem("uf_email", email);
  showMyQueries(email);
}

// Shows all questions asked by this email, newest first
function showMyQueries(email) {
  var html = "";

  for (var i = queries.length - 1; i >= 0; i--) {
    var q = queries[i];
    if (q.email !== email) { continue; }

    var status;
    if (q.answer === "") {
      status = '<div class="pending-box">⏳ Waiting for a reply from the organizers...</div>';
    } else {
      status = '<div class="answer-box">✅ <b>Answer:</b> ' + safe(q.answer) + '</div>';
    }

    html +=
      '<div class="query-card">' +
        '<span class="ticket-id">' + q.id + '</span> <span class="tag">' + safe(q.topic) + '</span>' +
        '<p class="question">❓ ' + safe(q.question) + '</p>' +
        '<small>' + q.time + '</small>' +
        status +
      '</div>';
  }

  if (html === "") {
    html = '<div class="empty">No questions found for <b>' + safe(email) + '</b> yet.</div>';
  }
  document.getElementById("myQueries").innerHTML = html;
}

// ----- organizer side (shown inside the Admin dashboard) -----

function showAdminQueries() {
  var pending = 0;
  var cards = "";

  for (var i = queries.length - 1; i >= 0; i--) {
    var q = queries[i];
    if (q.answer === "") { pending++; }

    cards +=
      '<div class="query-card">' +
        '<span class="ticket-id">' + q.id + '</span> <span class="tag">' + safe(q.topic) + '</span>' +
        '<p class="question">❓ ' + safe(q.question) + '</p>' +
        '<small>👤 ' + safe(q.name) + ' • ✉️ ' + safe(q.email) + ' • ' + q.time + '</small>' +
        '<textarea id="reply-' + q.id + '" rows="2" placeholder="Type your reply...">' + safe(q.answer) + '</textarea>' +
        '<button class="btn" onclick="replyToQuery(\'' + q.id + '\')">' + (q.answer === "" ? "📤 Send reply" : "✏️ Update reply") + '</button>' +
      '</div>';
  }

  if (cards === "") { cards = '<div class="empty">No help desk questions yet.</div>'; }

  document.getElementById("adminQueries").innerHTML =
    '<h3 class="page-title small">🙋 Help desk questions (' + pending + ' pending)</h3>' + cards;
}

function replyToQuery(queryId) {
  var reply = document.getElementById("reply-" + queryId).value.trim();
  if (reply === "") { showToast("Type a reply first"); return; }

  for (var i = 0; i < queries.length; i++) {
    if (queries[i].id === queryId) { queries[i].answer = reply; }
  }
  saveData();
  showAdminQueries();
  showToast("Reply sent ✅");
}


/* =========================================================
   8. ADMIN (organizer)
   ========================================================= */

function adminLogin() {
  if (document.getElementById("adminPass").value === ADMIN_PASSWORD) {
    adminLoggedIn = true;
    document.getElementById("adminPass").value = "";
    showAdmin();
    showToast("Welcome, organizer! 🛠️");
  } else {
    showToast("Wrong password ❌");
  }
}

function logout() {
  adminLoggedIn = false;
  showAdmin();
}

// Draws the admin page (login box OR dashboard)
function showAdmin() {
  document.getElementById("adminLogin").classList.toggle("hidden", adminLoggedIn);
  document.getElementById("adminPanel").classList.toggle("hidden", !adminLoggedIn);
  if (!adminLoggedIn) { return; }

  // dropdown in the "send announcement" form
  var options = '<option value="">General (everyone)</option>';
  for (var i = 0; i < events.length; i++) {
    options += '<option value="' + events[i].id + '">' + safe(events[i].title) + '</option>';
  }
  document.getElementById("annEvent").innerHTML = options;

  // list of events with registrant tables
  var html = "";
  for (var k = 0; k < events.length; k++) {
    var e = events[k];
    var rows = "";
    var count = 0;

    for (var j = 0; j < registrations.length; j++) {
      var r = registrations[j];
      if (r.eventId === e.id) {
        count++;
        rows += '<tr><td>' + r.id + '</td><td>' + safe(r.name) + '</td><td>' + safe(r.usn) + '</td><td>' + safe(r.dept) + '</td><td>' + safe(r.email) + '</td><td>' + safe(r.phone) + '</td></tr>';
      }
    }

    var table = count === 0
      ? '<p class="meta">No registrations yet.</p>'
      : '<div class="table-wrap"><table><tr><th>Ticket</th><th>Name</th><th>USN</th><th>Dept</th><th>Email</th><th>Phone</th></tr>' + rows + '</table></div>';

    html +=
      '<div class="box">' +
        '<div class="admin-event-head">' +
          '<div><h3>' + safe(e.title) + '</h3><span class="meta">' + formatDate(e.date) + ' • ' + count + '/' + e.seats + ' registered</span></div>' +
          '<button class="cancel-btn" onclick="deleteEvent(\'' + e.id + '\')">🗑️ Delete event</button>' +
        '</div>' +
        table +
      '</div>';
  }
  document.getElementById("adminEvents").innerHTML = html;

  showAdminQueries();   // help desk questions
}

function addEvent() {
  var start = document.getElementById("newStart").value;
  var end = document.getElementById("newEnd").value;
  if (end <= start) { showToast("End time must be after start time"); return; }

  events.push({
    id: "E" + Date.now(),
    title: document.getElementById("newTitle").value.trim(),
    category: document.getElementById("newCategory").value,
    date: document.getElementById("newDate").value,
    start: start,
    end: end,
    venue: document.getElementById("newVenue").value.trim(),
    seats: Number(document.getElementById("newSeats").value),
    description: document.getElementById("newDesc").value.trim()
  });
  saveData();

  // clear the form
  document.getElementById("newTitle").value = "";
  document.getElementById("newVenue").value = "";
  document.getElementById("newDesc").value = "";

  showAdmin();
  showToast("Event published 🎉");
}

function deleteEvent(eventId) {
  if (!confirm("Delete this event and all its registrations?")) { return; }

  var keepEvents = [], keepRegs = [], keepNews = [];
  for (var i = 0; i < events.length; i++) { if (events[i].id !== eventId) { keepEvents.push(events[i]); } }
  for (var j = 0; j < registrations.length; j++) { if (registrations[j].eventId !== eventId) { keepRegs.push(registrations[j]); } }
  for (var k = 0; k < announcements.length; k++) { if (announcements[k].eventId !== eventId) { keepNews.push(announcements[k]); } }

  events = keepEvents;
  registrations = keepRegs;
  announcements = keepNews;
  saveData();
  showAdmin();
  showToast("Event deleted");
}

function postAnnouncement() {
  announcements.push({
    id: "N" + Date.now(),
    eventId: document.getElementById("annEvent").value,
    title: document.getElementById("annTitle").value.trim(),
    message: document.getElementById("annMessage").value.trim(),
    time: new Date().toLocaleString()
  });
  saveData();

  document.getElementById("annTitle").value = "";
  document.getElementById("annMessage").value = "";
  showToast("Announcement posted 📢");
}

function resetData() {
  if (!confirm("Reset everything back to the demo data?")) { return; }
  localStorage.clear();
  loadData();
  showAdmin();
  showToast("Demo data restored");
}


/* =========================================================
   9. START-UP  (runs once when the page opens)
   ========================================================= */
loadData();
showEvents();