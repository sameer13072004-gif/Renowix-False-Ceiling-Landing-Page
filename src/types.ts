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
  customSector: string;
  timeline: 'within_1_month' | 'within_3_months' | 'within_6_months' | 'after_1_year' | '';
  budget: string;
  ceilingTypeOfInterest: string;
  notes: string;
  callbackTime: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  ceilingType: string;
}
