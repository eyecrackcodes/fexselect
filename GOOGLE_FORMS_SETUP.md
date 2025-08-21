# Google Forms Integration Setup

This guide will help you set up Google Forms integration for automatic submission of medical data.

## Overview

The application now supports automatic submission of customer medical data to a Google Form after the medical questions section is completed. This allows you to:
- Automatically populate a Google Form with collected data
- Keep a backup of medical information in Google Sheets
- Trigger any connected workflows (zapier, etc.)

## Setup Steps

### 1. Create Your Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Create a new form or use an existing one
3. Add these exact fields in order:
   - **Reference ID** (Short answer)
   - **Company Name** (Short answer)
   - **Plan Type** (Short answer)
   - **If ROP, List Yes Q's** (Paragraph)
   - **Insured** (Short answer)
   - **Address** (Short answer)
   - **City** (Short answer)
   - **State** (Short answer)
   - **Zip Code** (Short answer)
   - **Telephone Number** (Short answer)
   - **Email Address** (Short answer)
   - **Gender** (Multiple choice: M/F)
   - **DOB** (Date)
   - **Age** (Number)
   - **State of Birth** (Short answer)
   - **SS Number** (Short answer)
   - **Height** (Short answer)
   - **Weight** (Number)
   - **Owner if Other** (Short answer)
   - **Owner SS** (Short answer)
   - **Payor if Other** (Short answer)
   - **Payor SS** (Short answer)
   - **Payor DOB** (Date)
   - **Primary Beneficiary** (Short answer)
   - **Contingent Beneficiary** (Short answer)
   - **Face Amount** (Short answer)
   - **Riders** (Short answer)
   - **Monthly Premium** (Number)
   - **Tobacco Y or N** (Multiple choice: Y/N)
   - **Physician Name** (Short answer)
   - **Name of Bank** (Short answer)
   - **Name as Appears on Account** (Short answer)
   - **Routing** (Short answer)
   - **Account** (Short answer)
   - **Account Type** (Multiple choice: Checking/Savings)
   - **Draft Day** (Short answer)
   - **State:** (Short answer)
   - **Age:** (Number)
   - **DOB:** (Date)
   - **Tob/NT:** (Short answer)
   - **ht/wt:** (Short answer)
   - **Health:** (Paragraph)
   - **Meds:** (Paragraph)
   - **Current:** (Short answer)
   - **Concern:** (Short answer)

### 2. Get Your Form's Entry IDs

1. Open your Google Form
2. Click the three dots menu (⋮) in the top right
3. Select "Get pre-filled link"
4. Fill out the form with test data (e.g., "TEST" for text fields)
5. Click "Get link" at the bottom
6. Copy the generated URL

The URL will look like:
```
https://docs.google.com/forms/d/e/FORM_ID/viewform?entry.1234567890=TEST&entry.0987654321=TEST
```

The numbers after `entry.` are your field IDs.

### 3. Configure the Application

1. In the Script tab, you'll see a "Google Forms Integration" section
2. Click "Configure"
3. Paste your Google Form URL
4. The application will use default field mappings

### 4. Update Field Mappings (Optional)

If you need to update the field mappings to match your form's entry IDs:

1. Edit `src/components/GoogleFormsConfig/GoogleFormsConfig.tsx`
2. Update the `fieldMappings` object with your actual entry IDs:

```javascript
const fieldMappings = {
  customer_first_name: 'YOUR_ENTRY_ID_HERE',
  customer_last_name: 'YOUR_ENTRY_ID_HERE',
  // ... etc
};
```

## How It Works

1. **During Script Flow**: Agent collects all medical information through the script interface
2. **Auto-Submission**: When the agent completes the Medical Questions section and clicks "Next", the data is automatically submitted to your configured Google Form
3. **Confirmation**: The agent receives a confirmation that the data was submitted
4. **Backup**: All data is still saved in the application's database when creating a lead

## Features

- **Pre-filled Forms**: Opens the Google Form with all data pre-filled
- **Validation**: Ensures required medical fields are completed before submission
- **Error Handling**: Shows errors if submission fails
- **One-time Submission**: Prevents duplicate submissions for the same session
- **Persistent Configuration**: Settings are saved in browser storage

## Troubleshooting

### Form Not Opening
- Check that pop-ups are enabled for the application
- Verify the Google Form URL is correct
- Ensure the form is not restricted (anyone with link can access)

### Data Not Populating
- Verify entry IDs match your form fields
- Check that field types match (e.g., Multiple choice for Yes/No questions)
- Ensure data is being collected in the script before submission

### Missing Fields
- The application only submits fields that have been filled
- Check that all required fields in your form are optional or have default values

## Security Notes

- Form submissions open in a new browser tab
- No sensitive data is stored in the configuration
- Google Form must be publicly accessible (but responses can be restricted)
- Consider using Google Forms response validation for data integrity
