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

Prérequis : Node.js 22 ou 24, pnpm 9, Docker.

```bash
pnpm install
cp .env.example .env            # puis remplir SESSION_SECRET
docker compose up -d            # PostgreSQL sur le port 5433
pnpm --filter @cashpilot/db db:generate
pnpm --filter @cashpilot/db db:migrate
pnpm --filter @cashpilot/db db:seed
pnpm dev                        # http://localhost:3000
```

## Comptes de démonstration

Entreprise « Agence Pixel » (solde initial 5 000 DT). Mot de passe : `demo1234`.

| Rôle | Email | Droits |
|---|---|---|
| Dirigeant | dirigeant@pixel.tn | tout, dont la gestion de l'équipe |
| Gestionnaire financier | finance@pixel.tn | factures et paiements |
| Collaborateur | collaborateur@pixel.tn | dépenses (module à venir) |

## Commandes utiles

```bash
pnpm test        # tests de toutes les couches
pnpm typecheck   # vérification TypeScript
pnpm build       # build de production
```

## Limites connues

- Un utilisateur appartient à une seule entreprise.
- Modules à venir : dépenses, trésorerie, prévisions, simulation.

## Utilisation d'outils d'IA

Ce projet a été réalisé avec l'aide de Claude Code (Anthropic), comme l'exige le sujet.
