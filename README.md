# BRANCHLY
<img width="3378" height="2006" alt="image" src="https://github.com/user-attachments/assets/2938b9db-6e4e-4780-a2c1-c6767fecaeac" />


### **Where Every Decision Takes a Different Path**

> An interactive AI-powered experience that explores choices, consequences, and alternate possibilities through branching journeys.

---

## Overview

**Branchly** is an interactive web-based AI experience designed around the idea that every decision creates a new path.

A single choice can lead to completely different outcomes. Branchly turns this concept into an interactive digital experience where users can explore different possibilities, understand how decisions affect outcomes, and navigate through branching scenarios.

Instead of presenting information as a traditional linear interface, Branchly uses a **branch-based journey** where each decision can open a new direction.

The project combines:

- Artificial Intelligence
- Branching decision paths
- Interactive storytelling
- Immersive visual design
- Modern web technologies
- Dynamic user choices
- Consequence exploration

---

# Key Idea

### **One choice. Multiple possibilities.**

Traditional applications generally follow:

```text
START → ACTION → RESULT
```

Branchly explores:

```text
                    ┌── PATH A ──→ OUTCOME A
                    │
START → DECISION ───┼── PATH B ──→ OUTCOME B
                    │
                    └── PATH C ──→ OUTCOME C
```

The purpose is to make users think about how different decisions can produce different outcomes.

---

# Problem Statement

Many digital experiences are linear.

Users are given:

1. A situation
2. A limited set of actions
3. A predefined result

This makes interaction predictable.

Branchly approaches the problem differently by creating a system where users can explore **multiple possible paths**.

Instead of asking:

> "What happens next?"

Branchly encourages users to ask:

> **"What could happen if I chose differently?"**

---

# Our Solution

Branchly creates an interactive branching environment where:

- Users begin with an initial situation.
- The system presents possible choices.
- Each choice leads to a different branch.
- The resulting branch can contain additional decisions.
- Users can explore alternate outcomes.
- AI can help generate or interpret the evolving journey.
- The experience visually represents the relationship between choices and outcomes.

This creates a more engaging and exploratory experience than a conventional linear interface.

---

# Features

## 1. Branching Paths

The core concept of Branchly is the branching journey.

Every major decision can create a new path.

```text
                    Choice A
                   ↙️
Starting Point → Decision
                   ↘️
                    Choice B
```

Users can explore different branches rather than being restricted to one predetermined sequence.

---

## 2. AI-Powered Interaction

Branchly can use AI to make the experience more dynamic.

AI can assist with:

- Generating possible scenarios
- Expanding decision branches
- Producing contextual outcomes
- Understanding user choices
- Creating alternative possibilities
- Continuing an interactive journey

This allows the experience to move beyond static content.

---

## 3. Multiple Outcomes

Different choices can result in different outcomes.

For example:

```text
Decision
   │
   ├── Choice A → Outcome A
   │
   ├── Choice B → Outcome B
   │
   └── Choice C → Outcome C
```

This makes the application useful for exploring **"what-if" scenarios**.

---

## 4. Interactive Navigation

Users can move through different branches of the experience.

The interface is designed to make the journey understandable while allowing users to explore alternative directions.

---

## 5. Consequence Exploration

Branchly focuses not only on the decision itself but also on what follows from that decision.

Users can compare:

- Different choices
- Different paths
- Different outcomes
- Different possibilities

---

## 6. Immersive Interface

The visual experience is designed to support the concept of branching.

The UI can use:

- Dark backgrounds
- Glowing elements
- Branch/tree-inspired visuals
- Smooth transitions
- Interactive cards
- Animated paths
- Atmospheric effects

The goal is to make the interface feel like an **interactive journey rather than a conventional webpage**.

---

# User Experience

A typical Branchly journey can follow this flow:

```text
        LANDING PAGE
             │
             ▼
       START JOURNEY
             │
             ▼
        INITIAL SCENARIO
             │
             ▼
          CHOICES
        ↙️    ↓    ↘️
      A      B      C
      │      │      │
      ▼      ▼      ▼
   RESULT  RESULT  RESULT
      │      │      │
      └──────┼──────┘
             ▼
      EXPLORE AGAIN
```

---

# Application Architecture

A simplified architecture can be represented as:

```text
                 ┌─────────────────┐
                 │     USER        │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   BRANCHLY UI   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Decision Engine │
                 └────────┬────────┘
                          │
                 ┌────────┴────────┐
                 ▼                 ▼
          ┌─────────────┐   ┌─────────────┐
          │ Branch Data │   │ AI Layer    │
          └──────┬──────┘   └──────┬──────┘
                 │                 │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │    Outcome      │
                 └─────────────────┘
```

---

# Main Components

## Frontend

The frontend is responsible for:

- Rendering the user interface
- Displaying scenarios
- Showing available choices
- Managing navigation
- Displaying branch information
- Providing animations and interactions

---

## Decision Engine

The decision engine controls the relationship between:

```text
Current State
      ↓
User Choice
      ↓
Next Branch
      ↓
New State
```

This allows the experience to move dynamically from one branch to another.

---

## AI Layer

The AI component can be responsible for generating or interpreting content based on:

- Current scenario
- Previous decisions
- Selected branch
- User input
- Desired outcome

---

# 🛠️ Technology Stack

> Replace these entries with the exact technologies used in the prototype if they differ.

### Frontend

- HTML
- CSS
- JavaScript
- React / modern frontend framework

### AI

- Generative AI
- Large Language Model
- Prompt-based scenario generation

### Development

- Git
- GitHub
- AI-assisted development

### Deployment

- Web-based deployment
- AI Studio / hosted web environment

---

# Suggested Project Structure

```text
branchly/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── LandingPage
│   │   ├── Scenario
│   │   ├── ChoiceCard
│   │   ├── Branch
│   │   └── Outcome
│   │
│   ├── data/
│   │   └── scenarios
│   │
│   ├── services/
│   │   └── ai
│   │
│   ├── styles/
│   │   └── global
│   │
│   └── App
│
├── README.md
├── package.json
└── .gitignore
```

---

# How Branchly Works

### Step 1 — Start

The user enters the Branchly experience.

### Step 2 — Scenario

The system presents an initial situation.

### Step 3 — Decision

The user selects one of the available choices.

### Step 4 — Branch

The selected choice determines the next branch.

### Step 5 — Outcome

The system generates or displays the corresponding result.

### Step 6 — Exploration

The user can explore another branch and compare the outcomes.

---

# Design Philosophy

Branchly's visual language is based around the concept of **possibility**.

The design represents:

### Darkness

Represents the unknown.

### Branches

Represent choices and possibilities.

### Glow

Represents discovering a new path.

### Movement

Represents decisions changing the journey.

The interface therefore aims to feel mysterious, exploratory, and futuristic.

---

# Example Journey

Consider a simple scenario:

```text
You have an important decision to make.

             DECISION
            /        \
           /          \
      OPTION A      OPTION B
         │              │
         ▼              ▼
     OUTCOME A      OUTCOME B
         │              │
         └──────┬───────┘
                ▼
          COMPARE PATHS
```

The user can then return to the decision and explore the alternative.

---

# Why Branchly?

Branchly is designed around a simple observation:

> **Every decision creates a possibility that did not exist before.**

Instead of treating decisions as isolated actions, Branchly presents them as connected paths.

This makes the experience useful for:

- Interactive storytelling
- Scenario exploration
- Decision-based experiences
- Educational simulations
- Creative experimentation
- AI-generated narratives
- "What-if" exploration

---

# Innovation

The innovation of Branchly lies in combining:

**AI + branching logic + interactive storytelling**

into one experience.

Rather than simply asking an AI a question and receiving a response, Branchly creates a **visual and interactive journey around the response**.

<img width="3388" height="2000" alt="image" src="https://github.com/user-attachments/assets/1696fc85-0055-4a62-9c68-ccad526142b3" />
---

# Privacy & Safety

Branchly should avoid collecting unnecessary personal information.

If user-generated content or AI APIs are involved:

- Avoid exposing API keys in frontend code.
- Do not store sensitive information unnecessarily.
- Validate user input.
- Use environment variables for secrets.
- Follow the policies of the AI provider being used.

Example:

```env
AI_API_KEY=your_api_key_here
```

Never commit real API keys to GitHub.

---

# Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project:

```bash
cd branchly
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in the terminal.

---

# Deployment

Branchly can be deployed using a modern web-hosting platform.

Typical deployment process:

```text
GitHub Repository
       ↓
Connect Repository
       ↓
Configure Build
       ↓
Deploy
       ↓
Live Branchly Experience
```

Before deployment, make sure:

- Environment variables are configured.
- API keys are not exposed.
- Production builds work correctly.
- All assets load correctly.
- Navigation works on mobile and desktop.

---

# Development Workflow

```text
Idea
 ↓
Prototype
 ↓
Design
 ↓
Build
 ↓
AI Integration
 ↓
Testing
 ↓
Deployment
```

---

# Testing Checklist

Before submitting or deploying Branchly:

### Interface

- [ ] Landing page loads
- [ ] Buttons work
- [ ] Navigation works
- [ ] Branches display correctly
- [ ] Animations do not break the experience

### Functionality

- [ ] User can select choices
- [ ] Correct branch opens
- [ ] Outcomes are displayed
- [ ] Users can explore alternative paths

### AI

- [ ] AI responses are generated correctly
- [ ] Invalid input is handled
- [ ] API failures have fallback behavior
- [ ] API keys remain private

### Responsive Design

- [ ] Desktop layout works
- [ ] Laptop layout works
- [ ] Tablet layout works
- [ ] Mobile layout works

---

# Future Improvements

Possible future versions of Branchly could include:

### Shared Journeys

Allow users to share a generated branch journey with others.

### Deeper Branch Trees

Create journeys with many levels of decisions.

### Path Analytics

Show which branches users explore most.

### More Advanced AI

Allow AI to dynamically construct complex decision trees.

### Multiple Story Modes

Introduce different scenario categories such as:

- Mystery
- Adventure
- Education
- Career
- Fiction
- Simulation

### Multiplayer Branching

Allow multiple users to make decisions together.

### Journey History

Save previously explored journeys.

### Custom Scenarios

Allow users to create their own branching worlds.

---

# Hackathon Value

Branchly demonstrates how AI can be used for more than traditional chatbot interactions.

The project focuses on creating an **experience around AI**.

Instead of:

```text
USER → AI → TEXT
```

Branchly explores:

```text
USER
  ↓
DECISION
  ↓
AI
  ↓
BRANCH
  ↓
OUTCOME
  ↓
NEW POSSIBILITY
```

This makes AI part of an interactive system rather than simply a conversational interface.


# Demo

**Live Demo:**
https://branchly-1.ai.studio

# Team

### Team Branchly

| Vanshika | Frontend  |
| Seemakurthi Koushitha | AI / Logic |
| Syed Shaguftah Mahnoor | UI/UX |
| Siddhika K | Research |

---

# Project Goals

The main goals of Branchly are to:

1. Make AI interaction more immersive.
2. Represent decisions visually.
3. Allow users to explore alternative outcomes.
4. Combine storytelling with AI.
5. Build an engaging web experience.
6. Demonstrate the creative possibilities of generative AI.

---

# Vision

Branchly is built around one idea:

> **The future isn't a single path. It's a tree of possibilities.**

Every decision creates another branch.

Every branch creates another possibility.

And every possibility tells another story.

---

# Conclusion

**Branchly** transforms decision-making into an interactive exploration of possibilities.

By combining AI, branching logic, and immersive design, the project creates a digital environment where users can explore not only **what happened**, but also:

> **What could have happened?**

That is the world Branchly is designed to explore.


---

## Acknowledgements

- Generative AI technologies used during development
- AI Studio / development tools
- Open-source libraries and frameworks used by the project
- Hackathon organizers and mentors
- Everyone who contributed feedback and testing

---

## Final Thought

```text
ONE DECISION.
MANY PATHS.
INFINITE POSSIBILITIES.

             🌳
            /  \
           /    \
          /      \
       PATH A   PATH B
          \      /
           \    /
            \  /
          BRANCHLY
```

**Explore the path you didn't take.**
