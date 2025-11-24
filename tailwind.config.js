/** @type {import('tailwindcss').Config} */
module.exports = {
  // La ligne ci-dessous est CRUCIALE. 
  // Elle dit : "Cherche dans le dossier actuel (.), puis dans src, tous les fichiers html ou js"
  content: ["./src/**/*.{html,js}"], 
  theme: {
    extend: {},
  },
  plugins: [],
}