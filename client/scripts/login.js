const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginBtn = document.getElementById("loginBtn");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginMessage.textContent = "";
    loginMessage.classList.remove("success");
    loginBtn.disabled = true;
    loginBtn.textContent = "AUTHENTICATING...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const data = await window.authClient.api("/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      window.authClient.setSession(data.token, data.user);
      loginMessage.classList.add("success");
      loginMessage.textContent = "Access granted. Redirecting...";
      window.location.href = "./index.html";
    } catch (error) {
      loginMessage.textContent = error.message;
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "INITIALIZE TERMINAL";
    }
  });
}
