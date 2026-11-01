# AI MYSTERY ROOM
## Master Specification Sheet
**Specification-Driven Development (SDD) | Single Source of Truth for Codex**

**Project Name:** AI Mystery Room  
**Project Type:** AI-Powered Interactive Mystery Investigation Platform  
**Development Approach:** Specification-Driven Development  
**Frontend:** React.js  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**AI Integration:** Google Gemini API  
**Architecture:** MERN Stack  
**Document Version:** 1.0  
**Status:** Initial Development Specification

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is an AI-powered interactive mystery investigation platform where users become detectives and solve fictional investigation cases generated dynamically using Artificial Intelligence.

Users provide a short scenario, story, or mystery idea. Based on that input, the AI generates a complete fictional investigation containing:

- A mystery storyline.
- A crime or suspicious incident.
- Multiple suspects.
- One actual culprit.
- Suspect profiles and backgrounds.
- Evidence and clues.
- WhatsApp conversations.
- Images and photographs.
- CCTV footage or simulated camera recordings.
- Witness statements.
- Investigation reports.
- Hidden clues and misleading evidence.

The user investigates the generated case by examining the available evidence, identifying contradictions, connecting clues, and finally selecting the person they believe is responsible.

The system evaluates the user's decision and provides the actual culprit, an explanation, and a breakdown of the evidence.

## 1.2 Core Concept

**User Input → AI Mystery Generation → Evidence Collection → Investigation → Culprit Selection → AI Evaluation → Final Verdict**

The main objective is to provide an immersive detective experience in which every mystery is dynamically generated instead of relying on predefined cases.

## 1.3 Product Vision

To create an interactive AI-powered detective experience where users can investigate unique fictional mysteries, analyze digital evidence, uncover hidden connections, and test their detective skills.

---

# 2. PROJECT OBJECTIVES

The platform must:

1. Allow users to create mysteries using their own story prompts.
2. Generate logically consistent investigation scenarios using Gemini.
3. Generate multiple suspects with different backgrounds and motives.
4. Create a single, predetermined culprit for each mystery.
5. Generate different forms of fictional evidence.
6. Allow users to inspect evidence individually.
7. Provide an interactive investigation interface.
8. Prevent users from accessing the culprit before submitting their answer.
9. Evaluate the user's final suspect selection.
10. Reveal the complete investigation explanation after submission.
11. Save completed and ongoing investigations.
12. Provide a responsive and immersive detective-themed UI.

---

# 3. TARGET USERS

- People interested in mystery-solving games.
- Detective and crime-story enthusiasts.
- Students interested in logical reasoning.
- Users who enjoy interactive storytelling.
- Casual gamers looking for AI-generated challenges.

---

# 4. TECHNOLOGY STACK

## 4.1 Frontend

| Technology | Purpose |
|---|---|
| React.js | Frontend application |
| Vite | Development and build tool |
| React Router | Client-side routing |
| Tailwind CSS | Styling and responsive design |
| Axios | Backend API communication |
| Lucide React | Icons |
| Framer Motion | Animations |
| Context API | Global application state |

## 4.2 Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| bcrypt | Password hashing |
| Multer | File uploads, if required |
| Google Gemini API | Mystery and evidence generation |

## 4.3 AI Integration

**Primary AI provider: Google Gemini**

Gemini will be responsible for:

- Understanding user-provided scenarios.
- Designing the mystery.
- Creating suspects.
- Establishing the actual culprit.
- Generating evidence.
- Creating conversations and witness statements.
- Ensuring evidence consistency.
- Evaluating the final investigation.

### AI Architecture Rule

All AI operations must happen on the backend.

The Gemini API key must never be exposed in frontend code.

Use environment variables:

- GEMINI_API_KEY
- MONGODB_URI
- JWT_SECRET
- CLIENT_URL
- PORT

For image and video generation, implement separate provider adapters. Gemini should orchestrate the content and define the required media. Connect an image or video generation provider compatible with the available API capabilities.

If a media provider is unavailable, use clearly labeled simulated evidence or a generated media fallback. Never represent a text simulation as an actual generated video.

---

# 5. APPLICATION MODULES

The application is divided into the following major modules:

1. Authentication Module
2. Dashboard Module
3. Mystery Creation Module
4. AI Mystery Generation Module
5. Suspect Management Module
6. Evidence Generation Module
7. Investigation Room Module
8. Evidence Viewer Module
9. Culprit Selection Module
10. AI Evaluation Module
11. Results and Explanation Module
12. Investigation History Module

---

# 6. USER AUTHENTICATION

## 6.1 Registration

Users should be able to register using:

- Full name
- Email address
- Password
- Confirm password

Requirements:

- Validate email format.
- Enforce password requirements.
- Check whether the email already exists.
- Hash passwords using bcrypt.
- Store user information in MongoDB.
- Return a JWT after successful registration.

## 6.2 Login

Login fields:

- Email
- Password

Requirements:

- Verify credentials.
- Generate JWT.
- Maintain authenticated sessions.
- Protect private routes.
- Provide logout functionality.

## 6.3 Guest Mode

For the MVP, guest access is optional. If implemented, guests must be able to create and play a mystery without an account, but persistent history should require registration.

---

# 7. APPLICATION PAGES

## 7.1 Landing Page

Route: `/`

Purpose: Introduce AI Mystery Room and encourage users to start investigating.

Components:

- Application logo and navigation.
- Hero section.
- Main heading: "Every Mystery Has a Secret. Can You Find It?"
- Short product description.
- Primary CTA: "Enter Mystery Room".
- Secondary CTA: "How It Works".
- Feature cards.
- How-it-works section.
- Footer.

Design direction:

- Dark detective-themed interface.
- Charcoal and black backgrounds.
- Red accent color.
- Off-white typography.
- Subtle animations.
- Evidence-board-inspired graphics.

## 7.2 Authentication Pages

Routes:

- `/login`
- `/register`

Provide clean forms with validation, loading indicators, and error messages.

## 7.3 Dashboard

Route: `/dashboard`

Purpose: Central hub for users.

Components:

- Welcome message.
- Create New Mystery button.
- Active investigations.
- Completed investigations.
- Recent cases.
- Statistics:
  - Total cases created.
  - Cases solved.
  - Correct investigations.
  - Average detective score.

Each investigation card should display:

- Mystery title.
- Difficulty.
- Creation date.
- Status.
- Progress.
- Continue or View Results button.

## 7.4 Mystery Creation Page

Route: `/create-mystery`

This is where the user provides the initial scenario.

Input fields:

**A. Mystery Scenario**

A large text area where the user describes the mystery.

Example:

"A famous businessman was found unconscious inside his locked office at midnight. Three people had access to the building. One of them is hiding something."

**B. Mystery Settings**

- Mystery category:
  - Murder mystery (fictional and non-graphic).
  - Theft.
  - Disappearance.
  - Corporate conspiracy.
  - Cyber mystery.
  - General mystery.

- Difficulty:
  - Easy
  - Medium
  - Hard

- Number of suspects:
  - 3
  - 4
  - 5
  - 6

- Evidence complexity:
  - Basic
  - Intermediate
  - Advanced

- Optional custom title.

**C. Generate Mystery**

Button: "Generate Mystery"

On clicking:

1. Validate user input.
2. Send scenario and settings to backend.
3. Create a mystery generation job.
4. Generate the mystery using Gemini.
5. Generate or prepare evidence assets.
6. Validate the generated investigation.
7. Save the completed mystery.
8. Navigate to the investigation room.

Display a loading screen with messages such as:

- Analyzing your scenario...
- Creating suspects...
- Building the investigation...
- Generating evidence...
- Preparing your mystery room...

Do not expose the actual culprit during this process.

---

# 8. AI MYSTERY GENERATION ENGINE

This is the most important component of the application.

## 8.1 Generation Workflow

The backend must send a structured prompt to Gemini.

Gemini must return structured JSON containing:

1. Mystery metadata.
2. Main storyline.
3. Incident description.
4. Timeline.
5. Suspects.
6. Actual culprit.
7. Motives.
8. Evidence.
9. Hidden clues.
10. Red herrings.
11. Final explanation.

## 8.2 Mystery Generation Rules

Every mystery must follow these rules:

- Exactly one actual culprit.
- At least three suspects.
- Every suspect must have a believable background.
- Every suspect must have a possible motive or reason for suspicion.
- Every suspect must have an alibi or account of their activities.
- Evidence must be logically consistent with the storyline.
- At least two clues should meaningfully support the correct conclusion.
- At least one misleading clue should exist.
- The culprit must be identifiable through the available evidence.
- There must not be contradictory facts that make the mystery impossible to solve.
- The final explanation must connect the clues logically.

The AI must generate the complete solution before the investigation starts.

**Important:** The culprit and solution must remain server-side and must never be included in public API responses until the user submits their final answer.

## 8.3 Structured Mystery Output

The following is the logical structure expected from Gemini.

```json
{
  "title": "The Midnight Office Mystery",
  "category": "Theft",
  "difficulty": "Medium",
  "description": "A valuable diamond disappeared...",
  "incident": {
    "location": "Executive Office",
    "date": "2026-10-20",
    "time": "23:45",
    "description": "..."
  },
  "suspects": [
    {
      "suspectId": "S1",
      "name": "Alex Morgan",
      "age": 32,
      "occupation": "Office Manager",
      "background": "...",
      "motive": "...",
      "alibi": "...",
      "publicProfile": "..."
    }
  ],
  "timeline": [],
  "evidence": [],
  "solution": {
    "culpritId": "S2",
    "motive": "...",
    "method": "...",
    "explanation": "...",
    "supportingEvidenceIds": []
  }
}
```

This is an illustrative schema. Production generation must include all required fields and must be validated before saving.

---

# 9. SUSPECT MANAGEMENT

Each mystery should contain 3–6 suspects.

Every suspect profile should include:

- Suspect ID.
- Name.
- Age.
- Occupation.
- Background.
- Relationship with the victim or incident.
- Possible motive.
- Alibi.
- Suspicious behavior.
- Profile image or avatar.

Users must be able to:

- View suspect profiles.
- Compare suspect information.
- Review their alibis.
- Revisit suspect details while investigating.

Do not reveal a field called `isCulprit` or any equivalent information in frontend responses.

---

# 10. EVIDENCE GENERATION ENGINE

The platform must generate multiple forms of fictional evidence.

Every piece of evidence must be connected to the mystery storyline.

## 10.1 Evidence Types

### A. WhatsApp Messages

Generate fictional chat conversations between relevant characters.

Display:

- Sender name.
- Receiver name.
- Timestamp.
- Message content.
- Conversation bubbles.
- Optional attachment indicators.

Requirements:

- Use realistic conversation formatting.
- Include relevant clues.
- Maintain consistent timestamps.
- Allow users to inspect the complete conversation.
- Use fictional identities and numbers.

### B. Images and Photographs

Generate fictional investigation images, such as:

- Crime scene photographs.
- Suspicious objects.
- Office or room photographs.
- Photographs of relevant locations.
- Documents and handwritten notes.

Requirements:

- Use an image-generation provider.
- Store generated image URLs or storage references.
- Provide an image viewer.
- Support zooming and full-screen viewing.
- Include captions and evidence descriptions.

### C. CCTV Recordings

Provide fictional security camera evidence.

Each CCTV item should contain:

- Camera ID.
- Camera location.
- Recording date.
- Recording time.
- Video or simulated recording.
- Timestamp information.
- Investigation notes.

Preferred implementation:

Generate actual short video clips through a compatible video-generation provider.

If actual video generation is unavailable, provide a clearly labeled simulated CCTV viewer with:

- Camera-style interface.
- Timeline.
- Frame-by-frame visual evidence where available.
- AI-generated scene description.
- Recording transcript.

Do not claim that a simulated sequence is real video footage.

### D. Witness Statements

Generate statements from:

- Security guards.
- Employees.
- Neighbors.
- Witnesses.
- People connected to the incident.

Each statement must include:

- Witness name.
- Statement.
- Timestamp.
- Location.
- Related suspect, if applicable.

### E. Documents

Generate fictional documents such as:

- Investigation reports.
- Emails.
- Receipts.
- Access logs.
- Letters.
- Transaction records.
- Security access records.

Each document must have a viewer that supports readable formatting.

## 10.2 Evidence Metadata

Every evidence item should contain:

- Evidence ID.
- Evidence title.
- Evidence type.
- Description.
- Content.
- Asset URL, if applicable.
- Timestamp.
- Related suspect IDs.
- Discovery status.
- Relevance metadata (internal only).

**Security rule:** Never expose internal relevance scores, culprit associations, or solution explanations through public evidence APIs.

## 10.3 Evidence Generation Consistency

The evidence generation process must use the already-generated mystery solution as its source of truth.

Evidence must not independently invent new facts that contradict the original mystery.

The system should validate:

- Timestamps.
- Character names.
- Locations.
- Suspect references.
- Event chronology.
- Evidence-to-solution relationships.

---

# 11. INVESTIGATION ROOM

Route: `/investigation/:mysteryId`

This is the main gameplay interface.

## 11.1 Layout

Use a professional detective investigation dashboard.

Suggested layout:

**Left Sidebar:**
- Mystery overview.
- Investigation progress.
- Suspect list.
- Evidence categories.

**Main Area:**
- Investigation title.
- Incident overview.
- Evidence cards.
- Interactive evidence viewer.

**Right Sidebar:**
- Investigation notes.
- Suspect details.
- Case timeline.
- Final accusation panel.

On smaller screens, sidebars should become collapsible panels or tabs.

## 11.2 Evidence Board

All generated evidence should appear as individual cards.

Example:

| Evidence | Type |
|---|---|
| Conversation with Alex | WhatsApp |
| Office Photograph | Image |
| Camera 03 Recording | CCTV |
| Security Guard Statement | Witness |
| Building Access Log | Document |

Users can click any evidence card to open its details.

Evidence must remain accessible throughout the investigation.

## 11.3 Investigation Notes

Allow users to write their own notes.

Requirements:

- Add notes.
- Edit notes.
- Delete notes.
- Save notes to the backend.
- Associate notes with a particular mystery.

## 11.4 Investigation Progress

Display:

- Total evidence items.
- Evidence inspected.
- Suspects reviewed.
- Investigation completion percentage.

The progress indicator must be based on actual user interactions.

---

# 12. CULPRIT SELECTION MODULE

When the user finishes investigating, they can submit their final accusation.

## 12.1 Accusation Interface

Display all suspects as selectable cards.

Each card contains:

- Profile image.
- Name.
- Occupation.
- Short background.

The user selects exactly one suspect.

Optional field:

"Why do you think this person is responsible?"

This allows the user to explain their reasoning.

## 12.2 Submit Accusation

Button: "Submit Final Verdict"

Before submission:

- Confirm the selected suspect.
- Show a confirmation dialog.
- Prevent accidental submissions.

After submission:

- Save the selected suspect.
- Save the user's explanation.
- Compare the selected suspect with the actual culprit.
- Mark the investigation as completed.
- Reveal the final solution.

Users must not be allowed to repeatedly submit different suspects to improve their score.

For the MVP, the final accusation is permanent.

---

# 13. AI EVALUATION ENGINE

After the user submits their answer, Gemini may evaluate the reasoning.

The backend should compare:

1. Selected suspect.
2. Actual culprit.
3. User's written explanation.
4. Supporting evidence.
5. Logical consistency.

## 13.1 Evaluation Output

Display:

- Correct or incorrect verdict.
- Actual culprit.
- Correct motive.
- Explanation of how the incident happened.
- Important evidence.
- Clues the user may have missed.
- Why other suspects were not responsible.
- Feedback on the user's reasoning.

## 13.2 Detective Score

Use a transparent score out of 100.

Suggested scoring:

| Parameter | Weight |
|---|---:|
| Correct culprit selection | 60 |
| Evidence-based reasoning | 25 |
| Logical explanation | 15 |
| Total | 100 |

Rules:

- Correct culprit selection earns 60 points.
- Evidence-based reasoning is evaluated using the available evidence.
- Logical explanation is evaluated for consistency.
- Incorrect culprit selection cannot earn the culprit-selection points.
- The AI must not award points for unsupported claims.

The score must be stored in MongoDB.

---

# 14. RESULTS PAGE

Route: `/results/:mysteryId`

Display:

1. Investigation title.
2. User's selected suspect.
3. Actual culprit.
4. Correct/incorrect status.
5. Detective score.
6. Culprit's motive.
7. Incident explanation.
8. Important evidence.
9. Missed clues.
10. Explanation of other suspects.
11. Overall detective feedback.

Actions:

- Return to Dashboard.
- View Investigation Again.
- Start New Mystery.

The results page should only become accessible after final accusation submission.

---

# 15. INVESTIGATION HISTORY

Route: `/history`

Display all mysteries created by the authenticated user.

Each record should include:

- Mystery title.
- Category.
- Difficulty.
- Creation date.
- Investigation status.
- Detective score, if completed.

Users should be able to:

- Resume unfinished mysteries.
- View completed investigations.
- Delete their own mysteries.

Deleting a mystery must also handle its associated evidence assets and storage references appropriately.

---

# 16. DATABASE DESIGN

Use MongoDB with Mongoose.

## 16.1 User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 16.2 Mystery Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  scenario: String,
  category: String,
  difficulty: String,
  status: String,
  description: String,
  incident: Object,
  timeline: Array,
  suspects: Array,
  evidence: Array,
  solution: {
    culpritId: String,
    motive: String,
    method: String,
    explanation: String,
    supportingEvidenceIds: Array
  },
  generationStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Critical:** The solution must be protected from normal user-facing API responses. It must only be accessed by authorized backend logic.

## 16.3 Investigation Collection

```javascript
{
  _id: ObjectId,
  mysteryId: ObjectId,
  userId: ObjectId,
  inspectedEvidenceIds: Array,
  reviewedSuspectIds: Array,
  notes: [
    {
      content: String,
      createdAt: Date,
      updatedAt: Date
    }
  ],
  selectedSuspectId: String,
  userReasoning: String,
  score: Number,
  evaluation: Object,
  status: String,
  startedAt: Date,
  completedAt: Date
}
```

## 16.4 Asset Collection (Recommended)

```javascript
{
  _id: ObjectId,
  mysteryId: ObjectId,
  evidenceId: String,
  assetType: String,
  provider: String,
  storageUrl: String,
  generationStatus: String,
  createdAt: Date
}
```

Use references for large media assets instead of storing binary image or video data directly inside MongoDB documents.

---

# 17. BACKEND API DESIGN

Base URL: `/api`

## 17.1 Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout |

## 17.2 Mystery

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/mysteries/generate` | Start mystery generation |
| GET | `/mysteries` | Get user's mysteries |
| GET | `/mysteries/:id` | Get mystery overview |
| GET | `/mysteries/:id/status` | Get generation status |
| DELETE | `/mysteries/:id` | Delete mystery |

## 17.3 Evidence

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/mysteries/:id/evidence` | Get evidence list |
| GET | `/mysteries/:id/evidence/:evidenceId` | Get evidence details |

## 17.4 Investigation

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/investigations/:mysteryId/start` | Start investigation |
| GET | `/investigations/:mysteryId` | Get investigation progress |
| PATCH | `/investigations/:mysteryId/progress` | Update progress |
| PATCH | `/investigations/:mysteryId/notes` | Update notes |
| POST | `/investigations/:mysteryId/accuse` | Submit final accusation |
| GET | `/investigations/:mysteryId/results` | Get final results |

## 17.5 API Response Standards

Use consistent JSON responses.

Successful response:

```json
{
  "success": true,
  "message": "Mystery generated successfully",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Unable to generate mystery",
  "error": {
    "code": "GENERATION_FAILED"
  }
}
```

Use appropriate HTTP status codes:

- 200: Successful request.
- 201: Resource created.
- 202: Generation accepted and processing.
- 400: Invalid request.
- 401: Unauthorized.
- 403: Forbidden.
- 404: Resource not found.
- 409: Conflict.
- 422: Validation error.
- 429: Rate limit exceeded.
- 500: Internal server error.
- 503: AI provider unavailable.

---

# 18. AI PROMPT ENGINEERING

Create a dedicated AI service layer.

Suggested files:

- `gemini.service.js`
- `mysteryGeneration.service.js`
- `evidenceGeneration.service.js`
- `evaluation.service.js`
- `mediaGeneration.service.js`

## 18.1 Mystery Generation System Prompt

The system prompt must instruct Gemini:

"You are an expert fictional mystery writer and investigation designer.

Your task is to create a complete, logically consistent detective investigation based on the scenario supplied by the user.

Generate a mystery containing:

1. A compelling incident.
2. Three to six unique suspects.
3. Exactly one actual culprit.
4. A believable motive for every suspect.
5. Consistent alibis.
6. A chronological event timeline.
7. Multiple forms of evidence.
8. Meaningful clues that allow the actual culprit to be identified.
9. At least one misleading clue.
10. A complete solution explaining the incident.

All evidence must be consistent with the predetermined solution.

Do not create contradictions that make the case unsolvable.

Return valid JSON matching the required schema.

The solution must be generated and stored separately from all player-visible information."

## 18.2 Evidence Generation Prompt

"You are an investigation evidence designer.

Using the supplied mystery, generate realistic fictional evidence.

Evidence must contain clues that support the existing mystery solution without directly announcing the culprit.

Maintain consistency in names, timestamps, locations, events, and character relationships.

Generate the requested evidence type in the specified structured format."

## 18.3 Evaluation Prompt

"You are an impartial detective investigation evaluator.

Evaluate the user's accusation using the actual solution and available evidence.

Assess whether the selected suspect is correct and whether the user's explanation logically references the evidence.

Return structured JSON containing:

- Correctness.
- Detective score.
- Reasoning assessment.
- Supporting evidence.
- Missed clues.
- Explanation of the correct solution.

Do not change the predetermined culprit or mystery facts."

**AI Reliability Rule:** Gemini must not be allowed to independently redefine the culprit during evaluation. The original saved solution is authoritative.

---

# 19. SECURITY REQUIREMENTS

Security is mandatory.

1. Store API keys only in backend environment variables.
2. Hash passwords with bcrypt.
3. Authenticate protected API routes.
4. Verify resource ownership before accessing or modifying mysteries.
5. Prevent users from accessing another user's investigations.
6. Never expose the actual culprit before submission.
7. Never expose private solution fields through public APIs.
8. Validate all incoming data.
9. Implement request rate limiting.
10. Protect against NoSQL injection.
11. Sanitize user-generated content.
12. Restrict upload file types and sizes.
13. Prevent unauthorized result access.
14. Do not trust AI-generated JSON without schema validation.
15. Handle AI provider errors safely.
16. Never use frontend-supplied scores or correctness values as authoritative.

All mysteries must be fictional. Generated conversations, photographs, recordings, and documents must be presented as fictional game evidence, not authentic real-world investigative material.

---

# 20. UI/UX DESIGN SYSTEM

## 20.1 Theme

**Theme:** Dark Detective / Crime Investigation Dashboard.

Suggested colors:

| Element | Color |
|---|---|
| Main Background | #0B0D12 |
| Secondary Background | #151922 |
| Card Background | #1B202B |
| Primary Accent | #C83C45 |
| Secondary Accent | #D6A85F |
| Main Text | #F5F5F5 |
| Muted Text | #9299A6 |
| Borders | #303642 |

## 20.2 Design Requirements

- Premium detective-themed appearance.
- Consistent spacing.
- Clean typography.
- Smooth transitions.
- Responsive layouts.
- Interactive evidence cards.
- Animated loading screens.
- Hover effects.
- Proper empty states.
- Error and success notifications.
- Skeleton loaders.
- Confirmation dialogs.

Avoid making the interface look like a generic admin dashboard.

The investigation room should feel like an actual digital detective workspace.

## 20.3 Responsive Design

Support:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

All core functionality must work on mobile.

---

# 21. PROJECT FOLDER STRUCTURE

Use a modular structure.

```text
ai-mystery-room/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── mystery/
│       │   ├── evidence/
│       │   └── investigation/
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── CreateMysteryPage.jsx
│       │   ├── InvestigationPage.jsx
│       │   ├── ResultsPage.jsx
│       │   └── HistoryPage.jsx
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── routes/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   └── ai/
│   ├── validators/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── docs/
│   └── SPEC.md
│
├── .gitignore
└── README.md
```

The folder structure may be extended as required, but responsibilities must remain modular.

---

# 22. ERROR HANDLING

The application must gracefully handle:

- Gemini API failures.
- Invalid AI-generated JSON.
- Image generation failures.
- Video generation failures.
- MongoDB connection failures.
- Authentication errors.
- Network interruptions.
- Invalid mystery prompts.
- Duplicate submissions.
- Missing evidence.
- Invalid mystery IDs.
- Expired JWTs.

For long-running generation tasks:

- Use asynchronous generation.
- Return a job or mystery ID immediately.
- Provide a generation-status endpoint.
- Save generation progress.
- Allow the frontend to poll the status.
- Avoid blocking a single HTTP request while generating multiple media assets.

Failed media generation should not corrupt the mystery. Retry where appropriate and provide a clear fallback.

---

# 23. PERFORMANCE REQUIREMENTS

1. Lazy-load images and videos.
2. Paginate investigation history.
3. Avoid unnecessarily large API responses.
4. Use database indexes for frequently queried fields.
5. Generate evidence asynchronously.
6. Cache appropriate static resources.
7. Avoid repeated Gemini API calls for existing evidence.
8. Store generated assets in external object storage.
9. Limit media file sizes.
10. Optimize frontend rendering.

---

# 24. MVP DEVELOPMENT PRIORITIES

Build the project in phases.

## Phase 1: Foundation

- Initialize MERN project.
- Configure MongoDB.
- Configure React and Tailwind CSS.
- Implement authentication.
- Create common UI components.
- Create landing page and dashboard.

## Phase 2: Mystery Generation

- Integrate Gemini.
- Build mystery generation service.
- Define JSON schemas.
- Generate suspects.
- Generate culprit and solution.
- Validate AI responses.
- Save mysteries in MongoDB.

## Phase 3: Evidence Generation

- Generate WhatsApp conversations.
- Generate witness statements.
- Generate documents.
- Integrate image generation.
- Implement the media provider abstraction.
- Integrate video generation where available.
- Build evidence viewer.

## Phase 4: Investigation Gameplay

- Build investigation dashboard.
- Display suspects.
- Display evidence.
- Implement evidence inspection.
- Implement notes.
- Implement investigation progress.
- Implement accusation submission.

## Phase 5: Evaluation

- Implement answer verification.
- Integrate Gemini reasoning evaluation.
- Calculate detective score on backend.
- Build results page.
- Implement investigation history.

## Phase 6: Testing and Deployment

- Test authentication.
- Test mystery generation.
- Test evidence consistency.
- Test culprit confidentiality.
- Test investigation workflow.
- Test responsive UI.
- Optimize application.
- Deploy frontend and backend.

---

# 25. ACCEPTANCE CRITERIA

The project is considered MVP-complete only when all the following requirements work.

### Authentication

- [ ] Users can register.
- [ ] Users can log in.
- [ ] Passwords are hashed.
- [ ] Protected routes work.

### Mystery Generation

- [ ] Users can submit their own scenario.
- [ ] Gemini generates a complete mystery.
- [ ] At least three suspects are created.
- [ ] Exactly one culprit exists.
- [ ] A complete solution is saved.
- [ ] Mystery generation errors are handled.

### Evidence Generation

- [ ] WhatsApp evidence is generated.
- [ ] Witness statements are generated.
- [ ] Documents are generated.
- [ ] Image evidence is generated when the image provider is configured.
- [ ] CCTV evidence is available through actual generated video or an explicitly labeled simulation.
- [ ] Evidence remains consistent with the mystery.

### Investigation

- [ ] Users can view all suspects.
- [ ] Users can open evidence.
- [ ] Users can write investigation notes.
- [ ] Investigation progress is saved.
- [ ] Users can resume unfinished investigations.

### Culprit Selection

- [ ] Users can select one suspect.
- [ ] Users can submit their reasoning.
- [ ] Duplicate final submissions are prevented.
- [ ] The actual culprit is hidden before submission.

### Results

- [ ] Correct and incorrect answers are identified.
- [ ] The correct culprit is revealed.
- [ ] The solution is explained.
- [ ] Detective score is displayed.
- [ ] Results are saved.

### Application Quality

- [ ] Responsive UI works.
- [ ] API errors are handled.
- [ ] Database records are consistent.
- [ ] Users cannot access other users' private cases.
- [ ] Gemini API keys are protected.

---

# 26. IMPORTANT DEVELOPMENT RULES FOR CODEX

These rules are mandatory.

1. Treat this specification as the single source of truth for product requirements.
2. Do not randomly change the technology stack.
3. Use the MERN stack and Gemini as specified.
4. Build a complete working application, not just static UI screens.
5. Do not hardcode mystery scenarios, suspects, culprits, or investigation results as the main application logic.
6. Mystery content must be dynamically generated using AI.
7. The backend must be responsible for all critical business logic.
8. Never expose the culprit or solution before accusation submission.
9. Use structured JSON output and validate every AI response.
10. Maintain consistent data between the mystery, suspects, timeline, and evidence.
11. Keep frontend and backend code modular.
12. Reuse components instead of duplicating code.
13. Implement proper loading, error, success, and empty states.
14. Never expose API keys or secrets.
15. Do not leave major features as nonfunctional placeholder buttons.
16. Do not silently replace requested functionality with mock data.
17. If a third-party media provider requires credentials, implement its adapter and clearly document the required environment variables.
18. If a feature cannot be completed due to unavailable external services, document the limitation and implement the agreed fallback.
19. Do not remove or change specified functionality without updating the specification.
20. Update this document whenever an approved product requirement changes.

---

# 27. DEFINITION OF DONE

A feature is complete only when:

- Frontend implementation is complete.
- Backend implementation is complete.
- Database integration works.
- Input validation is implemented.
- Error handling is implemented.
- Authentication and authorization are verified where required.
- The feature has been tested.
- No critical console or server errors remain.
- The feature follows the specification.

A visually complete screen without working backend functionality does not count as a completed feature.

---

# 28. FINAL PRODUCT WORKFLOW

The complete expected user journey:

**STEP 1 — ENTER THE PLATFORM**

The user opens AI Mystery Room and registers or logs in.

**STEP 2 — CREATE A MYSTERY**

The user enters a scenario and selects the mystery category, difficulty, and number of suspects.

**STEP 3 — AI GENERATES THE INVESTIGATION**

Gemini generates the incident, suspects, timeline, culprit, solution, and evidence plan.

**STEP 4 — EVIDENCE IS CREATED**

The platform generates fictional conversations, photographs, CCTV evidence, witness statements, and documents.

**STEP 5 — ENTER THE INVESTIGATION ROOM**

The user explores the evidence board and examines each piece of evidence.

**STEP 6 — INVESTIGATE**

The user reviews suspects, checks alibis, connects clues, and writes investigation notes.

**STEP 7 — SELECT THE CULPRIT**

The user selects one suspect and explains their reasoning.

**STEP 8 — SUBMIT FINAL VERDICT**

The backend verifies the answer and evaluates the reasoning.

**STEP 9 — REVEAL THE SOLUTION**

The application reveals the actual culprit, motive, explanation, supporting evidence, and detective score.

**STEP 10 — SAVE AND CONTINUE**

The user can review completed investigations or create another mystery.

---

# 29. FINAL PRODUCT REQUIREMENT

AI Mystery Room must function as a complete AI-powered interactive detective investigation platform.

The experience must be centered around three main pillars:

**1. AI-GENERATED MYSTERIES**

Every investigation should feel unique, believable, and logically solvable.

**2. IMMERSIVE EVIDENCE INVESTIGATION**

Users should feel like real detectives examining digital evidence rather than simply reading an AI-generated story.

**3. LOGICAL CULPRIT IDENTIFICATION**

Users must use the available evidence to identify the culprit. The final result must explain why the selected answer is correct or incorrect.

**FINAL SUCCESS CONDITION:**

A user should be able to enter a simple story idea, receive a complete AI-generated fictional investigation, inspect multiple types of evidence, identify a culprit, and receive an intelligent explanation of the mystery — all within one website.

**END OF MASTER SPECIFICATION — VERSION 1.0**