export type Tone =
  | "sand"
  | "mist"
  | "ember"
  | "crimson"
  | "fog"
  | "charcoal"
  | "umber"
  | "wine"
  | "stone";

export type Post = {
  id: number;
  badge: string;
  title: string;
  tone: Tone;
  category: "Essay" | "Feature" | "Review" | "Note";
  excerpt?: string;
  meta?: string;
  cta?: string;
  author?: string;
};
