/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import '../../styles/my-project-card.scss';
import { LineProgressBar } from '@frogress/line';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../apis/lib/axios.ts';
import ImageWithFallback from '../../utils/DefaultImgage.tsx';
import { MenuProps } from '../../pages/myproject/MyProject.tsx';

/**
 * 필요정보
 * 프로젝트ID
 * 프로젝트 제목
 * 프로젝트 시작일
 * 프로젝트 종료일
 * 프로젝트 이미지 주소
 *  https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/5dXQ/image/fozCucJjp0u3RvWPLxWWf6NVbSI
 * 프로젝트 참여 인원수
 * 프로젝트 상태코드
 * 프로젝트 진행도 => 종료일 - 오늘 날짜 ... 프로그레스바 라이브러리 찾기
 */
interface ParticipationProjectsProps {
	selectItem: MenuProps | undefined;
}

interface ProjectItem {
	projectId: number;
	title: string;
	startDay: string;
	endDay: string;
	projectImgUrl: string;
	joinTotal: number;
	statusCode: {
		id: number;
		detailName: string;
		detailDescription: string;
		imgUrl: string;
	};
	progress: number;
}

const CustomLabelComponent = ({ percent }: { percent: number }) => {
	return (
		<div className='custom-label'>
			<span>{percent}%</span>
		</div>
	);
};

const useProjectList = (api: string) => {
	// let memberId = 0;
	//
	// // 로컬 스토리지에서 userProfile을 가져옴
	// const userProfileKey = 'userProfile';
	// const userProfileString = localStorage.getItem(userProfileKey);
	// if (userProfileString) {
	//     const userProfile = JSON.parse(userProfileString);
	//     memberId = userProfile.id;
	// }

	const [myProjectList, setMyProjectList] = useState<ProjectItem[]>([]); // 내가 참여중인 프로젝트 리스트
	const getProjectList = async () => {
		try {
			// const response = await axiosInstance.get(`/projects/myproject/${memberId}`, {});
			const response = await axiosInstance.get(api, {});
			// const response = await axiosInstance.get('/projects/myproject/5', {});
			if (response.data.status === 'OK') {
				const data: ProjectItem[] = response.data.data;
				setMyProjectList(data);
			}
		} catch (error) {}
	};

	useEffect(() => {
		getProjectList();
	}, [api]);

	return myProjectList;
};

const ParticipationProjects: React.FC<ParticipationProjectsProps> = ({ selectItem }) => {
	const myProjectList = useProjectList(selectItem?.api || '');

	return (
		<div className={'p-card-container'}>
			{myProjectList.map((data, index) => (
				<article key={index} className={'project-link'}>
					<Link to={`/project/${data.projectId}`}>
						{/*이미지 영역*/}
						<div className={'img-box flex justify-center'}>
							<ImageWithFallback src={data.projectImgUrl} alt={''} type={'project'} style={''} />
							{/*<img src={`${data.projectImgUrl}`} alt="이미지없음"/>*/}
						</div>
						{/*컨텐츠 영역*/}
						<div className={'p-3 project-content'}>
							{/*제목*/}
							<div>
								<h1 className={'truncate text-2xl text-cyan-700 font-bold'}>{data.title}</h1>
							</div>
							{/*프로젝트진행일*/}
							{/*프로젝트상태 & N명 참여중*/}
							<div className={'text-gray-500 text-sm'}>
								{/*<p>📆 {data.startDay} ~ {data.endDay}</p>*/}
								<p>📆 {data.startDay && data.endDay ? `${data.startDay} ~ ${data.endDay}` : '미정'}</p>
							</div>
							<div>
								<p className={'text-gray-500 text-sm'}> 👩‍💻 {data.joinTotal}명 참여중</p>
								<p>{data.statusCode.detailDescription}</p>
							</div>
							{/*프로그레스바*/}
							<div>
								<LineProgressBar
									label={(value: number) => <CustomLabelComponent percent={value} />}
									percent={data.progress}
									progressColor='linear-gradient(to right, rgb(18, 216, 250) 25%, rgb(67, 164, 255) 85%, rgb(49, 121, 255) 98%)'
									containerColor='#e9ecef'
									height={20}
								/>
							</div>
						</div>
					</Link>
				</article>
			))}
		</div>
	);
};
export default ParticipationProjects;
