# AI Dietary Intelligence
AI Dietary Intelligence is a full-stack AI-powered personalized dietary intelligence platform.
The purpose of the project is to combine food recognition, nutritional information, user health information, medical information, food preferences, food reactions, previous food experiences, and AI reasoning into one personalized dietary system.
The project is not designed to provide only generic nutrition information.
Instead, it follows the idea:
> The suitability of a food depends on the individual user and their personal context.
For example, two users may both like pizza, but their dietary restrictions, allergies, health information, previous reactions, nutritional requirements, and personal food history may be completely different.
AI Dietary Intelligence therefore combines:
- Food image recognition
- Food identification
- USDA nutritional information
- Patient health profile
- Medical report information
- Digital Twin
- Food Genome
- Food preferences
- Food reactions
- Food history
- User feedback
- Personalized AI analysis
- AI-generated meal plans
- Saved meal plans
- Meal-plan customization
- Meal-plan version history
- Meal-plan feedback
- Authentication
- Password reset
- MongoDB persistence
- Google Gemini
- USDA FoodData Central
- A locally downloaded Hugging Face food-recognition model
- Python-based local food recognition
The current version uses MongoDB.
The project is intentionally structured so that the frontend communicates with the backend through APIs rather than directly communicating with MongoDB.
The planned next-stage architecture is to migrate the database from MongoDB to SQL while keeping the frontend and API contracts as stable as possible.
A future stage will also introduce Retrieval-Augmented Generation (RAG).
---
# 1. Project Goal
The main goal of AI Dietary Intelligence is to build a personalized dietary decision-support system.
Traditional food applications generally provide information such as:
- Calories
- Protein
- Carbohydrates
- Fat
- Fiber
- Generic food recommendations
- Generic meal plans
However, generic information does not necessarily answer:
> "Is this food appropriate for me?"
AI Dietary Intelligence attempts to answer this question using the user's own stored information.
The system combines:
```text
Food Information
        +
Nutrition Information
        +
Health Information
        +
Medical Information
        +
Food Preferences
        +
Food Reactions
        +
Food History
        +
Previous Feedback
        |
        v
Personalized AI Reasoning
        |
        v
Personalized Dietary Intelligence

⸻

2. Main Concept

The central concept of the project is:

Recognize the food
        ↓
Retrieve nutrition information
        ↓
Understand the user
        ↓
Retrieve personal food history
        ↓
Analyze the food in the user's context
        ↓
Provide personalized information
        ↓
Collect feedback
        ↓
Update the user's Food Genome
        ↓
Improve future personalization

The system therefore creates a continuous learning loop.

Food / Meal Plan
      ↓
User Experience
      ↓
Feedback
      ↓
Food History
      ↓
Food Genome
      ↓
Digital Twin
      ↓
Future AI Analysis
      ↓
Future Meal Plans
      ↓
More Feedback

⸻

3. High-Level Project Architecture

                              USER
                                |
                                v
                         React + Vite
                            Frontend
                                |
                                v
                      Node.js + Express
                         Backend API
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
 Authentication           Food Recognition        Meal Planner
        |                       |                       |
        v                       v                       v
    MongoDB                  Python                 Gemini
                                |
                                v
                    Local Hugging Face Model
                                |
                                v
                         Food Recognition
                                |
                                v
                           Food Name
                                |
                                v
                    USDA FoodData Central
                                |
                                v
                       Nutrition Information
                                |
        +-----------------------+-----------------------+
        |                       |                       |
        v                       v                       v
 Patient Health Profile    Digital Twin          Food Genome
        |                       |                       |
        +-----------------------+-----------------------+
                                |
                                v
                         Google Gemini
                                |
                 +--------------+--------------+
                 |                             |
                 v                             v
       Personalized Food               Personalized Meal
           Analysis                        Plan
                 |                             |
                 v                             v
          User Feedback                  Saved Meal Plan
                 |                             |
                 v                             v
           Food History                  Plan Versions
                 |                             |
                 v                             v
           Food Genome                 Meal Plan Feedback
                 |                             |
                 +--------------+--------------+
                                |
                                v
                             MongoDB
                                |
                                v
                         Future SQL Database
                                |
                                v
                           Future RAG

⸻

4. Complete End-to-End Flow

The complete system flow is:

User opens application
        ↓
React frontend loads
        ↓
User signs up / logs in
        ↓
Backend creates authenticated session
        ↓
User creates health profile
        ↓
Patient profile is stored
        ↓
Digital Twin is created/updated
        ↓
Food Genome is created/updated
        ↓
User can upload medical report
        ↓
Medical report is sent to backend
        ↓
Gemini extracts explicitly stated information
        ↓
Medical information is stored
        ↓
Patient profile / Digital Twin are updated
        ↓
User can upload a food image
        ↓
Backend sends image to local Python process
        ↓
Python executes local Hugging Face model
        ↓
Food name + recognition score returned
        ↓
Backend requests nutrition information
        ↓
USDA FoodData Central API
        ↓
Nutrition information returned
        ↓
Backend retrieves user context
        ↓
Digital Twin
+
Food Genome
+
Food History
+
Patient Profile
        ↓
Gemini analyzes food in user context
        ↓
Personalized food analysis displayed
        ↓
User provides feedback
        ↓
Food History updated
        ↓
Food Genome updated
        ↓
Digital Twin feedback updated
        ↓
Future recommendations use the learned information

⸻

5. Two Main AI Workflows

The application has two major AI workflows.

Workflow A — Personalized Food Analysis

Food Image
    ↓
Local Hugging Face Model
    ↓
Food Name
    ↓
USDA FoodData Central
    ↓
Nutrition Data
    ↓
Patient Profile
    ↓
Digital Twin
    ↓
Food Genome
    ↓
Food History
    ↓
Gemini
    ↓
Personalized Food Analysis
    ↓
User Feedback

Workflow B — Personalized Meal Planning

User Goal
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
Previous Meal-Plan Feedback
    ↓
Gemini
    ↓
Personalized One-Day Meal Plan
    ↓
MongoDB
    ↓
Saved Meal Plan
    ↓
Customization
    ↓
New Version
    ↓
User Feedback
    ↓
Food Genome + Digital Twin

⸻

6. Technology Stack

Technology	Purpose
React	Frontend user interface
Vite	Frontend development/build tooling
JavaScript	Frontend programming language
Node.js	Backend runtime
Express.js	Backend/API framework
MongoDB	Current database
Python	Local food-recognition execution
Hugging Face model	Food image recognition
Google Gemini	AI reasoning and generation
@google/genai	Gemini Node.js SDK
USDA FoodData Central	Food and nutrition information
Multer	File upload handling
bcryptjs	Password hashing
Nodemailer	Password-reset email
crypto	Secure token generation and hashing
CORS	Frontend/backend communication
dotenv	Environment variable configuration
SQL	Planned future database
RAG	Planned future retrieval layer

⸻

7. Frontend Technology

The frontend is built using React and Vite.

The frontend provides the user interface for:

* Login
* Signup
* User profile
* Patient information
* Food image upload
* Food recognition
* Nutrition information
* Personalized analysis
* Food history
* Food feedback
* Food Genome
* Digital Twin
* Medical report upload
* Meal Planner
* Saved meal plans
* Meal-plan customization
* Meal-plan feedback

The frontend communicates with the backend through HTTP requests.

The frontend does not directly access:

* MongoDB
* Gemini API
* USDA API using the private API key
* SMTP
* Python model files

The architecture is:

React
  ↓
Backend API
  ↓
Services / Database / External APIs

⸻

8. Backend Technology

The backend is implemented using:

Node.js
Express.js

The main backend file is:

server/server.js

The backend acts as the central orchestrator.

It coordinates:

Frontend
   ↓
Express
   ├── Authentication
   ├── MongoDB
   ├── Python
   ├── Hugging Face Model
   ├── USDA FoodData Central
   ├── Gemini
   └── SMTP

⸻

9. Backend Port

The backend uses:

PORT=5001

The code defaults to port 5001 if the environment variable is not supplied.

Local backend:

http://127.0.0.1:5001

The root route is:

GET /

and returns:

AI Dietary Intelligence Backend is running!

⸻

10. Frontend Port

The Vite frontend normally runs on:

http://localhost:5173

The backend uses:

CLIENT_URL=http://localhost:5173

for CORS and password-reset URLs.

⸻

11. CORS

The backend uses Express CORS configuration.

The current configuration allows:

CLIENT_URL

and:

credentials: true

This is important because authentication uses a cookie.

The architecture is:

React
   |
   | Credentials / Cookies
   v
Express

⸻

12. Authentication

The application uses custom session-based authentication.

It does not rely on express-session.

Instead, the application implements its own MongoDB-backed session system.

The session cookie is:

dietary_session

The authentication flow is:

User Login
    ↓
Backend verifies password
    ↓
Generate secure random session token
    ↓
Hash session token with SHA-256
    ↓
Store hashed token in MongoDB
    ↓
Send raw token in HTTP-only cookie
    ↓
Browser stores cookie
    ↓
Future requests send cookie
    ↓
Backend hashes received token
    ↓
Backend checks sessions collection
    ↓
User authenticated

⸻

13. Password Security

Passwords are not stored as plain text.

The project uses:

bcryptjs

Passwords are hashed using bcrypt with a cost factor of:

12

The authentication flow is:

Password
   ↓
bcrypt.hash(password, 12)
   ↓
Password Hash
   ↓
MongoDB

During login:

Entered Password
       ↓
bcrypt.compare()
       ↓
Stored Password Hash
       ↓
Authentication Result

⸻

14. Session Token Security

Session tokens are generated using:

crypto.randomBytes(32)

The token is converted into hexadecimal form.

The raw token is not stored in MongoDB.

Instead:

Random Session Token
        ↓
SHA-256
        ↓
Token Hash
        ↓
MongoDB

The raw token is provided to the browser through the HTTP-only cookie.

This means the database does not contain the raw session token.

⸻

15. Session Lifetime

The project supports rememberMe.

Without rememberMe:

24 hours

With rememberMe:

30 days

The session contains an expiration time.

MongoDB also uses a TTL index on:

expiresAt

to automatically remove expired sessions.

⸻

16. HTTP-Only Cookie

The session cookie is configured with:

httpOnly: true

In production:

secure: true
sameSite: "none"

In development:

secure: false
sameSite: "lax"

The cookie path is:

/

The purpose is to keep the authentication token away from normal frontend JavaScript access.

⸻

17. Authentication Routes

The backend provides:

POST /signup
POST /login
GET /me
POST /logout
POST /forgot-password
POST /reset-password

These provide the complete basic account lifecycle.

⸻

18. Signup

The signup process validates:

* Email
* Password

The password must contain at least:

8 characters

The password is hashed using bcrypt before being stored.

After successful account creation, the user can authenticate using the login route.

⸻

19. Login

The login process is:

Email + Password
       ↓
Find User
       ↓
bcrypt.compare()
       ↓
Generate Session Token
       ↓
Hash Session Token
       ↓
Save Session
       ↓
HTTP-only Cookie
       ↓
Authenticated User

The login request can also include:

rememberMe

⸻

20. /me

The route:

GET /me

returns information about the currently authenticated user.

Sensitive authentication information such as:

* Password
* Password reset token
* Password reset expiration

is not returned.

⸻

21. Logout

The logout process:

Browser Cookie
     ↓
Backend
     ↓
Find Session
     ↓
Delete Session
     ↓
Clear Cookie

This invalidates the authentication session.

⸻

22. Forgot Password

The password-reset flow is:

User requests password reset
          ↓
Generate random reset token
          ↓
Hash token using SHA-256
          ↓
Store token hash
          ↓
Set expiration
          ↓
Send reset email

The reset token expires after:

30 minutes

⸻

23. Password Reset Email

Email delivery is implemented using:

Nodemailer

SMTP configuration is stored in backend environment variables.

The reset link follows the format:

CLIENT_URL/reset-password?token=RESET_TOKEN

After a successful password reset:

Password Updated
      ↓
Reset Token Removed
      ↓
Existing Sessions Deleted
      ↓
User Must Log In Again

⸻

24. Environment Variables

The backend uses a .env file.

The current environment variables are:

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
USDA_API_KEY=YOUR_USDA_API_KEY
CLIENT_URL=http://localhost:5173
PORT=5001
NODE_ENV=development
SMTP_HOST=YOUR_SMTP_HOST
SMTP_PORT=587
SMTP_USER=YOUR_SMTP_USERNAME
SMTP_PASSWORD=YOUR_SMTP_PASSWORD
SMTP_FROM=YOUR_FROM_ADDRESS

These values must be configured locally.

⸻

25. Important Environment Variable Correction

The current backend code uses:

SMTP_PASSWORD

not:

SMTP_PASS

The README therefore documents the exact variable currently used by server.js.

The current backend does not use:

SESSION_SECRET

The project uses its own cryptographically generated session-token system.

Therefore SESSION_SECRET is not required by the current server.js.

⸻

26. Gemini API

Google Gemini is one of the main AI components of the project.

The Node.js backend uses:

@google/genai

The SDK is imported using:

const { GoogleGenAI } = require("@google/genai");

Gemini is initialized using:

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

⸻

27. Exact Gemini Model

The exact Gemini model currently specified in the backend is:

gemini-3.5-flash

This exact model string is used in the Gemini calls in:

POST /medical-reports
POST /meal-plan
POST /personalized-analysis

The backend calls Gemini using:

gemini.models.generateContent(...)

Therefore the current Gemini integration is:

Google Gemini API
        ↓
@google/genai
        ↓
gemini.models.generateContent()
        ↓
gemini-3.5-flash

⸻

28. Gemini Use Cases

Gemini currently performs three major categories of work.

1. Medical Report Extraction

Medical Report
      ↓
Gemini
      ↓
Structured Medical Information

2. Personalized Food Analysis

Food
+
Nutrition
+
User Context
      ↓
Gemini
      ↓
Personalized Analysis

3. Meal Planning

User Goal
+
Health Context
+
Food Genome
+
Previous Plans
      ↓
Gemini
      ↓
Personalized Meal Plan

Gemini is also used when customizing an existing meal plan.

⸻

29. Gemini API Security

The Gemini API key is stored only on the backend:

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

It must never be hardcoded into the frontend.

The correct architecture is:

React
   ↓
Express Backend
   ↓
Google Gemini API

not:

React
   ↓
Google Gemini API

with the private API key exposed in frontend code.

⸻

30. Gemini Quota Handling

The backend checks for Gemini quota-related errors.

It handles conditions such as:

RESOURCE_EXHAUSTED
GenerateRequestsPerDay
quota
429

When the daily quota is exhausted, the backend returns an HTTP 429 response instead of allowing an unhandled Gemini error to reach the user.

⸻

31. Hugging Face Food Recognition

The project uses a food-recognition model obtained from:

Hugging Face

The important architectural point is that the model is:

Downloaded locally

and then executed through:

Python

The project does not call the Hugging Face hosted inference API for food recognition.

Therefore:

Hugging Face API Key

is not required for the current food-recognition implementation.

⸻

32. Exact Hugging Face Model Name

The exact model identifier is defined inside:

server/food_recognition.py

and not inside:

server/server.js

The supplied server.js only shows that Node.js launches:

server/food_recognition.py

using:

server/food-ai/bin/python3

Therefore the exact Hugging Face model name must be taken directly from the model-loading line in food_recognition.py.

It is intentionally not fabricated here because the exact model identifier is not present in the supplied server.js.

The architecture is:

Hugging Face Model Repository
            ↓
Downloaded by Python/model loader
            ↓
Local Model Files
            ↓
server/food_recognition.py
            ↓
Local Python Inference

If the model name is changed in food_recognition.py, this README should be updated to match it exactly.

⸻

33. How the Hugging Face Model Is Used Locally

The local food-recognition system works as follows:

1. Food-recognition model is obtained from Hugging Face
                    ↓
2. Model files are downloaded locally
                    ↓
3. Python environment contains required ML libraries
                    ↓
4. food_recognition.py loads the model
                    ↓
5. User uploads a food image
                    ↓
6. Node.js receives the image
                    ↓
7. Node.js executes local Python
                    ↓
8. Python receives the image path
                    ↓
9. Local Hugging Face model performs inference
                    ↓
10. Python returns JSON
                    ↓
11. Node.js parses the JSON
                    ↓
12. Frontend receives food name + score

⸻

34. Python Integration

Node.js uses:

child_process.execFile()

to execute the Python food-recognition script.

The backend constructs:

server/food-ai/bin/python3

as the Python executable.

The script path is:

server/food_recognition.py

The uploaded image path is passed to the Python script.

The execution flow is:

Node.js
   ↓
server/food-ai/bin/python3
   ↓
server/food_recognition.py
   ↓
Hugging Face model
   ↓
Prediction
   ↓
JSON
   ↓
Node.js

⸻

35. Food Recognition API

The backend endpoint is:

POST /recognize-food

The endpoint is protected by authentication.

The uploaded image field is:

foodImage

The backend uses:

multer

to receive the uploaded image.

⸻

36. Food Recognition Response

The Python process returns JSON.

The backend returns:

{
  "foodName": "FOOD_NAME",
  "score": "CONFIDENCE_SCORE"
}

The frontend can then use:

foodName

for the next stage.

⸻

37. Why Food Recognition Is Separate from Nutrition

Food recognition and nutrition lookup perform different jobs.

Food recognition answers:

"What food is shown in the image?"

USDA answers:

"What nutritional information is available for that food?"

Gemini answers:

"What does this food mean in this user's context?"

Therefore:

Hugging Face
     ↓
Food Identification
USDA
     ↓
Nutrition Information
Gemini
     ↓
Personalized Interpretation

⸻

38. USDA FoodData Central

The project uses:

USDA FoodData Central

as the external food and nutrition data source.

The exact USDA service name is:

USDA FoodData Central

The official API documentation is:

https://fdc.nal.usda.gov/api-guide/

⸻

39. Exact USDA API

The current backend uses the USDA FoodData Central Food Search endpoint:

GET https://api.nal.usda.gov/fdc/v1/foods/search

This is the exact external API endpoint currently called by server.js.

The backend constructs the request with:

api_key
query
pageSize

The request is conceptually:

https://api.nal.usda.gov/fdc/v1/foods/search
    ?api_key=USDA_API_KEY
    &query=FOOD_NAME
    &pageSize=5

⸻

40. USDA Backend Route

The application exposes:

GET /nutrition

The food is supplied using:

req.query.food

The default food in the current backend is:

masala dosa

Therefore, conceptually:

GET /nutrition?food=masala%20dosa

results in a USDA FoodData Central search.

⸻

41. USDA Search Flow

Frontend
    ↓
GET /nutrition?food=FOOD_NAME
    ↓
Express Backend
    ↓
USDA FoodData Central
    ↓
/fdc/v1/foods/search
    ↓
Search Results
    ↓
First Food Result
    ↓
Nutrition Extraction
    ↓
Frontend

⸻

42. USDA API Key

The USDA API requires an API key.

The key is stored as:

USDA_API_KEY=YOUR_USDA_API_KEY

The key remains on the backend.

The frontend should never contain the private USDA key.

The architecture is:

React
   ↓
Express
   ↓
USDA FoodData Central

⸻

43. USDA Information Extracted

The current implementation extracts information from the first USDA search result.

The response includes information such as:

Food Name
FDC ID
Calories
Protein
Carbohydrates
Fat
Fiber

The backend maps USDA nutrient names into application-level fields.

The application fields include:

foodName
fdcId
calories
protein
carbohydrates
fat
fiber

⸻

44. USDA Nutrient Mapping

The current backend looks for:

Energy

for calories.

It looks for:

Protein

for protein.

It looks for:

Carbohydrate, by difference

for carbohydrates.

It looks for:

Total lipid (fat)

for fat.

It looks for:

Fiber, total dietary

for fiber.

⸻

45. Important USDA Architecture

The project does not use USDA as an AI model.

USDA provides structured food/nutrition information.

The separation is:

USDA
    =
Nutrition Data

while:

Gemini
    =
AI Reasoning

and:

Hugging Face
    =
Food Image Recognition

⸻

46. Complete Food Analysis Pipeline

                    FOOD IMAGE
                         |
                         v
                  React Frontend
                         |
                         v
                POST /recognize-food
                         |
                         v
                  Express Backend
                         |
                         v
                     Python
                         |
                         v
               food_recognition.py
                         |
                         v
          Local Hugging Face Model
                         |
                         v
                    FOOD NAME
                         |
                         v
                 GET /nutrition
                         |
                         v
            USDA FoodData Central
                         |
                         v
               NUTRITION DATA
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
   Patient Profile   Digital Twin   Food Genome
          |              |              |
          +--------------+--------------+
                         |
                         v
                    Food History
                         |
                         v
                       Gemini
                         |
                         v
             Personalized Food Analysis
                         |
                         v
                    User Feedback
                         |
             +-----------+-----------+
             |                       |
             v                       v
        Food Genome              Digital Twin
             |
             v
        Food History

⸻

47. Patient Profile

The application allows the user to create a patient/health profile.

The route is:

POST /patients

The profile contains information such as:

Name
Age
Gender
Height
Weight
Blood Pressure
Blood Sugar
Diseases
Allergies
Food Preferences

The profile is associated with the authenticated user.

⸻

48. Patient Profile Flow

User
  ↓
Patient Profile Form
  ↓
POST /patients
  ↓
Authenticated Backend
  ↓
patients collection
  ↓
Digital Twin updated
  ↓
Food Genome initialized/updated

⸻

49. Digital Twin

The Digital Twin is a persistent representation of the user’s health and dietary context.

It is not a physical digital twin.

It is a structured software representation of the user’s relevant information.

The Digital Twin can contain:

Health Profile
Medical Information
Dietary Feedback
Feedback Count
Last Dietary Feedback
Patient Information

⸻

50. Purpose of Digital Twin

The Digital Twin allows the system to keep a persistent representation of the user.

Instead of asking the user for the same information every time:

User Health Profile
       ↓
Digital Twin
       ↓
Reusable Context

The AI system can use this information when performing personalized analysis.

⸻

51. Digital Twin Routes

The backend provides:

GET /digital-twin/:patientName

and:

GET /digital-twin/user/:userId

Both routes are protected and verify ownership.

⸻

52. Food Genome

The Food Genome is the user’s personalized food intelligence layer.

It represents the user’s relationship with food.

It can contain:

Loved Foods
Liked Foods
Neutral Foods
Disliked Foods
Food Reactions
Food Experiences
Food Feedback
Meal-Plan Feedback
Feedback Counts
Food Records

The Food Genome is continuously updated as the user interacts with the application.

⸻

53. Food Preference Categories

The system supports four primary food preference categories:

Loved
Liked
Neutral
Disliked

These are stored separately.

Conceptually:

Food Genome
    |
    +-- Loved Foods
    |
    +-- Liked Foods
    |
    +-- Neutral Foods
    |
    +-- Disliked Foods
    |
    +-- Reactions
    |
    +-- Meal Plan Feedback

⸻

54. Preference vs Physical Reaction

One of the most important design principles is that food preference and food reaction are different.

For example:

Food:
Pizza
Preference:
Loved
Reaction:
Acidity

The system should not conclude:

Loved = Automatically Suitable

Instead, it considers:

Preference
+
Reaction
+
Health Information
+
Nutrition
+
Dietary Restrictions
+
Allergies

This distinction is explicitly used in the AI prompts.

⸻

55. Food Reactions

Food reactions are treated as user-reported experiences.

The system does not automatically turn a user-reported reaction into:

Diagnosis

or:

Medical condition

or:

Allergy

unless that information is explicitly available elsewhere.

This is important because:

User Experience

and:

Medical Diagnosis

are different concepts.

⸻

56. Food History

The foodHistory collection stores user feedback and food experiences.

It can contain:

User ID
Patient Name
Food Name
Status
Reaction
Notes
Source
Meal Plan ID
Goal
Context
Customization
Timestamp

The source can identify whether feedback came from:

food-analysis

or:

meal-planner

⸻

57. Food Feedback Route

The backend uses:

POST /food-history

for feedback.

Valid statuses are:

loved
liked
neutral
disliked

The backend supports two sources:

food-analysis
meal-planner

⸻

58. Food Analysis Feedback

For food-analysis feedback, a valid:

foodName

is required.

The backend stores the feedback in:

foodHistory

and updates:

foodGenomes

and:

digitalTwins

⸻

59. Food Feedback Learning Flow

User analyzes food
       ↓
Personalized analysis displayed
       ↓
User selects feedback
       ↓
Feedback submitted
       ↓
foodHistory
       ↓
Food Genome updated
       ↓
Digital Twin updated
       ↓
Future AI requests receive updated context

⸻

60. Food Genome Learning

The backend builds structured learning information from the Food Genome.

This includes:

Preferences
Reactions
Recent Experiences
Learned Patterns
Meal Plan Feedback

The system considers repeated experiences.

Conceptually:

1 recorded experience
        ↓
Single recorded experience
2 repeated experiences
        ↓
Emerging pattern
3+ repeated experiences
        ↓
Strong repeated pattern

This allows repeated personal experiences to have more significance.

⸻

61. Digital Twin Feedback Learning

Food feedback also updates the Digital Twin.

The backend maintains information such as:

dietaryFeedback
feedbackCount
lastDietaryFeedback

Therefore:

Food Feedback
     |
     +----> Food History
     |
     +----> Food Genome
     |
     +----> Digital Twin

⸻

62. Medical Reports

The application supports medical report uploads.

The route is:

POST /medical-reports

The endpoint requires authentication.

Supported file types are:

PDF
JPEG
JPG
PNG

The uploaded file is read by the backend.

The file is converted to Base64.

The encoded file is sent to Gemini for structured information extraction.

⸻

63. Medical Report Flow

Medical Report
      ↓
React Upload
      ↓
POST /medical-reports
      ↓
Multer
      ↓
Server File Storage
      ↓
Read File
      ↓
Base64 Encoding
      ↓
Gemini
      ↓
Structured JSON
      ↓
medicalReports collection
      ↓
Patient Profile Update
      ↓
Digital Twin Update

⸻

64. Medical Report AI Model

Medical reports are analyzed using:

Google Gemini

and the exact current model is:

gemini-3.5-flash

The Gemini call is made through:

@google/genai

using:

gemini.models.generateContent()

⸻

65. Medical Report Extraction Rules

The medical-report prompt instructs Gemini to:

* Extract information explicitly visible in the report
* Avoid inventing information
* Avoid diagnosing the user
* Avoid guessing missing values
* Avoid inferring medical conditions that are not stated
* Return structured information

The system is therefore designed for extraction rather than independent medical diagnosis.

⸻

66. Medical Information Extracted

The current structure includes:

conditions
bloodPressure
bloodSugar
fastingBloodSugar
postMealBloodSugar
hba1c
cholesterol
ldl
hdl
triglycerides
hemoglobin
thyroidResults
kidneyFindings
liverFindings
allergies
dietaryRestrictions
medications
otherRelevantFindings

⸻

67. Medical Data Persistence

After extraction, the information is stored in:

medicalReports

The backend also updates relevant information in:

patients

and:

digitalTwins

This allows the extracted medical information to become part of future personalization.

⸻

68. Medical Safety Principle

The application is a dietary decision-support system.

It is not intended to replace:

* Doctors
* Dietitians
* Medical professionals
* Clinical diagnosis
* Professional medical advice

The AI should work only with available information and should not invent diagnoses or medical findings.

⸻

69. Meal Planner

The application contains an AI-powered Meal Planner.

The route is:

POST /meal-plan

The main input fields are:

goal
context
customization
mealPlanId

The user provides a goal such as a dietary objective.

The backend then retrieves the user’s existing context.

⸻

70. Meal Planner Data Sources

The Meal Planner uses:

Patient Health Profile
        +
Digital Twin
        +
Food Genome
        +
Food Genome Learning
        +
Previous Saved Meal Plans
        +
Previous Meal Plan Feedback
        +
User Goal
        +
User Context
        +
Customization

This information is supplied to Gemini.

⸻

71. Meal Planner Flow

User
  ↓
Enter Goal
  ↓
Enter Context
  ↓
Optional Customization
  ↓
React
  ↓
POST /meal-plan
  ↓
Express
  ↓
Retrieve Patient Profile
  ↓
Retrieve Digital Twin
  ↓
Retrieve Food Genome
  ↓
Build Food Genome Learning
  ↓
Retrieve Previous Meal Plans
  ↓
Build Gemini Prompt
  ↓
gemini-3.5-flash
  ↓
Generated Meal Plan
  ↓
MongoDB
  ↓
mealPlanId
  ↓
Frontend

⸻

72. Food Genome in Meal Planning

The Meal Planner does not only use static health information.

It also uses learned food information.

For example:

Food Genome
   |
   +-- Preferences
   |
   +-- Reactions
   |
   +-- Recent Experiences
   |
   +-- Learned Patterns
   |
   +-- Meal Plan Feedback

This allows the generated plan to become more personalized over time.

⸻

73. Previous Meal Plans

The backend retrieves up to eight previous saved meal plans for the user.

Previous plans provide additional context.

The AI can use them to understand:

* Previous goals
* Previous context
* Previous customizations
* Previously generated meals
* Previous feedback
* Existing user preferences

The system also aims to avoid blindly repeating the same complete meals.

⸻

74. Meal Plan Output

The AI is instructed to generate a structured one-day plan containing:

Breakfast
Mid-Morning Snack
Lunch
Evening Snack
Dinner
Why This Plan
Food Genome Considerations
Alternatives
Missing Information

The plan is personalized using the user’s available context.

⸻

75. Meal Plan Priority System

The meal-planning prompt uses a priority order.

The important factors are:

1. Explicit allergies
2. Explicit dietary restrictions
3. Explicit medical information
4. Previous negative reactions
5. Repeated personal patterns
6. Nutrition
7. Food preference

This means a simple food preference should not automatically override more important health or safety-related information.

⸻

76. Dietary Restrictions

The meal planner handles dietary restrictions explicitly.

For example, when the user is vegan, the system should avoid animal-derived foods.

When the user is vegetarian, the system should avoid:

Meat
Chicken
Fish
Seafood

Explicit allergies and restrictions should be respected.

⸻

77. Meal Plan Saved State

Generated meal plans are saved to MongoDB.

The backend returns:

mealPlan
mealPlanId
saved
updated

The important field is:

mealPlanId

This identifies the exact saved meal plan.

⸻

78. Why mealPlanId Is Important

The mealPlanId connects:

Generated Meal Plan
        ↓
Saved Meal Plan
        ↓
Customization
        ↓
Version History
        ↓
Feedback

Without the correct ID, feedback cannot reliably be connected to the correct saved plan.

⸻

79. Meal Plan Customization

The same:

POST /meal-plan

route is used for customization.

When the user customizes an existing plan, the frontend sends:

mealPlanId

along with the customization request.

The backend verifies:

Meal Plan ID
+
Authenticated User

before updating the plan.

⸻

80. Meal Plan Customization Flow

Saved Meal Plan
       ↓
User requests customization
       ↓
Existing mealPlanId sent
       ↓
Backend verifies ownership
       ↓
Current meal plan retrieved
       ↓
Gemini receives current plan
       +
Customization request
       ↓
Gemini generates updated plan
       ↓
Previous version stored
       ↓
Current plan updated
       ↓
Same mealPlanId preserved

⸻

81. Meal Plan Versioning

When an existing meal plan is updated, the previous version is preserved.

Conceptually:

Meal Plan
   |
   +-- Current Version
   |
   +-- Previous Version
   |
   +-- Previous Version
   |
   +-- Previous Version

A previous version can contain:

mealPlan
goal
context
customization
savedAt

This allows the system to maintain historical versions.

⸻

82. Meal Plan Feedback

Meal-plan feedback uses:

POST /food-history

with:

source = meal-planner

The backend requires:

mealPlanId

The backend then verifies that the meal plan belongs to the authenticated user.

This prevents feedback from being attached to another user’s meal plan.

⸻

83. Meal Plan Feedback Flow

Saved Meal Plan
      ↓
mealPlanId
      ↓
User Feedback
      ↓
POST /food-history
      ↓
Backend
      ↓
Verify mealPlanId
      +
Verify authenticated user
      ↓
Store feedback
      ↓
foodHistory
      +
foodGenomes
      +
mealPlans
      +
digitalTwins

⸻

84. Meal Plan Feedback Storage

Meal-plan feedback can update:

foodHistory

and:

foodGenomes.mealPlanFeedback

and:

mealPlans.latestFeedback

and:

mealPlans.feedbackHistory

and:

digitalTwins.dietaryFeedback

This makes meal-plan feedback part of the overall learning loop.

⸻

85. Complete Meal Plan Learning Loop

User Goal
    ↓
AI Meal Plan
    ↓
Saved Meal Plan
    ↓
User Uses/Reviews Plan
    ↓
User Feedback
    ↓
Food History
    ↓
Food Genome
    ↓
Digital Twin
    ↓
Meal Plan Feedback History
    ↓
Future Meal Plan

⸻

86. Personalized Food Analysis

The endpoint is:

POST /personalized-analysis

The request contains:

food
nutrition

The backend retrieves:

Patient
Digital Twin
Food Genome
Structured Food Genome Learning
Current Food Patterns
Previous Experiences

The information is sent to Gemini.

⸻

87. Personalized Analysis Categories

The Gemini prompt uses suitability categories such as:

Generally suitable
Suitable with caution
Less suitable

The model considers:

Allergies
Dietary Restrictions
Medical Information
Nutrition
Food Genome
Food Preferences
Food Reactions
Previous Experiences

The system keeps food preference separate from food reaction.

⸻

88. Personalized Analysis Flow

Food Name
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
    ↓
Backend
    ↓
Gemini
    ↓
Personalized Analysis
    ↓
Frontend
    ↓
User Feedback

⸻

89. Food Images

The application has a separate food-image upload route:

POST /food-images

This route stores food-image metadata.

The actual recognition process is handled separately through:

POST /recognize-food

This separation allows image storage and food recognition to remain different operations.

⸻

90. Uploaded Files

The backend uses:

multer

for handling file uploads.

Files are stored in:

server/uploads/

Uploaded files can include:

Food Images
Medical Reports

The project should not commit the uploads directory to GitHub.

⸻

91. MongoDB

The current database is:

MongoDB

The MongoDB client is:

MongoClient

The database name is:

dietaryAI

The connection string comes from:

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

⸻

92. MongoDB Collections

The current backend uses the following major collections:

users
sessions
patients
digitalTwins
foodGenomes
medicalReports
foodImages
foodHistory
mealPlans

Each collection has a specific responsibility.

⸻

93. users Collection

Stores account information such as:

Email
Password Hash
Created At
Updated At
Last Login
Password Reset Token Hash
Password Reset Expiration

Plain-text passwords are not stored.

⸻

94. sessions Collection

Stores authenticated sessions.

Important fields include:

userId
tokenHash
rememberMe
createdAt
expiresAt

A TTL index is created on:

expiresAt

⸻

95. patients Collection

Stores the user’s health profile.

It can contain:

userId
name
age
gender
height
weight
bloodPressure
bloodSugar
diseases
allergies
foodPreferences
medicalReportData
createdAt
updatedAt

⸻

96. digitalTwins Collection

Stores the user’s Digital Twin.

It can contain:

userId
patientName
healthProfile
medicalReportData
dietaryFeedback
feedbackCount
lastDietaryFeedback

⸻

97. foodGenomes Collection

Stores personalized food information.

It can contain:

userId
patientName
totalFeedback
lovedFoods
likedFoods
neutralFoods
dislikedFoods
reactions
foods
mealPlanFeedback
lastFeedback
lastMealPlanFeedback

⸻

98. foodHistory Collection

Stores food and meal-plan feedback.

It can contain:

userId
patientName
foodName
status
reaction
notes
source
mealPlanId
goal
context
customization
recordedAt

⸻

99. foodImages Collection

Stores metadata associated with food images.

It can contain:

userId
originalName
fileName
filePath
fileType
uploadedAt

⸻

100. medicalReports Collection

Stores uploaded medical report information.

It can contain:

userId
patientName
originalFileName
storedFileName
filePath
fileType
uploadedAt
aiAnalyzed
aiAnalyzedAt
extractedData

⸻

101. mealPlans Collection

Stores saved meal plans.

It can contain:

userId
patientName
goal
context
customization
mealPlan
versions
feedbackHistory
latestFeedback
createdAt
updatedAt

The collection provides persistence for meal-plan generation and customization.

⸻

102. MongoDB Indexes

The backend creates important indexes.

Sessions TTL Index

expiresAt

This allows expired sessions to be automatically removed.

Users Unique Index

email

This prevents duplicate account emails.

Meal Plans

Indexes are created using:

userId + updatedAt

and:

userId + createdAt

These support common meal-plan retrieval operations.

⸻

103. Database Ownership

All user-specific database operations are associated with:

userId

The backend verifies ownership before returning or modifying private data.

The architecture is:

Authenticated User
       ↓
userId
       ↓
MongoDB Query
       ↓
User-Owned Data

⸻

104. User Data Isolation

User A should not be able to access User B’s:

Patient Profile
Digital Twin
Food Genome
Food History
Medical Reports
Meal Plans
Feedback

The backend uses authentication and ownership checks.

For example:

Authenticated User ID
        +
Requested Meal Plan ID
        ↓
Verify Ownership
        ↓
Allow / Reject

⸻

105. Patient Routes

The backend provides:

POST /patients

to create/update a patient profile.

It also provides:

GET /patients/user/:userId

to retrieve the authenticated user’s patient information.

⸻

106. Digital Twin Routes

The backend provides:

GET /digital-twin/:patientName

and:

GET /digital-twin/user/:userId

Both are protected by authentication and ownership validation.

⸻

107. Food Genome Routes

The backend provides:

GET /food-genome/:patientName

and:

GET /food-genome/user/:userId

The user-specific route verifies that the requested user belongs to the authenticated session.

⸻

108. Meal Plan Routes

The current backend provides:

GET /meal-plans/user/:userId

to retrieve the user’s saved meal plans.

It also provides:

GET /meal-plans/:mealPlanId

to retrieve one saved meal plan.

The generation/update endpoint is:

POST /meal-plan

⸻

109. Saved Meal Plan Retrieval

The backend retrieves the user’s saved meal plans sorted by:

updatedAt

in descending order.

The current route limits the result to:

20 plans

This prevents unnecessarily large responses.

⸻

110. Individual Meal Plan Retrieval

The route:

GET /meal-plans/:mealPlanId

uses the meal-plan ID.

The backend also verifies ownership.

Conceptually:

mealPlanId
     +
authenticated userId
     ↓
MongoDB
     ↓
Exact User-Owned Plan

⸻

111. Meal Plan Database Design

A saved meal plan is treated as a persistent object rather than a temporary AI response.

The lifecycle is:

Generate
   ↓
Save
   ↓
Return mealPlanId
   ↓
Retrieve
   ↓
Customize
   ↓
Version
   ↓
Feedback
   ↓
Learn

⸻

112. Current Database Architecture

The current database architecture is:

React
   ↓
Express
   ↓
MongoDB

The frontend does not directly communicate with MongoDB.

The backend owns database operations.

⸻

113. Why MongoDB Is Being Used Currently

MongoDB provides flexible document-based storage that is convenient during the current development stage.

This is useful because the application contains evolving structures such as:

Food Genome
Digital Twin
Meal Plan Versions
Meal Plan Feedback
Medical Report Extraction
Food Experiences

These structures may continue evolving during development.

⸻

114. Planned MongoDB to SQL Migration

MongoDB is not the final planned database architecture.

The project will migrate from:

MongoDB

to:

SQL

in a future development phase.

Possible relational database technologies include:

PostgreSQL
MySQL

The exact SQL database can be selected during the migration stage.

⸻

115. Why Migrate to SQL

The system contains many relationships between entities.

For example:

User
 |
 +-- Patient
 |
 +-- Digital Twin
 |
 +-- Food Genome
 |
 +-- Food History
 |
 +-- Medical Reports
 |
 +-- Food Images
 |
 +-- Meal Plans
       |
       +-- Versions
       |
       +-- Feedback

A relational database can represent these relationships using:

Primary Keys
Foreign Keys
Constraints
Normalized Tables
Relationships
Indexes
Transactions

⸻

116. Planned SQL Architecture

The future architecture can be:

React
   ↓
Express API
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
SQL Database

The frontend does not need to know whether the backend is using MongoDB or SQL.

⸻

117. Planned SQL Tables

A possible future relational structure is:

users
user_profiles
sessions
digital_twins
medical_reports
foods
food_history
food_genomes
food_preferences
food_reactions
feedback
food_images
meal_plans
meal_plan_versions
meal_plan_feedback

The final schema can be refined during implementation.

⸻

118. SQL Migration Strategy

The intended migration strategy is:

CURRENT
React
  ↓
Express
  ↓
MongoDB
FUTURE
React
  ↓
Express
  ↓
Service Layer
  ↓
Repository Layer
  ↓
SQL

The goal is to avoid rewriting the frontend.

The frontend should continue calling stable API endpoints.

⸻

119. Database Abstraction

The future backend should separate business logic from database-specific code.

For example:

Meal Plan Service
       ↓
Meal Plan Repository
       ↓
MongoDB Repository

can later become:

Meal Plan Service
       ↓
Meal Plan Repository
       ↓
SQL Repository

The business logic can remain mostly unchanged.

⸻

120. Why the Frontend Should Not Know the Database

The frontend should only care about API responses.

For example:

React
   ↓
GET /meal-plans/user/:userId

The frontend should not care whether the backend obtains the data from:

MongoDB

or:

PostgreSQL

This is the reason for maintaining backend ownership of the database layer.

⸻

121. Future RAG Integration

Another planned feature is:

Retrieval-Augmented Generation

or:

RAG

RAG is not the current primary architecture.

It is a planned future enhancement.

The current system already has valuable information sources:

USDA Nutrition Data
Food Genome
Food History
Digital Twin
Medical Report Information
Previous Meal Plans
Meal Plan Feedback

These can later become retrieval sources.

⸻

122. Current AI Architecture

Currently:

User Context
      +
Food/Nutrition Information
      +
Food Genome
      +
Digital Twin
      +
History
      ↓
Gemini
      ↓
AI Response

The system currently provides relevant context directly to Gemini.

⸻

123. Future RAG Architecture

In the future:

User Request
      ↓
Retriever
      ↓
Relevant User/Data Information
      ↓
Gemini
      ↓
Grounded Personalized Response

Instead of always providing all available information, the retrieval layer can select the most relevant information.

⸻

124. RAG + Food Genome

For a food question:

User asks:
"Can I eat pizza?"
        ↓
Retriever
        ↓
Search Food Genome
        ↓
Retrieve:
Pizza preference
Pizza reactions
Previous experiences
        ↓
Gemini
        ↓
Personalized response

⸻

125. RAG + Digital Twin

For a health-related dietary request:

User Request
      ↓
Retriever
      ↓
Relevant Digital Twin Information
      ↓
Gemini
      ↓
Personalized response

Only the relevant user context can be supplied.

⸻

126. RAG + Food History

Food History can become another retrieval source.

For example:

Current Food
      ↓
Retrieve previous experiences
      ↓
Food History
      ↓
Gemini

This can help identify repeated personal patterns.

⸻

127. RAG + USDA

USDA information can also become part of a future retrieval pipeline.

For example:

Food
  ↓
Retrieve relevant USDA information
  ↓
Nutrition Data
  ↓
Gemini

The retrieval layer can select relevant nutritional information.

⸻

128. RAG + Meal Planner

A future meal planner can use RAG like:

User Goal
      ↓
Retrieve Relevant User Context
      |
      +-- Digital Twin
      +-- Food Genome
      +-- Food History
      +-- Previous Meal Plans
      +-- Meal Plan Feedback
      +-- Relevant Food Information
      +-- Nutrition Data
      ↓
Gemini
      ↓
Personalized Meal Plan

⸻

129. Future Complete Architecture

                         USER
                           |
                           v
                    React Frontend
                           |
                           v
                     Express API
                           |
              +------------+------------+
              |                         |
              v                         v
        Application Logic          AI Services
              |                         |
              v                         v
        SQL Database                 RAG Layer
              |                         |
       +------+------+                  v
       |      |      |               Gemini
       v      v      v                  |
     Users  Genome  Plans               |
                                         |
                                         v
                               Personalized Output

Food recognition remains:

Food Image
    ↓
Python
    ↓
Local Hugging Face Model

and nutrition remains:

Food Name
    ↓
USDA FoodData Central

⸻

130. Complete Future AI Pipeline

Food Image
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
      +-------------------+
      |                   |
      v                   v
Digital Twin        Food Genome
      |                   |
      +---------+---------+
                |
                v
           Food History
                |
                v
               RAG
                |
                v
             Gemini
                |
        +-------+-------+
        |               |
        v               v
Food Analysis      Meal Planning
        |               |
        v               v
    Feedback        Saved Plan
        |               |
        v               v
 Food Genome        Versions
        |               |
        +-------+-------+
                |
                v
             SQL DB

⸻

131. API Overview

The current backend API can be grouped as follows.

General

GET /

Authentication

POST /signup
POST /login
GET /me
POST /logout
POST /forgot-password
POST /reset-password

User

GET /user/:userId

Nutrition

GET /nutrition

Food Recognition

POST /recognize-food

Food Images

POST /food-images

Patients

POST /patients
GET /patients/user/:userId

Medical Reports

POST /medical-reports

Food History

POST /food-history

Food Genome

GET /food-genome/:patientName
GET /food-genome/user/:userId

Digital Twin

GET /digital-twin/:patientName
GET /digital-twin/user/:userId

Meal Plans

GET /meal-plans/user/:userId
GET /meal-plans/:mealPlanId
POST /meal-plan

Personalized AI

POST /personalized-analysis

⸻

132. API Responsibility Table

Endpoint	Purpose
GET /	Check backend status
POST /signup	Create user account
POST /login	Authenticate user
GET /me	Get current authenticated user
POST /logout	End session
POST /forgot-password	Request password reset
POST /reset-password	Reset password
GET /user/:userId	Retrieve authenticated user information
GET /nutrition	Search USDA nutrition data
POST /recognize-food	Recognize food using local Python model
POST /food-images	Store food image metadata
POST /patients	Create/update patient profile
GET /patients/user/:userId	Retrieve patient profile
POST /medical-reports	Upload/analyze medical report
POST /food-history	Record food/meal feedback
GET /food-genome/:patientName	Retrieve Food Genome
GET /food-genome/user/:userId	Retrieve user Food Genome
GET /digital-twin/:patientName	Retrieve Digital Twin
GET /digital-twin/user/:userId	Retrieve user Digital Twin
GET /meal-plans/user/:userId	Retrieve saved meal plans
GET /meal-plans/:mealPlanId	Retrieve one meal plan
POST /meal-plan	Generate/customize/save meal plan
POST /personalized-analysis	Generate personalized food analysis

⸻

133. Exact External Services

The current system uses the following external services/models.

Google Gemini

Service:

Google Gemini API

SDK:

@google/genai

Method:

gemini.models.generateContent()

Model:

gemini-3.5-flash

Uses:

Medical report extraction
Personalized food analysis
Meal-plan generation
Meal-plan customization

⸻

USDA

Service:

USDA FoodData Central

Exact API endpoint currently used:

https://api.nal.usda.gov/fdc/v1/foods/search

Backend route:

GET /nutrition

Purpose:

Food search
Nutrition information

⸻

Hugging Face

Service/model source:

Hugging Face

Purpose:

Food image recognition

Implementation:

Downloaded locally
↓
Python
↓
food_recognition.py
↓
Local inference

Hugging Face hosted inference API:

Not used

Hugging Face API key:

Not required

Exact model identifier:

Defined in server/food_recognition.py

The exact identifier should be copied from that file rather than guessed.

⸻

134. File Structure

The repository is structured approximately as:

CAPSTONE/
│
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── MealPlanner.jsx
│   │   ├── FoodHistory.jsx
│   │   ├── FoodGenome.jsx
│   │   ├── foodgenome.css
│   │   └── ...
│   │
│   ├── package.json
│   ├── vite.config.js
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
│
└── README.md

⸻

135. Root README

This file:

README.md

is located in the project root.

The root README documents the complete project.

It is not limited to the frontend.

The project is:

CAPSTONE/

with:

client/
server/
README.md
.gitignore

⸻

136. client Directory

The client directory contains the React/Vite frontend.

Important components include:

App.jsx
MealPlanner.jsx
FoodHistory.jsx
FoodGenome.jsx

Other frontend files handle:

* UI
* Styling
* Forms
* Authentication
* User interaction
* API requests
* Displaying application data

⸻

137. server Directory

The server directory contains the backend.

Important files include:

server.js
food_recognition.py
requirements.txt

The directory also contains runtime/generated directories such as:

uploads/
food-ai/

These should not be treated as source-code dependencies that need to be committed.

⸻

138. server.js

server.js is the primary backend file.

It currently contains the implementation for:

Express
CORS
MongoDB
Multer
Authentication
Sessions
bcrypt
Crypto
Nodemailer
Gemini
USDA
Python execution
Food Genome
Digital Twin
Medical Reports
Food History
Meal Plans
Personalized Analysis

⸻

139. food_recognition.py

This is the Python source file responsible for local food recognition.

It should be committed to GitHub.

It is not the same as:

food-ai/

The distinction is:

food_recognition.py
=
Source Code

while:

food-ai/
=
Local Python Virtual Environment

⸻

140. requirements.txt

This file defines the Python dependencies required by the food-recognition component.

It should be committed.

A developer can use it to recreate the local environment.

⸻

141. food-ai/

The directory:

server/food-ai/

is the local Python virtual environment.

It should be ignored by Git.

It may contain:

Python executable
Installed packages
ML libraries
PyTorch binaries
Transformers dependencies
Other runtime files

These files should not be pushed to GitHub.

⸻

142. uploads/

The directory:

server/uploads/

contains uploaded runtime files.

These can include:

Food Images
Medical Reports

Uploaded runtime data should not be committed to the repository.

⸻

143. Git Ignore Requirements

The project should ignore:

.env
.env.*
node_modules/
dist/
server/food-ai/
server/uploads/

The exact .gitignore can contain additional generated files as required by the environment.

⸻

144. What Must Be Committed

Important source files that should remain in Git include:

client/
server/server.js
server/food_recognition.py
server/requirements.txt
.gitignore
README.md
package.json

The exact frontend/backend package files should also remain committed.

⸻

145. What Must Not Be Committed

Do not commit:

.env
API keys
MongoDB credentials
SMTP passwords
node_modules/
server/food-ai/
server/uploads/
dist/

The Python environment should be recreated using:

requirements.txt

⸻

146. Local Installation

Clone the repository.

Then install the frontend dependencies:

cd client
npm install

Install backend dependencies:

cd ../server
npm install

⸻

147. Python Environment Installation

From:

cd server

create the virtual environment:

python3 -m venv food-ai

Activate it:

source food-ai/bin/activate

Then:

pip install -r requirements.txt

⸻

148. Windows Python Setup

On Windows:

cd server
python -m venv food-ai

Activate:

food-ai\Scripts\activate

Install dependencies:

pip install -r requirements.txt

⸻

149. Backend .env

Create:

server/.env

Example:

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
USDA_API_KEY=YOUR_USDA_API_KEY
CLIENT_URL=http://localhost:5173
PORT=5001
NODE_ENV=development
SMTP_HOST=YOUR_SMTP_HOST
SMTP_PORT=587
SMTP_USER=YOUR_SMTP_USERNAME
SMTP_PASSWORD=YOUR_SMTP_PASSWORD
SMTP_FROM=YOUR_FROM_ADDRESS

Never commit the actual values.

⸻

150. Starting the Backend

From:

cd server

run the backend using the command configured in package.json.

For example:

npm start

The backend listens on:

5001

unless another port is supplied through the environment.

⸻

151. Starting the Frontend

From:

cd client

run:

npm run dev

The Vite frontend will normally be available at:

http://localhost:5173

⸻

152. Complete Local Setup

A typical development environment is:

Terminal 1
-------------------------
cd server
npm install
npm start
Terminal 2
-------------------------
cd client
npm install
npm run dev
Python
-------------------------
server/food-ai/
Local food-recognition environment

⸻

153. Complete Local Runtime

                 Browser
                    |
                    v
             React + Vite
              Port 5173
                    |
                    v
          Node.js + Express
              Port 5001
                    |
        +-----------+-----------+
        |           |           |
        v           v           v
     MongoDB     Gemini       USDA
                    |
                    |
             Python Process
                    |
                    v
        Local Hugging Face Model

⸻

154. Medical Report Runtime

Browser
  ↓
React
  ↓
POST /medical-reports
  ↓
Express
  ↓
Multer
  ↓
File saved
  ↓
Base64
  ↓
Gemini
  ↓
Structured JSON
  ↓
MongoDB
  ↓
Patient
  +
Digital Twin

⸻

155. Food Recognition Runtime

Browser
  ↓
React
  ↓
POST /recognize-food
  ↓
Express
  ↓
Multer
  ↓
Uploaded Image
  ↓
execFile()
  ↓
server/food-ai/bin/python3
  ↓
food_recognition.py
  ↓
Local Hugging Face Model
  ↓
Prediction
  ↓
JSON
  ↓
Express
  ↓
React

⸻

156. Nutrition Runtime

Recognized Food
      ↓
GET /nutrition
      ↓
Express
      ↓
USDA FoodData Central
      ↓
/fdc/v1/foods/search
      ↓
First Search Result
      ↓
Nutrition Extraction
      ↓
Frontend

⸻

157. Personalized Food Runtime

Food
+
Nutrition
+
Patient
+
Digital Twin
+
Food Genome
+
Food History
       ↓
POST /personalized-analysis
       ↓
Express
       ↓
Gemini
       ↓
gemini-3.5-flash
       ↓
Personalized Analysis
       ↓
React

⸻

158. Meal Plan Runtime

Goal
+
Context
+
Customization
+
Patient Profile
+
Digital Twin
+
Food Genome
+
Previous Plans
+
Feedback
      ↓
POST /meal-plan
      ↓
Express
      ↓
Gemini
      ↓
gemini-3.5-flash
      ↓
Meal Plan
      ↓
MongoDB
      ↓
mealPlanId
      ↓
Frontend

⸻

159. Meal Plan Customization Runtime

Existing Meal Plan
       ↓
mealPlanId
       ↓
Customization Request
       ↓
Backend Ownership Check
       ↓
Retrieve Existing Plan
       ↓
Gemini
       ↓
Updated Plan
       ↓
Save Previous Version
       ↓
Update Current Version
       ↓
Same mealPlanId

⸻

160. Feedback Runtime

User Feedback
      ↓
POST /food-history
      ↓
Backend
      ↓
Validate User
      ↓
Validate Food / Meal Plan
      ↓
foodHistory
      |
      +----> foodGenomes
      |
      +----> digitalTwins
      |
      +----> mealPlans
      ↓
Future AI Context

⸻

161. Complete Food Intelligence Flowchart

                           START
                             |
                             v
                       User Logs In
                             |
                             v
                  Patient Profile Available?
                       /             \
                     NO               YES
                     |                 |
                     v                 v
              Create Profile      Continue
                     |                 |
                     +--------+--------+
                              |
                              v
                        Digital Twin
                              |
                              v
                         Food Genome
                              |
                              v
                       User Uploads Food
                              |
                              v
                     Food Image Received
                              |
                              v
                     POST /recognize-food
                              |
                              v
                     Node.js / Express
                              |
                              v
                         Python
                              |
                              v
                   food_recognition.py
                              |
                              v
                Local Hugging Face Model
                              |
                              v
                       Food Name
                              |
                              v
                       GET /nutrition
                              |
                              v
                  USDA FoodData Central
                              |
                              v
                     Nutrition Data
                              |
                              v
                     Patient Profile
                              |
                              v
                       Digital Twin
                              |
                              v
                       Food Genome
                              |
                              v
                       Food History
                              |
                              v
                            Gemini
                              |
                              v
                  Personalized Analysis
                              |
                              v
                        User Feedback
                              |
                              v
                       Food History
                              |
                    +---------+---------+
                    |                   |
                    v                   v
               Food Genome        Digital Twin
                    |                   |
                    +---------+---------+
                              |
                              v
                     Future Personalization
                              |
                              v
                             END

⸻

162. Complete Meal Planner Flowchart

                           START
                             |
                             v
                        User Goal
                             |
                             v
                         User Context
                             |
                             v
                     Patient Health Profile
                             |
                             v
                         Digital Twin
                             |
                             v
                         Food Genome
                             |
                             v
                    Food Genome Learning
                             |
                             v
                  Previous Saved Meal Plans
                             |
                             v
                  Previous Meal-Plan Feedback
                             |
                             v
                       Gemini Prompt
                             |
                             v
                     gemini-3.5-flash
                             |
                             v
                    Generated Meal Plan
                             |
                             v
                         MongoDB
                             |
                             v
                        mealPlanId
                             |
                             v
                    Display to User
                             |
                    +--------+--------+
                    |                 |
                    v                 v
                 Accept          Customize
                    |                 |
                    |                 v
                    |          Existing mealPlanId
                    |                 |
                    |                 v
                    |          Gemini Update
                    |                 |
                    |                 v
                    |          Save Previous
                    |             Version
                    |                 |
                    +--------+--------+
                             |
                             v
                       User Feedback
                             |
                             v
                        Food History
                             |
              +--------------+--------------+
              |              |              |
              v              v              v
         Food Genome     Meal Plans     Digital Twin
              |              |              |
              +--------------+--------------+
                             |
                             v
                   Future Meal Planning
                             |
                            END

⸻

163. Complete System Flowchart

                                 USER
                                   |
                                   v
                          React + Vite Frontend
                                   |
                                   v
                           Node.js + Express
                                   |
       +---------------------------+---------------------------+
       |                           |                           |
       v                           v                           v
 Authentication              Food Processing             Meal Planning
       |                           |                           |
       v                           v                           v
   MongoDB                     Python                      Gemini
                                   |
                                   v
                        food_recognition.py
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
              +--------------------+--------------------+
              |                    |                    |
              v                    v                    v
       Patient Profile       Digital Twin         Food Genome
              |                    |                    |
              +--------------------+--------------------+
                                   |
                                   v
                             Food History
                                   |
                                   v
                                Gemini
                                   |
                    +--------------+--------------+
                    |                             |
                    v                             v
            Personalized Food              Meal Plan
                Analysis                       |
                    |                           v
                    v                     Saved Plan
                Feedback                       |
                    |                           v
                    v                     Version History
              Food Genome                       |
                    |                           v
                    v                     Meal Feedback
              Digital Twin                       |
                    |                           |
                    +-------------+-------------+
                                  |
                                  v
                               MongoDB
                                  |
                                  v
                           Future SQL Layer
                                  |
                                  v
                              Future RAG

⸻

164. Security Architecture

The application keeps sensitive credentials on the backend.

Backend-only secrets include:

MONGODB_URI
GEMINI_API_KEY
USDA_API_KEY
SMTP_PASSWORD

Authentication uses:

HTTP-only Cookie
+
Random Session Token
+
SHA-256 Token Hash
+
MongoDB Session

Passwords use:

bcryptjs

Password reset uses:

Random Token
+
SHA-256
+
30-minute expiration

⸻

165. Security Flow

User
  ↓
Login
  ↓
Password Verification
  ↓
bcrypt.compare()
  ↓
Random Session Token
  ↓
SHA-256 Hash
  ↓
MongoDB Session
  ↓
HTTP-only Cookie
  ↓
Authenticated Requests

⸻

166. Data Security Principle

The frontend must never contain:

Gemini API Key
USDA API Key
MongoDB URI
SMTP Password

These values belong in:

server/.env

The .env file must be ignored by Git.

⸻

167. AI Safety Principle

The AI system is intended for personalized dietary decision support.

It should not:

Invent medical information
Invent food reactions
Invent allergies
Diagnose medical conditions
Replace professional medical advice

The system uses explicit available information.

⸻

168. Preference Safety Principle

The application distinguishes:

Food Preference

from:

Food Reaction

and from:

Medical Information

These should not be treated as the same thing.

The AI should consider all available context.

⸻

169. Important Personalization Priority

The system prioritizes information approximately in this order:

1. Explicit allergies
2. Explicit dietary restrictions
3. Explicit medical information
4. Previous negative reactions
5. Repeated personal patterns
6. Nutrition
7. Food preference

This prevents a simple preference from automatically overriding more important information.

⸻

170. Feedback-Driven Intelligence

The system becomes more personalized through feedback.

Initial User
     ↓
Health Profile
     ↓
Digital Twin
     ↓
Food Genome
     ↓
AI Analysis
     ↓
User Feedback
     ↓
Updated Food Genome
     ↓
Updated Digital Twin
     ↓
Better Future Analysis
     ↓
Better Meal Planning

This is one of the core ideas of the project.

⸻

171. Difference Between Digital Twin and Food Genome

Digital Twin

Represents:

Health Context
Medical Context
Dietary Context
User Profile
Feedback Summary

Food Genome

Represents:

Food Preferences
Food Reactions
Food Experiences
Food Feedback
Meal Plan Feedback
Learned Food Patterns

They work together.

Digital Twin
     +
Food Genome
     ↓
Personalized User Context

⸻

172. Difference Between Food Genome and Food History

Food History

Stores individual historical feedback/events.

Example:

Pizza
Loved
Acidity
Date

Food Genome

Stores the more persistent personalized understanding derived from those interactions.

Conceptually:

Food History
     ↓
Patterns
     ↓
Food Genome

⸻

173. Difference Between Gemini and Hugging Face

Hugging Face

Used for:

Food Image Recognition

It answers:

"What food is this?"

Gemini

Used for:

AI reasoning
Personalized analysis
Meal planning
Medical report extraction

It answers:

"What does this information mean in the user's context?"

⸻

174. Difference Between Gemini and USDA

USDA FoodData Central

Provides structured food/nutrition information.

Food
   ↓
Nutrition Data

Gemini

Uses available information to generate personalized reasoning.

Food
+
Nutrition
+
User Context
   ↓
Personalized AI

⸻

175. Complete Technology Relationship

                    Hugging Face
                         |
                         v
                  Food Recognition
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
       +-----------------+-----------------+
       |                 |                 |
       v                 v                 v
Patient Profile     Digital Twin      Food Genome
       |                 |                 |
       +-----------------+-----------------+
                         |
                         v
                    Food History
                         |
                         v
                       Gemini
                         |
                         v
               Personalized Intelligence

⸻

176. Current vs Future System

Current

React
  ↓
Express
  ↓
MongoDB

with:

Express
  ├── Python
  │     └── Local Hugging Face Model
  │
  ├── USDA FoodData Central
  │
  ├── Google Gemini
  │
  └── SMTP

Future

React
  ↓
Express
  ↓
Service Layer
  ↓
Repository Layer
  ↓
SQL

with:

Express
  ├── Python
  │     └── Local Hugging Face Model
  │
  ├── USDA FoodData Central
  │
  ├── RAG
  │     └── Retrieval Sources
  │
  ├── Google Gemini
  │
  └── SMTP

⸻

177. Future SQL Migration Goal

The migration should preserve the current API structure.

For example:

GET /nutrition

should continue to work.

POST /meal-plan

should continue to work.

POST /food-history

should continue to work.

The frontend should ideally not need to know whether the data is stored in:

MongoDB

or:

SQL

⸻

178. Future RAG Goal

The future RAG layer should retrieve only relevant information.

Instead of:

Entire Food Genome
+
Entire Food History
+
Entire Digital Twin
+
All Meal Plans

the system can retrieve:

Relevant Food Experiences
+
Relevant Preferences
+
Relevant Health Context
+
Relevant Nutrition Data

and provide that information to Gemini.

⸻

179. Future Scalability

The planned architecture can eventually support:

More Users
More Food Records
More Meal Plans
More Feedback
More Medical Information
More Nutrition Data
More Personalized Patterns

without requiring the frontend architecture to change.

The database layer can evolve from:

MongoDB

to:

SQL

and the AI context layer can evolve from direct context passing to:

RAG

⸻

180. Error Handling

The backend handles errors related to:

Authentication
Authorization
Database
File Upload
Food Recognition
Python Execution
USDA API
Gemini API
Gemini Quota
Medical Reports
Meal Plans
Meal Plan IDs
Invalid Requests
SMTP

The backend returns HTTP status codes and messages instead of allowing every error to become an unhandled server failure.

⸻

181. Food Recognition Error Handling

The food-recognition process handles problems such as:

Missing image
Python execution failure
Invalid Python output
JSON parsing failure
Model inference failure

The backend does not assume that every Python execution will succeed.

⸻

182. USDA Error Handling

The nutrition route checks whether the USDA request succeeds.

If the external API request fails, the backend returns an error rather than attempting to create fake nutrition data.

⸻

183. Gemini Error Handling

The backend handles Gemini errors.

In particular, quota exhaustion is detected.

The application can therefore distinguish between:

AI request failure

and:

AI quota exhaustion

⸻

184. Medical Report Error Handling

The medical-report endpoint validates uploaded file types.

Unsupported file types are rejected.

The supported types are:

PDF
JPEG
JPG
PNG

⸻

185. Meal Plan Ownership Validation

When an existing meal plan is customized or feedback is submitted, the backend verifies:

mealPlanId

and:

authenticated userId

The backend only allows operations on plans owned by the authenticated user.

⸻

186. Meal Plan Versioning Principle

The system does not simply overwrite the previous meal plan without preserving history.

Instead:

Current Plan
     ↓
Customization
     ↓
Previous Plan Saved
     ↓
New Plan Becomes Current

This creates a history of how the user’s plan evolved.

⸻

187. Medical Information to Personalization

Medical report information can eventually become part of:

Patient Profile
      ↓
Digital Twin
      ↓
Meal Planning Context
      +
Personalized Food Analysis Context

This creates a connection between medical information and dietary intelligence.

⸻

188. Food Image to Meal Plan Relationship

Food recognition itself does not directly create a meal plan.

Instead:

Food Image
   ↓
Food Recognition
   ↓
Food Name
   ↓
Nutrition
   ↓
Personalized Analysis
   ↓
Feedback
   ↓
Food Genome
   ↓
Future Meal Planning

This allows food-image interactions to indirectly improve future meal plans.

⸻

189. Learning Loop Example

A simplified example:

User analyzes Pizza
        ↓
USDA nutrition retrieved
        ↓
Gemini analyzes Pizza
        ↓
User marks Pizza as Loved
        ↓
User records a reaction
        ↓
Food History stores experience
        ↓
Food Genome updates
        ↓
Digital Twin feedback updates
        ↓
Future meal planner receives this information
        ↓
Gemini can consider the previous experience

The system therefore learns from interactions rather than treating every request as completely independent.

⸻

190. Meal Plan Feedback Example

User generates Meal Plan A
        ↓
Meal Plan saved
        ↓
mealPlanId generated
        ↓
User customizes Plan A
        ↓
Previous version preserved
        ↓
Current Plan A updated
        ↓
User provides feedback
        ↓
Feedback linked to exact mealPlanId
        ↓
Food Genome updated
        ↓
Digital Twin updated
        ↓
Future plans can use feedback

⸻

191. Project Design Philosophy

The project follows these main principles:

Personalization

Recommendations should consider the individual user.

Separation of responsibilities

Each technology should perform the task it is best suited for.

Security

Secrets remain on the backend.

Data persistence

User interactions should be saved.

Feedback

User feedback should improve future personalization.

API-driven architecture

Frontend and backend should remain separated.

Migration readiness

Database-specific logic should remain on the backend.

Future AI grounding

RAG can later provide more targeted retrieval.

⸻

192. Why the Project Uses Multiple AI/Data Components

A single model should not be responsible for everything.

The project intentionally separates the system into:

Food Recognition
        ↓
Hugging Face Model
Nutrition
        ↓
USDA FoodData Central
User Data
        ↓
MongoDB
Personal User Context
        ↓
Digital Twin + Food Genome
AI Reasoning
        ↓
Google Gemini
Future Retrieval
        ↓
RAG

This makes the architecture more modular.

⸻

193. Modular Architecture

The major modules are:

1. Authentication
2. Patient Profile
3. Digital Twin
4. Food Genome
5. Food Recognition
6. Nutrition
7. Medical Reports
8. Food History
9. Personalized Analysis
10. Meal Planner
11. Meal Plan Versioning
12. Meal Plan Feedback
13. Database
14. Email
15. Future SQL Layer
16. Future RAG Layer

⸻

194. Authentication Module

Responsible for:

Signup
Login
Sessions
Remember Me
Logout
Current User
Forgot Password
Reset Password

⸻

195. Patient Module

Responsible for:

Health Profile
Age
Gender
Height
Weight
Blood Pressure
Blood Sugar
Diseases
Allergies
Food Preferences

⸻

196. Digital Twin Module

Responsible for maintaining:

Health Profile
Medical Context
Dietary Feedback
Feedback Count
Personal Context

⸻

197. Food Genome Module

Responsible for:

Food Preferences
Food Reactions
Food Experiences
Learned Patterns
Meal Plan Feedback

⸻

198. Food Recognition Module

Responsible for:

Image Upload
Python Execution
Local Hugging Face Model
Food Name
Recognition Score

⸻

199. Nutrition Module

Responsible for:

Food Search
USDA FoodData Central
Calories
Protein
Carbohydrates
Fat
Fiber
FDC ID

⸻

200. Medical Report Module

Responsible for:

Report Upload
File Validation
Base64 Encoding
Gemini Extraction
Structured Medical Data
Patient Update
Digital Twin Update

⸻

201. Food History Module

Responsible for:

Feedback
Food Experiences
Reaction Records
Meal Plan Feedback
Historical Context

⸻

202. Personalized Analysis Module

Responsible for:

Food
+
Nutrition
+
User Context
+
Food Genome
+
Digital Twin
+
History
↓
Gemini
↓
Personalized Analysis

⸻

203. Meal Planner Module

Responsible for:

Goal
Context
Customization
Food Genome
Digital Twin
Previous Plans
Feedback
Gemini
Saved Plans

⸻

204. Meal Plan Version Module

Responsible for:

Previous Plan
Current Plan
Customization
Version History

⸻

205. Feedback Module

Responsible for updating:

Food History
Food Genome
Digital Twin
Meal Plan Feedback

⸻

206. Database Module

Current:

MongoDB

Future:

SQL

The database is controlled by the backend.

⸻

207. Email Module

Responsible for:

Password Reset

Technology:

Nodemailer
SMTP

⸻

208. Future Retrieval Module

Planned:

RAG

Purpose:

Retrieve relevant information
Ground Gemini
Reduce unnecessary context
Improve personalization
Improve scalability

⸻

209. Complete Project Architecture in One Diagram

                                      USER
                                        |
                                        v
                              +------------------+
                              | React + Vite     |
                              | Frontend         |
                              +--------+---------+
                                       |
                                       | HTTP
                                       v
                              +------------------+
                              | Node.js          |
                              | Express Backend  |
                              +--------+---------+
                                       |
        +------------------------------+------------------------------+
        |                              |                              |
        v                              v                              v
+---------------+              +---------------+              +---------------+
| Authentication|              | Food System   |              | Meal Planner  |
+-------+-------+              +-------+-------+              +-------+-------+
        |                              |                              |
        v                              |                              v
+---------------+                      |                         Google Gemini
| MongoDB       |                      |
| Sessions      |                      |
| Users         |                      |
+---------------+                      |
                                       v
                                +-------------+
                                | Python      |
                                +------+------+
                                       |
                                       v
                            +-----------------------+
                            | food_recognition.py   |
                            +-----------+-----------+
                                        |
                                        v
                            +-----------------------+
                            | Local Hugging Face    |
                            | Food Recognition Model|
                            +-----------+-----------+
                                        |
                                        v
                                  Food Name
                                        |
                                        v
                            +-----------------------+
                            | USDA FoodData        |
                            | Central API           |
                            +-----------+-----------+
                                        |
                                        v
                                Nutrition Data
                                        |
                    +-------------------+-------------------+
                    |                   |                   |
                    v                   v                   v
              Patient Profile      Digital Twin       Food Genome
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                                  Food History
                                        |
                                        v
                                  Google Gemini
                                        |
                         +--------------+--------------+
                         |                             |
                         v                             v
                 Personalized Food               Meal Plan
                     Analysis                         |
                         |                             v
                         v                       Saved Plan
                    Feedback                         |
                         |                             v
                         v                       Version History
                   Food Genome                         |
                         |                             v
                         v                       Meal Feedback
                  Digital Twin                         |
                         |                             |
                         +--------------+--------------+
                                        |
                                        v
                                     MongoDB
                                        |
                                        v
                              FUTURE SQL DATABASE
                                        |
                                        v
                                  FUTURE RAG

⸻

210. Current Architecture Summary

The current production/development architecture is:

Frontend:
React + Vite
Backend:
Node.js + Express
Database:
MongoDB
Food Recognition:
Python + locally downloaded Hugging Face model
Nutrition:
USDA FoodData Central API
AI:
Google Gemini API
Model: gemini-3.5-flash
Authentication:
Custom MongoDB-backed HTTP-only sessions
Email:
Nodemailer + SMTP
Future:
MongoDB → SQL
Future:
RAG

⸻

211. Exact Integration Summary

Component	Exact Current Implementation
Frontend	React + Vite
Backend	Node.js + Express
Database	MongoDB
MongoDB Database	dietaryAI
Gemini SDK	@google/genai
Gemini Method	gemini.models.generateContent()
Gemini Model	gemini-3.5-flash
Gemini Key	GEMINI_API_KEY
USDA Service	USDA FoodData Central
USDA Endpoint	https://api.nal.usda.gov/fdc/v1/foods/search
USDA Backend Route	GET /nutrition
USDA Key	USDA_API_KEY
Food Recognition	Python
Python Script	server/food_recognition.py
Python Environment	server/food-ai/
Python Executable	server/food-ai/bin/python3
Python Invocation	child_process.execFile()
Hugging Face	Locally downloaded food-recognition model
Hugging Face Hosted API	Not used
Hugging Face API Key	Not required
Upload Library	Multer
Password Hashing	bcryptjs
Session Token	crypto.randomBytes(32)
Session Hash	SHA-256
Session Cookie	dietary_session
Email	Nodemailer
SMTP Password Variable	SMTP_PASSWORD
Current Database	MongoDB
Planned Database	SQL
Planned Retrieval	RAG

⸻

212. Exact Environment Variable Summary

MONGODB_URI=
GEMINI_API_KEY=
USDA_API_KEY=
CLIENT_URL=http://localhost:5173
PORT=5001
NODE_ENV=development
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

There is no current:

SESSION_SECRET

requirement in the supplied backend implementation.

There is also no current:

HUGGINGFACE_API_KEY

requirement because the food-recognition model is executed locally.

⸻

213. Project Setup Summary

1. Clone repository
        ↓
2. Install frontend dependencies
        ↓
3. Install backend dependencies
        ↓
4. Create server/.env
        ↓
5. Configure MongoDB
        ↓
6. Configure Gemini API key
        ↓
7. Configure USDA API key
        ↓
8. Configure SMTP if password reset email is required
        ↓
9. Create Python virtual environment
        ↓
10. Install requirements.txt
        ↓
11. Ensure local Hugging Face model is available
        ↓
12. Start backend
        ↓
13. Start frontend
        ↓
14. Log in
        ↓
15. Create patient profile
        ↓
16. Test Digital Twin
        ↓
17. Test Food Genome
        ↓
18. Test food recognition
        ↓
19. Test USDA nutrition
        ↓
20. Test personalized analysis
        ↓
21. Test medical report
        ↓
22. Test meal planner
        ↓
23. Test meal customization
        ↓
24. Test meal feedback

⸻

214. Recommended Testing Order

For a new developer, the easiest testing order is:

1. Backend health
2. MongoDB connection
3. Signup
4. Login
5. /me
6. Patient Profile
7. Digital Twin
8. Food Genome
9. Food Image Upload
10. Food Recognition
11. USDA Nutrition
12. Personalized Analysis
13. Medical Report
14. Meal Planner
15. Saved Meal Plan
16. Meal Customization
17. Meal Plan Versioning
18. Food Feedback
19. Meal Plan Feedback
20. Password Reset

⸻

215. Testing Checklist

Authentication

* [ ]	Signup works
* [ ]	Password hashing works
* [ ]	Login works
* [ ]	Session cookie is created
* [ ]	/me works
* [ ]	Remember Me works
* [ ]	Logout works
* [ ]	Forgot password works
* [ ]	Reset password works
* [ ]	Sessions expire correctly

Patient Profile

* [ ]	Profile creation works
* [ ]	Profile update works
* [ ]	Profile retrieval works
* [ ]	User ownership works

Digital Twin

* [ ]	Digital Twin created
* [ ]	Health profile stored
* [ ]	Medical information stored
* [ ]	Feedback stored
* [ ]	Feedback count updated

Food Genome

* [ ]	Loved foods stored
* [ ]	Liked foods stored
* [ ]	Neutral foods stored
* [ ]	Disliked foods stored
* [ ]	Reactions stored
* [ ]	Patterns updated
* [ ]	Meal-plan feedback stored

Food Recognition

* [ ]	Image upload works
* [ ]	Python environment works
* [ ]	Python script executes
* [ ]	Local Hugging Face model loads
* [ ]	Food name returned
* [ ]	Score returned

USDA

* [ ]	/nutrition works
* [ ]	USDA API key works
* [ ]	Food search works
* [ ]	FDC ID returned
* [ ]	Calories returned
* [ ]	Protein returned
* [ ]	Carbohydrates returned
* [ ]	Fat returned
* [ ]	Fiber returned

Gemini

* [ ]	Medical report extraction works
* [ ]	Personalized analysis works
* [ ]	Meal plan generation works
* [ ]	Meal customization works
* [ ]	Quota errors are handled

Meal Planner

* [ ]	Goal accepted
* [ ]	Context accepted
* [ ]	Health profile used
* [ ]	Digital Twin used
* [ ]	Food Genome used
* [ ]	Previous plans used
* [ ]	Meal plan saved
* [ ]	mealPlanId returned
* [ ]	Existing plan can be customized
* [ ]	Same mealPlanId preserved
* [ ]	Previous version stored
* [ ]	Feedback linked to exact plan

⸻

216. GitHub Handoff

A developer cloning this repository should understand that:

The repository contains source code.

It does not contain:

API keys
MongoDB credentials
SMTP credentials
Python virtual environment
Uploaded user files
node_modules
Generated build files

The developer must recreate these locally.

⸻

217. Important GitHub Rule

Do not upload:

server/food-ai/

The virtual environment is machine-specific and can contain very large binaries.

Instead upload:

server/requirements.txt

This allows another developer to recreate the environment.

⸻

218. Food Recognition Handoff

For food recognition, the developer needs:

server/food_recognition.py
server/requirements.txt

and a recreated:

server/food-ai/

environment.

The local Hugging Face model must also be available through the model-loading process implemented in:

food_recognition.py

The backend expects the Python executable at:

server/food-ai/bin/python3

on the current Unix-style setup.

⸻

219. API Credential Handoff

The following must be configured by the developer:

MONGODB_URI
GEMINI_API_KEY
USDA_API_KEY

For password-reset emails:

SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM

The values must never be committed to GitHub.

⸻

220. Future Development Roadmap

Phase 1 — Current

React
+
Express
+
MongoDB
+
Python
+
Local Hugging Face Model
+
USDA FoodData Central
+
Gemini
+
Digital Twin
+
Food Genome
+
Medical Reports
+
Food History
+
Meal Planner
+
Feedback

Phase 2 — Backend Refactoring

Routes
    ↓
Controllers
    ↓
Services
    ↓
Repositories
    ↓
Database

Phase 3 — SQL Migration

MongoDB
    ↓
SQL

Phase 4 — RAG

User/Data Sources
    ↓
Retriever
    ↓
Relevant Context
    ↓
Gemini

Phase 5 — Advanced Personalization

SQL
+
RAG
+
Digital Twin
+
Food Genome
+
Food History
+
USDA
+
Local Food Recognition
+
Gemini

⸻

221. Long-Term Architecture

The long-term vision is:

                           USER
                             |
                             v
                      React Frontend
                             |
                             v
                       Express API
                             |
                  +----------+----------+
                  |                     |
                  v                     v
             Application            AI Layer
               Services                 |
                  |                     |
                  v                     v
             SQL Database              RAG
                  |                     |
       +----------+----------+          v
       |          |          |       Gemini
       v          v          v          |
    Profile    Genome     Meal Plans   |
       |          |          |          |
       +----------+----------+----------+
                             |
                             v
                    Personalized Output

Food recognition remains:

Image
 ↓
Python
 ↓
Local Hugging Face Model

Nutrition remains:

Food
 ↓
USDA FoodData Central

⸻

222. Final Architecture Philosophy

The project is designed around a layered architecture.

LAYER 1
Frontend
React + Vite
        ↓
LAYER 2
Backend
Node.js + Express
        ↓
LAYER 3
Business Logic
Personalization + Food Intelligence
        ↓
LAYER 4
External AI/Data
Gemini + USDA + Local Hugging Face Model
        ↓
LAYER 5
Persistence
MongoDB
        ↓
FUTURE
SQL
+
RAG

⸻

223. Complete Project in One Flow

USER
  |
  v
SIGN UP / LOGIN
  |
  v
AUTHENTICATED SESSION
  |
  v
PATIENT PROFILE
  |
  +----------------------+
  |                      |
  v                      v
DIGITAL TWIN         FOOD GENOME
  |                      |
  +----------+-----------+
             |
             v
       USER INTERACTION
             |
      +------+------+
      |             |
      v             v
 FOOD IMAGE      MEAL PLANNER
      |             |
      v             |
 LOCAL PYTHON       |
      |             |
      v             |
 HUGGING FACE       |
      |             |
      v             |
 FOOD NAME         |
      |             |
      v             |
 USDA FOOD DATA     |
      |             |
      v             |
 NUTRITION          |
      |             |
      +------+------+
             |
             v
           GEMINI
             |
      +------+------+
      |             |
      v             v
 FOOD ANALYSIS   MEAL PLAN
      |             |
      v             v
  FEEDBACK       SAVE PLAN
      |             |
      v             v
FOOD HISTORY    VERSIONS
      |             |
      v             v
FOOD GENOME     PLAN FEEDBACK
      |             |
      +------+------+
             |
             v
        DIGITAL TWIN
             |
             v
   FUTURE PERSONALIZATION
             |
             v
          FUTURE RAG
             |
             v
          FUTURE SQL

⸻

224. Final Summary

AI Dietary Intelligence combines multiple technologies into one personalized dietary intelligence platform.

The project currently consists of:

React + Vite
        ↓
Node.js + Express
        ↓
MongoDB

with:

Python
+
Locally Downloaded Hugging Face Food Model

for food recognition.

It uses:

USDA FoodData Central

through the exact endpoint:

https://api.nal.usda.gov/fdc/v1/foods/search

for nutrition and food information.

It uses:

Google Gemini API

through:

@google/genai

using:

gemini.models.generateContent()

and the exact current model:

gemini-3.5-flash

Gemini is used for:

Medical Report Extraction
Personalized Food Analysis
Meal Plan Generation
Meal Plan Customization

Food recognition is performed locally:

Hugging Face Model
        ↓
Downloaded Locally
        ↓
Python
        ↓
food_recognition.py
        ↓
Node.js

The project does not use the Hugging Face hosted inference API.

No Hugging Face API key is required for the current implementation.

The exact Hugging Face model identifier is defined in:

server/food_recognition.py

and should be documented from that file rather than guessed.

The current database is:

MongoDB

using the database:

dietaryAI

The project will migrate to:

SQL

in a future stage.

The planned SQL migration should be implemented behind the backend so that the frontend can continue using the same API layer.

The future AI architecture will also introduce:

RAG

to retrieve relevant information from sources such as:

Food Genome
Food History
Digital Twin
Medical Information
Previous Meal Plans
Meal Plan Feedback
USDA Nutrition Data

before sending the relevant context to Gemini.

⸻

225. Final End-to-End Architecture

                                      AI DIETARY INTELLIGENCE
                                                 |
                                                 v
                                               USER
                                                 |
                                                 v
                                        REACT + VITE
                                                 |
                                                 v
                                       NODE + EXPRESS API
                                                 |
        +----------------------+-----------------+----------------------+
        |                      |                 |                      |
        v                      v                 v                      v
 Authentication        Food Recognition    Nutrition              Meal Planner
        |                      |                 |                      |
        v                      v                 v                      v
    MongoDB                 Python          USDA FoodData            Gemini
                               |              Central API               |
                               v                 |                      |
                       Hugging Face Model        |                      |
                               |                 |                      |
                               +--------+--------+                      |
                                        |                               |
                                        v                               |
                                   FOOD CONTEXT                         |
                                        |                               |
                         +--------------+--------------+                |
                         |              |              |                |
                         v              v              v                |
                  Patient Profile  Digital Twin  Food Genome            |
                         |              |              |                |
                         +--------------+--------------+                |
                                        |                               |
                                        v                               |
                                  Food History                          |
                                        |                               |
                                        +---------------+---------------+
                                                        |
                                                        v
                                                     GEMINI
                                                        |
                              +-------------------------+-------------------------+
                              |                                                   |
                              v                                                   v
                    PERSONALIZED FOOD                                   PERSONALIZED MEAL
                       ANALYSIS                                               PLAN
                              |                                                   |
                              v                                                   v
                         USER FEEDBACK                                     SAVED PLAN
                              |                                                   |
                              v                                                   v
                       FOOD HISTORY                                      VERSION HISTORY
                              |                                                   |
                              v                                                   v
                        FOOD GENOME                                      MEAL PLAN FEEDBACK
                              |                                                   |
                              +-------------------------+-------------------------+
                                                        |
                                                        v
                                                  DIGITAL TWIN
                                                        |
                                                        v
                                             PERSONALIZATION LOOP
                                                        |
                                                        v
                                                   FUTURE RAG
                                                        |
                                                        v
                                                   FUTURE SQL

⸻

226. Final Project Vision

The final vision of AI Dietary Intelligence is:

Recognize
    ↓
Understand
    ↓
Retrieve
    ↓
Personalize
    ↓
Recommend
    ↓
Collect Feedback
    ↓
Learn
    ↓
Personalize Again

The system therefore evolves from a simple food-recognition and nutrition application into a personalized dietary intelligence platform.

The complete long-term architecture is:

Local Food Recognition
          +
USDA FoodData Central
          +
Patient Health Profile
          +
Medical Information
          +
Digital Twin
          +
Food Genome
          +
Food History
          +
User Feedback
          +
Meal Plan History
          +
SQL Database
          +
RAG
          +
Google Gemini
          |
          v
PERSONALIZED DIETARY INTELLIGENCE

The current implementation provides the foundation for this architecture, while the planned MongoDB-to-SQL migration and RAG layer provide the next stages of scalability, structured data management, retrieval, and advanced personalization.