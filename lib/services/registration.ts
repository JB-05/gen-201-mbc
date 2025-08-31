// Mock types to maintain type safety
type TeamInsert = {
    id?: string;
    team_name: string;
    school_name: string;
    school_district: string;
    lead_phone: string;
    lead_email: string;
    registration_status?: 'pending' | 'shortlisted' | 'rejected' | 'verified';
    created_at?: string;
    updated_at?: string;
};

type TeamMemberInsert = {
    id?: string;
    team_id: string;
    name: string;
    gender: 'male' | 'female' | 'other';
    grade: '11' | '12';
    phone: string;
    email: string;
    food_preference?: 'veg' | 'non_veg' | 'none';
    is_team_lead?: boolean;
    created_at?: string;
    updated_at?: string;
};

// Mock function to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock team name database
const existingTeamNames = new Set(['Team Alpha', 'Team Beta', 'Team Gamma']);

export async function checkTeamNameAvailability(teamName: string): Promise<boolean> {
    // Simulate API delay
    await delay(800);

    // Return true if team name is not in our mock database
    return !existingTeamNames.has(teamName);
}

export async function registerTeam(
    team: TeamInsert,
    teamMembers: Omit<TeamMemberInsert, 'team_id'>[]
): Promise<{ success: boolean; error?: string }> {
    try {
        // Simulate API delay
        await delay(1500);

        // Simulate validation
        if (existingTeamNames.has(team.team_name)) {
            throw new Error('Team name already exists');
        }

        // Simulate successful registration
        const mockTeamId = 'team_' + Math.random().toString(36).substr(2, 9);

        // Add team to mock database
        existingTeamNames.add(team.team_name);

        // Log registration data for demonstration
        console.log('Registration Successful:', {
            team: { ...team, id: mockTeamId },
            members: teamMembers.map(member => ({
                ...member,
                team_id: mockTeamId,
                id: 'member_' + Math.random().toString(36).substr(2, 9)
            }))
        });

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}