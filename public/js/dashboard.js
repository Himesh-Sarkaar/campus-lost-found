const API_URL = '/api';
const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';
const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

document.getElementById('logoutLink').addEventListener('click', (e) => {
  e.preventDefault(); localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = 'login.html';
});

document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch(`${API_URL}/items`, {
    method: 'POST', headers,
    body: JSON.stringify({
      name: document.getElementById('itemName').value, 
      category: document.getElementById('itemCategory').value,
      description: document.getElementById('itemDescription').value, 
      location: document.getElementById('itemLocation').value,
      date: document.getElementById('itemDate').value, 
      type: document.getElementById('itemType').value,
      imageUrl: document.getElementById('itemImage').value
    })
  });
  if (res.ok) { 
    alert('Item Reported Successfully!'); 
    document.getElementById('reportForm').reset(); 
    loadMyItems(); 
  } else {
    alert('Failed to report item.');
  }
});

async function loadMyItems() {
  const res = await fetch(`${API_URL}/items/my`, { headers });
  const items = await res.json();
  document.getElementById('myItems').innerHTML = items.map(item => `
    <div class="item-card" style="margin-bottom:1rem;">
      <h3>${item.name} <span class="badge ${item.type}">${item.type.toUpperCase()}</span></h3>
      <p>Status: <strong>${item.status.toUpperCase()}</strong></p>
    </div>
  `).join('') || '<p>You have not reported any items yet.</p>';
}

async function loadMyClaims() {
  const res = await fetch(`${API_URL}/claims/my`, { headers });
  const claims = await res.json();
  document.getElementById('myClaims').innerHTML = claims.map(c => `
    <div class="item-card" style="margin-bottom:1rem; border-top-color: ${c.status === 'approved' ? '#2e7d32' : c.status === 'rejected' ? '#c62828' : '#a67c52'};">
      <h3>Item: ${c.item?.name || 'Unknown'}</h3>
      <p><strong>Your Proof/Message:</strong> "${c.message}"</p>
      <p><strong>Admin Decision:</strong> <span style="font-weight: bold; color: ${c.status === 'approved' ? '#2e7d32' : c.status === 'rejected' ? '#c62828' : '#a67c52'};">${c.status.toUpperCase()}</span></p>
    </div>
  `).join('') || '<p>You have not submitted any claims yet.</p>';
}

loadMyItems(); 
loadMyClaims();