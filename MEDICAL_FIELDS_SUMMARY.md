# Medical Fields Summary

## Fields Already Captured in the Script (Medical Questions Section)

The following medical fields are already being collected during the script flow:

### Basic Health Information
- **Tobacco Use** - Radio (Yes/No)
- **Height** - Text input
- **Weight** - Number input

### Major Health Conditions
- **Heart Problems** - Radio (Yes/No)
- **Stroke History** - Radio (Yes/No)
- **Cancer History** - Radio (Yes/No)
- **AIDS/HIV/Terminal Illness** - Radio (Yes/No)

### Diabetes (with branching logic)
- **Diabetes** - Radio (Yes/No)
  - If Yes:
    - **Diabetes Treatment** - Radio (Pills/Insulin/Both)
    - **Medication Changed Recently** - Radio (Yes/No)
    - **Ever Used Insulin** - Radio (Yes/No)
    - **Insulin Started Before Age 50** - Radio (Yes/No)
    - **Diabetes Complications** - Radio (Yes/No)
    - **Types of Complications** - Checkbox (Multiple selections)

### Other Conditions
- **High Blood Pressure** - Radio (Yes/No)
  - If Yes: **BP Medication Changed Recently** - Radio (Yes/No)
- **Emphysema/COPD** - Radio (Yes/No)
  - If Yes: **Uses Inhalers/Nebulizer/Oxygen** - Radio (Yes/No)
- **Autoimmune Disorders** - Radio (Yes/No)
- **Liver/Kidney Disease** - Radio (Yes/No)
- **Alcohol/Drug Treatment** - Radio (Yes/No)

### Disability and Mobility
- **Disability Status** - Radio (Yes/No)
  - If Yes: **Disability Reason** - Textarea
- **Mobility Aids** (wheelchair/walker/cane) - Radio (Yes/No)
- **Home Health Care** - Radio (Yes/No)

### Additional Medical Information
- **Other Health Problems** - Textarea
- **Current Medications** - Textarea (converted to array when saving)

## Fields in Additional Info Tab

The Additional Info tab captures non-medical information:

### Beneficiary Information
- Primary Beneficiary Name
- Primary Beneficiary Relationship
- Contingent Beneficiary Name
- Contingent Beneficiary Relationship

### Banking Information
- Account Type (Checking/Savings)
- Monthly Draft Date

### Contact Information
- Street Address
- Alternate Phone
- Email Address
- Primary Doctor Name

### Quote Information
- Selected Carrier
- Selected Plan
- Monthly Premium

## Recommendation

All medical questions are already properly captured in the script's Medical Questions section. The Additional Info tab appropriately handles the non-medical administrative data needed to complete the application.

The only enhancement made was to the medications field - it now converts the comma-separated text input into an array for proper database storage.
