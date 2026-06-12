export interface FalseCeilingType {
  id: string;
  name: string;
  startingPrice: number; // in INR per sq.ft
  material: string;
  highlight: string;
  description: string;
  detailedDescription: string;
  features: string[];
  imageUrl: string;
  pros: string[];
  bestFor: string;
}

export interface NoidaProject {
  id: string;
  location: string;
  ceilingType: string;
  priceEstimation: string;
  imageUrl: string;
  date: string;
}

export interface CallbackRequest {
  name: string;
  phone: string;
  email: string;
  location: string;
  customSector: string; // society/apartment details - now required
  timeline: 'immediate' | 'next_30_days' | 'planning_phase' | '';
  budget: string;
  ceilingTypeOfInterest: string;
  notes: string;
  siteAuditTime: string; // Changed from callbackTime
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  ceilingType: string;
}
