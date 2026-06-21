export interface StatItem {
  id: string; // unique ID to track stats or re-order them
  label: string;
  value: string;
  icon: string;
}

export interface SiteSettings {
  companyName: string;
  logoUrl: string;
  logoAspectRatio?: string;
  logoMaxHeight?: number;
  logoMaxWidth?: number;
  logoSmartFraming?: boolean;
  logoBgColor?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  heroImageUrl?: string;
  heroOpacity?: number;
  videoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  stats?: StatItem[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  icon: string;
  imageUrl: string;
  videoUrl?: string;
  heroImageUrl?: string;
  heroOpacity?: number;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  isVisible: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  videoUrl?: string;
  category: string;
  date: string;
  isVisible: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  authorId: string; // Track who wrote it
  authorName: string; // Denormalized for quick view
  author?: string; // Legacy
  authorImage?: string;
  authorBio?: string;
  authorLinkedin?: string;
  authorInstagram?: string;
  publishedAt: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  isVisible: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  imageUrl: string;
  bio: string;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface UserRole {
  uid: string;
  email: string;
  role: 'admin' | 'author' | 'user';
  displayName?: string;
  bio?: string;
  photoURL?: string;
  linkedin?: string;
  instagram?: string;
  isBlocked?: boolean;
}

export interface Testimonial {
  id: string;
  authorName: string;
  role?: string;
  company?: string;
  feedback: string;
  imageUrl?: string;
  rating?: number; // 1-5
  order?: number;
  isVisible?: boolean;
}

