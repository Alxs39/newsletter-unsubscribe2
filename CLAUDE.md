# Contexte général

Ce projet est un monorepo pnpm.

- Gestionnaire de paquets : pnpm 9.15.0 uniquement  
- npm, yarn et npx sont strictement interdits  

- Node.js : >= 20  
- Projet en ESM (`type: module`)

# Structure du repository

## À la racine
- Aucun script de build  
- Scripts disponibles : lint, format uniquement

## Workspaces
- `apps/frontend` : frontend Next.js  
- `apps/backend` : backend AdonisJS (pas Next.js)

# Règles générales d’exécution

- Toutes les commandes doivent être lancées depuis la racine du repo  
- Les scripts workspace sont exécutés via `pnpm -C <workspace>`  
- Ne jamais exécuter ou suggérer `pnpm build` à la racine  
- Ne jamais inventer de scripts non définis dans `package.json`

# Frontend

- Localisation : `apps/frontend`  
- Framework : Next.js 16  
- React : 19  

Commandes autorisées :  
pnpm -C apps/frontend dev
pnpm -C apps/frontend build
pnpm -C apps/frontend start
pnpm -C apps/frontend lint


# Backend

- Localisation : `apps/backend`  
- Framework : AdonisJS v6  
- TypeScript utilisé  
- Entrée principale : `node ace`

Commandes autorisées :  
pnpm -C apps/backend dev
pnpm -C apps/backend build
pnpm -C apps/backend start
pnpm -C apps/backend typecheck
pnpm -C apps/backend test


Règles spécifiques :  
- Le build backend se fait exclusivement via `node ace build`  
- Ne jamais utiliser `tsc` comme commande de build  
- Ne jamais proposer de commandes Next.js pour le backend

# Diagnostic et erreurs

- Ne jamais deviner la cause d’une erreur  
- Toujours demander le message d’erreur exact  
- Raisonner uniquement à partir des logs fournis  
- Ne pas proposer de solution générique sans lien direct avec l’erreur

# Permissions

Le modèle est autorisé à :  
- installer ou mettre à jour des dépendances  
- modifier le code et la configuration  
- lancer toutes les commandes locales nécessaires

Interdiction absolue :  
- `git push` est strictement interdit