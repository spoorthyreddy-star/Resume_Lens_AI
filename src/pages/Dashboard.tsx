
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  UploadCloud, 
  FileText, 
  BarChart3, 
  Zap, 
  Sparkles, 
  PenTool, 
  FileQuestion, 
  QrCode,
  Plus,
  PlusCircle,
  FileSearch
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseResume } from '@/utils/resumeAnalysis';
import ResumeVisualizer from '@/components/resume/ResumeVisualizer';
import QRCodeGenerator from '@/components/resume/QRCodeGenerator';
import SkillGapAnalysis from '@/components/resume/SkillGapAnalysis';
import CoverLetterGenerator from '@/components/resume/CoverLetterGenerator';
import ResumeJobMatcher from '@/components/resume/ResumeJobMatcher';
import ResumeSuggestions from '@/components/resume/ResumeSuggestions';

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [resumeScore, setResumeScore] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle drag events for the drop zone
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('border-primary');
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('border-primary');
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('border-primary');
      
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (validateResumeFile(file)) {
          handleResumeUpload(file);
        }
      }
    };

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);

  const validateResumeFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (validateResumeFile(file)) {
      handleResumeUpload(file);
    }
  };

  const handleResumeUpload = async (file: File) => {
    setResumeFile(file);
    setIsUploading(true);
    
    try {
      // Parse the resume
      const data = await parseResume(file);
      setResumeData(data);
      
      // Calculate a random score between 60 and 95
      const score = Math.floor(Math.random() * 36) + 60;
      setResumeScore(score);
      
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded and analyzed successfully.",
      });
      
      // Switch to the resumes tab
      setActiveTab('resumes');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left sidebar - Dashboard navigation */}
          <aside className="w-full md:w-64 lg:w-72">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Manage your resume and applications</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1 px-2 pb-4">
                  <Button 
                    variant={activeTab === 'overview' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('overview')}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Overview
                  </Button>
                  <Button 
                    variant={activeTab === 'resumes' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('resumes')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    My Resumes
                  </Button>
                  <Button 
                    variant={activeTab === 'matches' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('matches')}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Job Matches
                  </Button>
                  <Button 
                    variant={activeTab === 'improvements' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('improvements')}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Resume Improvements
                  </Button>
                  <Button 
                    variant={activeTab === 'coverletters' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('coverletters')}
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    Cover Letters
                  </Button>
                  <Button 
                    variant={activeTab === 'skills' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('skills')}
                  >
                    <FileQuestion className="mr-2 h-4 w-4" />
                    Skill Gap Analysis
                  </Button>
                  <Button 
                    variant={activeTab === 'qr' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('qr')}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    QR Codes
                  </Button>
                  <Button 
                    variant={activeTab === 'visualize' ? "default" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('visualize')}
                  >
                    <FileSearch className="mr-2 h-4 w-4" />
                    Resume Visualization
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main content area */}
          <main className="flex-1 space-y-6">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Overview tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="dashboard-card">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Resume Score</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-14 w-14 flex items-center justify-center">
                          <svg className="h-14 w-14 transform -rotate-90">
                            <circle
                              cx="28"
                              cy="28"
                              r="22"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className="text-muted"
                            />
                            <circle
                              cx="28"
                              cy="28"
                              r="22"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray="138.2"
                              strokeDashoffset={138.2 - (138.2 * (resumeData ? resumeScore : 0)) / 100}
                              className="text-primary"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center font-semibold text-lg">
                            {resumeData ? `${resumeScore}%` : '0%'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {resumeData 
                              ? resumeScore > 80 
                                ? "Your resume score is excellent!"
                                : resumeScore > 60
                                ? "Your resume score is above average but has room for improvement."
                                : "Your resume needs improvement. Check our suggestions."
                              : "Upload your resume to get a score."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="dashboard-card">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Job Matches</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-semibold">{resumeData ? "12" : "0"}</div>
                        <div className="text-sm text-muted-foreground">
                          {resumeData 
                            ? "Potential job matches found based on your resume" 
                            : "Upload your resume to find matching jobs"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="dashboard-card">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">Improvement Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-semibold">{resumeData ? "7" : "0"}</div>
                        <div className="text-sm text-muted-foreground">
                          {resumeData 
                            ? "Suggestions to improve your resume's impact" 
                            : "Upload your resume to get improvement tips"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="dashboard-card">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle>Upload Your Resume</CardTitle>
                    <CardDescription>
                      Upload your resume to get AI-powered analysis and improvement suggestions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div 
                      ref={dropZoneRef}
                      className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center transition-colors"
                    >
                      <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold">Drag & drop your resume here</h3>
                        <p className="text-sm text-muted-foreground">
                          Support for PDF, DOCX, TXT (Max 5MB)
                        </p>
                      </div>
                      <div className="mt-4">
                        <label htmlFor="resume-upload">
                          <input
                            id="resume-upload"
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileSelection}
                            disabled={isUploading}
                          />
                          <Button
                            variant="default"
                            className="mt-2"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {isUploading ? "Uploading..." : "Select File"}
                          </Button>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {resumeData && (
                  <Card className="dashboard-card">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle>Skills Analysis</CardTitle>
                      <CardDescription>
                        Based on your resume and target industry
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Technical Skills</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Soft Skills</span>
                          <span className="font-medium">60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Leadership</span>
                          <span className="font-medium">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Industry-Specific</span>
                          <span className="font-medium">80%</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Resumes tab */}
              <TabsContent value="resumes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>My Resumes</CardTitle>
                      <Button onClick={() => setActiveTab('overview')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Resume
                      </Button>
                    </div>
                    <CardDescription>
                      Manage all your resume versions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-t border-border">
                      <div className="divide-y divide-border">
                        {resumeFile ? (
                          <div className="px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-semibold">{resumeFile.name}</h4>
                                <p className="text-sm text-muted-foreground">Uploaded just now</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setActiveTab('visualize')}
                              >
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setActiveTab('improvements')}
                              >
                                Improve
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="px-6 py-8 text-center">
                            <p className="text-muted-foreground">No resumes uploaded yet</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setActiveTab('overview')}
                            >
                              Upload Your First Resume
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {resumeData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Details</CardTitle>
                      <CardDescription>
                        Information extracted from your resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold">{resumeData.name}</h3>
                          <p className="text-muted-foreground">{resumeData.email}{resumeData.phone ? ` • ${resumeData.phone}` : ''}</p>
                        </div>
                        
                        {resumeData.summary && (
                          <div>
                            <h4 className="font-medium mb-1">Professional Summary</h4>
                            <p className="text-sm text-muted-foreground">{resumeData.summary}</p>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-medium mb-2">Experience</h4>
                          <div className="space-y-3">
                            {resumeData.experience.map((exp: any, index: number) => (
                              <div key={index} className="border rounded-lg p-3">
                                <div className="flex justify-between">
                                  <h5 className="font-semibold">{exp.title}</h5>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                                    {exp.endDate === 'Present' ? ' Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                                <ul className="mt-2 text-sm space-y-1">
                                  {exp.description.map((desc: string, i: number) => (
                                    <li key={i} className="list-disc ml-4 text-muted-foreground">{desc}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill: any, index: number) => (
                              <span key={index} className="px-2 py-1 rounded-full bg-muted text-sm">
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Education</h4>
                          <div className="space-y-3">
                            {resumeData.education.map((edu: any, index: number) => (
                              <div key={index} className="border rounded-lg p-3">
                                <div className="flex justify-between">
                                  <h5 className="font-semibold">{edu.degree} in {edu.field}</h5>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                                    {new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('overview')}>
                        Upload New Version
                      </Button>
                      <Button onClick={() => setActiveTab('improvements')}>
                        Get Improvement Suggestions
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
              
              {/* Job Matches tab */}
              <TabsContent value="matches">
                <ResumeJobMatcher resumeData={resumeData} />
              </TabsContent>
              
              {/* Resume Improvements tab */}
              <TabsContent value="improvements">
                <ResumeSuggestions resumeData={resumeData} />
              </TabsContent>
              
              {/* Cover Letters tab */}
              <TabsContent value="coverletters">
                <CoverLetterGenerator resumeData={resumeData} />
              </TabsContent>
              
              {/* Skill Gap Analysis tab */}
              <TabsContent value="skills">
                <SkillGapAnalysis resumeData={resumeData} />
              </TabsContent>
              
              {/* QR Codes tab */}
              <TabsContent value="qr">
                <QRCodeGenerator resumeData={resumeData} />
              </TabsContent>
              
              {/* Resume Visualization tab */}
              <TabsContent value="visualize">
                <ResumeVisualizer resumeData={resumeData} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
