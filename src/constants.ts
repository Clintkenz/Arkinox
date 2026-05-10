import { SiteSettings, Service, TeamMember, BlogPost, Project } from './types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "ARKINOX Integrated Ltd.",
  logoUrl: "https://picsum.photos/seed/arkinox-logo/200/200",
  primaryColor: "#003366", // Dark Blue
  secondaryColor: "#FF8C00", // Dark Orange
  fontFamily: "Inter",
  heroOpacity: 15,
  contactEmail: "arkinoxintegrated@gmail.com",
  contactPhone: "07045777065",
  address: "36 Apaihie Rd, Prime Estate, Rumuewhara, Port Harcourt",
  socialLinks: {
    facebook: "https://facebook.com/arkinox",
    instagram: "https://instagram.com/arkinox",
    linkedin: "https://linkedin.com/company/arkinox"
  },
  seo: {
    metaTitle: "ARKINOX Integrated Ltd. | Construction, Oil & Gas Support, and Supply Logistics",
    metaDescription: "Providing HSE management, supply coordination, and project management support for oil & gas and construction firms in Port Harcourt, Nigeria."
  }
};

export const INITIAL_SERVICES: Partial<Service>[] = [
  {
    title: "HSE Management & Compliance",
    slug: "hse-management",
    description: "Industry-leading Health, Safety, and Environmental management systems tailored for high-risk operations.",
    content: `
### Elevating Safety Standards in Every Project

At ARKINOX, we believe that safety is not just a requirement—it's a core value. Our HSE Management services are designed to protect your workforce and ensure full compliance with both local (DPR, Federal Ministry of Environment) and international standards.

#### Our Comprehensive HSE Solutions Include:
*   **HSE Plans & Manuals:** Development of project-specific safety documentation that meets the highest industry benchmarks.
*   **Job Hazard Analysis (JHA):** Identifying potential risks before they become incidents through rigorous site assessments.
*   **Toolbox Talk Development:** Equipping your team with the knowledge they need for daily safe operations.
*   **Audit Support:** Preparing your organization for client and regulatory audits with 100% compliance targets.
*   **HIRA (Hazard Identification & Risk Assessment):** Deep-dive analysis of operational risks with actionable mitigation strategies.

We don't just provide paperwork; we foster a culture of safety that permeates every level of your organization.
    `,
    icon: "ShieldCheck",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    heroOpacity: 15,
    order: 1,
    isVisible: true
  },
  {
    title: "Supply Coordination & Procurement",
    slug: "supply-coordination",
    description: "Strategic procurement support and vendor coordination that maximizes value and minimizes delays.",
    content: `
### Strategic Sourcing for Complex Operations

In the oil & gas and construction sectors, supply chain efficiency is the difference between profit and loss. ARKINOX provides a transparent, coordination-first approach to procurement.

#### Our Value-Driven Approach:
*   **Vendor Sourcing & Verification:** We maintain a pre-vetted database of reliable suppliers across Nigeria.
*   **Competitive Pricing & Negotiation:** Leveraging our market presence to get you the best rates.
*   **Purchase Order Coordination:** End-to-end management of the procurement lifecycle.
*   **Delivery Follow-up & Reporting:** Real-time tracking of your critical materials from warehouse to site.

**The ARKINOX Advantage:** We operate on a coordination model. Clients pay for actual materials directly or through verified channels, ensuring 100% transparency and zero hidden markups.
    `,
    icon: "Truck",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200",
    heroOpacity: 15,
    order: 2,
    isVisible: true
  },
  {
    title: "Project & Site Coordination",
    slug: "project-coordination",
    description: "Precision-driven site management and daily activity reporting to keep your projects on track.",
    content: `
### Your Eyes and Ears on the Ground

Successful projects require meticulous coordination between contractors, vendors, and stakeholders. ARKINOX acts as your strategic partner on-site, ensuring that execution matches the plan.

#### Core Site Coordination Services:
*   **Daily Activity Reporting:** Detailed logs of progress, challenges, and milestones.
*   **Material Tracking & Usage Control:** Preventing waste and ensuring materials are used where they are needed most.
*   **Contractor Management:** Synchronizing multiple workstreams to prevent bottlenecks.
*   **Progress Documentation:** High-quality photo and video documentation of project stages.
*   **Scheduling Support:** Basic scheduling and execution monitoring to prevent timeline slippage.

We bridge the gap between the boardroom and the site, providing the data you need to make informed decisions.
    `,
    icon: "LayoutDashboard",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200",
    heroOpacity: 15,
    order: 3,
    isVisible: true
  },
  {
    title: "Heavy Duty Machinery Leasing",
    slug: "machinery-leasing",
    description: "Reliable hiring and leasing of trucks and heavy machinery with performance tracking.",
    content: `
### Powering Your Infrastructure Projects

ARKINOX provides access to a fleet of well-maintained heavy-duty machinery and trucks, backed by professional management and performance tracking.

#### Our Fleet & Management Services:
*   **Truck Management:** Specialized logistics support for moving heavy equipment and materials.
*   **Machinery Hiring:** Access to excavators, bulldozers, and cranes for short or long-term projects.
*   **Performance Tracking:** We monitor equipment uptime and efficiency to ensure you get what you pay for.
*   **Maintenance Support:** Ensuring all leased equipment is in peak operating condition.

Whether it's a small-scale construction site or a major oil & gas facility, we provide the muscle you need to get the job done.
    `,
    icon: "HardHat",
    imageUrl: "https://images.unsplash.com/photo-1533991022833-ad44c795c51f?auto=format&fit=crop&q=80&w=1200",
    heroImageUrl: "/arkinox-machines.png",
    heroOpacity: 15,
    order: 4,
    isVisible: true
  },
  {
    title: "Marine Logistics & Support",
    slug: "marine-logistics",
    description: "Specialized support for offshore and swamp operations in the Niger Delta region.",
    content: `
### Navigating the Challenges of Marine Operations

The Niger Delta presents unique logistical challenges. ARKINOX provides specialized marine support services to ensure your offshore and swamp-based projects run smoothly.

#### Marine Support Capabilities:
*   **Barge Coordination:** Managing the movement of heavy equipment via waterways.
*   **Crew Boat Logistics:** Ensuring safe and timely transport for your personnel.
*   **Marine HSE Compliance:** Specialized safety protocols for water-based operations.
*   **Vessel Sourcing:** Connecting you with reliable marine assets for specialized tasks.

Our local expertise and deep understanding of the maritime landscape make us the ideal partner for swamp and offshore support.
    `,
    icon: "Anchor",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    heroImageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    heroOpacity: 15,
    order: 5,
    isVisible: true
  }
];

export const INITIAL_TEAM: Partial<TeamMember>[] = [
  {
    name: "Modestus Ekenze",
    designation: "Managing Director",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    bio: "A veteran in the Nigerian oil and gas support sector with over 20 years of experience in HSE and project management.",
    order: 1
  },
  {
    name: "Clinton Ekenze",
    designation: "Executive Director",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=400",
    bio: "Strategic leader focused on digital transformation and operational efficiency in the construction and logistics industries.",
    order: 2
  },
  {
    name: "Cynthia Peterson",
    designation: "Field Consultant",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    bio: "Expert field consultant specializing in site safety and operational coordination.",
    order: 3
  }
];

export const INITIAL_BLOG_POSTS: Partial<BlogPost>[] = [
  {
    title: "The Importance of HSE in Modern Construction",
    slug: "importance-of-hse",
    excerpt: "Why HSE compliance is no longer optional but a critical success factor for major contracts in Nigeria.",
    content: `
# Safety First: The Strategic Value of HSE

In the high-stakes world of construction and oil & gas, Health, Safety, and Environment (HSE) management is often viewed as a regulatory hurdle. However, at ARKINOX, we see it as a critical competitive advantage.

## Beyond Compliance
While meeting DPR and Ministry standards is essential, a robust HSE system does much more:
1.  **Protects Your Workforce:** Your people are your most valuable asset. A safe site is a productive site.
2.  **Reduces Operational Costs:** Preventing accidents is far cheaper than dealing with their aftermath—legal fees, medical costs, and project delays.
3.  **Enhances Reputation:** Major international oil companies (IOCs) only work with partners who demonstrate a world-class commitment to safety.

## The ARKINOX Approach
We don't just write manuals; we implement systems. From daily toolbox talks to rigorous hazard identification, we ensure that every worker goes home safe, every single day.
    `,
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
    authorId: "default-uche",
    authorName: "Uche Ekenze",
    publishedAt: new Date().toISOString(),
    tags: ["HSE", "Safety", "Construction"],
    isVisible: true
  },
  {
    title: "Optimizing Supply Chain for Oil & Gas Projects",
    slug: "optimizing-supply-chain",
    excerpt: "How strategic procurement coordination can save your project thousands in overhead and delays.",
    content: `
# Logistics Excellence in the Niger Delta

The logistics landscape in Port Harcourt and the wider Niger Delta is fraught with challenges—from vendor reliability to transport bottlenecks. Optimizing this supply chain is critical for project success.

## Key Strategies for Optimization
*   **Vendor Verification:** Don't just look at the price; look at the track record. We pre-vet every supplier to ensure quality and reliability.
*   **Transparent Coordination:** By separating coordination fees from material costs, we eliminate the "middleman markup" that plagues many procurement processes.
*   **Real-time Tracking:** Knowing exactly where your materials are allows for better site planning and less downtime.

## Conclusion
Efficiency in procurement isn't just about buying cheap; it's about buying smart. Strategic coordination ensures that the right materials arrive at the right time, every time.
    `,
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    authorId: "default-clinton",
    authorName: "Clinton Ekenze",
    publishedAt: new Date().toISOString(),
    tags: ["Procurement", "Logistics", "Oil & Gas"],
    isVisible: true
  },
  {
    title: "The Future of Heavy Machinery in Infrastructure",
    slug: "future-of-heavy-machinery",
    excerpt: "Exploring how telematics and performance tracking are changing the face of machinery leasing.",
    content: `
# Technology Meets Heavy Metal

The days of simply "renting a truck" are over. The future of heavy machinery leasing lies in data and performance tracking.

## The Rise of Telematics
Modern machinery is now equipped with sensors that track everything from fuel consumption to engine health. This data allows us to:
*   **Predict Maintenance:** Fixing a small issue before it becomes a major breakdown.
*   **Optimize Uptime:** Ensuring that the equipment you pay for is actually working.
*   **Improve Operator Safety:** Monitoring usage patterns to prevent dangerous operations.

At ARKINOX, we are integrating these technologies into our fleet management to provide our clients with unprecedented levels of transparency and efficiency.
    `,
    imageUrl: "https://images.unsplash.com/photo-1533991022833-ad44c795c51f?auto=format&fit=crop&q=80&w=1200",
    authorId: "default-clinton",
    authorName: "Clinton Ekenze",
    publishedAt: new Date().toISOString(),
    tags: ["Machinery", "Technology", "Infrastructure"],
    isVisible: true
  }
];

export const INITIAL_PROJECTS: Partial<Project>[] = [
  {
    title: "Port Harcourt Refinery Support",
    slug: "ph-refinery-support",
    description: "Comprehensive HSE and supply coordination for major refinery maintenance.",
    content: "ARKINOX was contracted to provide full HSE documentation, site safety monitoring, and procurement coordination for a critical maintenance phase at the Port Harcourt Refinery. Our team ensured 100% compliance with safety standards and zero lost-time incidents over a 6-month period.",
    imageUrl: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200",
    category: "Oil & Gas",
    date: "2023-10-15",
    isVisible: true
  },
  {
    title: "Bonny Island Logistics Hub",
    slug: "bonny-island-logistics",
    description: "Marine logistics and material tracking for offshore support base.",
    content: "We managed the complex marine logistics for a supply base on Bonny Island, coordinating barge movements and material tracking for offshore drilling support. Our coordination reduced material delivery times by 15% through optimized vendor synchronization.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200",
    category: "Marine Logistics",
    date: "2024-02-10",
    isVisible: true
  }
];
