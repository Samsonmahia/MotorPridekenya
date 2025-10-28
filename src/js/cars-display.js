document.addEventListener("DOMContentLoaded", async () => {
  const carsContainer = document.getElementById("carsContainer");
  const loadingSpinner = document.querySelector(".loading-spinner");

  try {
    const res = await fetch("/data/cars-index.json");
    if (!res.ok) throw new Error("Failed to load cars index");
    const cars = await res.json();

    loadingSpinner.style.display = "none";

    if (!cars.length) {
      carsContainer.innerHTML = "<p>No cars available at the moment.</p>";
      return;
    }

    cars.forEach(car => {
      const carCard = document.createElement("div");
      carCard.classList.add("car-card");
      carCard.innerHTML = `
        <div class="car-image">
          <img src="${car.images?.[0] || 'https://via.placeholder.com/400x250'}" alt="${car.model}">
          <span class="status ${car.status.toLowerCase()}">${car.status}</span>
        </div>
        <div class="car-info">
          <h3>${car.brand} ${car.model}</h3>
          <p><strong>Year:</strong> ${car.year}</p>
          <p><strong>Fuel:</strong> ${car.fuel}</p>
          <p><strong>Transmission:</strong> ${car.transmission}</p>
          <p><strong>Price:</strong> ${car.price}</p>
          <button class="reserve-btn" onclick="reserveCar('${car.brand} ${car.model}', '${car.whatsapp || '254723098206'}')">Reserve via WhatsApp</button>
        </div>
      `;
      carsContainer.appendChild(carCard);
    });
  } catch (err) {
    console.error(err);
    loadingSpinner.innerHTML = `<p style="color:red;">Error loading cars. Try again later.</p>`;
  }
});

function reserveCar(carName, whatsappNumber) {
  const message = encodeURIComponent(`Hi, I'm interested in reserving the ${carName}. Is it still available?`);
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}
