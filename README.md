# 🎓 Campus Lost & Found Portal

A responsive, full-stack web application designed for Sai University students to report lost items, post found items, and claim them with proof. It includes a complete Admin dashboard for managing claims and viewing statistics.

## 🚀 Features
* **User Authentication**: Secure Registration and Login using JWT (JSON Web Tokens).
* **Lost & Found Reports**: Users can report items with details like name, category, location, date, and description.
* **Search & Filter**: Live search and filtering by category, location, and item type (lost/found).
* **Claim System**: Users can claim items by submitting a proof message.
* **Admin Dashboard**: Admins can view statistics, review claims, and approve/reject them. Approving a claim automatically updates the item's status to "Claimed".
* **Responsive UI**: Clean, modern Brown & Beige aesthetic.

## 💻 Tech Stack
* **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (via Mongoose)
* **Authentication**: JWT, bcryptjs
* **Testing**: Postman

## ⚙️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-link>
   cd campus-lost-found