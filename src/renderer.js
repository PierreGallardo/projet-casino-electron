// Récupération des éléments
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logoutBtn');

// GESTION DE LA CONNEXION
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Appel sécurisé à main.js
    const response = await window.electronAPI.login({ email, password });

    if (response.success) {
        // 1. Cacher le login
        loginView.classList.add('hidden');
        
        // 2. Afficher le dashboard
        dashboardView.classList.remove('hidden');
                
        // Nettoyer les champs (sécurité)
        document.getElementById('password').value = "";
    } else {
        errorMsg.textContent = response.message;
    }
});

// GESTION DE LA DÉCONNEXION (Bonus)
logoutBtn.addEventListener('click', () => {
    // On inverse la logique
    dashboardView.classList.add('hidden');
    loginView.classList.remove('hidden');
    errorMsg.textContent = "";
});