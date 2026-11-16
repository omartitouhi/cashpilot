# CashPilot

Gestion et prévision de trésorerie pour les petites entreprises.
Secteur choisi : **agence digitale**.

Projet React / Next.js organisé en **monorepo** (pnpm + Turborepo) selon la **Clean Architecture**.

## Architecture

```
apps/web/              Next.js : pages, Server Actions, composants (présentation)
  src/container/       composition root : choisit les implémentations
packages/domain/       règles métier pures (Money, Invoice, User…), sans dépendance
packages/application/  use cases + ports (interfaces), vérification des droits
packages/infra/        adaptateurs : repositories Prisma, bcrypt, horloge
packages/db/           schéma Prisma, migrations, données de démo
packages/config/       configuration TypeScript partagée
```

Règle de dépendance : `web → application → domain`. Seul `infra` connaît Prisma.

## Installation

Prérequis : Node.js 22 ou 24 (LTS), pnpm 9, Docker.

```bash
pnpm install
cp .env.example .env            # puis remplir SESSION_SECRET
docker compose up -d            # PostgreSQL sur le port 5433
pnpm --filter @cashpilot/db db:migrate
pnpm --filter @cashpilot/db db:seed
pnpm dev                        # http://localhost:3000
```

## Comptes de démonstration

Entreprise « Agence Pixel » (solde initial 5 000 DT). Mot de passe : `demo1234`.

| Rôle | Email | Droits |
|---|---|---|
| Dirigeant | dirigeant@pixel.tn | tout : équipe, approbation des dépenses |
| Gestionnaire financier | finance@pixel.tn | factures, encaissements, paiement des dépenses |
| Collaborateur | collaborateur@pixel.tn | soumet des dépenses et suit les siennes |

## Commandes utiles

```bash
pnpm test        # tests de toutes les couches
pnpm typecheck   # vérification TypeScript
pnpm build       # build de production
pnpm depcruise   # règles d'architecture (Node 22 ou 24)
```

Après une migration, relancer `pnpm dev` : le serveur garde l'ancien client Prisma en mémoire.

## Intégration continue

`.github/workflows/ci.yml` lance à chaque push et pull request : `pnpm depcruise`, puis
`turbo run typecheck test build`. Une violation des couches bloque la CI.

## Déploiement (Vercel + Neon)

1. Créer une base PostgreSQL sur [Neon](https://neon.tech) et copier sa chaîne de connexion.
2. Appliquer les migrations et les données de démo depuis sa machine :
   ```bash
   DATABASE_URL="<url Neon>" pnpm --filter @cashpilot/db db:deploy
   DATABASE_URL="<url Neon>" pnpm --filter @cashpilot/db db:seed
   ```
3. Sur [Vercel](https://vercel.com), importer le dépôt GitHub avec **Root Directory = `apps/web`**
   (`apps/web/vercel.json` lance le build via Turborepo, qui génère le client Prisma).
4. Ajouter les variables `DATABASE_URL` (URL Neon) et `SESSION_SECRET` (longue chaîne aléatoire).

## Limites connues

- Un utilisateur appartient à une seule entreprise.
- Clients et fournisseurs partagent la même table (champ `kind`). Une dépense peut viser un fournisseur ;
  on ne peut pas facturer un fournisseur.
- Les justificatifs (PDF ou image, 2 Mo max) sont stockés en base.
- Le solde réel est calculé à partir des paiements reçus et des dépenses payées (aucune copie des montants).
- Prévision : reste à payer des factures validées à leur échéance, dépenses approuvées non payées
  à leur date ; un flux en retard est attendu dès aujourd'hui. Les dépenses encore à valider ne sont pas comptées.
- Simulation « What if? » : les hypothèses passent dans l'URL, rien n'est enregistré en base.

## Utilisation d'outils d'IA

Ce projet a été réalisé avec l'aide de Claude Code (Anthropic), comme l'exige le sujet.
