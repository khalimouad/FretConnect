# FretConnect

Plateforme de mise en relation **Fret Retour à Vide** — Maroc (MVP), extensible Afrique de l'Ouest & Europe.

Frontend web du MVP, construit à partir du cahier des charges v1.0 (juillet 2026). Les données sont simulées côté client (`lib/data/mock.ts`) derrière une couche repository asynchrone, prête à être remplacée par Supabase/PostgreSQL sans toucher aux pages.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS 4** (design tokens dans `app/globals.css`)
- i18n maison à 4 langues — **AR (RTL), FR, EN, ES** — avec détection automatique de la langue (`proxy.ts`) et bascule dans l'en-tête

## Démarrage

```bash
npm install
npm run dev     # http://localhost:3000 → redirection vers /fr, /ar, /en ou /es
npm run build   # build de production (toutes les locales pré-rendues)
```

## Couverture fonctionnelle (cahier des charges)

| Section | Implémentation |
| --- | --- |
| §2 Référentiel géographique | Hiérarchie Pays → Région → Ville, codes ISO, zones AO/Europe « prévues » (`lib/data/geo.ts`) |
| §3 Rôles | 4 espaces : Utilisateur final, Société de transport, Manager (`/dashboard/*`) + backoffice interne Administrateur (`/admin`) |
| §4.1 Inscription | Double parcours : expéditeur (simple) / transporteur (onboarding + choix de formule + validation Manager) |
| §4.2 Cycle de vie des offres | Machine à états `draft → active → pourvue/expirée/suspendue/annulée → archivée` (`lib/domain/workflow.ts`), actions dans le backoffice transporteur, expiration automatique après la date de disponibilité |
| §4.3 Recherche | Filtres combinés (villes, date, véhicule, tonnage, prix) + tri (date, prix, capacité) sur `/search` |
| §4.4 Alertes | Création d'alertes trajet (email/push) côté utilisateur |
| §4.5 Contact | Coordonnées affichées sur la fiche offre + messagerie interne + flux « acceptation → confirmation transporteur » |
| §4.6 Tableaux de bord | 4 dashboards avec statistiques, modération, suivi d'abonnements |
| §5 Abonnements | 3 formules (Basique/Pro/Entreprise) sur `/pricing`, statut d'abonnement (actif/à échéance/impayé) |
| §6.2 International | Multi-devises dans le modèle (`Money { amount, currency }`), i18n RTL dès le MVP |

## Structure

```
app/[locale]/(site)/     site public (landing, search, offers/[id], login, register, pricing, dashboard/*)
app/[locale]/admin/      backoffice interne Administrateur (vue d'ensemble, managers, modération, référentiel géo, formules)
components/              UI (primitives, icônes, header/footer, cartes offre, dashboards, admin)
lib/domain/              types métier + machines à états (offres, comptes société)
lib/data/                référentiel géo, données de démonstration, repository
lib/i18n/                config locales + dictionnaires AR/FR/EN/ES
proxy.ts                 détection de langue à la première visite
```

## Point ouvert §9 (acceptation d'une offre)

L'implémentation retient l'option « manifestation d'intérêt » : l'acceptation par l'utilisateur notifie le transporteur, qui **confirme la mise en relation** depuis son backoffice (l'offre passe alors en « Pourvue »). À trancher définitivement avec le porteur de projet.
