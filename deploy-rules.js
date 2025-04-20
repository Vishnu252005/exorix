// This script will help you deploy the updated Firestore rules
// Run this with Node.js after installing the Firebase CLI

const fs = require('fs');
const { exec } = require('child_process');

// Step 1: Copy the updated rules to firestore.rules
console.log('Copying updated rules to firestore.rules...');
fs.copyFileSync('updated-firestore-rules.txt', 'firestore.rules');

// Step 2: Deploy the rules
console.log('Deploying rules to Firebase...');
exec('firebase deploy --only firestore:rules', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error deploying rules: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log('Rules deployed successfully!');
});

// Instructions for manual deployment
console.log('\nIf the automatic deployment fails, follow these steps:');
console.log('1. Install Firebase CLI: npm install -g firebase-tools');
console.log('2. Login to Firebase: firebase login');
console.log('3. Initialize Firebase in your project: firebase init');
console.log('4. Copy the contents of updated-firestore-rules.txt to firestore.rules');
console.log('5. Deploy the rules: firebase deploy --only firestore:rules'); 