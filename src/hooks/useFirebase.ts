import { useState, useEffect } from 'react';
import { 
  db, auth, onAuthStateChanged, onSnapshot, collection, doc, query, orderBy, where, 
  User, setDoc, getDoc, OperationType, handleFirestoreError 
} from '../firebase';
import { SiteSettings, Service, Project, BlogPost, TeamMember, Message, UserRole } from '../types';
import { DEFAULT_SITE_SETTINGS, INITIAL_SERVICES, INITIAL_TEAM, INITIAL_BLOG_POSTS, INITIAL_PROJECTS } from '../constants';

export function useFirebase() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allUsers, setAllUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // Check if admin/author and IF BLOCKED
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserRole;
            
            if (userData.isBlocked) {
              console.warn("Account is blocked. Signing out...");
              await auth.signOut();
              setUser(null);
              setIsAdmin(false);
              setIsAuthor(false);
              return;
            }

            setUser(currentUser);
            setIsAdmin(userData.role === 'admin');
            setIsAuthor(userData.role === 'author' || userData.role === 'admin');
          } else if (currentUser.email === 'ekenzeclinton@gmail.com') {
            // Bootstrap first admin
            await setDoc(doc(db, 'users', currentUser.uid), {
              uid: currentUser.uid,
              email: currentUser.email,
              role: 'admin',
              isBlocked: false
            });
            setUser(currentUser);
            setIsAdmin(true);
            setIsAuthor(true);
          } else {
            setUser(currentUser);
            setIsAdmin(false);
            setIsAuthor(false);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsAuthor(false);
        }
      } catch (err) {
        console.error("Error during auth state change:", err);
      } finally {
        setIsAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!isAuthReady) return;

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      } else if (isAdmin) {
        // Initialize settings if not exists
        setDoc(doc(db, 'settings', 'global'), DEFAULT_SITE_SETTINGS);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));

    const unsubServices = onSnapshot(query(collection(db, 'services'), orderBy('order', 'asc')), (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
      setServices(allData);
      
      if (isAdmin && snapshot.empty && !snapshot.metadata.fromCache) {
        console.log('Seeding services...');
        INITIAL_SERVICES.forEach((s) => {
          setDoc(doc(collection(db, 'services')), s);
        });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'services'));

    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('date', 'desc')), (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(allData);
      
      if (isAdmin && snapshot.empty && !snapshot.metadata.fromCache) {
        INITIAL_PROJECTS.forEach((p) => {
          setDoc(doc(collection(db, 'projects')), p);
        });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'projects'));

    const unsubBlog = onSnapshot(query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc')), (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[];
      setBlogPosts(allData);
      
      if (isAdmin && snapshot.empty && !snapshot.metadata.fromCache) {
        INITIAL_BLOG_POSTS.forEach((b) => {
          setDoc(doc(collection(db, 'blogPosts')), b);
        });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'blogPosts'));

    const unsubTeam = onSnapshot(query(collection(db, 'teamMembers'), orderBy('order', 'asc')), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TeamMember[];
      setTeamMembers(data);
      if (isAdmin && snapshot.empty && !snapshot.metadata.fromCache) {
        INITIAL_TEAM.forEach((t) => {
          setDoc(doc(collection(db, 'teamMembers')), t);
        });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'teamMembers'));

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => doc.data() as UserRole));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));

    let unsubMessages = () => {};
    if (isAdmin) {
      unsubMessages = onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[]);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'messages'));
    }

    setLoading(false);

    return () => {
      unsubSettings();
      unsubServices();
      unsubProjects();
      unsubBlog();
      unsubTeam();
      unsubMessages();
      unsubUsers();
    };
  }, [isAuthReady, isAdmin, isAuthor]);

  return {
    user,
    isAdmin,
    isAuthor,
    isAuthReady,
    settings,
    services,
    projects,
    blogPosts,
    teamMembers,
    messages,
    allUsers,
    loading
  };
}
