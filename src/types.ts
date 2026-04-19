export interface SiteSettings {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  heroOpacity?: number;
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
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  icon: string;
  imageUrl: string;
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
