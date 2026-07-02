import manualVsAiCallAutomationBetterForBusiness from "./posts/manual-vs-ai-call-automation-better-for-business.json";
import aiVoiceAgentsIncreaseSalesConversions from "./posts/ai-voice-agents-increase-sales-conversions.json";
import reduceMissedCalls from "./posts/reduce-missed-calls-small-business.json";
import automateCustomerCallsUsingAi from "./posts/automate-customer-calls-using-ai.json";
import handle100PlusCustomerCallsWithoutCallCenter from "./posts/handle-100-plus-customer-calls-without-call-center.json";
import growingBusinessesAutomateCallsAiSolutions from "./posts/growing-businesses-automate-calls-ai-solutions.json";
import businessLosingLeadsDueToMissedCalls from "./posts/business-losing-leads-due-to-missed-calls.json";
import howToNeverMissACustomerCallAgain from "./posts/how-to-never-miss-a-customer-call-again.json";

export type BlogContentItem = {
  type: "paragraph" | "heading" | "subheading" | "list" | "table";
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  image: string;
  content: BlogContentItem[];
  htmlContent?: string;
  sectionImages?: Record<string, string>; 
};

const blogPostsRaw = [
  howToNeverMissACustomerCallAgain,
  businessLosingLeadsDueToMissedCalls,
  growingBusinessesAutomateCallsAiSolutions,
  handle100PlusCustomerCallsWithoutCallCenter,
  automateCustomerCallsUsingAi,
  reduceMissedCalls,
  aiVoiceAgentsIncreaseSalesConversions,
  manualVsAiCallAutomationBetterForBusiness,
] as const;

export const BLOG_POSTS = [...blogPostsRaw] as BlogPost[];