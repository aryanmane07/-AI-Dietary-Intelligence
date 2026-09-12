# AI Dietary Intelligence
AI Dietary Intelligence is a full-stack AI-powered personalized dietary platform that combines food recognition, nutrition data, health information, food preferences, food reactions, medical reports, and user feedback to provide personalized dietary recommendations.
## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express.js
- **Current Database:** MongoDB
- **Food Recognition:** Python + locally downloaded Hugging Face food-recognition model
- **Nutrition:** USDA FoodData Central API
- **AI:** Google Gemini
- **Gemini SDK:** `@google/genai`
- **Email:** Nodemailer + SMTP
- **Authentication:** Custom MongoDB-backed HTTP-only sessions
- **Future Database:** SQL
- **Future AI Retrieval:** RAG
---
## Main Architecture
```text
User
 ↓
React + Vite
 ↓
Node.js + Express
 ↓
 ├── MongoDB
 ├── Python + Hugging Face
 ├── USDA FoodData Central
 └── Google Gemini
 ↓
Personalized Dietary Intelligence

⸻

Food Recognition

The application uses a Hugging Face food-recognition model downloaded and executed locally.

The model is not accessed through the Hugging Face hosted inference API.

Food Image
 ↓
POST /recognize-food
 ↓
Node.js
 ↓
Python
 ↓
server/food_recognition.py
 ↓
Local Hugging Face Model
 ↓
Food Name + Confidence Score

Node.js runs Python using:

server/food-ai/bin/python3

The Python source file is:

server/food_recognition.py

The Python environment is recreated using:

server/requirements.txt

The server/food-ai/ virtual environment is not committed to GitHub.

The exact Hugging Face model identifier is defined inside:

server/food_recognition.py

and should be kept synchronized with that file.

No Hugging Face API key is required for the current local implementation.

⸻

USDA FoodData Central

The project uses USDA FoodData Central for nutritional information.

The exact API endpoint currently used is:

https://api.nal.usda.gov/fdc/v1/foods/search

The backend exposes:

GET /nutrition

The request uses:

api_key
query
pageSize=5

The application extracts information such as:

* Food name
* FDC ID
* Calories
* Protein
* Carbohydrates
* Fat
* Fiber

The USDA API key is stored only in the backend:

USDA_API_KEY=...

⸻

Google Gemini

The project uses the Google Gemini API for AI reasoning and generation.

SDK:

@google/genai

Method:

gemini.models.generateContent()

Exact model currently used:

gemini-3.5-flash

Gemini is used for:

1. Medical report information extraction
2. Personalized food analysis
3. Meal-plan generation
4. Meal-plan customization

Gemini is accessed only from the backend.

React
 ↓
Express
 ↓
Google Gemini
 ↓
gemini-3.5-flash

The API key is:

GEMINI_API_KEY=...

⸻

Patient Profile

The user can store:

* Name
* Age
* Gender
* Height
* Weight
* Blood pressure
* Blood sugar
* Diseases
* Allergies
* Food preferences

The patient profile is stored in MongoDB and is used to build the user’s personalized context.

⸻

Digital Twin

The Digital Twin represents the user’s health and dietary context.

It contains information such as:

* Health profile
* Medical information
* Dietary feedback
* Feedback count
* Previous dietary interactions

Patient Profile
      ↓
Digital Twin
      ↓
Personalized AI Context

⸻

Food Genome

The Food Genome represents the user’s personal relationship with food.

It stores information such as:

* Loved foods
* Liked foods
* Neutral foods
* Disliked foods
* Food reactions
* Food experiences
* Learned patterns
* Meal-plan feedback

The system separates:

Food Preference

from:

Physical Reaction

A food being liked does not automatically mean that it is suitable for the user.

⸻

Medical Reports

Users can upload:

* PDF
* JPG
* JPEG
* PNG

The route is:

POST /medical-reports

Flow:

Medical Report
 ↓
Backend
 ↓
Base64
 ↓
Gemini
 ↓
Structured Medical Information
 ↓
MongoDB
 ↓
Patient + Digital Twin

The system extracts explicitly available information such as:

* Blood pressure
* Blood sugar
* HbA1c
* Cholesterol
* LDL
* HDL
* Triglycerides
* Hemoglobin
* Thyroid results
* Kidney findings
* Liver findings
* Allergies
* Dietary restrictions
* Medications
* Other relevant findings

The AI is instructed not to invent information or diagnose conditions.

⸻

Personalized Food Analysis

The endpoint is:

POST /personalized-analysis

The analysis combines:

Food
+
Nutrition
+
Patient Profile
+
Digital Twin
+
Food Genome
+
Food History
+
Reactions

and sends the relevant context to:

gemini-3.5-flash

The analysis can classify food as:

* Generally suitable
* Suitable with caution
* Less suitable

⸻

Meal Planner

The endpoint is:

POST /meal-plan

The meal planner uses:

Goal
+
Context
+
Patient Profile
+
Digital Twin
+
Food Genome
+
Previous Food Experiences
+
Previous Meal Plans
+
Meal-Plan Feedback

Gemini generates a personalized one-day meal plan.

The plan contains sections such as:

* Breakfast
* Mid-Morning Snack
* Lunch
* Evening Snack
* Dinner
* Why This Plan
* Food Genome Considerations
* Alternatives
* Missing Information

⸻

Meal Plan Customization

Existing meal plans are identified using:

mealPlanId

When a user customizes a saved plan:

Existing Meal Plan
 ↓
mealPlanId
 ↓
Customization Request
 ↓
Gemini
 ↓
Updated Plan
 ↓
Previous Version Saved
 ↓
Same mealPlanId

This allows meal-plan version history to be maintained.

⸻

Feedback and Learning

Users can provide feedback:

Loved
Liked
Neutral
Disliked

Feedback is stored in:

foodHistory

and can update:

Food Genome
Digital Twin
Meal Plans

The learning loop is:

Food / Meal Plan
 ↓
User Feedback
 ↓
Food History
 ↓
Food Genome
 ↓
Digital Twin
 ↓
Future AI Recommendations

⸻

MongoDB

The current database is:

MongoDB

Database name:

dietaryAI

Main collections:

users
sessions
patients
digitalTwins
foodGenomes
medicalReports
foodImages
foodHistory
mealPlans

The backend owns all database operations.

The frontend never directly communicates with MongoDB.

⸻

Authentication

Authentication uses custom MongoDB-backed sessions.

Cookie name:

dietary_session

Session tokens are generated using:

crypto.randomBytes(32)

The token is hashed using:

SHA-256

Passwords are hashed using:

bcryptjs

with a cost factor of:

12

Session lifetime:

Normal login: 24 hours
Remember Me: 30 days

The session cookie is HTTP-only.

⸻

Important API Routes

Authentication

POST /signup
POST /login
GET /me
POST /logout
POST /forgot-password
POST /reset-password

Patient

POST /patients
GET /patients/user/:userId

Food

POST /recognize-food
POST /food-images
GET /nutrition
POST /personalized-analysis
POST /food-history

Digital Twin

GET /digital-twin/:patientName
GET /digital-twin/user/:userId

Food Genome

GET /food-genome/:patientName
GET /food-genome/user/:userId

Medical Reports

POST /medical-reports

Meal Plans

POST /meal-plan
GET /meal-plans/user/:userId
GET /meal-plans/:mealPlanId

⸻

Complete Food Flow

User Uploads Food Image
 ↓
React
 ↓
POST /recognize-food
 ↓
Express
 ↓
Python
 ↓
Local Hugging Face Model
 ↓
Food Name
 ↓
GET /nutrition
 ↓
USDA FoodData Central
 ↓
Nutrition Data
 ↓
Digital Twin + Food Genome + History
 ↓
Gemini
 ↓
Personalized Food Analysis
 ↓
User Feedback
 ↓
Food Genome + Digital Twin

⸻

Complete Meal Planner Flow

User Goal
 ↓
Context
 ↓
Patient Profile
 ↓
Digital Twin
 ↓
Food Genome
 ↓
Previous Plans + Feedback
 ↓
POST /meal-plan
 ↓
Gemini
 ↓
gemini-3.5-flash
 ↓
Personalized Meal Plan
 ↓
MongoDB
 ↓
mealPlanId
 ↓
User Customization / Feedback
 ↓
Food Genome + Digital Twin
 ↓
Future Meal Plans

⸻

Future Development

MongoDB → SQL Migration

MongoDB is the current database, but the project is planned to migrate to SQL.

Current:
React
 ↓
Express
 ↓
MongoDB
Future:
React
 ↓
Express
 ↓
Service Layer
 ↓
Repository Layer
 ↓
SQL Database

The frontend should continue using the same API contracts.

This means the database can change internally without requiring a complete frontend rewrite.

Possible future SQL databases include:

PostgreSQL
MySQL

The final choice will be made during migration.

⸻

Future RAG

RAG (Retrieval-Augmented Generation) is planned for a future version.

The future architecture will be:

User Request
 ↓
RAG Retriever
 ↓
Relevant User Information
 ↓
Digital Twin
+
Food Genome
+
Food History
+
Medical Information
+
Previous Meal Plans
+
Relevant Nutrition Data
 ↓
Gemini
 ↓
Personalized Response

RAG will allow the system to retrieve only the most relevant information before sending context to Gemini.

⸻

Security

Sensitive credentials must remain in the backend .env file.

Important variables:

MONGODB_URI=
GEMINI_API_KEY=
USDA_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

The project does not currently use:

SESSION_SECRET

and does not require:

HUGGINGFACE_API_KEY

for the local food-recognition implementation.

The following should never be committed:

.env
node_modules/
server/food-ai/
server/uploads/
dist/
API keys
Database credentials
SMTP passwords

⸻

Project Structure

CAPSTONE/
│
├── client/
│   ├── src/
│   ├── App.jsx
│   ├── MealPlanner.jsx
│   ├── FoodHistory.jsx
│   ├── FoodGenome.jsx
│   ├── package.json
│   └── ...
│
├── server/
│   ├── server.js
│   ├── food_recognition.py
│   ├── requirements.txt
│   ├── uploads/
│   ├── food-ai/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md

⸻

Local Setup

Frontend

cd client
npm install
npm run dev

Backend

cd server
npm install
npm start

Python

cd server
python3 -m venv food-ai
source food-ai/bin/activate
pip install -r requirements.txt

Windows:

cd server
python -m venv food-ai
food-ai\Scripts\activate
pip install -r requirements.txt

⸻

Final Architecture

                         USER
                           |
                           v
                    React + Vite
                           |
                           v
                  Node.js + Express
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
   Authentication    Food Recognition    Meal Planner
        |                  |                  |
        v                  v                  v
     MongoDB             Python             Gemini
                           |
                           v
                Local Hugging Face Model
                           |
                           v
                      Food Name
                           |
                           v
               USDA FoodData Central
                           |
                           v
                    Nutrition Data
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
   Patient Profile   Digital Twin     Food Genome
          |                |                |
          +----------------+----------------+
                           |
                           v
                     Food History
                           |
                           v
                         Gemini
                           |
              +------------+------------+
              |                         |
              v                         v
      Personalized Analysis       Meal Plans
              |                         |
              v                         v
          Feedback                 Versions
              |                         |
              +------------+------------+
                           |
                           v
                     Future SQL
                           |
                           v
                      Future RAG

⸻

Project Vision

The long-term goal is to build a system that can:

Recognize food
 ↓
Understand nutrition
 ↓
Understand the user
 ↓
Understand personal food history
 ↓
Retrieve relevant information
 ↓
Use AI reasoning
 ↓
Provide personalized dietary intelligence
 ↓
Collect feedback
 ↓
Learn from feedback
 ↓
Improve future recommendations

In short:

Food Recognition
+
USDA Nutrition
+
Medical Information
+
Digital Twin
+
Food Genome
+
Food History
+
Feedback
+
Gemini
+
Future RAG
+
Future SQL
=
AI Dietary Intelligence