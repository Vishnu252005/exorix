import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, Timestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJSEAWssnwFNVAGRlhM6hxP7IJXLKdN04",
  authDomain: "stellar-a0f58.firebaseapp.com",
  projectId: "stellar-a0f58",
  storageBucket: "stellar-a0f58.firebasestorage.app",
  messagingSenderId: "850623372300",
  appId: "1:850623372300:web:87f612b27998a4048da229",
  measurementId: "G-WXYDRNN5MG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Check if user is admin
export const checkIfAdmin = async (email: string) => {
  try {
    const adminDoc = await getDoc(doc(db, 'admin', email));
    return adminDoc.exists();
  } catch (error) {
    return false;
  }
};

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isAdmin: boolean;
  events: any[];
  blogs: any[];
  createdEvents?: any[];
}

interface EventData {
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  game: string;
  prize: string;
  registrationFee: string;
  image: string;
  status: 'upcoming' | 'completed' | 'Registration Open' | 'Coming Soon';
}

interface BlogData {
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'draft' | 'published';
}

interface JobData {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

// Auth functions
export const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user is admin
    const isAdmin = await checkIfAdmin(email);
    
    // Update user profile with display name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    // Create user data object
    const userData: UserData = {
      firstName,
      lastName,
      email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isAdmin,
      events: [], // Initialize empty events array
      blogs: [],  // Initialize empty blogs array
    };

    // Add createdEvents array only if user is admin
    if (isAdmin) {
      userData.createdEvents = [];
    }

    // Add user to Firestore with extended data
    await setDoc(doc(db, "users", user.uid), userData);

    return { success: true, user, isAdmin };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const isAdmin = await checkIfAdmin(email);
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    const userData = userDoc.data();

    // Update isAdmin status if it has changed
    if (userData && userData.isAdmin !== isAdmin) {
      await setDoc(doc(db, "users", userCredential.user.uid), {
        ...userData,
        isAdmin,
        updatedAt: Timestamp.now()
      });
    }

    return { success: true, user: userCredential.user, isAdmin };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Admin functions
export const createEvent = async (eventData: EventData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    // Create the event in events collection
    const eventRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      createdBy: user.uid,
      creatorEmail: user.email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      registeredUsers: [],
      status: eventData.status || 'Registration Open'
    });

    return { success: true, eventId: eventRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateEvent = async (eventId: string, eventData: EventData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userData) throw new Error('User data not found');

    // Update the event in events collection
    await setDoc(doc(db, 'events', eventId), {
      ...eventData,
      createdBy: user.uid,
      creatorEmail: user.email,
      updatedAt: Timestamp.now()
    }, { merge: true });

    // Update the event in user's createdEvents array
    const updatedEvent = {
      id: eventId,
      title: eventData.title,
      date: eventData.date,
      game: eventData.game,
      prize: eventData.prize,
      status: eventData.status
    };

    const updatedCreatedEvents = (userData.createdEvents || []).map((event: any) =>
      event.id === eventId ? updatedEvent : event
    );

    // Update user document
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdEvents: updatedCreatedEvents,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const createBlog = async (blogData: BlogData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userData) throw new Error('User data not found');

    // Create the blog in blogs collection
    const blogRef = await addDoc(collection(db, 'blogs'), {
      ...blogData,
      authorId: user.uid,
      authorName: `${userData.firstName} ${userData.lastName}`,
      authorEmail: user.email,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      likes: 0,
      comments: []
    });

    // Get the created blog data
    const newBlog = {
      id: blogRef.id,
      title: blogData.title,
      summary: blogData.summary,
      category: blogData.category,
      status: blogData.status,
      createdAt: Timestamp.now()
    };

    // Update user document with the new blog
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      blogs: [...(userData.blogs || []), newBlog],
      updatedAt: Timestamp.now()
    });

    return { success: true, blogId: blogRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateBlog = async (blogId: string, blogData: BlogData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userData) throw new Error('User data not found');

    // Update the blog in blogs collection
    await setDoc(doc(db, 'blogs', blogId), {
      ...blogData,
      authorId: user.uid,
      authorEmail: user.email,
      updatedAt: Timestamp.now()
    }, { merge: true });

    // Update the blog in user's blogs array
    const updatedBlog = {
      id: blogId,
      title: blogData.title,
      summary: blogData.summary,
      category: blogData.category,
      status: blogData.status,
      updatedAt: Timestamp.now()
    };

    const updatedBlogs = (userData.blogs || []).map((blog: any) =>
      blog.id === blogId ? updatedBlog : blog
    );

    // Update user document
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      blogs: updatedBlogs,
      updatedAt: Timestamp.now()
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const createJob = async (jobData: JobData) => {
  try {
    const user = auth.currentUser;
    
    // Validate job data
    if (!jobData.title || !jobData.department || !jobData.location || !jobData.type || !jobData.description) {
      throw new Error('Please fill in all required fields');
    }
    
    // Create the job in jobs collection with or without user authentication
    const jobRef = await addDoc(collection(db, 'jobs'), {
      ...jobData,
      createdBy: user ? user.uid : 'anonymous',
      creatorEmail: user ? user.email : 'anonymous@user.com',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      applications: []
    });

    // If user is authenticated, update their user document
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData) {
        // Get the created job data
        const newJob = {
          id: jobRef.id,
          title: jobData.title,
          department: jobData.department,
          createdAt: Timestamp.now()
        };

        // Update user document with the new job in the jobs array
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          jobs: [...(userData.jobs || []), newJob],
          updatedAt: Timestamp.now()
        });
      }
    }

    return { 
      success: true, 
      jobId: jobRef.id,
      message: user ? 'Job opening created successfully!' : 'Job opening created successfully as anonymous user!'
    };
  } catch (error: any) {
    console.error('Error creating job:', error);
    return { success: false, error: error.message };
  }
};

// Add the placeOrder function
