async function loadPackages() {
  try {
    const res = await fetch("http://localhost:3000/packages");
    const data = await res.json();

    const container = document.getElementById("packagesContainer");
    container.innerHTML = "";

    data.forEach((pkg) => {
      const div = document.createElement("div");
      div.className = "package-card";

      div.innerHTML = `
        <div class="card-img">
          <img src="${
            pkg.images && pkg.images.length
              ? pkg.images[0]
              : "https://via.placeholder.com/300"
          }" alt="${pkg.title}">
        </div>

        <div class="card-content">
          <h3>${pkg.title}</h3>

          <div class="top-row">
            <span class="country">${pkg.country}</span>
            <span class="price">₹${pkg.price}</span>
          </div>

          <p class="duration">${pkg.duration.nights}N / ${pkg.duration.days}D</p>

          <p class="locations">${pkg.locations.join(", ")}</p>

          <div class="meta">
            <span>${pkg.rating}</span>
            <span>${pkg.availableSlots} slots</span>
          </div>

          <details>
            <summary>Itinerary</summary>
            <ul>
              ${pkg.itinerary
                .map((item) => `<li>Day ${item.day}: ${item.activity}</li>`)
                .join("")}
            </ul>
          </details>

          <details>
            <summary>Inclusions</summary>
            <ul>
              ${pkg.inclusions.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </details>

          <button onclick="handleBooking('${pkg._id}')">
            Book Now
          </button>
        </div>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading packages:", err);
  }
}

function handleBooking(id) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    openLogin();
    return;
  }

  // ✅ pass packageId via URL (BEST METHOD)
  window.location.href = `booking.html?packageId=${id}`;
}

// Run
loadPackages();
