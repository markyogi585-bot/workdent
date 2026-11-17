export type ExoRole = 'dentist' | 'designer' | 'admin';

export const EXO_SERVICES = [
  'Crown & Bridge',
  'Implant Crown & Custom Abutment',
  'Veneers & Digital Smile Design',
  'Full-Arch / All-on-X Hybrid',
  'Surgical Guide',
  'Nightguard / Occlusal Splint',
  'Digital Denture',
  'Inlay / Onlay / Partial Crown',
] as const;

export type ExoServiceType = (typeof EXO_SERVICES)[number] | string;

export interface DesignerServicePrice {
  id: string;
  service: string;
  priceUsd: number;
  turnaroundHours: number;
}

export interface ExoDesigner {
  id: string;
  name: string;
  title: string;
  country: string;
  location: string;
  avatar: string;
  bio: string;
  yearsExperience: number;
  completionRate: number;
  repeatClientsPct: number;
  memberSince: string;
  rating: number;
  reviewsCount: number;
  readyForPayouts: boolean;
  available: boolean;
  specializations: string[];
  services: DesignerServicePrice[];
  portfolio: {
    id: string;
    title: string;
    service: string;
    image: string;
  }[];
  reviews: {
    id: string;
    dentistName: string;
    practiceName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface ExoCaseFile {
  id: string;
  name: string;
  size: string;
  format: 'STL' | 'PLY' | 'OBJ';
  section: 'SCAN' | 'DELIVERABLE';
  uploadedBy: string;
  uploadedAt: string;
  meshType: 'molar_bridge' | 'full_arch' | 'anterior_veneers' | 'implant_abutment';
}

export interface ExoWebLink {
  id: string;
  url: string;
  label: string;
  addedBy: string;
  addedAt: string;
}

export interface ExoTimelineEvent {
  id: string;
  status: string;
  note: string;
  timestamp: string;
}

export interface ExoCaseMessage {
  id: string;
  senderName: string;
  senderRole: ExoRole;
  text: string;
  timestamp: string;
}

export type ExoCaseStatus =
  | 'Awaiting Designer'
  | 'In Progress'
  | 'Submitted'
  | 'Revision Requested'
  | 'Completed'
  | 'Disputed'
  | 'Disputed Closed';

export type ExoPaymentStatus =
  | 'Authorized Hold'
  | 'Escrow'
  | 'Released'
  | 'Refunded'
  | 'Split';

export interface ExoCase {
  id: string;
  projectNumber: string;
  title: string;
  service: string;
  caseNotes: string;
  teethInvolved: string;
  material: string;
  dentistName: string;
  practiceName: string;
  designerId: string;
  designerName: string;
  designerAvatar: string;
  priceUsd: number;
  commissionUsd: number; // 12% ExoConnect commission
  designerNetUsd: number; // 88% Designer payout
  status: ExoCaseStatus;
  paymentStatus: ExoPaymentStatus;
  createdAt: string;
  dueDate: string;
  scanFiles: ExoCaseFile[];
  deliverableFiles: ExoCaseFile[];
  webLinks: ExoWebLink[];
  timeline: ExoTimelineEvent[];
  messages: ExoCaseMessage[];
  disputeReason?: string;
  disputeResolutionNote?: string;
  ratingGiven?: number;
  reviewGiven?: string;
}

export interface ExoUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: ExoRole;
  practiceName: string;
  practiceType: string;
  location: string;
  title: string;
  bio: string;
  yearsExperience: number;
  avatar: string;
  specializations: string[];
  services: DesignerServicePrice[];
  portfolio: { id: string; title: string; service: string; image: string }[];
  paymentGatewayConnected: boolean;
  plan: 'Standard' | 'Pro';
  referralCode: string;
  referredByCode?: string;
  loggedIn: boolean;
}

const USER_KEY = 'exo_user_v1';
const DESIGNERS_KEY = 'exo_designers_v1';
const CASES_KEY = 'exo_cases_v1';
const THEME_KEY = 'exo_theme_v1';

export const SEED_EXO_DESIGNERS: ExoDesigner[] = [
  {
    id: 'des-1',
    name: 'Marcus Lindqvist, CDT',
    title: 'Master Dental CAD Designer · exocad & 3Shape Specialist',
    country: 'Sweden',
    location: 'Stockholm, Sweden',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: '14+ years designing anatomical zirconia crowns, complex multi-unit implant bridges, and full-arch hybrid bars in exocad 3.2 Elefsina and 3Shape Dental System. Zero-redo margin protocol.',
    yearsExperience: 14,
    completionRate: 99,
    repeatClientsPct: 94,
    memberSince: 'Jan 2024',
    rating: 4.98,
    reviewsCount: 164,
    readyForPayouts: true,
    available: true,
    specializations: [
      'Crown & Bridge',
      'Full-Arch / All-on-X Hybrid',
      'Implant Crown & Custom Abutment',
      'exocad 3.2 Elefsina',
    ],
    services: [
      { id: 's-1', service: 'Crown & Bridge', priceUsd: 150, turnaroundHours: 24 },
      { id: 's-2', service: 'Implant Crown & Custom Abutment', priceUsd: 185, turnaroundHours: 24 },
      { id: 's-3', service: 'Full-Arch / All-on-X Hybrid', priceUsd: 320, turnaroundHours: 48 },
      { id: 's-4', service: 'Veneers & Digital Smile Design', priceUsd: 210, turnaroundHours: 24 },
    ],
    portfolio: [
      {
        id: 'p-1',
        title: 'Upper Left 3-Unit Zirconia Bridge (#24–#26)',
        service: 'Crown & Bridge',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'p-2',
        title: 'All-on-6 Screw-Retained Maxillary Hybrid Design',
        service: 'Full-Arch / All-on-X Hybrid',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'p-3',
        title: 'Custom Angled Ti-Base Implant Abutment & Crown',
        service: 'Implant Crown & Custom Abutment',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      },
    ],
    reviews: [
      {
        id: 'r-1',
        dentistName: 'Dr. Amelia Vance, DDS',
        practiceName: 'Vance Prosthodontics',
        rating: 5,
        comment: 'Marginal fit and occlusal contacts were spot-on straight out of our mill. Delivered in 14 hours.',
        date: '2 days ago',
      },
      {
        id: 'r-2',
        dentistName: 'Dr. David Miller, DMD',
        practiceName: 'Pacific Restorative Dental',
        rating: 5,
        comment: 'Best exocad designer we have worked with. The embedded digital design web link made chairside approval effortless.',
        date: '1 week ago',
      },
    ],
  },
  {
    id: 'des-2',
    name: 'Elena Rostova, MDT',
    title: 'Anterior Smile Design & Minimal-Prep Veneer Specialist',
    country: 'Germany',
    location: 'Munich, Germany',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Master Dental Technician focused on anterior esthetics, digital wax-ups, cutback frameworks for lithium disilicate, and 2D/3D facial photo alignment.',
    yearsExperience: 11,
    completionRate: 98,
    repeatClientsPct: 91,
    memberSince: 'Feb 2024',
    rating: 4.96,
    reviewsCount: 128,
    readyForPayouts: true,
    available: true,
    specializations: [
      'Veneers & Digital Smile Design',
      'Crown & Bridge',
      'Inlay / Onlay / Partial Crown',
      '3Shape Dental System',
    ],
    services: [
      { id: 's-5', service: 'Veneers & Digital Smile Design', priceUsd: 195, turnaroundHours: 24 },
      { id: 's-6', service: 'Crown & Bridge', priceUsd: 140, turnaroundHours: 24 },
      { id: 's-7', service: 'Inlay / Onlay / Partial Crown', priceUsd: 95, turnaroundHours: 18 },
    ],
    portfolio: [
      {
        id: 'p-4',
        title: '8-Unit Anterior e.max Veneer Smile Rehab (#14–#24)',
        service: 'Veneers & Digital Smile Design',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'p-5',
        title: 'Posterior Ceramic Onlay & Crown Combination',
        service: 'Crown & Bridge',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
      },
    ],
    reviews: [
      {
        id: 'r-3',
        dentistName: 'Dr. Sofia Rossi',
        practiceName: 'Milan Esthetic Studio',
        rating: 5,
        comment: 'Natural incisal line angles and embrasures. My patients love the 3D smile preview link.',
        date: '4 days ago',
      },
    ],
  },
  {
    id: 'des-3',
    name: 'Rahul Sharma, CAD',
    title: 'Senior Exocad Crown, Bridge & Implant Designer',
    country: 'India',
    location: 'New Delhi, India',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'High-precision daily restorative CAD support for dental practices and commercial laboratories. Fast 12–24h turnaround on crowns, bridges, splints, and custom abutments.',
    yearsExperience: 7,
    completionRate: 97,
    repeatClientsPct: 89,
    memberSince: 'Mar 2024',
    rating: 4.94,
    reviewsCount: 215,
    readyForPayouts: true,
    available: true,
    specializations: [
      'Crown & Bridge',
      'Implant Crown & Custom Abutment',
      'Nightguard / Occlusal Splint',
      'Digital Denture',
    ],
    services: [
      { id: 's-8', service: 'Crown & Bridge', priceUsd: 95, turnaroundHours: 12 },
      { id: 's-9', service: 'Implant Crown & Custom Abutment', priceUsd: 135, turnaroundHours: 24 },
      { id: 's-10', service: 'Nightguard / Occlusal Splint', priceUsd: 75, turnaroundHours: 12 },
      { id: 's-11', service: 'Digital Denture', priceUsd: 160, turnaroundHours: 36 },
    ],
    portfolio: [
      {
        id: 'p-6',
        title: 'Monolithic Zirconia Molar & Premolar Crowns',
        service: 'Crown & Bridge',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      },
    ],
    reviews: [
      {
        id: 'r-4',
        dentistName: 'Apex Dental Lab',
        practiceName: 'Apex Milling Center',
        rating: 5,
        comment: 'Handles our peak overflow every week without a single missed deadline.',
        date: '5 days ago',
      },
    ],
  },
  {
    id: 'des-4',
    name: 'Dr. Kenji Takahashi',
    title: 'Guided Surgery Stents & Full-Arch Implant Planner',
    country: 'Japan',
    location: 'Tokyo, Japan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in CBCT-to-IOS registration, stackable surgical guides, and immediate-load PMMA provisional bridges.',
    yearsExperience: 10,
    completionRate: 99,
    repeatClientsPct: 92,
    memberSince: 'Jan 2024',
    rating: 4.97,
    reviewsCount: 94,
    readyForPayouts: true,
    available: true,
    specializations: [
      'Surgical Guide',
      'Full-Arch / All-on-X Hybrid',
      'Implant Crown & Custom Abutment',
    ],
    services: [
      { id: 's-12', service: 'Surgical Guide', priceUsd: 145, turnaroundHours: 24 },
      { id: 's-13', service: 'Full-Arch / All-on-X Hybrid', priceUsd: 310, turnaroundHours: 48 },
      { id: 's-14', service: 'Implant Crown & Custom Abutment', priceUsd: 175, turnaroundHours: 24 },
    ],
    portfolio: [
      {
        id: 'p-7',
        title: 'Fully Guided Dual-Implant Surgical Stent (#36, #37)',
        service: 'Surgical Guide',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      },
    ],
    reviews: [],
  },
];

export const SEED_EXO_CASES: ExoCase[] = [
  {
    id: '1048',
    projectNumber: 'PRJ-1048',
    title: 'Crown & Bridge - Upper Left Molar (#24–#26)',
    service: 'Crown & Bridge',
    caseNotes:
      '3-unit posterior monolithic zirconia bridge (#24 retainer, #25 pontic, #26 retainer). 0.04mm cement spacer, light occlusal contact in lateral excursion, hygienic ovate pontic.',
    teethInvolved: '#24, #25, #26',
    material: 'Multilayer Zirconia (4Y-TZP)',
    dentistName: 'Dr. Amelia Vance, DDS',
    practiceName: 'Vance Prosthodontics & Implant Center',
    designerId: 'des-1',
    designerName: 'Marcus Lindqvist, CDT',
    designerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    priceUsd: 150,
    commissionUsd: 18,
    designerNetUsd: 132,
    status: 'Submitted',
    paymentStatus: 'Escrow',
    createdAt: 'Nov 15, 2026 · 09:30 AM',
    dueDate: 'Nov 17, 2026 · 05:00 PM',
    scanFiles: [
      {
        id: 'f-101',
        name: 'Upper_Arch_Prep_24_26.stl',
        size: '14.2 MB',
        format: 'STL',
        section: 'SCAN',
        uploadedBy: 'Dr. Amelia Vance, DDS',
        uploadedAt: 'Nov 15, 09:30 AM',
        meshType: 'molar_bridge',
      },
      {
        id: 'f-102',
        name: 'Lower_Antagonist_Scan.ply',
        size: '18.6 MB',
        format: 'PLY',
        section: 'SCAN',
        uploadedBy: 'Dr. Amelia Vance, DDS',
        uploadedAt: 'Nov 15, 09:30 AM',
        meshType: 'full_arch',
      },
      {
        id: 'f-103',
        name: 'Buccal_Bite_Registration.obj',
        size: '6.4 MB',
        format: 'OBJ',
        section: 'SCAN',
        uploadedBy: 'Dr. Amelia Vance, DDS',
        uploadedAt: 'Nov 15, 09:31 AM',
        meshType: 'molar_bridge',
      },
    ],
    deliverableFiles: [
      {
        id: 'f-201',
        name: 'Final_Zirconia_Bridge_24_26_CAM.stl',
        size: '11.8 MB',
        format: 'STL',
        section: 'DELIVERABLE',
        uploadedBy: 'Marcus Lindqvist, CDT',
        uploadedAt: 'Nov 16, 02:15 PM',
        meshType: 'molar_bridge',
      },
    ],
    webLinks: [
      {
        id: 'wl-1',
        url: 'https://webview.dentalcad.exoconnect.io/share/PRJ-1048-3d-review',
        label: 'exocad WebView 3D Design Preview (#24–#26)',
        addedBy: 'Marcus Lindqvist, CDT',
        addedAt: 'Nov 16, 02:16 PM',
      },
    ],
    timeline: [
      {
        id: 'tl-1',
        status: 'Case Created & Card Authorized ($150.00)',
        note: 'Card hold placed. Waiting for designer acceptance.',
        timestamp: 'Nov 15, 09:30 AM',
      },
      {
        id: 'tl-2',
        status: 'Accepted by Marcus Lindqvist, CDT',
        note: 'Card captured into Escrow ($150.00). Case moved to In Progress.',
        timestamp: 'Nov 15, 10:05 AM',
      },
      {
        id: 'tl-3',
        status: 'Deliverables & Web Link Submitted',
        note: 'Final_Zirconia_Bridge_24_26_CAM.stl + exocad WebView link uploaded for review.',
        timestamp: 'Nov 16, 02:16 PM',
      },
    ],
    messages: [
      {
        id: 'm-1',
        senderName: 'Dr. Amelia Vance, DDS',
        senderRole: 'dentist',
        text: 'Hi Marcus, attached the TRIOS upper prep, lower antagonist, and bite scan. Please keep the distal margin on #26 at 0.04mm spacer.',
        timestamp: 'Nov 15, 09:32 AM',
      },
      {
        id: 'm-2',
        senderName: 'Marcus Lindqvist, CDT',
        senderRole: 'designer',
        text: 'Received! Margin line on #24 and #26 is crystal clear. Uploading the finished CAM STL and interactive exocad web link now.',
        timestamp: 'Nov 16, 02:16 PM',
      },
    ],
  },
  {
    id: '1049',
    projectNumber: 'PRJ-1049',
    title: 'Implant Crown & Custom Ti-Base Abutment - Lower Right (#46)',
    service: 'Implant Crown & Custom Abutment',
    caseNotes:
      'Screw-retained monolithic zirconia crown on Straumann Bone Level RC Ti-base. Emergent profile contoured to match healing abutment.',
    teethInvolved: '#46',
    material: 'Zirconia on Ti-Base',
    dentistName: 'Dr. Amelia Vance, DDS',
    practiceName: 'Vance Prosthodontics & Implant Center',
    designerId: 'des-1',
    designerName: 'Marcus Lindqvist, CDT',
    designerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    priceUsd: 185,
    commissionUsd: 22.2,
    designerNetUsd: 162.8,
    status: 'In Progress',
    paymentStatus: 'Escrow',
    createdAt: 'Nov 16, 2026 · 11:20 AM',
    dueDate: 'Nov 18, 2026 · 12:00 PM',
    scanFiles: [
      {
        id: 'f-104',
        name: 'Lower_Arch_Scanbody_46.stl',
        size: '15.1 MB',
        format: 'STL',
        section: 'SCAN',
        uploadedBy: 'Dr. Amelia Vance, DDS',
        uploadedAt: 'Nov 16, 11:20 AM',
        meshType: 'implant_abutment',
      },
    ],
    deliverableFiles: [],
    webLinks: [],
    timeline: [
      {
        id: 'tl-4',
        status: 'Case Created & Card Authorized ($185.00)',
        note: 'Card hold placed.',
        timestamp: 'Nov 16, 11:20 AM',
      },
      {
        id: 'tl-5',
        status: 'Accepted by Marcus Lindqvist, CDT',
        note: 'Card captured into Escrow ($185.00). Case moved to In Progress.',
        timestamp: 'Nov 16, 11:45 AM',
      },
    ],
    messages: [
      {
        id: 'm-3',
        senderName: 'Dr. Amelia Vance, DDS',
        senderRole: 'dentist',
        text: 'Scanbody is Straumann RC 4.1mm. Let me know if screw channel emerges cleanly through the central fossa.',
        timestamp: 'Nov 16, 11:22 AM',
      },
    ],
  },
  {
    id: '1050',
    projectNumber: 'PRJ-1050',
    title: 'Anterior 6-Unit Minimal Prep Veneers (#13–#23)',
    service: 'Veneers & Digital Smile Design',
    caseNotes:
      'Patient wants natural B1 shade with slight incisal translucency and closed midline diastema (0.8mm).',
    teethInvolved: '#13, #12, #11, #21, #22, #23',
    material: 'IPS e.max CAD',
    dentistName: 'Dr. Amelia Vance, DDS',
    practiceName: 'Vance Prosthodontics & Implant Center',
    designerId: 'des-1',
    designerName: 'Marcus Lindqvist, CDT',
    designerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    priceUsd: 210,
    commissionUsd: 25.2,
    designerNetUsd: 184.8,
    status: 'Awaiting Designer',
    paymentStatus: 'Authorized Hold',
    createdAt: 'Nov 17, 2026 · 08:15 AM',
    dueDate: 'Nov 19, 2026 · 05:00 PM',
    scanFiles: [
      {
        id: 'f-105',
        name: 'Upper_Anterior_Veneer_Preps.ply',
        size: '16.9 MB',
        format: 'PLY',
        section: 'SCAN',
        uploadedBy: 'Dr. Amelia Vance, DDS',
        uploadedAt: 'Nov 17, 08:15 AM',
        meshType: 'anterior_veneers',
      },
    ],
    deliverableFiles: [],
    webLinks: [],
    timeline: [
      {
        id: 'tl-6',
        status: 'Case Created & Card Authorized ($210.00)',
        note: 'Hold placed on card. Charged only when designer accepts (auto-releases after 6 days if unclaimed).',
        timestamp: 'Nov 17, 08:15 AM',
      },
    ],
    messages: [],
  },
  {
    id: '1042',
    projectNumber: 'PRJ-1042',
    title: 'Full-Arch Maxillary Zirconia Hybrid (#16–#26)',
    service: 'Full-Arch / All-on-X Hybrid',
    caseNotes: 'All-on-6 screw-retained bridge with titanium thimbles. Verified PMMA try-in scan attached.',
    teethInvolved: 'Full Upper Arch (#16–#26)',
    material: 'Multilayer Zirconia',
    dentistName: 'Dr. Amelia Vance, DDS',
    practiceName: 'Vance Prosthodontics & Implant Center',
    designerId: 'des-1',
    designerName: 'Marcus Lindqvist, CDT',
    designerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    priceUsd: 320,
    commissionUsd: 38.4,
    designerNetUsd: 281.6,
    status: 'Completed',
    paymentStatus: 'Released',
    createdAt: 'Nov 10, 2026 · 10:00 AM',
    dueDate: 'Nov 12, 2026 · 05:00 PM',
    scanFiles: [
      {
        id: 'f-106',
        name: 'Maxillary_AllOn6_Scanbodies.stl',
        size: '22.4 MB',
        format: 'STL',
        section: 'SCAN',
        uploadedBy: 'Dr. Amelia Vance, DDS',
        uploadedAt: 'Nov 10, 10:00 AM',
        meshType: 'full_arch',
      },
    ],
    deliverableFiles: [
      {
        id: 'f-202',
        name: 'AllOn6_Final_Hybrid_Superstructure.stl',
        size: '24.1 MB',
        format: 'STL',
        section: 'DELIVERABLE',
        uploadedBy: 'Marcus Lindqvist, CDT',
        uploadedAt: 'Nov 11, 04:10 PM',
        meshType: 'full_arch',
      },
    ],
    webLinks: [],
    timeline: [
      {
        id: 'tl-7',
        status: 'Case Created & Card Authorized ($320.00)',
        note: 'Hold placed on card.',
        timestamp: 'Nov 10, 10:00 AM',
      },
      {
        id: 'tl-8',
        status: 'Accepted by Marcus Lindqvist, CDT',
        note: 'Card captured into Escrow ($320.00).',
        timestamp: 'Nov 10, 10:18 AM',
      },
      {
        id: 'tl-9',
        status: 'Accepted & Completed by Dentist (5★)',
        note: 'Designer payout ($281.60) released; ExoConnect 12% commission ($38.40).',
        timestamp: 'Nov 12, 09:40 AM',
      },
    ],
    messages: [],
    ratingGiven: 5,
    reviewGiven: 'Passive fit on all 6 multi-unit abutments. Outstanding design!',
  },
];

export const DEFAULT_EXO_USERS: Record<ExoRole, ExoUser> = {
  dentist: {
    id: 'usr-dentist-1',
    firstName: 'Amelia',
    lastName: 'Vance',
    email: 'amelia@vanceprosthodontics.com',
    role: 'dentist',
    practiceName: 'Vance Prosthodontics & Implant Center',
    practiceType: 'Prosthodontics & Digital Practice',
    location: 'San Francisco, United States',
    title: 'Lead Prosthodontist, DDS',
    bio: 'Digital restorative & implant practice using 3Shape TRIOS 5 and in-house 5-axis milling.',
    yearsExperience: 12,
    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    specializations: ['Prosthodontics', 'Implantology'],
    services: [],
    portfolio: [],
    paymentGatewayConnected: true,
    plan: 'Standard',
    referralCode: '2FEGD5WD',
    loggedIn: true,
  },
  designer: {
    id: 'des-1',
    firstName: 'Marcus',
    lastName: 'Lindqvist',
    email: 'marcus@stockholmprosthetics.se',
    role: 'designer',
    practiceName: 'Stockholm Digital Prosthetics Studio',
    practiceType: 'CAD Design Studio',
    location: 'Stockholm, Sweden',
    title: 'Master Dental CAD Designer · exocad & 3Shape Specialist',
    bio: '14+ years designing anatomical zirconia crowns, complex multi-unit implant bridges, and full-arch hybrid bars in exocad 3.2 Elefsina and 3Shape Dental System.',
    yearsExperience: 14,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    specializations: [
      'Crown & Bridge',
      'Full-Arch / All-on-X Hybrid',
      'Implant Crown & Custom Abutment',
      'exocad 3.2 Elefsina',
    ],
    services: SEED_EXO_DESIGNERS[0].services,
    portfolio: SEED_EXO_DESIGNERS[0].portfolio,
    paymentGatewayConnected: true,
    plan: 'Standard',
    referralCode: 'MARCUS88CAD',
    loggedIn: true,
  },
  admin: {
    id: 'usr-admin-1',
    firstName: 'ExoConnect',
    lastName: 'Arbitration',
    email: 'support@exoconnect.io',
    role: 'admin',
    practiceName: 'ExoConnect Trust & Disputes Team',
    practiceType: 'Platform Operations',
    location: 'Global Operations',
    title: 'Dispute & Escrow Administrator',
    bio: 'Reviews disputed cases and settles outcomes via full refund, designer release, or custom percentage split.',
    yearsExperience: 10,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    specializations: [],
    services: [],
    portfolio: [],
    paymentGatewayConnected: true,
    plan: 'Pro',
    referralCode: 'EXOPARTNER10',
    loggedIn: true,
  },
};

export function getExoTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore
  }
  return 'light';
}

export function setExoTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  window.dispatchEvent(new CustomEvent('exo-theme-changed', { detail: theme }));
}

export function getExoUser(): ExoUser {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return DEFAULT_EXO_USERS.dentist;
}

export function saveExoUser(patch: Partial<ExoUser>): ExoUser {
  const current = getExoUser();
  const next: ExoUser = { ...current, ...patch };
  localStorage.setItem(USER_KEY, JSON.stringify(next));

  // If designer updated their services/portfolio, sync with SEED_EXO_DESIGNERS[0]
  if (next.role === 'designer') {
    const designers = getExoDesigners();
    const updatedDesigners = designers.map((d) =>
      d.id === 'des-1'
        ? {
            ...d,
            name: `${next.firstName} ${next.lastName}`,
            title: next.title,
            location: next.location,
            bio: next.bio,
            specializations: next.specializations,
            services: next.services,
            portfolio: next.portfolio,
            readyForPayouts: next.paymentGatewayConnected,
          }
        : d
    );
    saveExoDesigners(updatedDesigners);
  }

  window.dispatchEvent(new CustomEvent('exo-store-updated'));
  return next;
}

export function switchExoRole(role: ExoRole): ExoUser {
  const preset = DEFAULT_EXO_USERS[role];
  localStorage.setItem(USER_KEY, JSON.stringify(preset));
  window.dispatchEvent(new CustomEvent('exo-store-updated'));
  return preset;
}

export function logoutExoUser(): void {
  const current = getExoUser();
  localStorage.setItem(USER_KEY, JSON.stringify({ ...current, loggedIn: false }));
  window.dispatchEvent(new CustomEvent('exo-store-updated'));
}

export function getExoDesigners(): ExoDesigner[] {
  try {
    const raw = localStorage.getItem(DESIGNERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  localStorage.setItem(DESIGNERS_KEY, JSON.stringify(SEED_EXO_DESIGNERS));
  return SEED_EXO_DESIGNERS;
}

export function saveExoDesigners(designers: ExoDesigner[]): void {
  localStorage.setItem(DESIGNERS_KEY, JSON.stringify(designers));
  window.dispatchEvent(new CustomEvent('exo-store-updated'));
}

export function getExoCases(): ExoCase[] {
  try {
    const raw = localStorage.getItem(CASES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  localStorage.setItem(CASES_KEY, JSON.stringify(SEED_EXO_CASES));
  return SEED_EXO_CASES;
}

export function saveExoCases(cases: ExoCase[]): void {
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  window.dispatchEvent(new CustomEvent('exo-store-updated'));
}

export function updateExoCase(caseId: string, updater: (c: ExoCase) => ExoCase): ExoCase[] {
  const all = getExoCases();
  const next = all.map((c) => (c.id === caseId ? updater(c) : c));
  saveExoCases(next);
  return next;
}
