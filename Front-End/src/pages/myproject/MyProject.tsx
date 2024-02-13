import React, { useEffect, useState } from 'react';
// import RecruitCard from "../../components/recruit/RecruitCard.tsx";
import ParticipationProjects from '../../components/mypage/ParticipationProjects.tsx';
import '../../styles/my-project-page.scss';
// import {axiosInstance} from "../../apis/lib/axios.ts";

interface MenuProps {
	statusCode: number;
	description: string;
	total: number;
	isActive?: boolean;
	api?: string;
}

// const getProjectList = async () => {
//     try {
//         const response = await axiosInstance.get(`/projects/hotProject`, {});
//         if (response.data.status === "OK") {
//             const data: ProjectItem[] = response.data.data;
//             const formattedData = data.map(item => ({
//                 ...item,
//                 createdAt: formatDate(item.createdAt),
//             }));
//
//             setProjectList(formattedData);
//         }
//         ProjectCarousel();
//     } catch (error) {
//         console.error("Loading failed:", error);
//     }
// }

const tempData: MenuProps[] = [
	{
		statusCode: 1,
		description: '전체',
		total: 5,
		isActive: true,
		api: 'http://localhost:8080/api/project/ongoing',
	},
	{
		statusCode: 2,
		description: '모집&진행중',
		total: 5,
		isActive: false,
		api: 'http://localhost:8080/api/project/completed',
	},
	{
		statusCode: 3,
		description: '완료',
		total: 5,
		isActive: false,
		api: 'http://localhost:8080/api/project/completed',
	},
	{
		statusCode: 4,
		description: '신청중',
		total: 5,
		isActive: false,
		api: 'http://localhost:8080/api/project/completed',
	},
];

const MyProject = () => {
	const [activeItem, setActiveItem] = useState<MenuProps[]>([]);
	const Menu = () => {
		const handleClick = (clickedItem: MenuProps) => {
			setActiveItem(
				activeItem.map((item) =>
					item.statusCode === clickedItem.statusCode ? { ...item, isActive: true } : { ...item, isActive: false },
				),
			);
			console.log('클릭');
			console.log(`받은 값: ${JSON.stringify(clickedItem)}`);
		};

		return (
			<ul id={'condition-menu'}>
				{activeItem.map((item, index) => (
					<li key={index} onClick={() => handleClick(item)} className={item.isActive ? 'active' : ''}>
						<button>
							<span>{item.description}</span>
							<span>({item.total})</span>
						</button>
					</li>
				))}
			</ul>
		);
	};

	useEffect(() => {
		setActiveItem(tempData);
	}, []);

	return (
		<React.StrictMode>
			<div className={'my-project-container'}>
				<header className='grid text-center'>
					{/*<div className="font-bold text-6xl">내가 참여중인 프로젝트</div>*/}
					<Menu />
				</header>
				<main className='grid gap-4'>
					{/*<main >*/}
					<ParticipationProjects />
				</main>
			</div>
		</React.StrictMode>
	);
};

export default MyProject;
