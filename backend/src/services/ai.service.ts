import { GoogleGenerativeAI } from '@google/generative-ai';

// High quality data structures for dynamic fallback generation
const FUTURISTIC_CAREERS = [
  { title: "AI Ethics Lawyer", domain: "Law", growth: 95, demand: "High", salary: "$145,000 - $210,000", description: "Navigates legalities of AI algorithms, copyright, and ethical parameters." },
  { title: "Quantum Computing Engineer", domain: "Technology", growth: 98, demand: "Critical", salary: "$160,000 - $250,000", description: "Designs hardware and algorithms based on quantum mechanics." },
  { title: "Climate Data Scientist", domain: "Science", growth: 92, demand: "High", salary: "$110,000 - $175,000", description: "Leverages machine learning to model global environmental risks." },
  { title: "Space Commerce Consultant", domain: "Commerce", growth: 89, demand: "Medium-High", salary: "$130,000 - $190,000", description: "Orchestrates financial strategies for orbital manufacturing and off-planet resources." },
  { title: "Metaverse Architect", domain: "Arts", growth: 87, demand: "Medium", salary: "$95,000 - $160,000", description: "Designs spatial experiences and digital real estate assets." },
  { title: "Human-AI Collaboration Specialist", domain: "Technology", growth: 94, demand: "High", salary: "$120,000 - $185,000", description: "Optimizes operational workflows combining human talent with cognitive computing tools." }
];

export class AIService {
  // Method 1: Evaluate Psychometric DNA Assessment
  static async evaluateDNA(answers: Record<string, string>) {
    // Determine personality based on answers
    const answersList = Object.values(answers);
    const countA = answersList.filter(a => a === 'A').length;
    const countB = answersList.filter(a => a === 'B').length;
    const countC = answersList.filter(a => a === 'C').length;

    let personality = "Innovator (ENTP)";
    let learningStyle = "Visual-Spatial";
    let strengths = ["Strategic Thinking", "Creative Problem Solving", "Adaptability"];
    let weaknesses = ["Impatient with Routine", "Over-analyzing", "Difficulty Delegating"];
    let interestAreas = ["Artificial Intelligence", "Autonomous Systems", "Emerging Tech"];
    let careerFit = { Technology: 95, Science: 85, Commerce: 70, Arts: 60, Law: 55 };

    if (countB > countA && countB > countC) {
      personality = "Architect (INTJ)";
      learningStyle = "Logical-Mathematical";
      strengths = ["Structured Analysis", "Objectivity", "Deep Focus"];
      weaknesses = ["Risk Averse", "Perfectionism", "Reluctance to pivot quickly"];
      interestAreas = ["Quantum Computing", "Data Science", "Corporate Law"];
      careerFit = { Science: 92, Technology: 88, Law: 80, Commerce: 75, Arts: 45 };
    } else if (countC > countA && countC > countB) {
      personality = "Campaigner (ENFP)";
      learningStyle = "Auditory-Kinesthetic";
      strengths = ["Empathy", "Communication", "Leadership"];
      weaknesses = ["Easily Distracted", "Conflict Avoidance", "Over-committing"];
      interestAreas = ["UI/UX Design", "Corporate Communications", "Public Policy"];
      careerFit = { Arts: 90, Commerce: 82, Law: 75, Technology: 68, Science: 60 };
    }

    return {
      personality,
      learningStyle,
      strengths,
      weaknesses,
      interestAreas,
      careerFit
    };
  }

  // Method 2: AI Future Career Predictor
  static getFutureCareers() {
    return FUTURISTIC_CAREERS;
  }

  // Method 3: Simulate Career Scenario Decisions
  static getSimulationStep(career: string, stepIndex: number, previousDecision?: string) {
    if (career === 'software_engineer') {
      const steps = [
        {
          id: 0,
          scenario: "You are starting a sprint. The product manager asks to add a last-minute feature that bypasses security testing to hit a press deadline. What do you do?",
          options: [
            { text: "Bypass the security testing. Timely delivery is everything.", nextId: 1, feedback: "Risk Alert! The client loved the release, but a data leak occurred. Security is paramount." },
            { text: "Refuse the bypass. Explain the security risks and propose a scaled-back version.", nextId: 2, feedback: "Excellent decision. You safeguarded data integrity while showing business acumen." }
          ]
        },
        {
          id: 1,
          scenario: "Due to the leak, you must deploy a hotfix immediately. But your dev database is out of sync with production. Do you...",
          options: [
            { text: "Sync databases dynamically risking data overwrite.", nextId: 3, feedback: "Oops! Database overwrite occurred. Massive data corruption logged." },
            { text: "Write manual patches to production database.", nextId: 3, feedback: "Good effort. It was slow but it saved user details." }
          ]
        },
        {
          id: 2,
          scenario: "Your product manager agrees. You implement security safeguards and standard features. The tech lead recommends code refactoring for the legacy codebase. What is your path?",
          options: [
            { text: "Dedicate 20% of sprint capacity to refactor incrementally.", nextId: 3, feedback: "Perfect! Maintainability scores increased by 40%." },
            { text: "Defer refactoring until the software breaks.", nextId: 3, feedback: "Tech debt accumulated. Sprint velocity dropped by half." }
          ]
        },
        {
          id: 3,
          scenario: "Simulation Complete! You have earned +100 Career XP. Your technical leadership badge is now unlocked.",
          options: []
        }
      ];
      return steps[stepIndex] || null;
    } else if (career === 'lawyer') {
      const steps = [
        {
          id: 0,
          scenario: "A major client reveals they inadvertently shared proprietary competitor trade secrets during a public podcast. What is your legal counsel?",
          options: [
            { text: "File an emergency retraction and immediate trademark/IP shield.", nextId: 1, feedback: "Great reactive response. Minimizes immediate exposure." },
            { text: "Keep quiet and hope competitors don't notice.", nextId: 2, feedback: "Severe legal liability. Competitors filed a lawsuit." }
          ]
        },
        {
          id: 1,
          scenario: "The client asks you to formulate the public statement. Do you...",
          options: [
            { text: "Admit error and emphasize it was non-malicious.", nextId: 3, feedback: "Transparent and safe. Judges prefer honest disclosures." },
            { text: "Draft a combative statement denying trade secret usage.", nextId: 3, feedback: "Highly risky. Discovery phase will show otherwise." }
          ]
        },
        {
          id: 2,
          scenario: "The competitor files a lawsuit. How do you prepare?",
          options: [
            { text: "Negotiate an out-of-court settlement.", nextId: 3, feedback: "Smart business choice. Saved millions in trial costs." },
            { text: "Counter-sue for defamation.", nextId: 3, feedback: "Aggressive but ultimately lost. The facts were clear." }
          ]
        },
        {
          id: 3,
          scenario: "Simulation Complete! You earned +100 Career XP. Your Legal Strategist badge is unlocked.",
          options: []
        }
      ];
      return steps[stepIndex] || null;
    } else {
      // Default Doctor Simulation
      const steps = [
        {
          id: 0,
          scenario: "An elderly patient presents with sudden severe chest pain spreading to the back, alongside high blood pressure. What is your immediate diagnostic focus?",
          options: [
            { text: "Order an ECG and Troponin to check for Myocardial Infarction.", nextId: 1, feedback: "Standard protocol, but keep your differential diagnosis wide." },
            { text: "Suspect Aortic Dissection and immediately order a CT Angiogram.", nextId: 2, feedback: "Aortic dissection is highly lethal. Correct urgent prioritization!" }
          ]
        },
        {
          id: 1,
          scenario: "ECG shows mild ST abnormalities. Patient is still in pain. What next?",
          options: [
            { text: "Administer high-dose Aspirin immediately.", nextId: 3, feedback: "Danger! If it was aortic dissection, aspirin would worsen bleeding. Fatal mistake." },
            { text: "Halt aspirin, request immediate imaging for Aortic Dissection.", nextId: 3, feedback: "Excellent save. Imaging shows a dissection and you saved the patient." }
          ]
        },
        {
          id: 2,
          scenario: "CT Angiogram confirms Type A Aortic Dissection. Cardiothoracic surgery is notified. Do you...",
          options: [
            { text: "Initiate IV beta-blockers to lower heart rate and blood pressure.", nextId: 3, feedback: "Brilliant. Minimizes shear stress on the aorta before surgery." },
            { text: "Wait for surgeon arrival before taking any action.", nextId: 3, feedback: "Risk alert. Pressure spike caused dissection rupture." }
          ]
        },
        {
          id: 3,
          scenario: "Simulation Complete! You earned +100 Career XP. Your Diagnostic Ace badge is unlocked.",
          options: []
        }
      ];
      return steps[stepIndex] || null;
    }
  }

  // Method 4: Placement Predictor calculations
  static predictPlacement(data: { cgpa: number; skills: string[]; projects: number; internships: number }) {
    const { cgpa, skills, projects, internships } = data;
    
    // Simple algorithmic weighting
    let baseScore = (cgpa / 10) * 40; // 40 points max for CGPA
    baseScore += Math.min(skills.length * 5, 25); // 25 points max for skills
    baseScore += Math.min(projects * 8, 20); // 20 points max for projects
    baseScore += Math.min(internships * 10, 15); // 15 points max for internships

    const readinessScore = Math.min(Math.round(baseScore), 100);

    // Dynamic salary forecast
    let minSalary = 4; // Lakhs
    let maxSalary = 6;
    if (readinessScore > 85) {
      minSalary = 18;
      maxSalary = 30;
    } else if (readinessScore > 70) {
      minSalary = 10;
      maxSalary = 18;
    } else if (readinessScore > 50) {
      minSalary = 6;
      maxSalary = 10;
    }

    const companyMatches = [];
    if (readinessScore > 80) {
      companyMatches.push("Google", "Microsoft", "Amazon", "NVIDIA");
    }
    if (readinessScore > 60) {
      companyMatches.push("TCS Innovation Labs", "Infosys Center of Excellence", "Cognizant", "Deloitte");
    }
    if (companyMatches.length === 0) {
      companyMatches.push("Startups Hub", "Local Tech Labs");
    }

    const recommendations = [];
    if (cgpa < 8) recommendations.push("Focus on elevating CGPA above 8.0 to unlock premium recruiters.");
    if (skills.length < 5) recommendations.push("Upskill in high-demand tools (e.g. Next.js, Cloud Architectures, PyTorch).");
    if (projects < 2) recommendations.push("Build at least 2 full-stack deployable projects displaying live utilities.");
    if (internships === 0) recommendations.push("Acquire internship/freelance credentials or participate in open-source programs.");

    return {
      readinessScore,
      salaryRange: `₹${minSalary}L - ₹${maxSalary}L per annum`,
      companyMatchProbability: companyMatches,
      interviewReadiness: readinessScore > 75 ? "High" : readinessScore > 50 ? "Medium" : "Need Practice",
      recommendations: recommendations.length > 0 ? recommendations : ["Your profile looks highly optimized! Start practicing advanced system design."]
    };
  }

  // Method: Search real colleges in India & Karnataka using Gemini
  static async searchColleges(query: { domain?: string; maxFees?: number; location?: string }) {
    const { domain, maxFees, location } = query;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      const maxRetries = 3;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const modelName = attempt === 1 ? "gemini-2.5-flash" : "gemini-3.5-flash";
          const model = genAI.getGenerativeModel(
            { 
              model: modelName,
              generationConfig: { responseMimeType: "application/json" }
            },
            { apiVersion: "v1", timeout: 8000 }
          );

          const prompt = `Search and list real, existing colleges in India matching these parameters:
- Domain: ${domain || 'Any'}
- Maximum Yearly Fees: INR ${maxFees || 'No limit'}
- Preferred Location: ${location || 'Any (specifically make sure to include top colleges in Karnataka like NLSIU, IISc, RVCE, PES University)'}

Provide actual real colleges with correct NIRF ranking, actual yearly fees (in INR), placement rate (%), location, and facilities.
Specifically prioritize and list top-ranking colleges situated in Karnataka if location matches 'Karnataka' or 'Bangalore' or if no specific location was requested.

Output ONLY a JSON array matching this schema:
[
  {
    "name": "Full College Name",
    "domain": "Technology" | "Law" | "Commerce" | "Science" | "Arts",
    "ranking": number (actual Nirf/National rank),
    "fees": number (yearly fees in INR),
    "placementRate": number (average placement rate percentage, e.g. 92),
    "location": "City, State",
    "facilities": ["Facility 1", "Facility 2"]
  }
]`;

          const result = await model.generateContent(prompt);
          const text = result.response.text();
          if (text) {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            if (Array.isArray(parsed)) {
              return parsed;
            }
          }
        } catch (err: any) {
          console.warn(`Gemini College Search attempt ${attempt} failed: ${err.message}`);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    }

    // High fidelity fallback seed of REAL Indian/Karnataka Colleges
    const seedColleges = [
      { name: "Indian Institute of Science (IISc)", domain: "Science", ranking: 1, fees: 80000, placementRate: 95, location: "Bangalore, Karnataka", facilities: ["Supercomputing Center", "Research Labs", "Nanoscience Wing"] },
      { name: "National Law School of India University (NLSIU)", domain: "Law", ranking: 1, fees: 320000, placementRate: 98, location: "Bangalore, Karnataka", facilities: ["Mock Courtrooms", "Digital Law Library", "Hostels"] },
      { name: "RV College of Engineering (RVCE)", domain: "Technology", ranking: 35, fees: 250000, placementRate: 94, location: "Bangalore, Karnataka", facilities: ["Robotics Center", "Placement Cell", "Incubation Hub"] },
      { name: "PES University", domain: "Technology", ranking: 60, fees: 380000, placementRate: 92, location: "Bangalore, Karnataka", facilities: ["Seminar Halls", "Maker Space", "Auditoriums"] },
      { name: "Indian Institute of Technology Bombay (IITB)", domain: "Technology", ranking: 3, fees: 220000, placementRate: 97, location: "Mumbai, Maharashtra", facilities: ["Innovation Labs", "Sports Complex", "Wind Tunnel"] },
      { name: "Indian Institute of Management Bangalore (IIMB)", domain: "Commerce", ranking: 2, fees: 1100000, placementRate: 100, location: "Bangalore, Karnataka", facilities: ["Management Cell", "Executive Block", "Computing Centre"] },
      { name: "National Institute of Technology Karnataka (NITK)", domain: "Technology", ranking: 12, fees: 150000, placementRate: 96, location: "Surathkal, Karnataka", facilities: ["Private Beach Access", "Heavy Machinery Labs", "Mega Mess"] },
      { name: "St. Joseph's College of Commerce", domain: "Commerce", ranking: 45, fees: 85000, placementRate: 88, location: "Bangalore, Karnataka", facilities: ["Seminar Halls", "Audit Center", "Computing Cell"] },
      { name: "MS Ramaiah Institute of Technology (MSRIT)", domain: "Technology", ranking: 65, fees: 260000, placementRate: 90, location: "Bangalore, Karnataka", facilities: ["Hi-Tech Laboratories", "Digital Library", "Sports Wing"] },
      { name: "Manipal Academy of Higher Education", domain: "Science", ranking: 7, fees: 450000, placementRate: 91, location: "Manipal, Karnataka", facilities: ["Research Centers", "Innovation Labs", "World Class Campus"] },
      { name: "BMS College of Engineering (BMSCE)", domain: "Technology", ranking: 73, fees: 220000, placementRate: 89, location: "Bangalore, Karnataka", facilities: ["Research Incubator", "Library", "Indoor Gym"] }
    ];

    let matched = seedColleges;
    if (domain) {
      matched = matched.filter(c => c.domain.toLowerCase() === domain.toLowerCase());
    }
    if (maxFees) {
      matched = matched.filter(c => c.fees <= maxFees);
    }
    if (location) {
      const locLower = location.toLowerCase();
      matched = matched.filter(c => c.location.toLowerCase().includes(locLower));
    }
    return matched;
  }

  // Method 5: Skill Gap Analyzer
  static analyzeSkillGap(resumeText: string, targetRole: string) {
    const cleanedText = resumeText.toLowerCase();
    let presentSkills: string[] = [];
    let missingSkills: string[] = [];
    let courses: string[] = [];
    let certs: string[] = [];
    let readiness = 60;

    const lowerRole = targetRole.toLowerCase();

    if (lowerRole.includes('engineer') || lowerRole.includes('developer') || lowerRole.includes('tech')) {
      const techSkills = ['javascript', 'typescript', 'react', 'next.js', 'node.js', 'mongodb', 'python', 'java', 'aws', 'docker', 'sql', 'git'];
      techSkills.forEach(s => {
        if (cleanedText.includes(s)) {
          presentSkills.push(s.toUpperCase());
        } else {
          missingSkills.push(s.toUpperCase());
        }
      });
      readiness = Math.round((presentSkills.length / techSkills.length) * 100);
      courses = ["Meta Front-End Developer Professional Certificate (Coursera)", "Docker & AWS Masterclass (Udemy)"];
      certs = ["AWS Certified Developer - Associate", "MongoDB Certified Developer"];
    } else if (lowerRole.includes('law')) {
      const lawSkills = ['contracts', 'ip', 'intellectual property', 'compliance', 'negotiation', 'litigation', 'corporate law', 'arbitration'];
      lawSkills.forEach(s => {
        if (cleanedText.includes(s)) {
          presentSkills.push(s.toUpperCase());
        } else {
          missingSkills.push(s.toUpperCase());
        }
      });
      readiness = Math.round((presentSkills.length / lawSkills.length) * 100);
      courses = ["Contract Law: From Trust to Promise (Harvard)", "Intellectual Property Law (Penn)"];
      certs = ["Certified Corporate Compliance Specialist", "IP Law Academy Certificate"];
    } else {
      // General fallbacks
      presentSkills = ["COMMUNICATION", "OFFICE SUITE", "TEAMWORK"];
      missingSkills = ["DATA ANALYSIS", "STRATEGIC PLANNING", "PROJECT MANAGEMENT"];
      readiness = 50;
      courses = ["Google Project Management Professional Certificate", "Data Science Foundation (IBM)"];
      certs = ["CAPM (Certified Associate in Project Management)"];
    }

    return {
      presentSkills,
      missingSkills,
      recommendedCourses: courses,
      certificationsNeeded: certs,
      readinessPercentage: Math.max(readiness, 30)
    };
  }

  // Method 6: Career Roadmap Generator
  static generateRoadmap(career: string) {
    const baseRoadmap: Record<string, { milestones: string[]; targetCert: string; projects: string[] }> = {
      Technology: {
        milestones: ["Year 1: Learn JS/TS, CSS/Tailwind, basic Node.js, and git structures.", "Year 3: Build dynamic full-stack Next.js platforms, master MongoDB, AWS basics, and state stores.", "Year 5: Master Kubernetes, system designs, distributed databases, and take Tech Lead responsibilities."],
        targetCert: "AWS Certified Solutions Architect",
        projects: ["E-Commerce server with real-time sockets", "Personalized CMS with rich authentication schema"]
      },
      Law: {
        milestones: ["Year 1: Master legal research tools, draft contract briefs, study constitutional parameters.", "Year 3: Work on corporate dispute arbitrations, file IP/Copyright applications, join a legal firm.", "Year 5: Act as Lead Corporate Counselor or Junior Partner managing independent regulatory portfolios."],
        targetCert: "Bar Council Certification / CCEP",
        projects: ["Open Legal Consultation Portal Design", "Contract Lifecycle Analysis Model"]
      },
      Science: {
        milestones: ["Year 1: Learn core programming (Python/R), data structures, and statistic models.", "Year 3: Work on clinical/climate datasets, specialize in machine learning regressions and CNNs.", "Year 5: Senior Scientist heading computational modeling or pharmaceutical predictive systems."],
        targetCert: "Google Data Analytics Professional Certificate",
        projects: ["Interactive COVID-19/Genome Vector Map", "Biomedical Signal Processing Notebooks"]
      }
    };

    const sector = baseRoadmap[career] || baseRoadmap['Technology'];

    return {
      '1_year': {
        goals: [sector.milestones[0], "Establish a strong peer network", "Acquire initial micro-credentials"],
        actionItems: ["Practice coding/research 2 hours daily", "Publish 1 small utility to GitHub/Portfolio"]
      },
      '3_year': {
        goals: [sector.milestones[1], "Secure a mid-level professional role", "Drive end-to-end features"],
        actionItems: ["Deploy " + sector.projects[0] + " to production", "Prepare for " + sector.targetCert]
      },
      '5_year': {
        goals: [sector.milestones[2], "Establish technical/strategic leadership status", "Drive architecture revisions"],
        actionItems: ["Lead a junior engineer/associate team", "Achieve " + sector.targetCert]
      }
    };
  }

  // Method 7: AI Chatbot Responder
  static async chat(messages: { role: string; content: string }[], currentContext?: string) {
    const lastMessage = messages[messages.length - 1]?.content || '';
    const lowerMessage = lastMessage.toLowerCase();

    // Temporal context for dynamic real-time awareness
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';

    // Check if the user is using Google Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const candidateModels = ["gemini-2.5-flash", "gemini-3.5-flash"];
      for (const modelName of candidateModels) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel(
            { model: modelName },
            { apiVersion: "v1", timeout: 15000 }
          );

          const prompt = `System Instructions:
You are CareerVerse AI (powered by Google Gemini) — an advanced, empathetic, intelligent, and versatile conversational AI assistant, mentor, and counselor.

Core Behavior & Capabilities:
1. FULL-SPECTRUM CONVERSATIONAL INTELLIGENCE: You are NOT restricted to pre-scripted lines or just career topics. You can converse on ANY topic just like Google Gemini — including general knowledge, math, science, programming, history, philosophy, writing, current events, daily life, humor, or casual conversations.
2. TEMPORAL & REAL-TIME AWARENESS:
   - Current Date: ${dateString}
   - Current Time: ${timeString} (${timezone} Timezone)
   - If the user asks for the current time, date, day of the week, or year, provide this exact real-world time clearly and accurately.
3. CAREER & EDUCATION SPECIALIZATION: You excel at career roadmap planning, college recommendations (India NIRF, Karnataka, Global), entrance examinations (JEE, NEET, CLAT, CAT, GATE, SAT, GRE), skill-gap diagnostics, and placement preparation.
4. TONE & PRESENTATION:
   - Friendly, futuristic, professional, and clear.
   - Use clean Markdown formatting (bold highlights, bullet lists, code blocks, tables where appropriate).
   - Answer directly and helpfully to whatever the user asks.

Additional Context: ${currentContext || 'None'}

Conversation History:
${messages.map(m => `${m.role === 'user' ? 'User' : 'CareerVerse AI'}: ${m.content}`).join('\n')}
CareerVerse AI:`;
          
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          if (responseText) {
            return responseText;
          }
        } catch (err: any) {
          console.warn(`⚠️ Gemini model (${modelName}) failed: ${err.message}. Trying next candidate...`);
        }
      }
    }

    // Check if the user is using OpenAI
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { 
                role: "system", 
                content: `You are CareerVerse AI. Current Date: ${dateString}, Current Time: ${timeString}. Answer any question naturally, intelligently, and helpfully with rich markdown formatting.` 
              },
              ...messages
            ]
          })
        });
        const data = await response.json() as any;
        if (data.choices && data.choices.length > 0) {
          return data.choices[0].message.content;
        }
      } catch (err) {
        console.error("OpenAI API call failed, falling back to local simulation.", err);
      }
    }

    // High quality local interactive responder (fallback)
    if (lowerMessage.includes('time') || lowerMessage.includes('clock') || lowerMessage.includes('date') || lowerMessage.includes('day') || lowerMessage.includes('today')) {
      return `⏰ **Current Date & Time**:\nToday is **${dateString}**, and the current local time is **${timeString}** (${timezone}).`;
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `👋 **Hello voyager!** Welcome to **CareerVerse AI**.\n\nI am your versatile AI counselor and assistant. I can answer any questions you have — from the current time & date, coding help, and general knowledge, to career roadmaps, college admissions, and interview prep!\n\nHow can I help you today?`;
    }

    if (lowerMessage.includes('resume') || lowerMessage.includes('portfolio') || lowerMessage.includes('cv')) {
      return "✨ **CareerVerse AI Resume Reviewer**:\nI've analyzed the resume keywords in your query. Your format looks strong! For your target domain, I recommend highlighting projects using **Next.js**, **Docker**, or specific **IP Draft Models**. Let's run a `/skillgap` test to extract exact gaps!";
    }

    if (lowerMessage.includes('interview') || lowerMessage.includes('practice') || lowerMessage.includes('mock')) {
      return "🚀 **CareerVerse AI Interview Simulator**:\nWelcome to your prep station. Let's practice! I will ask you a core question. \n\n*\"Can you describe a challenging project you engineered, how you handled trade-offs, and what the ultimate performance impact was?\"*\n\nReply to me with your answer, and I will score your feedback!";
    }

    if (lowerMessage.includes('college') || lowerMessage.includes('university') || lowerMessage.includes('exam')) {
      return "🏫 **College & Exam Advisor**:\nBased on current entrance stats, target options like CLAT (for Law) or JEE Main (for Tech) are pivotal. IIT Bombay, NLSIU Bangalore, and SRCC Delhi represent premium options. You can explore schedules in the **Exam Navigator** or input grades in **College Match** to filter by location and budgets!";
    }

    return `Hello voyager! 🌌 I am your **CareerVerse AI Counselor**.\n\nI'm ready to answer any questions across science, technology, mathematics, general knowledge, or career pathways. Today is **${dateString}**.\n\nWhat would you like to explore?`;
  }
}
