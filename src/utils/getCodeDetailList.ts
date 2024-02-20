import { axiosInstance } from '../apis/lib/axios';

export interface codeDetailItem {
	id: number;
	detailName: string;
	detailDescription: string;
	imgUrl: string;
}

export const getCodeDetailList = async (codeName: string): Promise<codeDetailItem[]> => {
	try {
		const response = await axiosInstance.get(`/codes/details/${codeName}`, {});
		if (response.data.status === 'OK') {
			return response.data.data;
		}
	} catch (error) {}

	return [];
};
