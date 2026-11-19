# Portfolio — Takwa Zaghdoudi

Portfolio personnel (HTML / CSS / JavaScript, sans framework) — étudiante L3 Réseaux et Services Informatiques, ISET Radès.

## Structure

```
index.html                 → la page
assets/css/style.css       → styles (couleurs modifiables en haut du fichier, :root)
assets/js/main.js          → menu mobile, filtre des projets, terminal animé, fond réseau
assets/img/takwa.jpg       → photo
assets/docs/CV_Takwa_Zaghdoudi.pdf → CV téléchargeable
```

## Mise en ligne sur GitHub Pages

1. Sur GitHub, créer un dépôt **public** nommé exactement `<ton-pseudo>.github.io`
   (ex. `takwazaghdoudi.github.io`).
2. Bouton **Add file → Upload files**, glisser tout le contenu de ce dossier
   (`index.html`, `README.md` et le dossier `assets`) puis **Commit changes**.
3. **Settings → Pages** : Source = *Deploy from a branch*, Branch = `main`, dossier `/ (root)` → **Save**.
4. Après 1 à 2 minutes, le site est en ligne sur `https://<ton-pseudo>.github.io`.

En ligne de commande :

```bash
git init
git add .
git commit -m "Portfolio initial"
git branch -M main
git remote add origin https://github.com/<ton-pseudo>/<ton-pseudo>.github.io.git
git push -u origin main
```

## Mettre à jour

- **Ajouter un projet** : copier un bloc `<article class="project ...">` dans `index.html`
  et choisir ses catégories dans `data-cat` (`reseau`, `securite`, `wan`, `systeme`).
- **Changer le CV** : remplacer `assets/docs/CV_Takwa_Zaghdoudi.pdf` en gardant le même nom.
- **Changer les couleurs** : modifier `--accent` et `--accent-2` en haut de `style.css`.
