# 🧠 Inside Reinforcement Learning

> Plateforme éducative 3D immersive — Explorez les algorithmes de Deep Reinforcement Learning de l'intérieur.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Three.js](https://img.shields.io/badge/Three.js-0.158-green?logo=threedotjs) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🌌 Vue d'ensemble

**Inside Reinforcement Learning** transforme l'apprentissage des algorithmes de Deep RL en une expérience interactive et cinématique. Plutôt que de lire des équations dans un manuel, l'utilisateur **voyage à l'intérieur** des algorithmes comme s'il explorait un univers vivant.

Le joueur commence dans **"The RL Core"** — un hub central futuriste avec 6 portails énergétiques — et explore chaque monde à son rythme, guidé par une IA narrative holographique.

---

## 🌍 Les 6 Mondes

| Portail | Monde | Algorithme | Concepts clés |
|---------|-------|------------|---------------|
| 🔵 | **RL Core** | Hub Central | Navigation, aperçu global |
| 🧠 | **DQN World** | Deep Q-Network | Q-values, replay memory, ε-greedy, target network, Bellman |
| 🌊 | **Policy World** | Policy Network | π(a\|s), gradient ascent, entropie, stochastic policy |
| ⚖️ | **Actor-Critic** | A2C / A3C | advantage A(s,a), TD error, V(s), feedback Actor↔Critic |
| ⚡ | **TD Learning** | SARSA / TD(λ) | bootstrapping, Bellman, SARSA, apprentissage en ligne |
| 🌍 | **Environment MDP** | MDP | state space, action space, reward signal, transitions |
| 🔄 | **PPO World** | PPO | clipping L_CLIP, trust region, policy ratio r(θ) |

### 🧠 World 1 — Deep Q-Network (DQN)

Ville cybernétique avec flux de données et réseaux neuronaux géants.
Le joueur suit le signal de décision de bout en bout :

```
Observation → Neural Network → Q-values → Action → Reward → Replay Memory → Training → Target Network
```

**Zones interactives :**
- **Neural Network Tunnel** — voyage à travers les couches, propagation des activations, backpropagation sous forme d'ondes lumineuses
- **Replay Memory City** — bibliothèque holographique de capsules `(s, a, r, s')`
- **Q-Value Reactor** — salle énergétique où `Q(s,a)` est calculé en temps réel
- **Exploration Arena** — deux chemins : monde chaotique (exploration) vs chemin optimisé (exploitation)

### 🌊 World 2 — Policy Network

Monde organique et fluide. Le réseau génère directement une politique sans passer par les Q-values.

**Zones :**
- **Probability River** — rivière dynamique représentant `π(a|s)`, les courants = les probabilités d'actions
- **Policy Generator Temple** — visualisation de la production directe de probabilités
- **Gradient Mountain** — montagne représentant le Policy Gradient, le joueur grimpe pendant l'optimisation

### ⚖️ World 3 — Actor-Critic

Deux tours gigantesques reliées par des flux énergétiques.

**Structure :**
- **Actor Tower** — génère les actions, politique continue, exploration intelligente
- **Critic Tower** — estime `V(s)`, calcule l'avantage, produit le TD error
- **Synchronization Bridge** — échanges de gradients et corrections mutuelles en temps réel

### ⚡ World 4 — TD Learning

Apprentissage par différences temporelles. L'agent apprend en ligne depuis des épisodes incomplets grâce au bootstrapping.

### 🌍 World 5 — Environment MDP

Fondation de tout RL : le Processus de Décision Markovien. États, transitions probabilistes, récompenses et cycle agent-environnement.

### 🔄 World 6 — PPO

Proximal Policy Optimization, l'algorithme standard de l'industrie. Visualise le mécanisme de clipping qui garantit des mises à jour stables :

```
L_CLIP = E[min(r·A, clip(r, 1-ε, 1+ε)·A)]
```

---

## 🛠️ Outils Pédagogiques Intégrés

Accessibles depuis la **barre d'outils flottante** (bas de l'écran) dans tous les mondes :

| Icône | Outil | Description |
|-------|-------|-------------|
| 📊 | **Training Simulator** | Simule un entraînement en temps réel — courbes de loss, return, TD error et ε |
| 📐 | **Math Holo** | Hologrammes animés : Bellman, Policy Gradient, Advantage, TD Error, L_CLIP |
| ❓ | **Concept Quiz** | 8 questions QCM avec explications détaillées — score Novice / Learning / Master |
| 🧠 | **Neural Architect** | Éditeur de réseau neuronal interactif avec propagation visuelle en temps réel |
| 📅 | **RL Timeline** | Frise chronologique 1957–2024 : 14 jalons historiques du RL avec équations |
| ⚔️ | **Algorithm Arena** | Comparaison de 6 algorithmes (DQN, REINFORCE, A2C, PPO, SAC) par métriques |

### 📊 Training Simulator — Détail

Lance un agent fictif et affiche en direct :

```
Episode | Steps | ε (epsilon)
Loss ────────────────── courbe décroissante
Return ─────────────── courbe croissante
TD-error ───────────── courbe décroissante
```

Boutons : `▶ RUN` / `⏸ PAUSE` / `↺ RESET` — couleurs adaptées à chaque monde.

### ❓ Concept Quiz — Questions couvertes

| Concept | Question posée |
|---------|---------------|
| Q-value | Signification du Q dans Q-learning |
| Bellman | Identifier l'équation de Bellman |
| ε-greedy | Rôle de ε dans l'exploration |
| Critic | Ce que le Critic produit |
| Replay | Utilité de l'experience replay |
| Advantage | Formule de A(s,a) |
| REINFORCE | Facteur de mise à l'échelle des gradients |
| Bootstrapping | Définition du bootstrapping en TD |

### ⚔️ Algorithm Arena — Algorithmes comparés

| Algorithme | Type | Policy | Action Space |
|------------|------|--------|-------------|
| Q-Learning | Value-Based | Off-policy | Discret |
| DQN | Value-Based | Off-policy | Discret |
| REINFORCE | Policy-Based | On-policy | Les deux |
| A2C / A3C | Actor-Critic | On-policy | Les deux |
| PPO | Actor-Critic | On-policy | Les deux |
| SAC | Actor-Critic | Off-policy | Continu |

---

## 🎓 Scénarios d'Utilisation Pédagogique

### Scénario A — Introduction au cours (15 min)

> Poser les bases du Reinforcement Learning.

1. Lancer le site — Hub Central en projection
2. Entrer dans **World 5 – Environment MDP** : état, action, récompense, cycle agent-environnement
3. Ouvrir **Math Holo** (📐) → Bellman Equation pour la formulation mathématique

---

### Scénario B — Cours sur DQN (30 min)

> Exploration complète du Deep Q-Network.

1. Entrer dans **World 1 – DQN World**, laisser le Guide IA introduire les zones
2. **Neural Network Tunnel** : expliquer la propagation avant et la rétropropagation
3. **Replay Memory City** : concept d'experience replay, décorrélation des données
4. **Q-Value Reactor** : voir `Q(s,a)` se mettre à jour dynamiquement
5. **Exploration Arena** : montrer le compromis exploration/exploitation avec ε-greedy
6. Activer le **Training Simulator** (📊) : convergence de la loss et décroissance de ε en temps réel
7. Clore avec le **Concept Quiz** (❓) : questions sur Q-values, Bellman et replay memory

---

### Scénario C — Comparaison des algorithmes (20 min)

> Situer les algorithmes les uns par rapport aux autres.

1. Ouvrir **Algorithm Arena** (⚔️) — trier par **stabilité**
2. Comparer DQN vs PPO vs SAC sur les barres de métriques (stabilité, efficacité, scalabilité)
3. Développer chaque carte pour voir les avantages/inconvénients
4. Ouvrir **RL Timeline** (📅) : contextualiser historiquement (DQN 2013 → PPO 2017 → SAC 2018)

---

### Scénario D — TP étudiant autonome

> Session d'exploration individuelle avec évaluation.

1. Explorer les **6 mondes dans l'ordre** (Environment MDP → DQN → Policy → Actor-Critic → TD → PPO)
2. Compléter le **Concept Quiz** (score minimum recommandé : 6/8)
3. Noter les équations affichées dans **Math Holo** pour le compte-rendu
4. Consulter la **RL Timeline** pour comprendre le contexte historique de chaque algorithme
5. Suivre sa progression via le compteur de concepts découverts dans le **HUD**

---

### Scénario E — Présentation magistrale complète (1h)

> Cours complet de RL en une heure avec la plateforme.

| Durée | Activité |
|-------|----------|
| 10 min | Hub + Environment MDP + Bellman (Math Holo) |
| 15 min | DQN World — Neural Tunnel + Replay Memory + Q-Value Reactor |
| 10 min | Training Simulator — convergence en direct |
| 10 min | Actor-Critic — Actor Tower + Critic Tower + Synchronization Bridge |
| 10 min | Algorithm Arena — comparaison PPO vs SAC vs DQN |
| 5 min | Concept Quiz — évaluation rapide de la session |

---

## 🤖 Guide IA Narratif

Un assistant holographique accompagne l'utilisateur dans tous les mondes :

- Explique **pourquoi** une décision est prise dans l'algorithme
- Décrit **ce que représente** chaque élément visuel
- Annonce le contenu d'un monde **avant d'y entrer** (transition de portail)
- Confirme les **concepts découverts** (tracking dans le store global)

> Idéal en cours : l'enseignant projette le site et laisse le guide commenter chaque étape avant d'approfondir au tableau.

---

## 📐 Mathématiques Visualisées

Les équations apparaissent comme des hologrammes animés dans l'environnement :

| Équation | Monde |
|----------|-------|
| `Q(s,a) = R + γ·max Q(s',a')` | DQN World |
| `V(s) ← V(s) + α[r + γV(s') - V(s)]` | TD Learning |
| `∇θ J(θ) = E[∇θ log π(a\|s;θ) · G]` | Policy World |
| `A(s,a) = Q(s,a) - V(s)` | Actor-Critic |
| `L_CLIP = E[min(r·A, clip(r,1-ε,1+ε)·A)]` | PPO World |

---

## 📚 Concepts RL Couverts

| Concept | Monde | Format |
|---------|-------|--------|
| State / Action / Reward | Environment MDP | Cycle agent-environnement animé |
| Q-values Q(s,a) | DQN — Q-Value Reactor | Salle énergétique dynamique |
| Bellman Equation | Math Holo + DQN | Hologramme + contexte algorithmique |
| ε-greedy Exploration | DQN — Exploration Arena | Deux chemins visuels |
| Experience Replay | DQN — Replay Memory City | Capsules mémoire `(s,a,r,s')` |
| Backpropagation | DQN — Neural Tunnel | Ondes lumineuses de rétropropagation |
| Policy π(a\|s) | Policy World | Rivière de probabilités dynamique |
| Policy Gradient | Gradient Mountain | Ascension + gradient ascent |
| Actor / Critic | Actor-Critic | Deux tours + flux énergétiques |
| Advantage A(s,a) | Actor-Critic + Math Holo | A = Q − V holographique |
| TD Error | Training Simulator + TD World | Courbe temps réel |
| Bootstrapping | TD Learning | Mise à jour depuis estimation courante |
| PPO Clipping | PPO World | Trust region visuelle |
| REINFORCE | RL Timeline + Policy World | Contexte historique + équation |

---

## 🚀 Démarrage Rapide

### Option 1 — Docker (Recommandé)

```bash
# Production — une seule commande
docker compose up --build -d inside-rl

# Ouvrir dans le navigateur
# http://localhost:3000

# Arrêter
docker compose down
```

### Option 2 — Mode Développement (hot-reload)

```bash
# Hot-reload sur le port 3001
docker compose --profile dev up inside-rl-dev
# http://localhost:3001
```

### Option 3 — Node.js local

```bash
npm install --legacy-peer-deps
npm run dev        # développement  → http://localhost:3000
npm run build      # build prod
npm run preview    # prévisualiser le build
```

---

## 🐳 Architecture Docker

```
Dockerfile (multi-stage)
├── Stage 1 : node:18-alpine   → npm install + vite build
└── Stage 2 : nginx:alpine     → sert /dist (image ~25 MB)

docker-compose.yml
├── inside-rl      (prod)  → port 3000:80   restart: unless-stopped
└── inside-rl-dev  (dev)   → port 3001:3000 volume mount + hot-reload
```

**Healthcheck** intégré — vérifie que nginx répond toutes les 30 secondes.

---

## 🖥️ Compatibilité Navigateurs

| Navigateur | Support | Notes |
|------------|---------|-------|
| Chrome 100+ | ✅ Optimal | WebGL2 + accélération matérielle |
| Firefox 100+ | ✅ Très bon | Léger delta sur les particles |
| Edge 100+ | ✅ Bon | Identique à Chrome (Chromium) |
| Safari 16+ | ⚠️ Partiel | WebGL2 ok, audio limité |
| Mobile | ⚠️ Limité | Non optimisé écran tactile |

> **Accès réseau local (salle de TP)** : remplacer `localhost` par l'IP de la machine hôte, ex: `http://192.168.1.X:3000`

---

## 🛠️ Stack Technique

| Catégorie | Technologie |
|-----------|-------------|
| UI Framework | React 18 |
| Rendu 3D | Three.js 0.158 + React Three Fiber |
| Helpers 3D | @react-three/drei |
| Post-processing | @react-three/postprocessing (bloom, aberration, vignette) |
| Animations 2D | Framer Motion + GSAP |
| State Management | Zustand |
| Styling | TailwindCSS |
| Audio | Web Audio API (sons synthétisés) |
| Build | Vite 4 |
| Déploiement | Docker + Nginx |

---

## 🎨 Inspiration Visuelle

| Œuvre | Élément emprunté |
|-------|-----------------|
| **Tron** | Grille néon, identité visuelle cyberpunk |
| **Interstellar** | Échelle cosmique, profondeur spatiale |
| **Matrix** | Flux de données, pluie de code |
| **Cyberpunk 2077** | Interface holographique, HUD futuriste |
| **Inside Out** | Visualisation interne des concepts |
| **No Man's Sky** | Navigation entre mondes |

---

## 📁 Structure du Projet

```
inside-rl/
├── src/
│   ├── worlds/           # Les 6 mondes 3D
│   │   ├── HubWorld.jsx
│   │   ├── DQNWorld.jsx
│   │   ├── PolicyWorld.jsx
│   │   ├── ActorCriticWorld.jsx
│   │   ├── TDWorld.jsx
│   │   ├── EnvironmentWorld.jsx
│   │   └── PPOWorld.jsx
│   ├── components/       # Composants réutilisables
│   │   ├── Scene3D.jsx        # Primitives 3D partagées
│   │   ├── GuideAI.jsx        # Guide IA narratif
│   │   ├── HUD.jsx            # Interface tête haute
│   │   ├── TrainingSimulator.jsx
│   │   ├── ConceptQuiz.jsx
│   │   ├── MathHolo.jsx
│   │   ├── NeuralEditor.jsx
│   │   ├── RLTimeline.jsx
│   │   ├── AlgoComparison.jsx
│   │   ├── AudioSystem.jsx
│   │   ├── PortalTransition.jsx
│   │   ├── PostFX.jsx
│   │   ├── IntroScreen.jsx
│   │   └── LoadingScreen.jsx
│   ├── store.js          # État global Zustand
│   ├── App.jsx           # Routeur de mondes
│   └── main.jsx
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── vite.config.js
```

---

## 👤 Auteur

**EL AIBOUDI MARYAM**
- Email : mariamelaiboudi@gmail.com
- École Nationale de l'Intelligence Artificielle et du Digital

---

*Inside Reinforcement Learning v1.0.0 — Mai 2026*
