# SF Sewage System Learning Simulation - Development Plan

## Project Overview

Building an educational game about the San Francisco sewage system using Phaser 3 + TypeScript. The game teaches basic sewage management through interactive simulation with fewer than 10 components, immediate feedback, and a cartoonish aesthetic.

## Development Phases

### Phase 1: Foundation & Setup

**Goal:** Establish project structure and core data models

#### Task 1: Project Setup ⏳

- [ ] Initialize Phaser 3 project with TypeScript configuration
- [ ] Set up build toolchain (Webpack/Vite)
- [ ] Configure `tsconfig.json` for game development
- [ ] Create basic project structure (`src/`, `assets/`, `public/`)

#### Task 2: Data Models ⏳

- [ ] Create TypeScript interfaces from PRD specifications:
  - `IGameComponent` (base interface)
  - `IPipe` (extends IGameComponent)
  - `INode` (extends IGameComponent with flowActive)
  - `IGameState` (systemHealth, components array, win condition)
  - `IAnalyticsEvent` (timestamp, eventType, componentId, details)
  - `IFeedback` (message, soundEffect type)
- [ ] Define `ComponentStatus` enum (HEALTHY, DAMAGED)

#### Task 3: Asset Loading System ⏳

- [ ] Create Phaser preloader scene
- [ ] Set up asset manifest and loading pipeline
- [ ] Prepare placeholder assets for development

### Phase 2: Core Simulation Engine

**Goal:** Build the foundational game mechanics and state management

#### Task 4: Main Game Scene ⏳

- [ ] Create primary GameScene class
- [ ] Implement static background rendering
- [ ] Create network layout with <10 components (pipes + nodes)
- [ ] Position components based on config file

#### Task 5: Simulation Manager ⏳

- [ ] Implement core SimulationManager class
- [ ] Build game state management (`IGameState`)
- [ ] Create component initialization logic
- [ ] Implement state update mechanisms

#### Task 6: Input System ⏳

- [ ] Build InputManager for mouse interactions
- [ ] Add component hover detection and visual feedback
- [ ] Implement click detection on game components
- [ ] Connect input events to simulation actions

### Phase 3: User Interface & Feedback

**Goal:** Create responsive UI and immediate player feedback systems

#### Task 7: UI Management System ⏳

- [ ] Create UIManager class
- [ ] Implement progressive health bar (green→yellow→red at 70%/30% thresholds)
- [ ] Build popup notification system with auto-dismiss
- [ ] Add sound effect integration

#### Task 8: Pipe Repair Mechanics ⏳

- [ ] Implement pipe repair action in SimulationManager
- [ ] Add visual state changes (healthy ↔ damaged sprites)
- [ ] Create repair feedback (popup + sound)
- [ ] Update health bar on successful repairs (+10 health)

#### Task 9: Water Flow Control ⏳

- [ ] Implement binary water flow toggle for nodes
- [ ] Add visual indicators for flow state (on/off sprites)
- [ ] Create flow adjustment feedback system
- [ ] Handle incorrect flow adjustments

### Phase 4: Game Systems & Logic

**Goal:** Implement health system, win conditions, and educational feedback

#### Task 10: Health System ⏳

- [ ] Implement health deterioration formulas:
  - Initial health: 100
  - Repair bonus: +10 per fixed pipe
  - Mismanagement penalty: TBD based on PRD
- [ ] Add real-time health bar updates
- [ ] Create health-based visual feedback

#### Task 11: Feedback & Education ⏳

- [ ] Create educational popup messages for actions
- [ ] Implement distinct sound effects (correct/incorrect)
- [ ] Add contextual hints for mismanagement
- [ ] Ensure immediate feedback for all interactions

#### Task 12: Win Condition System ⏳

- [ ] Implement win state detection (all pipes repaired)
- [ ] Create celebratory success message
- [ ] Add win state visual effects
- [ ] Trigger final analytics event

### Phase 5: Analytics & Polish

**Goal:** Complete the experience with tracking and final assets

#### Task 13: Analytics Integration ⏳

- [ ] Implement AnalyticsLogger class
- [ ] Add console logging for key events:
  - `pipe_repaired`
  - `mismanagement_error`
  - `game_won`
- [ ] Ensure event tracking throughout gameplay

#### Task 14: Art Assets ⏳

- [ ] Source or create cartoonish art assets:
  - `pipe_healthy.png`
  - `pipe_damaged.png`
  - `node_on.png` / `node_off.png`
  - `background.png`
  - `popup_background.png`
- [ ] Ensure consistent "cute" visual style

#### Task 15: Audio Assets ⏳

- [ ] Add sound effects:
  - `correct.mp3` (successful actions)
  - `incorrect.mp3` (errors/mismanagement)
- [ ] Test audio integration across browsers

### Phase 6: Testing & Deployment

**Goal:** Validate complete user experience and deploy

#### Task 16: Integration Testing ⏳

- [ ] Test all user stories from PRD:
  - Visual representation of sewage system ✓
  - Interactive repair and flow management ✓
  - Immediate action feedback ✓
  - System health indicator ✓
  - Clear win condition ✓
  - Friendly visual style ✓
- [ ] Cross-browser testing (Chrome, Firefox)
- [ ] Performance validation (30+ FPS, <5s load time)

#### Task 17: Deployment ⏳

- [ ] Choose hosting platform (GitHub Pages/Vercel/Netlify)
- [ ] Set up build pipeline for production
- [ ] Deploy static files
- [ ] Verify production functionality

## Technical Architecture Summary

### Core Classes

- **GameScene**: Main Phaser scene orchestrating the simulation
- **SimulationManager**: Game state and business logic
- **UIManager**: Health bar, popups, and audio feedback
- **InputManager**: Mouse interaction handling
- **AnalyticsLogger**: Console-based event tracking

### Key Implementation Details

- **Framework**: Phaser 3 + TypeScript
- **Architecture**: Monolithic client-side application
- **Data Storage**: In-memory only, no persistence
- **Interaction Model**: Simple point-and-click
- **Network Size**: <10 interactive components
- **Win Condition**: All pipes repaired
- **Health System**: 0-100 scale with visual color coding

## Success Criteria

- [ ] Functional prototype implementing core gameplay loop
- [ ] User can interact, repair, receive feedback, and win
- [ ] All user stories from PRD satisfied
- [ ] Deployed and accessible via web browser
- [ ] Maintains cartoonish, educational aesthetic

---

**Status Legend:**

- ⏳ Pending
- 🔄 In Progress
- ✅ Completed
- ❌ Blocked

_Last Updated: [Current Date]_
