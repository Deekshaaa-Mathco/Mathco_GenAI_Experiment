# TODO List for Frontend Updates

## 1. Comment out KPI cards in Dashboard.jsx and DemandReview.jsx
- [ ] Wrap the 4 KPI cards section in Dashboard.jsx with comments to hide them.
- [ ] Wrap the 4 segmentation KPI cards in DemandReview.jsx with comments to hide them.

## 2. Modify SupplyPlanning.jsx
- [ ] Check for any button named "simulate scenario" and remove it if present (otherwise leave "Apply Scenario" button untouched).
- [ ] Confirm "Publish Plan" button is already next to "Apply Scenario" in the 4 KPI cards; no changes needed.

## 3. Implement publish plan functionality
- [ ] Update the "Publish Plan" button in SupplyPlanning.jsx to call an API endpoint that adds a new entry to the supply plans table in Dashboard.jsx with status "published".
- [ ] Modify PublishPlan.jsx if needed to handle the API call and ensure it updates the supply plans.

## 4. Remove "View" buttons in SupplyPlanning.jsx
- [ ] Remove the "View" buttons from the DC Utilization and Plant Line Utilization tables.

## 5. Standardize table headers to black
- [ ] Ensure table headers in ReasonCodes.jsx are black (already appear to be).
- [ ] Ensure table headers in DemandReview.jsx detailed forecast table are black.
- [ ] Ensure table headers in MasterConfigurator.jsx (Reason Codes tab and other tables) are black.

## 6. Enhance edit option in DemandReview.jsx
- [ ] Add inline editing for reason code in the detailed forecast table.
- [ ] Allow selection from existing reason codes or adding new ones during editing.
- [ ] Update the reason codes table in MasterConfigurator.jsx via API if a new reason code is added.

## 7. Verify map functions
- [ ] Confirm all map functions in frontend/components/ files are properly implemented (no issues found in initial check).

## Followup Steps
- [ ] Run the frontend application to test changes.
- [ ] Verify that publishing a plan adds an entry to the supply plans table with "published" status.
- [ ] Test editing in DemandReview.jsx for both forecast volume and reason code.
- [ ] Ensure no console errors related to map functions or other components.
