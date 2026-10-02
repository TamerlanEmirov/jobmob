export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';
export type ExperienceLevel = 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  applicant?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
  salaryRange?: string;
  minSalary?: number;
  maxSalary?: number;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  companyName?: string; // Single property fallback üçün
  company?: {
    name: string;
    category?: string;
  };
  applications?: Application[]; // İşəgötürən görünüşü üçün müraciətlər siyahısı
}

export interface CreateJobInput {
  title: string;
  description: string;
  location?: string;
  employmentType?: EmploymentType;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  skills?: string[];
  responsibilities?: string[];
  requirements?: string[];
  minSalary?: number;
  maxSalary?: number;
  salaryRange?: string;
}

export type UpdateJobInput = Partial<CreateJobInput>;