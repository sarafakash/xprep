interface Feedback {
  id: number;
  interviewId: number;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: Date;
}

interface Interview {
  id: number;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: Date;
  userId: number
  type: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: number;
  userId: number
  transcript: { role: string; content: string }[];
  feedbackId?: number;
}

interface User {
  name: string;
  email: string;
  id: number;
}

interface InterviewCardProps {
  id?: number;
  userId?: number;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: Date;
}

interface AgentProps {
  userName: string;
  userId?: number;
  interviewId?: number;
  feedbackId?: number;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: number;
  userId: number
}

interface GetLatestInterviewsParams {
  userId: number
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}
