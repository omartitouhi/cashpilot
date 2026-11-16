# Architecture de CashPilot

CashPilot suit la **Clean Architecture** dans un **monorepo pnpm + Turborepo**.
Objectif : que les règles métier (calculs monétaires, workflows, droits) ne dépendent
d'aucun outil, et puissent être testées sans base de données ni serveur.

## Les couches

```
apps/web ──────────────► packages/application ──► packages/domain
   │ (container)                ▲
   └──────► packages/infra ─────┘──► packages/db (Prisma)
```

| Package | Rôle | Dépend de |
|---|---|---|
| `domain` | Entités et règles pures : `Money`, `Invoice`, `Expense`, `Client`, `User`, projection de trésorerie | rien |
| `application` | Use cases (un fichier = une action), ports (interfaces), vérification des droits | `domain` |
| `infra` | Adaptateurs : repositories Prisma + mappers, bcrypt, PDF, horloge, UUID | `application`, `domain`, `db` |
| `db` | Schéma Prisma, migrations, données de démo, client unique | Prisma |
| `apps/web` | Next.js App Router : pages, Server Actions, Route Handlers, composants | `application` (+ `infra` dans `container/` seulement) |

**Règle de dépendance** : une couche interne ne connaît jamais une couche externe.
Elle est vérifiée par `dependency-cruiser` (`.dependency-cruiser.cjs`) et bloque la CI.

## Choix et justifications

**Montants en millimes entiers** (`Money`). 1 DT = 1 000 millimes : additions exactes,
aucune erreur d'arrondi. La base stocke `DECIMAL(14,3)`, le mapper convertit.

**Le solde réel n'est jamais stocké.** Il est recalculé à partir des paiements reçus
et des dépenses payées. Une opération ne peut donc pas être comptée deux fois.

**Les données réelles ne sont jamais corrigées en place.** Un paiement n'est ni modifié
ni supprimé ; une dépense garde qui l'a approuvée, refusée ou payée, et quand.

**Simulation sans écriture.** Les hypothèses « What if? » passent dans l'URL ;
`applyScenario` travaille sur une copie des flux.

**Droits vérifiés deux fois.** Le proxy Next.js protège les URL ; chaque use case
appelle `assertCan(actor, permission)`. L'entreprise vient toujours de la session,
jamais du formulaire : un utilisateur ne voit que les données de son entreprise.

**Validation à deux niveaux.** Zod vérifie la forme des données à la frontière (Server Actions) ;
les entités vérifient les règles métier et lèvent des `DomainError` avec un code.

**Composition root unique** (`apps/web/src/container`). Le seul fichier qui choisit
les implémentations : remplacer Prisma par un autre stockage ne touche que `infra` et ce fichier.

**Justificatifs en base** plutôt que sur disque : compatible avec un hébergement sans disque (Vercel).

## Tests

| Couche | Type | Exemple |
|---|---|---|
| `domain` | unitaires purs | paiement partiel, dépense refusée non payable, exemple chiffré du sujet |
| `application` | use cases avec fakes en mémoire | permissions par rôle, isolation entre entreprises |
| architecture | `dependency-cruiser` | domaine pur, pas de Prisma dans la présentation |

## Coûts assumés

Plus de fichiers qu'une application « tout dans la page », et des mappers à maintenir
entre le modèle Prisma et le modèle métier. En échange, chaque règle du sujet a un seul
emplacement et un test qui tourne en quelques millisecondes.
