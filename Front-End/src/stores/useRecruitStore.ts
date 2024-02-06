import { create } from "zustand";

interface TechCode {
  id: number;
  detailName: string;
}

interface ProjectStatus {
  detailDescription: string;
  id: number;
  detailName: string;
}

interface SearchResult {
  id: number;
  title: string;
  projectImgUrl: string;
  statusCode: ProjectStatus;
  techCodes: TechCode[];
  total: number;
  current: number;
}

interface RecruitStore {
  searchResults: SearchResult[];
  updateSearchResults: (results: SearchResult[]) => void;
}

const useRecruitStore = create<RecruitStore>((set) => ({
  searchResults: [],
  updateSearchResults: (results) => set(() => ({ searchResults: results })),
}));

export default useRecruitStore;
