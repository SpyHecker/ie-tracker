const profileInitial = document.getElementById("profileInitial");
const profileName = document.getElementById("profileName");
const welcomeName = document.getElementById("welcomeName");
const logoutBtn = document.getElementById("logoutBtn");

function firstInitial(value) {
  if (!value) return "G";
  return value.trim().charAt(0).toUpperCase();
}

async function syncSessionUI() {
  const user = await window.authClient.validateSession();
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const displayName = user.name || user.email || "User";
  if (profileInitial) profileInitial.textContent = firstInitial(displayName);
  if (profileName) profileName.textContent = displayName;
  if (welcomeName) welcomeName.textContent = displayName;
  if (logoutBtn) logoutBtn.style.display = "inline-flex";
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    window.authClient.clearSession();
    window.location.href = "./login.html";
  });
}

syncSessionUI();
