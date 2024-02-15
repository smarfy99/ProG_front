import { create } from 'zustand';

interface Feed {
	memberId: number;
	nickname: string;
	imgUrl: string;
	position: string;
	boardId: number;
	createdAt: string;
	isDeleted: boolean;
	title: string;
	viewCnt: number;
	isNotice: boolean;
}

interface FeedStore {
	getFeeds: Feed[];
	updateGetFeeds: (results: Feed[]) => void;
}

const useFeedStore = create<FeedStore>((set) => ({
	getFeeds: [],
	updateGetFeeds: (results) => set(() => ({ getFeeds: results })),
}));

export default useFeedStore;
