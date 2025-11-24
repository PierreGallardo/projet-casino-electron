const { app, BrowserWindow, ipcMain } = require('electron');
// On utilise la version PROMISE, donc on ne peut utiliser que async/await
const mysql = require('mysql2/promise');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js') 
        }
    });

    win.setMenu(null);
    win.loadFile(path.join(__dirname, 'index.html'));
    
    // Ouvre la console pour voir les logs (très utile pour déboguer)
    win.webContents.openDevTools();
}

ipcMain.handle('login-check', async (event, credentials) => {
    console.log("Tentative de connexion pour :", credentials.email);

    let connection;

    try {
        // 1. Connexion (Version Promise)
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'ma_base_de_donnees',
            port: 3306
        });

        // 2. Requête
        const [rows] = await connection.execute(
            'SELECT * FROM utilisateurs WHERE mail_User = ?', 
            [credentials.email]
        );

        // 3. Vérification existence
        if (rows.length === 0) {
            return { success: false, message: "Compte introuvable." };
        }

        const user = rows[0];

        // 4. Vérification mot de passe
        // ⚠️ Vérifie bien que ta colonne s'appelle 'mdp_User' dans ta BDD
        if (user.mdp_User === credentials.password) {
            
            // ⚠️ PETITE VÉRIF À FAIRE ICI :
            // Tu renvoies 'user.nom'. Est-ce que ta colonne s'appelle bien 'nom' ?
            // Si elle s'appelle 'nom_User', il faut mettre user.nom_User ici.
            return { success: true, nom: user.nom }; 

        } else {
            return { success: false, message: "Mot de passe incorrect." };
        }

    } catch (error) {
        console.error("Erreur Database :", error); // S'affichera dans ton terminal VS Code
        return { success: false, message: "Erreur technique : " + error.message };
        
    } finally {
        if (connection) await connection.end();
    }
});

// --- CYCLE DE VIE DE L'APP ---

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
