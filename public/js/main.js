const API_URL = '/api';
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (token && user) {
  document.getElementById('loginLink').style.display = 'none';
  document.getElementById('registerLink').style.display = 'none';
  document.getElementById('logoutLink').style.display = 'inline';
  document.getElementById('dashboardLink').style.display = 'inline';
  if (user.isAdmin) document.getElementById('adminLink').style.display = 'inline';
}

document.getElementById('logoutLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
});

async function fetchItems() {
  const search = document.getElementById('searchInput').value;
  const category = document.getElementById('categoryFilter').value;
  const location = document.getElementById('locationFilter').value;
  const type = document.getElementById('typeFilter').value;
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (location) params.append('location', location);
  if (type) params.append('type', type);
  
  try {
    const res = await fetch(`${API_URL}/items?${params}`);
    const items = await res.json();
    renderItems(items);
  } catch (err) {
    console.error(err);
  }
}

function renderItems(items) {
  const container = document.getElementById('itemsList');
  if (!items.length) { container.innerHTML = '<p>No items found.</p>'; return; }
  
  container.innerHTML = items.map(item => {
    // Check if user is logged in and didn't report this item themselves
    const canClaim = user && item.reportedBy && item.reportedBy._id !== user._id && item.status === 'open';
    
    return `
    <div class="item-card">
      <h3>${item.name}</h3>
      <span class="badge ${item.type}">${item.type.toUpperCase()}</span>
      <p>${item.description}</p>
      <p style="margin-top: 0.5rem; font-size: 0.9rem;"><strong>📍 Location:</strong> ${item.location}</p>
      <p style="font-size: 0.9rem;"><strong>📅 Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
      <p style="font-size: 0.9rem; margin-bottom: 1rem;"><strong>👤 Reported by:</strong> ${item.reportedBy?.name || 'Unknown'}</p>
      
      ${canClaim ? `<button class="btn-claim" onclick="claimItem('${item._id}')">Claim This Item</button>` : ''}
      ${item.status !== 'open' ? '<p style="color: #c62828; font-weight: bold; margin-top: 1rem;">Status: ' + item.status.toUpperCase() + '</p>' : ''}
    </div>
  `}).join('');
}

async function claimItem(itemId) {
  if (!token) {
    alert('You must be logged in to claim an item!');
    window.location.href = 'login.html';
    return;
  }

  // Ask the user for proof/message
  const message = prompt("Please describe why this item belongs to you (Provide proof like color, scratches, contents, etc.):");
  
  if (!message || message.trim() === '') {
    alert('You must provide a reason/proof to claim this item.');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/claims`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ itemId, message })
    });
    
    const data = await res.json();
    if (res.ok) {
      alert('Claim submitted successfully! The admin will review your proof and get back to you.');
    } else {
      alert(data.message || 'Failed to submit claim');
    }
  } catch (err) {
    alert('Network error while submitting claim.');
  }
}

document.getElementById('searchBtn')?.addEventListener('click', fetchItems);
fetchItems();