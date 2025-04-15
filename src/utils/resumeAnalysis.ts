
// AI-powered resume analysis utilities

interface ResumeData {
  name: string;
  email: string;
  phone?: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  summary?: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Experience {
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string[];
}

interface Skill {
  name: string;
  level?: number; // 1-10
  category?: string;
}

interface JobPosting {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  preferredSkills?: string[];
}

// Simulating resume parsing functionality
export const parseResume = (file: File): Promise<ResumeData> => {
  return new Promise((resolve) => {
    // In a real application, we would send the file to an API
    // For simulation, we'll resolve with mock data after a delay
    setTimeout(() => {
      const mockResumeData: ResumeData = {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "555-123-4567",
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2016-09-01",
            endDate: "2020-05-30"
          }
        ],
        experience: [
          {
            company: "Tech Solutions Inc.",
            title: "Software Developer",
            location: "San Francisco, CA",
            startDate: "2020-06-15",
            endDate: "2023-02-28",
            description: [
              "Developed and maintained web applications using React and Node.js",
              "Implemented RESTful APIs and optimized database queries",
              "Collaborated with cross-functional teams to deliver projects on time"
            ]
          },
          {
            company: "Digital Innovations",
            title: "Junior Developer",
            location: "San Francisco, CA",
            startDate: "2019-05-01",
            endDate: "2020-06-01",
            description: [
              "Assisted in developing front-end components using React",
              "Participated in code reviews and testing",
              "Fixed bugs and implemented minor features"
            ]
          }
        ],
        skills: [
          { name: "JavaScript", level: 9, category: "Programming" },
          { name: "React", level: 8, category: "Frontend" },
          { name: "Node.js", level: 7, category: "Backend" },
          { name: "TypeScript", level: 8, category: "Programming" },
          { name: "SQL", level: 6, category: "Database" },
          { name: "Git", level: 8, category: "Tools" },
          { name: "Agile Methodology", level: 7, category: "Process" },
          { name: "Problem Solving", level: 9, category: "Soft Skills" },
        ],
        summary: "Dedicated software developer with 3+ years of experience building web applications with modern JavaScript frameworks. Passionate about creating clean, efficient code and learning new technologies."
      };
      
      resolve(mockResumeData);
    }, 2000);
  });
};

// Resume-Job matching functionality
export const matchResumeToJob = (resume: ResumeData, job: JobPosting): number => {
  // In a real application, this would use AI to compare skills, experience, etc.
  // For simulation, we'll use a simple algorithm
  
  let score = 0;
  const maxScore = 100;
  
  // Check if skills match requirements
  const resumeSkills = resume.skills.map(skill => skill.name.toLowerCase());
  const jobRequirements = job.requirements.map(req => req.toLowerCase());
  
  // Calculate skill match percentage
  let matchedSkills = 0;
  jobRequirements.forEach(req => {
    if (resumeSkills.some(skill => req.includes(skill) || skill.includes(req))) {
      matchedSkills++;
    }
  });
  
  const skillMatchPercentage = jobRequirements.length > 0 
    ? (matchedSkills / jobRequirements.length) * 60 
    : 0;
  
  // Check experience relevance
  const experienceScore = Math.min(resume.experience.length * 10, 30);
  
  // Final score
  score = Math.min(skillMatchPercentage + experienceScore + 10, maxScore);
  
  return Math.round(score);
};

// Analyze resume for improvements
export const analyzeResume = (resume: ResumeData): string[] => {
  const suggestions: string[] = [];
  
  // Check for summary
  if (!resume.summary || resume.summary.length < 50) {
    suggestions.push("Add a more detailed professional summary to highlight your expertise and career goals.");
  }
  
  // Check for skills
  if (resume.skills.length < 5) {
    suggestions.push("Add more skills relevant to your target positions.");
  }
  
  // Check for quantifiable achievements
  let hasQuantifiableResults = false;
  resume.experience.forEach(exp => {
    exp.description.forEach(desc => {
      if (/increased|decreased|improved|reduced|achieved|delivered|generated|saved|[\d]+%/i.test(desc)) {
        hasQuantifiableResults = true;
      }
    });
  });
  
  if (!hasQuantifiableResults) {
    suggestions.push("Add quantifiable achievements to your work experience (e.g., 'Increased sales by 20%').");
  }
  
  // Check for education details
  if (resume.education.length === 0) {
    suggestions.push("Add educational background to strengthen your profile.");
  }
  
  // Check for experience descriptions
  resume.experience.forEach((exp, index) => {
    if (exp.description.length < 2) {
      suggestions.push(`Add more details to your role at ${exp.company}.`);
    }
  });
  
  // If no suggestions, add a positive note
  if (suggestions.length === 0) {
    suggestions.push("Your resume looks well-structured! Consider customizing it for specific job applications.");
  }
  
  return suggestions;
};

// Generate cover letter based on resume and job
export const generateCoverLetter = (resume: ResumeData, job: JobPosting): string => {
  // In a real app, this would use AI to generate a custom cover letter
  // For simulation, we'll use a template
  
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `${today}

Dear Hiring Manager,

I am writing to express my interest in the ${job.title} position at ${job.company}. With my background in ${resume.experience[0]?.title || "software development"} and expertise in ${resume.skills.slice(0, 3).map(s => s.name).join(", ")}, I believe I would be a valuable addition to your team.

During my time at ${resume.experience[0]?.company || "my previous company"}, I ${resume.experience[0]?.description[0]?.toLowerCase() || "developed and maintained various software solutions"}. This experience has prepared me well for the challenges of the ${job.title} role.

I am particularly drawn to ${job.company} because of its reputation for ${job.description.includes("innovation") ? "innovation and cutting-edge technology" : "excellence and professional growth opportunities"}. My skills in ${resume.skills.slice(0, 2).map(s => s.name).join(" and ")} align perfectly with your requirements for this role.

I look forward to the opportunity to discuss how my background, skills, and experience would benefit ${job.company}. Thank you for considering my application.

Sincerely,
${resume.name}
${resume.email}
${resume.phone || ""}`;
};

// Identify skill gaps between resume and job requirements
export const analyzeSkillGaps = (resume: ResumeData, job: JobPosting): {
  missingSkills: string[];
  recommendations: { skill: string; course: string; provider: string; }[];
} => {
  const resumeSkills = resume.skills.map(skill => skill.name.toLowerCase());
  const requiredSkills = [...job.requirements, ...(job.preferredSkills || [])].map(skill => skill.toLowerCase());
  
  const missingSkills: string[] = [];
  
  requiredSkills.forEach(reqSkill => {
    // Check if the resume has this skill or something similar
    if (!resumeSkills.some(userSkill => 
      reqSkill.includes(userSkill) || 
      userSkill.includes(reqSkill) ||
      // Handle common variations like "JavaScript"/"JS" or "React"/"React.js"
      (reqSkill.replace('.js', '').replace('js', 'javascript') === userSkill.replace('.js', '').replace('js', 'javascript')))) {
      missingSkills.push(reqSkill);
    }
  });
  
  // Generate course recommendations for missing skills
  const recommendations = missingSkills.map(skill => {
    // In a real app, this would match to an actual course database
    // Simulated course recommendations
    const courseOptions = [
      { provider: "Coursera", course: `Complete ${skill} Masterclass` },
      { provider: "Udemy", course: `${skill} for Professionals` },
      { provider: "LinkedIn Learning", course: `${skill} Essential Training` },
      { provider: "edX", course: `Introduction to ${skill}` },
    ];
    
    const randomIndex = Math.floor(Math.random() * courseOptions.length);
    return {
      skill,
      course: courseOptions[randomIndex].course,
      provider: courseOptions[randomIndex].provider
    };
  });
  
  return {
    missingSkills,
    recommendations
  };
};

// Generate QR code data (in a real app, this would create an actual QR code)
export const generateResumeQRCode = (resume: ResumeData): { url: string; instructions: string } => {
  // In a real implementation, this would generate a QR code linking to an online version of the resume
  // For simulation, we'll return instructions
  
  return {
    url: `https://resumeapp.example/profile/${resume.name.toLowerCase().replace(/\s+/g, '-')}`,
    instructions: "Add this QR code to your printed resume or business card to provide recruiters with instant access to your online profile, portfolio, and contact information."
  };
};

// Sample job postings for testing
export const sampleJobPostings: JobPosting[] = [
  {
    title: "Frontend Developer",
    company: "Tech Innovations Inc.",
    description: "We are looking for a skilled Frontend Developer to join our product team. You will be responsible for building user interfaces for our web applications.",
    requirements: [
      "JavaScript", 
      "React",
      "HTML/CSS",
      "Responsive Design",
      "Git version control"
    ],
    preferredSkills: [
      "TypeScript",
      "Next.js",
      "Unit Testing",
      "UI/UX knowledge"
    ]
  },
  {
    title: "Full Stack Engineer",
    company: "Digital Solutions Ltd.",
    description: "Join our team to develop and maintain web applications across the full stack. You'll work on both frontend and backend components.",
    requirements: [
      "JavaScript",
      "Node.js",
      "React or Angular",
      "RESTful APIs",
      "SQL databases",
      "Git version control"
    ],
    preferredSkills: [
      "TypeScript",
      "Docker",
      "AWS or cloud services",
      "Agile development"
    ]
  },
  {
    title: "Backend Developer",
    company: "Data Systems Corp.",
    description: "We're seeking a Backend Developer to build and optimize our server-side applications and databases.",
    requirements: [
      "Node.js",
      "Express",
      "MongoDB or PostgreSQL",
      "RESTful API design",
      "Authentication and authorization"
    ],
    preferredSkills: [
      "GraphQL",
      "Redis",
      "Microservices architecture",
      "CI/CD pipelines"
    ]
  }
];
