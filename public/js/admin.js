const API_URL = '/api';
const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';
const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

document.getElementById('logoutLink').addEventListener('click', (e) => {
  e.preventDefault(); localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = 'login.html';
});

async function loadStats() {
  const res = await fetch(`${API_URL}/admin/stats`, { headers });
  const s = await res.json();
  document.getElementById('stats').innerHTML = `
    <div class="stat-card"><h3>${s.totalItems}</h3><p>Total Items</p></div>
    <div class="stat-card"><h3>${s.lostItems}</h3><p>Lost Items</p></div>
    <div class="stat-card"><h3>${s.foundItems}</h3><p>Found Items</p></div>
    <div class="stat-card"><h3>${s.totalClaims}</h3><p>Total Claims</p></div>
    <div class="stat-card"><h3>${s.pendingClaims}</h3><p>Pending Claims</p></div>
    <div class="stat-card"><h3>${s.totalUsers}</h3><p>Total Users</p></div>
  `;
}

async function loadAllClaims() {
  const res = await fetch(`${API_URL}/claims`, { headers });
  const claims = await res.json();
  document.getElementById('allClaims').innerHTML = `
    <table>
      <thead><tr><th>Item</th><th>Claimant</th><th>Proof / Message</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        ${claims.map(c => `
          <tr>
            <td><strong>${c.item?.name}</strong></td>
            <td>${c.claimant?.name}<br><small>${c.claimant?.email}</small></td>
            <td style="max-width: 300px; font-style: italic;">"${c.message}"</td>
            <td><strong>${c.status.toUpperCase()}</strong></td>
            <td>
              ${c.status === 'pending' ? `
                <button class="btn-approve" onclick="updateClaim('${c._id}', 'approved')">Approve</button>
                <button class="btn-reject" onclick="updateClaim('${c._id}', 'rejected')">Reject</button>
              ` : 'Completed'}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function updateClaim(id, status) {
  if (!confirm(`Are you sure you want to ${status} this claim?`)) return;
  
  const res = await fetch(`${API_URL}/claims/${id}`, { 
    method: 'PUT', 
    headers, 
    body: JSON.stringify({ status }) 
  });
  
  if (res.ok) {
    alert(`Claim ${status} successfully!`);
    loadAllClaims(); 
    loadStats();
  } else {
    alert('Error updating claim.');
  }
}

async function loadAllItems() {
  const res = await fetch(`${API_URL}/items`, { headers });
  const items = await res.json();
  document.getElementById('allItems').innerHTML = `
    <table>
      <thead><tr><th>Name</th><th>Type</th><th>Location</th><th>Status</th><th>Reported By</th></tr></thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td>${i.name}</td>
            <td><span class="badge ${i.type}">${i.type}</span></td>
            <td>${i.location}</td>
            <td><strong>${i.status.toUpperCase()}</strong></td>
            <td>${i.reportedBy?.name || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

loadStats(); 
loadAllClaims(); 
loadAllItems();