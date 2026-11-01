// ===== MODAL CONTROL =====

function openLogin() {
  document.getElementById("signupModal").style.display = "none"; // 🔥 ADD THIS
  document.getElementById("loginModal").style.display = "flex";
}

function openSignup() {
  document.getElementById("loginModal").style.display = "none"; // 🔥 ADD THIS
  document.getElementById("signupModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("signupModal").style.display = "none";
}

// Close when clicking outside
window.onclick = function (e) {
  const login = document.getElementById("loginModal");
  const signup = document.getElementById("signupModal");

  if (e.target === login) login.style.display = "none";
  if (e.target === signup) signup.style.display = "none";
};

// ===== LOGIN =====

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.status === 200) {
      // ✅ store name + email
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          email: email,
          name: data.name,
        }),
      );

      alert(data.message);
      closeModal();
      updateNavbar();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Server error");
  }
}

// ===== SIGNUP =====

async function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const res = await fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.status === 200) {
      // ✅ store name
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          email: email,
          name: name,
        }),
      );

      alert(data.message);
      closeModal();
      updateNavbar();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Server error");
  }
}

// ===== NAVBAR LOGIN STATE =====

function updateNavbar() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const nav = document.querySelector(".nav-links");

  if (!nav) return;

  if (user) {
    const initials = user.name.charAt(0).toUpperCase();

    nav.innerHTML = `
      <a href="homepage.html">Home</a>
      <a href="packages.html">Packages</a>
      <a href="booking.html">Booking</a>
      <a href="gallery.html">Gallery</a>

      <div class="user-menu">
        <div class="user-trigger" onclick="toggleMenu()">
          <div class="avatar">${initials}</div>
          <span>${user.name}</span>
        </div>

        <div id="dropdown" class="dropdown">
          <div class="dropdown-item" onclick="viewBookings()">
            Your Bookings
          </div>

          <div class="dropdown-item logout" onclick="logout()">
            Logout
          </div>
        </div>
      </div>
    `;
  }
}

// ===== DROPDOWN =====

function toggleMenu() {
  const menu = document.getElementById("dropdown");
  if (!menu) return;

  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// ===== LOGOUT =====

function logout() {
  sessionStorage.removeItem("user");
  location.reload();
}

// ===== VIEW BOOKINGS =====

async function viewBookings() {
  // 🔥 Remove existing popup (prevents duplication)
  document.querySelector(".booking-popup")?.remove();

  const user = JSON.parse(sessionStorage.getItem("user"));

  // 🔥 Login protection
  if (!user) {
    alert("Please login first");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/bookings");
    const data = await res.json();

    // 🔥 Filter only current user's bookings
    const userBookings = data.filter((b) => b.userName === user.name);

    let html = `
      <div class="booking-popup">
        <div class="booking-box">
          <h2>Your Bookings</h2>
          <div class="booking-list">
    `;

    // 🔥 No bookings case
    if (userBookings.length === 0) {
      html += `<p>No bookings found</p>`;
    } else {
      userBookings.forEach((b) => {
        // 🔥 Skip broken old data
        if (!b.packageName) return;

        html += `
          <div class="booking-card">
            <h4>${b.packageName}</h4>
            <p>${b.people} people</p>
            <p>${b.travelDate}</p>
            <p style="color:${
              b.payment?.status === "confirmed" ? "green" : "red"
            }">
              ● ${b.payment?.status || "unknown"}
            </p>
          </div>
        `;
      });
    }

    html += `
          </div>
          <button onclick="closeBookingPopup()">Close</button>
        </div>
      </div>
    `;

    // 🔥 Insert popup
    document.body.insertAdjacentHTML("beforeend", html);
  } catch (err) {
    console.error(err);
    alert("Error loading bookings");
  }
}

function closeBookingPopup() {
  document.querySelector(".booking-popup")?.remove();
}

// apply on page load
document.addEventListener("DOMContentLoaded", updateNavbar);
