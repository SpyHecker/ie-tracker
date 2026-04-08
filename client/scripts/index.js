const navLogin = document.getElementById("navLogin");
const navRegister = document.getElementById("navRegister");
const navLogout = document.getElementById("navLogout");

async function syncSessionUI() {
  const user = await window.authClient.validateSession();
  if (!user) {
    return;
  }

  if (navLogin) {
    navLogin.textContent = user.name;
    navLogin.href = "./index.html#platform";
  }
  if (navRegister) {
    navRegister.style.display = "none";
  }
  if (navLogout) {
    navLogout.style.display = "inline-flex";
  }
}

if (navLogout) {
  navLogout.addEventListener("click", () => {
    window.authClient.clearSession();
    window.location.href = "./login.html";
  });
}

syncSessionUI();
