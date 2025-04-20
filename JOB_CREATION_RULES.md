# Job Creation Rules and Permissions

This document outlines the rules and permissions for job creation in our application.

## User Types and Permissions

### Anonymous Users (Not Logged In)
- **Can create job openings**: Yes
- **Can view job openings**: Yes
- **Can update their own job openings**: No (only admins can update anonymous job postings)
- **Can delete their own job openings**: No (only admins can delete anonymous job postings)
- **Can apply to jobs**: No (must be logged in)

### Regular Users (Logged In)
- **Can create job openings**: Yes
- **Can view job openings**: Yes
- **Can update their own job openings**: Yes
- **Can delete their own job openings**: Yes
- **Can update other users' job openings**: No
- **Can delete other users' job openings**: No
- **Can apply to jobs**: Yes

### Admin Users
- **Can create job openings**: Yes
- **Can view job openings**: Yes
- **Can update any job opening**: Yes (including anonymous and other users' postings)
- **Can delete any job opening**: Yes (including anonymous and other users' postings)
- **Can apply to jobs**: Yes

## Job Creation Process

### Anonymous Job Creation
1. Anonymous users can create job openings from the JoinUs page
2. The job is stored in Firestore with `createdBy: 'anonymous'`
3. The job is visible to all users
4. Only admins can update or delete anonymous job postings

### Authenticated User Job Creation
1. Logged-in users can create job openings from:
   - Their profile page
   - The JoinUs page
2. The job is stored in Firestore with the user's ID as `createdBy`
3. The job is also added to the user's `jobs` array in their user document
4. The job is visible to all users
5. The user can update or delete their own job postings

### Admin Job Creation
1. Admins can create job openings from:
   - Their admin profile page
   - The JoinUs page
2. The job is stored in Firestore with the admin's ID as `createdBy`
3. The job is also added to the admin's `jobs` array in their user document
4. The job is visible to all users
5. Admins can update or delete any job posting

## Firestore Security Rules

The following security rules are implemented for job creation:

```javascript
// Jobs collection rules
match /jobs/{jobId} {
  // Anyone can read job openings
  allow read: if true;
  
  // Anyone can create job openings (no authentication required)
  allow create: if true;
  
  // Only the creator of the job or an admin can update it
  // For anonymous users (createdBy == 'anonymous'), only admins can update
  allow update: if 
    (isAuthenticated() && resource.data.createdBy == request.auth.uid) || 
    isAdmin();
  
  // Only the creator of the job or an admin can delete it
  // For anonymous users (createdBy == 'anonymous'), only admins can delete
  allow delete: if 
    (isAuthenticated() && resource.data.createdBy == request.auth.uid) || 
    isAdmin();
}
```

## Job Applications

### Application Rules
1. Only authenticated users can apply for jobs
2. Job creators can view all applications for their jobs
3. Applicants can view their own applications
4. Admins can view all applications

### Application Security Rules

```javascript
// Applications subcollection
match /jobs/{jobId}/applications/{applicationId} {
  // Job creators and admins can read all applications
  // Applicants can only read their own applications
  allow read: if isAuthenticated() && (
    resource.data.applicantId == request.auth.uid || 
    get(/databases/$(database)/documents/jobs/$(jobId)).data.createdBy == request.auth.uid || 
    isAdmin()
  );
       
  // Any authenticated user can apply for a job
  allow create: if isAuthenticated();
  
  // Users can only update or delete their own applications
  // Job creators and admins can also update application status
  allow update, delete: if isAuthenticated() && (
    resource.data.applicantId == request.auth.uid || 
    get(/databases/$(database)/documents/jobs/$(jobId)).data.createdBy == request.auth.uid || 
    isAdmin()
  );
}
```

## Implementation Details

### Job Data Structure
```typescript
interface JobData {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  createdBy: string;
  creatorEmail: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  applications: any[];
}
```

### User Job Reference Structure
```typescript
interface UserJobReference {
  id: string;
  title: string;
  department: string;
  createdAt: Timestamp;
}
``` 