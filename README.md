# NoKo — Site de démonstration

Site vitrine + démo produit pour NoKo, plateforme de crowdfunding dédiée aux TPE françaises en difficulté (investissement dès 10 €).

Ce dépôt est **100 % statique** (HTML/CSS/JS vanilla, aucune dépendance, aucun build) — il est fait pour tourner directement sur **GitHub Pages**.

## Structure

```
.
├── index.html       # Landing page (pitch, modèle, simulateur, chiffres, équipe)
├── style.css
├── script.js         # Logique du simulateur d'investissement sur la landing
├── demo/
│   ├── index.html    # Démo produit : projets fictifs + simulation d'investissement + portefeuille
│   ├── demo.css
│   └── demo.js        # Données fictives des projets + logique du parcours investisseur
└── README.md
```

⚠️ Toutes les données de projets (entreprises, montants, taux) dans `demo/demo.js` sont **fictives**, à but illustratif uniquement. Aucune donnée réelle de NoKo n'y figure.

## Mettre le site en ligne avec GitHub Pages

### 1. Créer le dépôt

```bash
cd noko-site
git init
git add .
git commit -m "Site de démonstration NoKo"
git branch -M main
git remote add origin https://github.com/<ton-compte>/<nom-du-repo>.git
git push -u origin main
```

### 2. Activer GitHub Pages

1. Va dans l'onglet **Settings** de ton dépôt sur GitHub
2. Dans le menu de gauche, clique sur **Pages**
3. Sous **Build and deployment** → **Source**, sélectionne **Deploy from a branch**
4. Choisis la branche **main** et le dossier **/ (root)**
5. Clique sur **Save**

Au bout de 1 à 2 minutes, le site sera accessible à l'adresse :

```
https://<ton-compte>.github.io/<nom-du-repo>/
```

### 3. Mettre à jour le site

Chaque `git push` sur la branche `main` redéploie automatiquement le site (1-2 minutes de délai).

## Tester en local avant de déployer

Aucune installation requise, un simple serveur HTTP suffit :

```bash
python3 -m http.server 8080
```

Puis ouvre `http://localhost:8080` dans ton navigateur.

## Personnalisation rapide

- **Couleurs** : tous les tokens sont en haut de `style.css` (`:root`), palette vert forêt / vert vif / vert acide.
- **Projets de la démo** : modifie le tableau `PROJECTS` dans `demo/demo.js`.
- **Chiffres de la landing** : section `#chiffres` dans `index.html`, directement issus du dossier commercial.
- **Contacts équipe** : section `#equipe` dans `index.html`.

## Limites de cette démo

- Aucune base de données ni backend : le "portefeuille" de la démo vit uniquement en mémoire JS et se réinitialise au rechargement de la page.
- Aucune authentification, aucun paiement réel — usage présentation/pitch uniquement.
- Pas de connexion blockchain réelle ; le dossier commercial décrit l'usage prévu (tokenisation, marché secondaire), non implémenté ici.
