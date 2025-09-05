export interface TeamMember {
    name: string;
    gender: 'male' | 'female' | 'other';
    grade: '11' | '12';
    phone: string;
    email: string;
    foodPreference?: 'veg' | 'non-veg' | 'none';
}

export interface TeacherVerification {
    salutation: 'sir' | 'maam';
    name: string;
    phone: string;
}

export interface ProjectDetails {
    projectName: string;
    projectField: string;
    projectDescription: string;
    termsAccepted: boolean;
}

export interface RegistrationFormData {
    teamName: string;
    school: string;
    district: string;
    teamLead: TeamMember;
    teamMembers: TeamMember[];
    teacherVerification: TeacherVerification;
    projectDetails: ProjectDetails;
}