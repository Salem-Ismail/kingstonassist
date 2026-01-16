export type Language = "en" | "fr" | "so";

export type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  whyHelpful: string;
  contact: string;
  location: string;
  source?: string;
};

export type Answers = {
  need: "housing" | "employment" | "health" | "legal" | "immigration" | "settlement" | "community" | "";
  urgency: "today" | "this-week" | "this-month" | "exploring" | "";
  mode: "phone" | "online" | "in-person" | "";
  household: "single" | "family" | "unsure" | "";
};

export type RecommendResponse =
  | {
      mode: "recommendations";
      language: Language;
      supportedLanguages: string[];
      answers: Answers;
      serviceIds: string[];
      services: Service[];
      summary: string;
    }
  | {
      mode: "clarification";
      language: Language;
      answer: string;
      serviceIds: string[];
    };

