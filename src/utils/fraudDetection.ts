
import { toast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyA7WL5Pisv7OhJ8XReH1d-erUTFwjoeh48");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Fraud detection thresholds
export interface FraudDetectionOptions {
  amountThreshold?: number;
  highRiskCountries?: string[];
  unusualHours?: { start: number; end: number };
  ipMismatch?: boolean;
  velocityCheck?: boolean;
}

// Default options
const defaultOptions: FraudDetectionOptions = {
  amountThreshold: 10000,
  highRiskCountries: ["RU", "NG", "UA", "KP"],
  unusualHours: { start: 23, end: 5 },
  ipMismatch: true,
  velocityCheck: true,
};

/**
 * Simple rule-based fraud detection
 */
export const detectFraud = (transaction: any, options: FraudDetectionOptions = defaultOptions): { 
  isFraudulent: boolean; 
  reasons: string[];
  score: number;
} => {
  const reasons: string[] = [];
  let score = 0;

  // Check for high amount
  if (options.amountThreshold && transaction.amount > options.amountThreshold) {
    reasons.push(`High amount (${transaction.amount})`);
    score += 0.3;
  }

  // Check for high-risk country
  if (options.highRiskCountries && options.highRiskCountries.includes(transaction.country)) {
    reasons.push(`High-risk country (${transaction.country})`);
    score += 0.4;
  }

  // Check for unusual hours
  if (options.unusualHours) {
    const hour = new Date(transaction.timestamp).getHours();
    if (hour >= options.unusualHours.start || hour <= options.unusualHours.end) {
      reasons.push(`Unusual hours (${hour}:00)`);
      score += 0.2;
    }
  }

  // Check for IP mismatch (using mock data here)
  if (options.ipMismatch && transaction.ipCountry !== transaction.country) {
    reasons.push(`IP country mismatch (IP: ${transaction.ipCountry}, Billing: ${transaction.country})`);
    score += 0.5;
  }

  // Check for velocity (multiple transactions in short time)
  if (options.velocityCheck && transaction.recentTransactions > 5) {
    reasons.push(`High velocity (${transaction.recentTransactions} transactions recently)`);
    score += 0.4;
  }

  return {
    isFraudulent: score >= 0.5,
    reasons,
    score: parseFloat(score.toFixed(2)),
  };
};

/**
 * Advanced fraud detection using Gemini AI
 */
export const detectFraudWithAI = async (transaction: any): Promise<{
  isFraudulent: boolean;
  reasons: string[];
  score: number;
  aiAnalysis: string;
}> => {
  try {
    // First perform rule-based detection
    const ruleBasedResult = detectFraud(transaction);
    
    // Prepare transaction data for AI analysis
    const transactionData = JSON.stringify(transaction, null, 2);
    
    // Construct the prompt for Gemini
    const prompt = `Analyze this transaction for potential fraud:
    ${transactionData}
    
    Consider these risk factors:
    1. Transaction amount (high amounts are riskier)
    2. Country of origin (some countries have higher fraud rates)
    3. Time of transaction (unusual hours may indicate fraud)
    4. User history and behavior patterns
    5. IP location vs billing address location
    
    Format your response as JSON with these fields:
    - isFraudulent: boolean indicating if you think this is fraudulent
    - confidenceScore: number between 0 and 1
    - reasoning: string explaining your analysis
    `;

    // Make request to Gemini using the SDK
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    let aiResult;
    
    try {
      // Extract JSON from the response text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      // Fallback to rule-based result
      return {
        ...ruleBasedResult,
        aiAnalysis: "AI analysis failed, using rule-based detection.",
      };
    }
    
    // Combine AI and rule-based results
    const combinedScore = (ruleBasedResult.score + (aiResult.confidenceScore || 0)) / 2;
    
    return {
      isFraudulent: combinedScore > 0.5 || aiResult.isFraudulent,
      reasons: [...ruleBasedResult.reasons],
      score: parseFloat(combinedScore.toFixed(2)),
      aiAnalysis: aiResult.reasoning || "No detailed analysis provided.",
    };
  } catch (error) {
    console.error("Error in AI fraud detection:", error);
    toast({
      title: "AI Detection Failed",
      description: "Falling back to rule-based detection.",
      variant: "destructive",
    });
    
    // Fallback to rule-based detection
    const fallbackResult = detectFraud(transaction);
    return {
      ...fallbackResult,
      aiAnalysis: "AI analysis failed, using rule-based detection.",
    };
  }
};

// Analysis helper function to evaluate transaction
export const analyzeFraudRisk = (transaction: any) => {
  const result = detectFraud(transaction);
  
  if (result.isFraudulent) {
    toast({
      title: "Fraud Alert",
      description: `Suspicious transaction detected: ${result.reasons.join(", ")}`,
      variant: "destructive",
    });
  }
  
  return result;
};

// Test function for the Gemini API
export const testGeminiAPI = async (): Promise<boolean> => {
  try {
    // Use the SDK to make a simple test request
    const result = await model.generateContent("Respond with 'Gemini API is working correctly' if you receive this message.");
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini API test response:", text);
    return text.includes("working correctly");
  } catch (error) {
    console.error("Gemini API test failed:", error);
    return false;
  }
};
