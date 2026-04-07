const navLogin = document.getElementById("navLogin");
const navRegister = document.getElementById("navRegister");
const navLogout = document.getElementById("navLogout");

async function syncSessionUI() {
  const token = window.authClient.getToken();
  if (!token) {
    return;
  }

  try {
    const data = await window.authClient.api("/me", { method: "GET" });
    if (navLogin) {
      navLogin.textContent = data.user.name;
      navLogin.href = "#";
      navLogin.style.pointerEvents = "none";
    }
    if (navRegister) {
      navRegister.style.display = "none";
    }
    if (navLogout) {
      navLogout.style.display = "inline-flex";
    }
  } catch {
    window.authClient.clearSession();
  }
}

if (navLogout) {
  navLogout.addEventListener("click", () => {
    window.authClient.clearSession();
    window.location.href = "./login.html";
  });
}

syncSessionUI();
