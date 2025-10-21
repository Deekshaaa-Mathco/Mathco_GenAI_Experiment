# TODO: Fix API URLs for Vercel Deployment

## Information Gathered
- Frontend deployed on Vercel: https://mathco-gen-ai-experiment-6ld6.vercel.app
- Backend deployed on Vercel: https://mathco-gen-ai-experiment-nzkisklaf-deekshashri-ss-projects.vercel.app
- AuthContext.jsx already uses API_BASE_URL for auth endpoints
- Many components use relative URLs like '/api/...' which won't work across domains
- API_BASE_URL config exists in frontend/src/config/api.js but needs updating to new backend URL
- Backend has CORS headers configured in vercel.json and server.js

## Plan
1. Update API_BASE_URL in frontend/src/config/api.js to new backend URL
2. Update all axios calls in components to use API_BASE_URL from config
3. Update all fetch calls to use API_BASE_URL
4. Ensure consistent API URL usage across all components

## Dependent Files to be edited
- frontend/src/config/api.js ✅
- frontend/src/components/Dashboard.jsx ✅
- frontend/src/components/DemandReview.jsx (already using API_BASE_URL, but verify) ✅
- frontend/src/components/MasterConfigurator.jsx (already using API_BASE_URL) ✅
- frontend/src/components/ReasonCodes.jsx ✅
- frontend/src/components/SupplyPlanning.jsx ✅
- frontend/src/components/ModelPerformance.jsx ✅
- frontend/src/components/CommercialInputs.jsx ✅
- frontend/src/components/CreateScenario.jsx ✅
- frontend/src/components/ApplyConstraints.jsx ✅

## Followup steps
- Test API calls after deployment
- Verify CORS is working properly
- Build and deploy frontend
