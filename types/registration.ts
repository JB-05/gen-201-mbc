export type TeamMember = {
    name: string;
    gender: 'male' | 'female' | 'other';
    grade: '11' | '12';
    phone: string;
    email: string;
    foodPreference?: 'veg' | 'non-veg' | 'none';
};

export type RegistrationFormData = {
    teamName: string;
    school: string;
    district: string;
    teamLead: TeamMember;
    teamMembers: TeamMember[];
};
