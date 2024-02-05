import { create } from 'zustand';

interface UserProfile {
	id: number;
	email: string;
	nickname: string;
	imgUrl: string;
}

interface UserState {
	profile: UserProfile | null;
	setProfile: (profile: UserProfile) => void;
}

export const useUserStore = create<UserState>((set) => ({
	profile: null,
	setProfile: (profile) => set({ profile: profile }),
}));
