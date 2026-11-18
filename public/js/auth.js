const API_URL = '/api';
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: document.getElementById('email').value, password: document.getElementById('password').value })
    });
    const data = await res.json();
    if (res.ok) { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data)); window.location.href = 'index.html'; }
    else { document.getElementById('message').textContent = data.message; }
  });
}
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: document.getElementById('name').value, email: document.getElementById('email').value, password: document.getElementById('password').value })
    });
    const data = await res.json();
    if (res.ok) { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data)); window.location.href = 'index.html'; }
    else { document.getElementById('message').textContent = data.message; }
  });
}