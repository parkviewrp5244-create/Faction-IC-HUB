# Illegal Civ Hub (GitHub Pages)
## 1. Upload & host
Push all files to a GitHub repo → Settings → Pages → Deploy from branch `main` / root.
## 2. Add your images (assets/)
- `logo.png`, `bg.jpg` (hero background)
- `map.jpg` – the base GTA map. Put its pixel size in `config.js` → `map.w` / `map.h`
- `weapons/*.png` – match filenames in `config.js` → `tiers`
## 3. Backend (free) so submissions + admin + turfs work
GitHub Pages is static, so threads are stored in Firebase:
1. console.firebase.google.com → new project → Add web app → copy config into `config.js`
2. Build → Authentication → enable **Email/Password** → add your admin user
3. Build → Firestore → create database, then Rules:
```
rules_version='2';service cloud.firestore{match /databases/{d}/documents{match /threads/{id}{
 allow create: if true;
 allow get: if true;
 allow list: if request.auth!=null || resource.data.status=='approved';
 allow update,delete: if request.auth!=null && request.auth.token.email=='YOUR_ADMIN_EMAIL';}}}
```
4. Auth → Settings → Authorized domains → add `YOURNAME.github.io`
## Admin
Open `#/admin` (Management Login), click 2 corners on the map to draw a turf, pick a color, Approve. It appears on the public map.
Edit ROE text, questions, boroughs and weapons in `config.js`.
