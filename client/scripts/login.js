const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginBtn = document.getElementById("loginBtn");
const socialButtons = document.querySelectorAll("[data-oauth]");

window.authClient.redirectIfAuthenticated("./dashboard.html");

socialButtons.forEach((button) => {
  button.addEventListener("click", () => {
    loginMessage.textContent = `${button.dataset.oauth} login is not available yet. Please use email and password.`;
  });
});

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginMessage.textContent = "";
    loginMessage.classList.remove("success");
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const data = await window.authClient.api("/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      window.authClient.setSession(data.token, data.user);
      loginMessage.classList.add("success");
      loginMessage.textContent = "Login successful. Redirecting...";
      window.location.href = "./dashboard.html";
    } catch (error) {
      loginMessage.textContent = error.message;
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "LOGIN";
    }
  });
}
