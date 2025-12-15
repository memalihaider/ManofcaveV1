import { create } from 'zustand';

export interface TeamMember {
  id: string;
  name: string;
  specialty: string;
  branchId: string;
  image: string;
  rating: number;
  experience: string;
  status: 'active' | 'inactive';
}

interface TeamStore {
  teamMembers: TeamMember[];
  getTeamMembersByBranch: (branchId?: string) => TeamMember[];
  getAllTeamMembers: () => TeamMember[];
}

// Mock team member data
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    specialty: 'Master Barber & Hair Stylist',
    branchId: 'alwahda',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    experience: '10 years',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    specialty: 'Hair Color Specialist',
    branchId: 'alwahda',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    experience: '7 years',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mohammed Al-Farsi',
    specialty: 'Beard & Grooming Expert',
    branchId: 'madinat',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    experience: '12 years',
    status: 'active'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    specialty: 'Nail & Beauty Specialist',
    branchId: 'madinat',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.7,
    experience: '6 years',
    status: 'active'
  },
  {
    id: '5',
    name: 'Omar Al-Mansoori',
    specialty: 'Traditional Cuts & Shaves',
    branchId: 'khalifa',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    experience: '15 years',
    status: 'active'
  },
  {
    id: '6',
    name: 'Lisa Chen',
    specialty: 'Hair Treatment Expert',
    branchId: 'khalifa',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    experience: '9 years',
    status: 'active'
  },
  {
    id: '7',
    name: 'Khalid Al-Hamad',
    specialty: 'Men\'s Grooming Specialist',
    branchId: 'marina-mall',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    experience: '11 years',
    status: 'active'
  },
  {
    id: '8',
    name: 'Anna Rodriguez',
    specialty: 'Makeup & Beauty Artist',
    branchId: 'marina-mall',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.7,
    experience: '8 years',
    status: 'active'
  },
  {
    id: '9',
    name: 'Rashid Al-Zaabi',
    specialty: 'Luxury Spa Treatments',
    branchId: 'wtc',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    experience: '13 years',
    status: 'active'
  },
  {
    id: '10',
    name: 'Maria Gonzalez',
    specialty: 'Hair Extension Specialist',
    branchId: 'wtc',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    experience: '10 years',
    status: 'active'
  },
  {
    id: '11',
    name: 'Hamad Al-Suwaidi',
    specialty: 'Executive Styling',
    branchId: 'salam-street',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    experience: '14 years',
    status: 'active'
  },
  {
    id: '12',
    name: 'Sophie Taylor',
    specialty: 'Bridal Hair & Makeup',
    branchId: 'salam-street',
    image: 'https://images.unsplash.com/photo-1594824804732-ca8db723f8fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    rating: 4.9,
    experience: '11 years',
    status: 'active'
  }
];

export const useTeamStore = create<TeamStore>((set, get) => ({
  teamMembers: mockTeamMembers,

  getTeamMembersByBranch: (branchId?: string) => {
    const { teamMembers } = get();
    if (!branchId) return teamMembers;
    return teamMembers.filter(member => member.branchId === branchId);
  },

  getAllTeamMembers: () => {
    return get().teamMembers;
  }
}));