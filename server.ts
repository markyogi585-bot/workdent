import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Procedural ASCII STL Generator for Anatomical Dental Crown & 3-Unit Molar Bridge
function generateDentalCrownSTL(type: string = "crown"): string {
  const lines: string[] = ["solid WorkDent_Anatomical_Crown"];
  const addQuad = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    p4: [number, number, number]
  ) => {
    lines.push(
      `  facet normal 0 0 1\n    outer loop\n      vertex ${p1.join(" ")}\n      vertex ${p2.join(" ")}\n      vertex ${p3.join(" ")}\n    endloop\n  endfacet`
    );
    lines.push(
      `  facet normal 0 0 1\n    outer loop\n      vertex ${p1.join(" ")}\n      vertex ${p3.join(" ")}\n      vertex ${p4.join(" ")}\n    endloop\n  endfacet`
    );
  };

  const buildToothUnit = (offsetX: number, scaleRadius: number, height: number) => {
    const radialSegments = 40;
    const heightSegments = 24;

    const getPoint = (u: number, v: number): [number, number, number] => {
      const theta = u * Math.PI * 2;
      // Cervical margin pinch at bottom (v=0), anatomical Equator bulge at v=0.55, 4-cusp occlusal table at v=1
      const marginProfile = 0.72 + 0.32 * Math.sin(v * Math.PI * 0.88);
      const fourCuspHarmonic =
        1 +
        0.11 * Math.cos(2 * theta) +
        0.08 * Math.cos(4 * theta) * Math.pow(v, 1.4);
      const r = scaleRadius * marginProfile * fourCuspHarmonic * (1 - 0.18 * Math.pow(v, 4));
      const x = offsetX + r * Math.cos(theta);
      const z = r * 0.88 * Math.sin(theta);

      // Occlusal fossa & cusp ridges at top
      const cuspElevation =
        v > 0.7
          ? Math.pow((v - 0.7) / 0.3, 1.5) *
            2.6 *
            (0.55 + 0.45 * Math.cos(4 * theta + 0.4))
          : 0;
      const centralFossaDip =
        v > 0.85 ? -1.8 * Math.pow((v - 0.85) / 0.15, 2) : 0;
      const y = (v - 0.5) * height + cuspElevation + centralFossaDip;
      return [Number(x.toFixed(4)), Number(y.toFixed(4)), Number(z.toFixed(4))];
    };

    for (let i = 0; i < radialSegments; i++) {
      const u0 = i / radialSegments;
      const u1 = (i + 1) / radialSegments;
      for (let j = 0; j < heightSegments; j++) {
        const v0 = j / heightSegments;
        const v1 = (j + 1) / heightSegments;
        const p1 = getPoint(u0, v0);
        const p2 = getPoint(u1, v0);
        const p3 = getPoint(u1, v1);
        const p4 = getPoint(u0, v1);
        addQuad(p1, p2, p3, p4);
      }
      // Close occlusal fossa center
      const topCenter: [number, number, number] = [offsetX, height * 0.36, 0];
      const pTop0 = getPoint(u0, 1);
      const pTop1 = getPoint(u1, 1);
      lines.push(
        `  facet normal 0 1 0\n    outer loop\n      vertex ${pTop0.join(" ")}\n      vertex ${pTop1.join(" ")}\n      vertex ${topCenter.join(" ")}\n    endloop\n  endfacet`
      );
      // Close cervical margin intaglio base
      const botCenter: [number, number, number] = [offsetX, -height * 0.32, 0];
      const pBot0 = getPoint(u0, 0);
      const pBot1 = getPoint(u1, 0);
      lines.push(
        `  facet normal 0 -1 0\n    outer loop\n      vertex ${pBot1.join(" ")}\n      vertex ${pBot0.join(" ")}\n      vertex ${botCenter.join(" ")}\n    endloop\n  endfacet`
      );
    }
  };

  if (type === "bridge") {
    buildToothUnit(-16, 8.2, 13.5);
    buildToothUnit(0, 7.6, 12.8);
    buildToothUnit(15.5, 8.8, 14.0);
  } else {
    buildToothUnit(-10, 9.5, 14.8);
    buildToothUnit(10.5, 8.2, 13.4);
  }

  lines.push("endsolid WorkDent_Anatomical_Crown");
  return lines.join("\n");
}

const CACHED_STL = generateDentalCrownSTL("bridge");

// In-Memory Stateful Store for all 73 WorkDent Endpoints
interface UserProfile {
  id: number;
  uid: string;
  full_name: string;
  clinic_name?: string;
  email: string;
  role: "DENTIST" | "LAB" | "DESIGNER" | "ADMIN";
  phone: string;
  avatar_url: string;
  banner_url?: string;
  timezone: string;
  two_factor_enabled: boolean;
  email_notifications_enabled: boolean;
  referral_code: string;
  plan: "STANDARD" | "PRO";
  wallet_balance: number;
}

let currentUser: UserProfile = {
  id: 101,
  uid: "usr_dentist_101",
  full_name: "Dr. Amelia Vance, DDS",
  clinic_name: "Vance Prosthodontics & Implant Center",
  email: "amelia.vance@workdent.io",
  role: "DENTIST",
  phone: "+1 (415) 890-4321",
  avatar_url: "/src/assets/images/avatar_clinic_director_1794830763686.jpg",
  banner_url: "/src/assets/images/hero_dental_cad_studio_1794830761941.jpg",
  timezone: "America/New_York",
  two_factor_enabled: false,
  email_notifications_enabled: true,
  referral_code: "WD-VANCE-902",
  plan: "PRO",
  wallet_balance: 2840.0,
};

const designersList = [
  {
    id: 201,
    full_name: "Marcus Lindqvist, CDT",
    location: "Stockholm, Sweden",
    rating: 4.96,
    reviews_count: 218,
    completed_cases: 1420,
    turnaround_hours: 12,
    starting_rate: 18,
    software: ["Exocad Expert", "3Shape Master"],
    languages: ["English", "Swedish", "German"],
    avatar_url: "/src/assets/images/avatar_designer_lead_1794830762435.jpg",
    banner_url: "/src/assets/images/hero_dental_cad_studio_1794830761941.jpg",
    bio: "Master Dental Technologist with 14+ years specializing in full-arch zirconia bridges, custom titanium Ti-Base abutments, and minimally invasive lithium disilicate veneers.",
    verified: true,
    services: [
      { id: 1, service_name: "Single Anatomical Crown", price: 18, turnaround_hours: 12 },
      { id: 2, service_name: "3-Unit Zirconia Bridge", price: 48, turnaround_hours: 18 },
      { id: 3, service_name: "Custom Implant Abutment + Crown", price: 35, turnaround_hours: 16 },
      { id: 4, service_name: "Full Arch All-on-X Bar", price: 165, turnaround_hours: 24 },
      { id: 5, service_name: "Occlusal Nightguard / Michigan Splint", price: 24, turnaround_hours: 12 },
    ],
  },
  {
    id: 202,
    full_name: "Elena Rostova, MDT",
    location: "Munich, Germany",
    rating: 4.94,
    reviews_count: 176,
    completed_cases: 980,
    turnaround_hours: 16,
    starting_rate: 22,
    software: ["Exocad Expert", "Blenderfordental"],
    languages: ["English", "German"],
    avatar_url: "/src/assets/images/avatar_clinic_director_1794830763686.jpg",
    banner_url: "/src/assets/images/showcase_zirconia_crown_1794830761578.jpg",
    bio: "Munich-trained Master Dental Technician focused on anterior digital smile design, cutback layering frameworks, and precision telescopic prosthetics.",
    verified: true,
    services: [
      { id: 6, service_name: "Single Anatomical Crown", price: 22, turnaround_hours: 12 },
      { id: 7, service_name: "Anterior Veneer Waxup (per unit)", price: 25, turnaround_hours: 16 },
      { id: 8, service_name: "3-Unit Zirconia Bridge", price: 55, turnaround_hours: 20 },
    ],
  },
  {
    id: 203,
    full_name: "Kenji Takahashi, CDT",
    location: "Tokyo, Japan",
    rating: 4.98,
    reviews_count: 310,
    completed_cases: 2150,
    turnaround_hours: 8,
    starting_rate: 20,
    software: ["3Shape Master", "Exocad Expert"],
    languages: ["English", "Japanese"],
    avatar_url: "/src/assets/images/avatar_designer_lead_1794830762435.jpg",
    banner_url: "/src/assets/images/hero_dental_cad_studio_1794830761941.jpg",
    bio: "Zero-adjustment occlusal morphology specialist. Overnight 8-hour turnaround for North American & European clinics with sub-15 micron marginal fit parameters.",
    verified: true,
    services: [
      { id: 9, service_name: "Single Anatomical Crown", price: 20, turnaround_hours: 8 },
      { id: 10, service_name: "Custom Implant Abutment + Crown", price: 38, turnaround_hours: 12 },
      { id: 11, service_name: "Digital Complete Denture (U/L)", price: 95, turnaround_hours: 24 },
    ],
  },
  {
    id: 204,
    full_name: "Sofia Castellanos, CDT",
    location: "Madrid, Spain",
    rating: 4.91,
    reviews_count: 142,
    completed_cases: 845,
    turnaround_hours: 24,
    starting_rate: 16,
    software: ["3Shape Master", "Dental Wings"],
    languages: ["English", "Spanish", "French"],
    avatar_url: "/src/assets/images/avatar_clinic_director_1794830763686.jpg",
    banner_url: "/src/assets/images/showcase_zirconia_crown_1794830761578.jpg",
    bio: "Clear aligner staging, surgical implant guides, and digital removable partial dentures (RPD) designed for predictable 3D printing and 5-axis milling.",
    verified: true,
    services: [
      { id: 12, service_name: "Single Anatomical Crown", price: 16, turnaround_hours: 24 },
      { id: 13, service_name: "Clear Aligner Setup & Staging", price: 65, turnaround_hours: 24 },
      { id: 14, service_name: "Surgical Implant Guide", price: 50, turnaround_hours: 18 },
    ],
  },
];

let stagedFiles: { id: number; file_name: string; file_size: number; created_at: string }[] = [
  { id: 9001, file_name: "Upper_Arch_Preparation_Tooth14_16.stl", file_size: 14820100, created_at: new Date().toISOString() },
  { id: 9002, file_name: "Lower_Antagonist_Scan.stl", file_size: 11240500, created_at: new Date().toISOString() },
];

let projectsList = [
  {
    id: 4821,
    title: "Posterior 3-Unit Zirconia Bridge (#14–#16) — Pt. R. Sterling",
    description: "Monolithic multilayer zirconia (VITA Shade A2). 0.04mm cement spacer, 80-micron radial die spacer, light occlusal contact in lateral excursion.",
    status: "IN_REVIEW",
    service_type: "Crown & Bridge",
    tooth_numbers: "#14, #15 (Pontic), #16",
    shade: "VITA A2",
    material: "Monolithic Zirconia (1200 MPa)",
    dentist_id: 101,
    dentist_name: "Dr. Amelia Vance, DDS",
    designer_id: 201,
    designer_name: "Marcus Lindqvist, CDT",
    designer_avatar: "/src/assets/images/avatar_designer_lead_1794830762435.jpg",
    escrow_status: "CAPTURED",
    escrow_amount: 48.0,
    platform_fee: 4.8,
    created_at: "2026-11-14T09:30:00Z",
    updated_at: "2026-11-16T02:15:00Z",
    deadline: "2026-11-16T18:00:00Z",
    web_preview_link: "https://viewer.workdent.io/exocad-webview/case-4821",
    files: [
      { id: 501, file_name: "Upper_Arch_Prep_14_16.stl", file_size: 14820100, file_type: "STL", is_deliverable: false, storage_url: "/api/stl/sample.stl" },
      { id: 502, file_name: "Lower_Opposing_Arch.stl", file_size: 11240500, file_type: "STL", is_deliverable: false, storage_url: "/api/stl/sample.stl" },
      { id: 503, file_name: "Bite_Registration_Occlusion.stl", file_size: 4210000, file_type: "STL", is_deliverable: false, storage_url: "/api/stl/sample.stl" },
      { id: 504, file_name: "FINAL_Bridge_14_16_Zirconia_CAM.stl", file_size: 8640200, file_type: "STL", is_deliverable: true, storage_url: "/api/stl/sample.stl" },
    ],
    timeline: [
      { step: "Case Posted & Escrow Hold Authorized ($48.00)", timestamp: "Nov 14, 09:30 AM", status: "done" },
      { step: "Accepted by Marcus Lindqvist, CDT — Funds Captured to Escrow", timestamp: "Nov 14, 10:12 AM", status: "done" },
      { step: "Margin Line Verified & Pontic Emergence Profile Designed", timestamp: "Nov 15, 04:40 PM", status: "done" },
      { step: "Final Deliverable STL Uploaded — Ready for 3D Inspection", timestamp: "Nov 16, 02:15 AM", status: "active" },
    ],
  },
  {
    id: 4822,
    title: "Custom Titanium Abutment + Screw-Retained Crown (#19) — Pt. M. Chen",
    description: "Straumann Bone Level RC Ti-Base. Subgingival emergence concave profile, screw channel angulated 12° lingually.",
    status: "IN_PROGRESS",
    service_type: "Implant Abutment",
    tooth_numbers: "#19",
    shade: "VITA A1",
    material: "Ti-Base + e.max CAD",
    dentist_id: 101,
    dentist_name: "Dr. Amelia Vance, DDS",
    designer_id: 203,
    designer_name: "Kenji Takahashi, CDT",
    designer_avatar: "/src/assets/images/avatar_designer_lead_1794830762435.jpg",
    escrow_status: "CAPTURED",
    escrow_amount: 38.0,
    platform_fee: 3.8,
    created_at: "2026-11-15T14:20:00Z",
    updated_at: "2026-11-15T16:05:00Z",
    deadline: "2026-11-16T22:00:00Z",
    web_preview_link: "https://viewer.workdent.io/3shape-webview/case-4822",
    files: [
      { id: 505, file_name: "Mandibular_Scanbody_19.ply", file_size: 16400000, file_type: "PLY", is_deliverable: false, storage_url: "/api/stl/sample.stl" },
      { id: 506, file_name: "Emergence_Gingiva_Mask.stl", file_size: 9100000, file_type: "STL", is_deliverable: false, storage_url: "/api/stl/sample.stl" },
    ],
    timeline: [
      { step: "Case Posted & Escrow Hold Authorized ($38.00)", timestamp: "Nov 15, 02:20 PM", status: "done" },
      { step: "Accepted by Kenji Takahashi, CDT", timestamp: "Nov 15, 04:05 PM", status: "active" },
    ],
  },
  {
    id: 4823,
    title: "Anterior Layered Veneers (#7, #8, #9, #10) — Pt. L. Kensington",
    description: "Facial cutback 0.4mm for feldspathic porcelain layering. Natural incisal embrasures and surface perikymata texture.",
    status: "APPROVED",
    service_type: "Crown & Bridge",
    tooth_numbers: "#7, #8, #9, #10",
    shade: "BL2 Bleached",
    material: "IPS e.max Press/CAD",
    dentist_id: 101,
    dentist_name: "Dr. Amelia Vance, DDS",
    designer_id: 202,
    designer_name: "Elena Rostova, MDT",
    designer_avatar: "/src/assets/images/avatar_clinic_director_1794830763686.jpg",
    escrow_status: "RELEASED_TO_DESIGNER",
    escrow_amount: 100.0,
    platform_fee: 10.0,
    created_at: "2026-11-10T11:00:00Z",
    updated_at: "2026-11-12T15:30:00Z",
    deadline: "2026-11-12T18:00:00Z",
    web_preview_link: "https://viewer.workdent.io/exocad-webview/case-4823",
    files: [
      { id: 507, file_name: "FINAL_Anterior_Veneers_7_10.stl", file_size: 12300000, file_type: "STL", is_deliverable: true, storage_url: "/api/stl/sample.stl" },
    ],
    timeline: [
      { step: "Case Posted & Escrow Authorized ($100.00)", timestamp: "Nov 10, 11:00 AM", status: "done" },
      { step: "Delivered by Elena Rostova, MDT", timestamp: "Nov 11, 06:45 PM", status: "done" },
      { step: "Approved by Dr. Amelia Vance — Escrow Released", timestamp: "Nov 12, 03:30 PM", status: "done" },
    ],
  },
  {
    id: 4824,
    title: "Michigan Hard Occlusal Splint (Upper Arch) — Pt. D. Kowalski",
    description: "2.0mm posterior vertical thickness, canine guidance ramp, flat posterior occlusal plane for bruxism therapy.",
    status: "PENDING_ACCEPTANCE",
    service_type: "Splint / Nightguard",
    tooth_numbers: "Full Upper Arch (#2–#15)",
    shade: "Clear PMMA / KeySplint Soft",
    material: "3D Printed KeySplint Resin",
    dentist_id: 101,
    dentist_name: "Dr. Amelia Vance, DDS",
    designer_id: null,
    designer_name: "Open Marketplace Broadcast",
    designer_avatar: "/src/assets/images/avatar_designer_lead_1794830762435.jpg",
    escrow_status: "AUTHORIZED_HOLD",
    escrow_amount: 24.0,
    platform_fee: 2.4,
    created_at: "2026-11-16T01:00:00Z",
    updated_at: "2026-11-16T01:00:00Z",
    deadline: "2026-11-17T12:00:00Z",
    web_preview_link: "https://viewer.workdent.io/exocad-webview/case-4824",
    files: [
      { id: 508, file_name: "Upper_Lower_Intraoral_Scan.stl", file_size: 19400000, file_type: "STL", is_deliverable: false, storage_url: "/api/stl/sample.stl" },
    ],
    timeline: [
      { step: "Case Posted — Card Authorization Hold ($24.00) Active for 6 Days", timestamp: "Nov 16, 01:00 AM", status: "active" },
    ],
  },
];

let portfolioItems = [
  {
    id: 301,
    user_id: 201,
    title: "Full-Arch Zirconia Monolithic Bridge on 6 Multi-Unit Abutments",
    description: "Designed in Exocad Galway 3.1 with gingival cutback and passive screw channel verification.",
    image_url: "/src/assets/images/showcase_zirconia_crown_1794830761578.jpg",
    is_featured: true,
    created_at: "2026-10-12T10:00:00Z",
  },
  {
    id: 302,
    user_id: 201,
    title: "Posterior 3-Unit Bridge (#14–#16) with Precision Margin Adaptation",
    description: "Sub-20 micron marginal gap with hygienic ovate pontic contour and canine-protected articulation.",
    image_url: "/src/assets/images/hero_dental_cad_studio_1794830761941.jpg",
    is_featured: true,
    created_at: "2026-10-28T14:30:00Z",
  },
];

let messagesList = [
  {
    id: 701,
    sender_id: 201,
    receiver_id: 101,
    project_id: 4821,
    content: "Hello Dr. Vance! I have imported the Medit i700 STL files for #14-#16. The distal shoulder margin on #16 is crystal clear.",
    created_at: "2026-11-15T14:15:00Z",
    attachments: [
      { id: 501, fileName: "Margin_Detection_Preview_14_16.stl", fileSize: 8420000 },
    ],
  },
  {
    id: 702,
    sender_id: 101,
    receiver_id: 201,
    project_id: 4821,
    content: "Thank you Marcus. Please keep the pontic #15 modified ridge-lap with light mucosal pressure and 0.04mm cement gap.",
    created_at: "2026-11-15T15:02:00Z",
    attachments: [],
  },
  {
    id: 703,
    sender_id: 201,
    receiver_id: 101,
    project_id: 4821,
    content: "Uploaded the final CAM-ready STL for #14-#16. Connector cross-section is 12.4 mm² on mesial and 14.1 mm² on distal. Ready for your 3D inspection!",
    created_at: "2026-11-16T02:15:00Z",
    attachments: [
      { id: 504, fileName: "FINAL_Bridge_14_16_Zirconia_CAM.stl", fileSize: 8640200 },
    ],
  },
];

let notificationsList = [
  {
    id: 801,
    title: "Deliverable STL Ready for 3D Review",
    message: "Marcus Lindqvist, CDT uploaded FINAL_Bridge_14_16_Zirconia_CAM.stl for Case #4821.",
    link: "/projects/4821",
    is_read: false,
    created_at: "14 mins ago",
  },
  {
    id: 802,
    title: "Escrow Hold Authorized ($24.00)",
    message: "Your card ending in •••• 4242 has a 6-day authorization hold for Case #4824.",
    link: "/projects/4824",
    is_read: false,
    created_at: "2 hours ago",
  },
  {
    id: 803,
    title: "Escrow Released to Elena Rostova, MDT",
    message: "$100.00 released for Case #4823 (Anterior Layered Veneers).",
    link: "/projects/4823",
    is_read: true,
    created_at: "2 days ago",
  },
];

let activeBanners = [
  {
    id: 1,
    title: "Exocad Elefsina 3.2 & 3Shape 2026 Direct Web-Link Preview Now Live",
    message: "Inspect margin lines, occlusal contacts, and connector cross-sections directly in your browser without downloading.",
    type: "info",
  },
];

let payoutSchedule = {
  frequency: "weekly",
  anchor_day: "Friday",
};

// Serve procedural 3D STL for ThreeDViewer
app.get("/api/stl/:name", (_req, res) => {
  res.setHeader("Content-Type", "model/stl");
  res.setHeader("Content-Disposition", 'inline; filename="WorkDent_Crown_Bridge.stl"');
  res.send(CACHED_STL);
});

// ============================================================================
// ALL 73 REST API ENDPOINTS (EXACT SPECIFICATION CONTRACT)
// ============================================================================

// 1. POST /api/login
app.post("/api/login", (req, res) => {
  const { email, role } = req.body;
  if (email) currentUser.email = email;
  if (role) currentUser.role = role;
  res.json({
    token: "wd_jwt_live_" + Date.now(),
    user: currentUser,
    requires_2fa: currentUser.two_factor_enabled,
  });
});

// 2. POST /api/register
app.post("/api/register", (req, res) => {
  const { full_name, email, role, phone, clinic_name } = req.body;
  currentUser = {
    ...currentUser,
    full_name: full_name || currentUser.full_name,
    email: email || currentUser.email,
    role: role ? (String(role).toUpperCase() as any) : "DENTIST",
    phone: phone || currentUser.phone,
    clinic_name: clinic_name || currentUser.clinic_name,
  };
  res.json({ success: true, user: currentUser });
});

// 3. POST /api/verify-otp
app.post("/api/verify-otp", (_req, res) => {
  res.json({ success: true, message: "Email verified via 6-digit OTP." });
});

// 4. POST /api/resend-otp
app.post("/api/resend-otp", (_req, res) => {
  res.json({ success: true });
});

// 5. POST /api/verify-2fa
app.post("/api/verify-2fa", (_req, res) => {
  res.json({ token: "wd_jwt_2fa_verified_" + Date.now(), user: currentUser });
});

// 6. POST /api/forgot-password
app.post("/api/forgot-password", (_req, res) => {
  res.json({ success: true });
});

// 7. POST /api/change-password
app.post("/api/change-password", (_req, res) => {
  res.json({ success: true });
});

// 8. POST /api/2fa/enable
app.post("/api/2fa/enable", (_req, res) => {
  res.json({
    qr_code_url: "otpauth://totp/WorkDent:amelia.vance@workdent.io?secret=JBSWY3DPEHPK3PXP&issuer=WorkDent",
    secret: "JBSWY3DPEHPK3PXP",
  });
});

// 9. POST /api/2fa/confirm
app.post("/api/2fa/confirm", (_req, res) => {
  currentUser.two_factor_enabled = true;
  res.json({ success: true });
});

// 10. POST /api/2fa/disable
app.post("/api/2fa/disable", (_req, res) => {
  currentUser.two_factor_enabled = false;
  res.json({ success: true });
});

// 11. POST /api/email-change-request
app.post("/api/email-change-request", (req, res) => {
  if (req.body.new_email) currentUser.email = req.body.new_email;
  res.json({ success: true });
});

// 12. POST /api/email-change-verify
app.post("/api/email-change-verify", (_req, res) => {
  res.json({ success: true });
});

// 13. GET /api/get-profile
app.get("/api/get-profile", (_req, res) => {
  res.json(currentUser);
});

// 14. POST /api/personalization
app.post("/api/personalization", (req, res) => {
  const { full_name, phone, timezone, email_notifications_enabled } = req.body;
  if (full_name !== undefined) currentUser.full_name = full_name;
  if (phone !== undefined) currentUser.phone = phone;
  if (timezone !== undefined) currentUser.timezone = timezone;
  if (email_notifications_enabled !== undefined) {
    currentUser.email_notifications_enabled = Boolean(email_notifications_enabled);
  }
  res.json({ success: true, user: currentUser });
});

// 15. POST /api/uploads/stage
app.post("/api/uploads/stage", (req, res) => {
  const newId = Date.now() + Math.floor(Math.random() * 1000);
  const item = {
    id: newId,
    file_name: req.body?.fileName || `Intraoral_Scan_${newId.toString().slice(-4)}.stl`,
    file_size: Number(req.body?.fileSize) || 12450800,
    created_at: new Date().toISOString(),
  };
  stagedFiles.push(item);
  res.status(201).json({ success: true, data: item });
});

// 16. DELETE /api/uploads/stage/:id
app.delete("/api/uploads/stage/:id", (req, res) => {
  const id = Number(req.params.id);
  stagedFiles = stagedFiles.filter((f) => f.id !== id);
  res.json({ success: true });
});

// 17. POST /api/portfolio
app.post("/api/portfolio", (req, res) => {
  const newItem = {
    id: Date.now(),
    user_id: 201,
    title: req.body?.title || "Anatomical Full-Contour Zirconia Case",
    description: req.body?.description || "Designed in Exocad with 0.04mm cement gap and dynamic articulation.",
    image_url: "/src/assets/images/showcase_zirconia_crown_1794830761578.jpg",
    is_featured: false,
    created_at: new Date().toISOString(),
  };
  portfolioItems.unshift(newItem);
  res.json({ success: true, item: newItem });
});

// 18. PATCH /api/portfolio/:id/feature
app.patch("/api/portfolio/:id/feature", (req, res) => {
  const id = Number(req.params.id);
  const item = portfolioItems.find((p) => p.id === id);
  if (item) item.is_featured = !item.is_featured;
  res.json({ success: true, is_featured: item ? item.is_featured : true });
});

// 19. POST /api/portfolio/:id/replace
app.post("/api/portfolio/:id/replace", (_req, res) => {
  res.json({ success: true });
});

// 20. DELETE /api/portfolio/:id
app.delete("/api/portfolio/:id", (req, res) => {
  const id = Number(req.params.id);
  portfolioItems = portfolioItems.filter((p) => p.id !== id);
  res.json({ success: true });
});

// 21. POST /api/designer/banner
app.post("/api/designer/banner", (_req, res) => {
  res.json({
    success: true,
    banner_url: "/src/assets/images/hero_dental_cad_studio_1794830761941.jpg",
  });
});

// 22. DELETE /api/designer/banner
app.delete("/api/designer/banner", (_req, res) => {
  res.json({ success: true });
});

// 23. POST & GET /api/attachments/download/:id
app.all("/api/attachments/download/:id", (req, res) => {
  res.setHeader("Content-Type", "application/sla");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="WorkDent_Deliverable_${req.params.id}.stl"`
  );
  res.send(CACHED_STL);
});

// 24. GET /api/dentist/card-info
app.get("/api/dentist/card-info", (_req, res) => {
  res.json({
    has_saved_card: true,
    brand: "Visa Corporate",
    last4: "4242",
    exp_month: 9,
    exp_year: 2029,
  });
});

// 25. GET /api/dentist/check-payment-type
app.get("/api/dentist/check-payment-type", (req, res) => {
  const qty = Number(req.query.quantity) || 1;
  const unitRate = 24;
  const subtotal = qty * unitRate;
  const platformFee = Number((subtotal * 0.1).toFixed(2));
  res.json({
    total_amount: subtotal + platformFee,
    platform_fee: platformFee,
  });
});

// 26. POST /api/dentist/stripe-pay-success
app.post("/api/dentist/stripe-pay-success", (req, res) => {
  const { project_title, amount, service_type, tooth_numbers, designer_id, shade, material, description } = req.body;
  const newCaseId = 4820 + projectsList.length + 1;
  const assignedDesigner = designersList.find((d) => d.id === Number(designer_id));
  const numAmount = Number(amount) || 48.0;
  const newCase = {
    id: newCaseId,
    title: project_title || `Clinical CAD Case #${newCaseId}`,
    description: description || "0.04mm cement gap, anatomical cusps, verify occlusal clearance.",
    status: assignedDesigner ? "IN_PROGRESS" : "PENDING_ACCEPTANCE",
    service_type: service_type || "Crown & Bridge",
    tooth_numbers: tooth_numbers || "#14",
    shade: shade || "VITA A2",
    material: material || "Monolithic Zirconia",
    dentist_id: currentUser.id,
    dentist_name: currentUser.full_name,
    designer_id: assignedDesigner ? assignedDesigner.id : null,
    designer_name: assignedDesigner ? assignedDesigner.full_name : "Open Marketplace Broadcast",
    designer_avatar: assignedDesigner
      ? assignedDesigner.avatar_url
      : "/src/assets/images/avatar_designer_lead_1794830762435.jpg",
    escrow_status: "AUTHORIZED_HOLD",
    escrow_amount: numAmount,
    platform_fee: Number((numAmount * 0.1).toFixed(2)),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deadline: new Date(Date.now() + 86400000).toISOString(),
    web_preview_link: `https://viewer.workdent.io/exocad-webview/case-${newCaseId}`,
    files: [
      {
        id: Date.now(),
        file_name: "Uploaded_Intraoral_Preparation.stl",
        file_size: 14200000,
        file_type: "STL",
        is_deliverable: false,
        storage_url: "/api/stl/sample.stl",
      },
    ],
    timeline: [
      {
        step: `Case Posted & Escrow Hold Authorized ($${numAmount.toFixed(2)})`,
        timestamp: "Just now",
        status: "active",
      },
    ],
  };
  projectsList.unshift(newCase);
  notificationsList.unshift({
    id: Date.now(),
    title: `Case #${newCaseId} Posted with Escrow Hold`,
    message: `$${numAmount.toFixed(2)} authorized on card •••• 4242 for ${newCase.title}.`,
    link: `/projects/${newCaseId}`,
    is_read: false,
    created_at: "Just now",
  });
  res.json({ success: true, case_id: newCaseId, project: newCase });
});

// 27. GET /api/dentist/active-projects
app.get("/api/dentist/active-projects", (_req, res) => {
  res.json({
    cases: projectsList.filter((p) =>
      ["PENDING_ACCEPTANCE", "IN_PROGRESS", "IN_REVIEW", "REVISION_REQUESTED"].includes(p.status)
    ),
  });
});

// 28. GET /api/dentist/complete-projects
app.get("/api/dentist/complete-projects", (_req, res) => {
  res.json({
    cases: projectsList.filter((p) => ["APPROVED", "COMPLETED"].includes(p.status)),
  });
});

// 29. GET /api/dentist/get-projects
app.get("/api/dentist/get-projects", (req, res) => {
  const search = String(req.query.search || "").toLowerCase();
  const status = String(req.query.project_status || "ALL").toUpperCase();
  let filtered = [...projectsList];
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.service_type.toLowerCase().includes(search) ||
        p.tooth_numbers.toLowerCase().includes(search) ||
        String(p.id).includes(search)
    );
  }
  if (status && status !== "ALL") {
    filtered = filtered.filter((p) => p.status === status);
  }
  res.json({
    data: filtered,
    total: filtered.length,
    pages: 1,
  });
});

// Single project helper endpoint
app.get("/api/projects/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = projectsList.find((p) => p.id === id) || projectsList[0];
  res.json({ project: found });
});

// 30. GET /api/get-designers
app.get("/api/get-designers", (req, res) => {
  const search = String(req.query.search || "").toLowerCase();
  const software = String(req.query.software || "").toLowerCase();
  const serviceName = String(req.query.service_name || "").toLowerCase();
  let list = [...designersList];
  if (search) {
    list = list.filter(
      (d) =>
        d.full_name.toLowerCase().includes(search) ||
        d.location.toLowerCase().includes(search) ||
        d.bio.toLowerCase().includes(search)
    );
  }
  if (software) {
    list = list.filter((d) => d.software.some((s) => s.toLowerCase().includes(software)));
  }
  if (serviceName) {
    list = list.filter((d) =>
      d.services.some((s) => s.service_name.toLowerCase().includes(serviceName))
    );
  }
  res.json({ data: list });
});

// 31. GET /api/get-designer-filter-options
app.get("/api/get-designer-filter-options", (_req, res) => {
  res.json({
    software: ["Exocad Expert", "3Shape Master", "Dental Wings", "Blenderfordental"],
    services: [
      "Single Anatomical Crown",
      "3-Unit Zirconia Bridge",
      "Custom Implant Abutment + Crown",
      "Full Arch All-on-X Bar",
      "Occlusal Nightguard / Michigan Splint",
      "Clear Aligner Setup & Staging",
      "Surgical Implant Guide",
    ],
  });
});

// 32. GET /api/get-designer-portfolio/:id
app.get("/api/get-designer-portfolio/:id", (req, res) => {
  const id = Number(req.params.id);
  const designer = designersList.find((d) => d.id === id) || designersList[0];
  res.json({
    designer,
    portfolio: portfolioItems,
  });
});

// 33. GET /api/designer/card-info
app.get("/api/designer/card-info", (_req, res) => {
  res.json({
    stripe_connect_active: true,
    charges_enabled: true,
    payouts_enabled: true,
    account_id: "acct_1WorkDentConnect992",
  });
});

// 34. GET /api/designer/active-jobs
app.get("/api/designer/active-jobs", (_req, res) => {
  res.json({
    jobs: projectsList.filter((p) => ["IN_PROGRESS", "IN_REVIEW", "REVISION_REQUESTED"].includes(p.status)),
  });
});

// 35. GET /api/designer/complete-jobs
app.get("/api/designer/complete-jobs", (_req, res) => {
  res.json({
    jobs: projectsList.filter((p) => ["APPROVED", "COMPLETED"].includes(p.status)),
  });
});

// 36. GET /api/designer/get-job-requests
app.get("/api/designer/get-job-requests", (_req, res) => {
  res.json({
    requests: projectsList.filter((p) => p.status === "PENDING_ACCEPTANCE"),
  });
});

// 37. GET /api/designer/get-jobs
app.get("/api/designer/get-jobs", (_req, res) => {
  res.json({
    open_jobs: projectsList,
  });
});

// 38. PATCH /api/designer/accept-job
app.patch("/api/designer/accept-job", (req, res) => {
  const jobId = Number(req.query.job_id || req.body?.job_id);
  const proj = projectsList.find((p) => p.id === jobId);
  if (proj) {
    proj.status = "IN_PROGRESS";
    proj.escrow_status = "CAPTURED";
    proj.designer_id = 201;
    proj.designer_name = "Marcus Lindqvist, CDT";
    proj.timeline.push({
      step: "Accepted by Marcus Lindqvist, CDT — Funds Captured to Escrow",
      timestamp: "Just now",
      status: "active",
    });
  }
  res.json({ success: true, status: "IN_PROGRESS", project: proj });
});

// 39. PATCH /api/designer/reject-job
app.patch("/api/designer/reject-job", (req, res) => {
  const projectId = Number(req.query.project_id || req.body?.project_id);
  const proj = projectsList.find((p) => p.id === projectId);
  if (proj) {
    proj.status = "CANCELLED";
    proj.escrow_status = "REFUNDED_TO_CLINIC";
  }
  res.json({ success: true, status: "DECLINED" });
});

// 40. GET /api/designer/get-services
app.get("/api/designer/get-services", (_req, res) => {
  res.json({ services: designersList[0].services });
});

// 41. GET /api/designer/get-admin-services
app.get("/api/designer/get-admin-services", (_req, res) => {
  res.json({
    catalog: [
      { id: 1, name: "Single Anatomical Crown", default_price: 18 },
      { id: 2, name: "3-Unit Zirconia Bridge", default_price: 48 },
      { id: 3, name: "Custom Implant Abutment + Crown", default_price: 35 },
      { id: 4, name: "Full Arch All-on-X Bar", default_price: 165 },
      { id: 5, name: "Occlusal Nightguard / Michigan Splint", default_price: 24 },
      { id: 6, name: "Digital Complete Denture (U/L)", default_price: 95 },
    ],
  });
});

// 42. POST /api/designer/add-service
app.post("/api/designer/add-service", (req, res) => {
  const { service_name, custom_price, turnaround_hours } = req.body;
  const newSvc = {
    id: Date.now(),
    service_name: service_name || "Custom Dental CAD Restoration",
    price: Number(custom_price) || 25,
    turnaround_hours: Number(turnaround_hours) || 16,
  };
  designersList[0].services.push(newSvc);
  res.json({ success: true, service: newSvc });
});

// 43. PATCH /api/designer/edit-service/:id
app.patch("/api/designer/edit-service/:id", (req, res) => {
  const id = Number(req.params.id);
  const svc = designersList[0].services.find((s) => s.id === id);
  if (svc) {
    if (req.body.custom_price !== undefined) svc.price = Number(req.body.custom_price);
    if (req.body.turnaround_hours !== undefined) svc.turnaround_hours = Number(req.body.turnaround_hours);
  }
  res.json({ success: true, service: svc });
});

// 44. DELETE /api/designer/delete-service/:id
app.delete("/api/designer/delete-service/:id", (req, res) => {
  const id = Number(req.params.id);
  designersList[0].services = designersList[0].services.filter((s) => s.id !== id);
  res.json({ success: true });
});

// 45. GET /api/designer/earning-info
app.get("/api/designer/earning-info", (_req, res) => {
  res.json({
    lifetime_earnings: 42680.0,
    pending_escrow: 486.0,
    available_balance: currentUser.wallet_balance,
  });
});

// 46. GET /api/designer/earning-curve
app.get("/api/designer/earning-curve", (_req, res) => {
  res.json({
    monthly_data: [
      { month: "Jun", earnings: 3420, cases: 92 },
      { month: "Jul", earnings: 3890, cases: 108 },
      { month: "Aug", earnings: 4120, cases: 115 },
      { month: "Sep", earnings: 4650, cases: 129 },
      { month: "Oct", earnings: 5180, cases: 144 },
      { month: "Nov", earnings: 5640, cases: 158 },
    ],
  });
});

// 47. GET /api/designer/get-earnings
app.get("/api/designer/get-earnings", (_req, res) => {
  res.json({
    ledger: [
      { id: 1, date: "2026-11-16", case_id: 4821, title: "Posterior 3-Unit Zirconia Bridge (#14–#16)", gross: 48.0, fee: 4.8, net: 43.2, status: "IN_ESCROW", utr: "UTR-WD-9984120" },
      { id: 2, date: "2026-11-15", case_id: 4822, title: "Custom Titanium Abutment (#19)", gross: 38.0, fee: 3.8, net: 34.2, status: "IN_ESCROW", utr: "UTR-WD-9983904" },
      { id: 3, date: "2026-11-12", case_id: 4823, title: "Anterior Layered Veneers (#7–#10)", gross: 100.0, fee: 10.0, net: 90.0, status: "PAID", utr: "UTR-WD-9981022" },
      { id: 4, date: "2026-11-08", case_id: 4815, title: "Full Arch All-on-6 Titanium Bar", gross: 165.0, fee: 16.5, net: 148.5, status: "PAID", utr: "UTR-WD-9978411" },
      { id: 5, date: "2026-11-03", case_id: 4809, title: "Upper Arch Michigan Splint", gross: 24.0, fee: 2.4, net: 21.6, status: "PAID", utr: "UTR-WD-9974019" },
    ],
  });
});

// 48. GET /api/designer/get-wallet-balance
app.get("/api/designer/get-wallet-balance", (_req, res) => {
  res.json({ balance: currentUser.wallet_balance, currency: "USD" });
});

// 49. GET /api/designer/payout-method
app.get("/api/designer/payout-method", (_req, res) => {
  res.json({
    payout_configured: true,
    bank_name: "JPMorgan Chase NA / SEPA Express",
    bank_last4: "8841",
    routing_status: "VERIFIED",
  });
});

// 50. POST /api/designer/payout-method
app.post("/api/designer/payout-method", (_req, res) => {
  res.json({
    stripe_connect_onboarding_url: "/designer/wallet?onboarding=complete",
  });
});

// 51. GET /api/designer/connect/login-link
app.get("/api/designer/connect/login-link", (_req, res) => {
  res.json({
    express_dashboard_url: "/designer/wallet?dashboard=express",
  });
});

// 52. POST /api/designer/connect/refresh
app.post("/api/designer/connect/refresh", (_req, res) => {
  res.json({
    new_onboarding_url: "/designer/wallet?refreshed=true",
  });
});

// 53. GET /api/designer/get-payout-schedule
app.get("/api/designer/get-payout-schedule", (_req, res) => {
  res.json(payoutSchedule);
});

// 54. POST /api/designer/update-payout-schedule
app.post("/api/designer/update-payout-schedule", (req, res) => {
  if (req.body.frequency) payoutSchedule.frequency = req.body.frequency;
  if (req.body.anchor_day) payoutSchedule.anchor_day = req.body.anchor_day;
  res.json({ success: true, schedule: payoutSchedule });
});

// 55. GET /api/designer/get-payout-histories
app.get("/api/designer/get-payout-histories", (_req, res) => {
  res.json({
    transfers: [
      { id: "tr_1Wd9921", date: "2026-11-13", amount: 1240.0, destination: "Bank •••• 8841", status: "COMPLETED", utr: "UTR-883920194" },
      { id: "tr_1Wd8810", date: "2026-11-06", amount: 980.5, destination: "Bank •••• 8841", status: "COMPLETED", utr: "UTR-883104921" },
      { id: "tr_1Wd7742", date: "2026-10-30", amount: 1510.0, destination: "Bank •••• 8841", status: "COMPLETED", utr: "UTR-882491003" },
    ],
  });
});

// Withdraw funds helper
app.post("/api/designer/withdraw", (req, res) => {
  const amount = Number(req.body.amount) || currentUser.wallet_balance;
  currentUser.wallet_balance = Math.max(0, Number((currentUser.wallet_balance - amount).toFixed(2)));
  res.json({
    success: true,
    withdrawn: amount,
    remaining_balance: currentUser.wallet_balance,
  });
});

// 56. GET /api/designer/plan-info
app.get("/api/designer/plan-info", (_req, res) => {
  res.json({
    plan: currentUser.plan,
    commission_rate: currentUser.plan === "PRO" ? "5%" : "10%",
    renews_at: "2026-12-16",
  });
});

// 57. POST /api/designer/subscription/checkout
app.post("/api/designer/subscription/checkout", (req, res) => {
  currentUser.plan = req.body?.plan === "STANDARD" ? "STANDARD" : "PRO";
  res.json({
    success: true,
    plan: currentUser.plan,
    checkout_url: "/designer/subscription?upgraded=true",
  });
});

// 58. POST /api/designer/subscription/portal
app.post("/api/designer/subscription/portal", (_req, res) => {
  res.json({
    portal_url: "/designer/subscription?portal=active",
  });
});

// 59. GET /api/get-chat-list
app.get("/api/get-chat-list", (_req, res) => {
  res.json({
    conversations: [
      {
        partner_id: 201,
        partner_name: "Marcus Lindqvist, CDT",
        partner_role: "Exocad Expert • Stockholm",
        partner_avatar: "/src/assets/images/avatar_designer_lead_1794830762435.jpg",
        last_message: "Uploaded the final CAM-ready STL for #14-#16. Ready for your 3D inspection!",
        unread: 1,
        case_id: 4821,
        updated_at: "14m ago",
      },
      {
        partner_id: 203,
        partner_name: "Kenji Takahashi, CDT",
        partner_role: "3Shape Master • Tokyo",
        partner_avatar: "/src/assets/images/avatar_designer_lead_1794830762435.jpg",
        last_message: "Angulated screw channel on #19 verified at 12 degrees lingual.",
        unread: 0,
        case_id: 4822,
        updated_at: "3h ago",
      },
      {
        partner_id: 202,
        partner_name: "Elena Rostova, MDT",
        partner_role: "Anterior Smile Design • Munich",
        partner_avatar: "/src/assets/images/avatar_clinic_director_1794830763686.jpg",
        last_message: "Thank you for releasing the escrow on Case #4823!",
        unread: 0,
        case_id: 4823,
        updated_at: "2d ago",
      },
    ],
  });
});

// 60. GET /api/messageable-users
app.get("/api/messageable-users", (_req, res) => {
  res.json({ users: designersList });
});

// 61. GET /api/get-messages
app.get("/api/get-messages", (req, res) => {
  const partnerId = Number(req.query.chat_partner_id) || 201;
  const filtered = messagesList.filter(
    (m) => m.sender_id === partnerId || m.receiver_id === partnerId
  );
  res.json({ data: filtered.length ? filtered : messagesList });
});

// 62. POST /api/messages/send
app.post("/api/messages/send", (req, res) => {
  const { receiver_id, message, project_id } = req.body;
  const newMsg = {
    id: Date.now(),
    sender_id: currentUser.id,
    receiver_id: Number(receiver_id) || 201,
    project_id: Number(project_id) || 4821,
    content: message || "",
    created_at: new Date().toISOString(),
    attachments: [],
  };
  messagesList.push(newMsg);
  res.json({ success: true, message_id: newMsg.id, data: newMsg });
});

// 63. GET /api/support-contact
app.get("/api/support-contact", (_req, res) => {
  res.json({
    support_user_id: 999,
    status: "ONLINE",
    sla_response: "< 2 hours",
    email: "clinical-support@workdent.io",
  });
});

// 64. GET /api/get-notifications
app.get("/api/get-notifications", (_req, res) => {
  res.json({ notifications: notificationsList });
});

// 65. GET /api/notification-status
app.get("/api/notification-status", (_req, res) => {
  const unread = notificationsList.filter((n) => !n.is_read).length;
  res.json({ unread_count: unread });
});

// 66. PATCH /api/read
app.patch("/api/read", (req, res) => {
  const id = Number(req.body?.notification_id);
  const item = notificationsList.find((n) => n.id === id);
  if (item) item.is_read = true;
  res.json({ success: true });
});

// 67. PATCH /api/read-all
app.patch("/api/read-all", (_req, res) => {
  notificationsList.forEach((n) => {
    n.is_read = true;
  });
  res.json({ success: true });
});

// 68. GET /api/active-banners
app.get("/api/active-banners", (_req, res) => {
  res.json({ banners: activeBanners });
});

// 69. POST /api/announcements/:id/dismiss
app.post("/api/announcements/:id/dismiss", (req, res) => {
  const id = Number(req.params.id);
  activeBanners = activeBanners.filter((b) => b.id !== id);
  res.json({ success: true });
});

// 70. POST /api/log-client-error
app.post("/api/log-client-error", (_req, res) => {
  res.json({ logged: true });
});

// 71. GET /api/referral-info
app.get("/api/referral-info", (_req, res) => {
  res.json({
    referral_code: currentUser.referral_code,
    invite_url: `https://workdent.io/ref/${currentUser.referral_code}`,
    bonus_amount: 50,
  });
});

// 72. GET /api/referral-stats
app.get("/api/referral-stats", (_req, res) => {
  res.json({
    total_referred: 7,
    total_bonus: 350.0,
    pending_bonus: 100.0,
    referrals: [
      { id: 1, clinic: "Apex Prosthodontics NYC", date: "Nov 11, 2026", cases_completed: 14, reward: "$50.00 Paid" },
      { id: 2, clinic: "Nordic Smile Studio", date: "Nov 02, 2026", cases_completed: 8, reward: "$50.00 Paid" },
      { id: 3, clinic: "Bespoke Dental Lab Zurich", date: "Oct 24, 2026", cases_completed: 31, reward: "$50.00 Paid" },
    ],
  });
});

// 73. POST /api/projects/:id/approve
app.post("/api/projects/:id/approve", (req, res) => {
  const id = Number(req.params.id);
  const proj = projectsList.find((p) => p.id === id) || projectsList[0];
  proj.status = "APPROVED";
  proj.escrow_status = "RELEASED_TO_DESIGNER";
  proj.timeline.push({
    step: "Approved by Clinic — Escrow Released to Designer",
    timestamp: "Just now",
    status: "done",
  });
  res.json({
    success: true,
    escrow_status: "RELEASED_TO_DESIGNER",
    project: proj,
  });
});

// Revision request & Designer file delivery endpoints
app.post("/api/projects/:id/revision", (req, res) => {
  const id = Number(req.params.id);
  const proj = projectsList.find((p) => p.id === id) || projectsList[0];
  proj.status = "REVISION_REQUESTED";
  proj.timeline.push({
    step: `Revision Requested: ${req.body?.reason || "Adjust occlusal contact by -0.05mm"}`,
    timestamp: "Just now",
    status: "active",
  });
  res.json({ success: true, project: proj });
});

app.post("/api/designer/deliver-project/:id", (req, res) => {
  const id = Number(req.params.id);
  const proj = projectsList.find((p) => p.id === id) || projectsList[0];
  proj.status = "IN_REVIEW";
  const deliverableName = req.body?.file_name || `FINAL_CAD_${id}_Verified.stl`;
  proj.files.push({
    id: Date.now(),
    file_name: deliverableName,
    file_size: 9410200,
    file_type: "STL",
    is_deliverable: true,
    storage_url: "/api/stl/sample.stl",
  });
  proj.timeline.push({
    step: `Deliverable Uploaded (${deliverableName}) — Submitted for Clinical Review`,
    timestamp: "Just now",
    status: "active",
  });
  res.json({ success: true, project: proj });
});

async function startServer() {
  const PORT = 3000;
  const distPath = path.resolve(process.cwd(), "dist");

  if (process.env.NODE_ENV === "production" && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WorkDent Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
