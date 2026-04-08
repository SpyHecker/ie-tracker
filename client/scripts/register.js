const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");
const registerBtn = document.getElementById("registerBtn");
const socialButtons = document.querySelectorAll("[data-oauth]");

window.authClient.redirectIfAuthenticated("./dashboard.html");

socialButtons.forEach((button) => {
  button.addEventListener("click", () => {
    registerMessage.textContent = `${button.dataset.oauth} signup is not available yet. Please use the form.`;
  });
});

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    registerMessage.textContent = "";
    registerMessage.classList.remove("success");

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      registerMessage.textContent = "Passwords do not match.";
      return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = "Creating...";

    try {
      const data = await window.authClient.api("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, confirmPassword })
      });

      window.authClient.setSession(data.token, data.user);
      registerMessage.classList.add("success");
      registerMessage.textContent = "Account created. Redirecting...";
      window.location.href = "./dashboard.html";
    } catch (error) {
      registerMessage.textContent = error.message;
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = "Create Account";
    }
  });
}
