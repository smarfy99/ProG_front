import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../apis/lib/axios';
import { useUserStore } from '../../stores/useUserStore';
import { useParams } from 'react-router-dom';
import { useDetailCodes } from '../../hooks/useDetailCodes';
import ImageWithFallback from '../../utils/DefaultImgage.tsx';
import '../../styles/component/project-application-status.scss';
import { useRequireAuth } from '../../hooks/useRequireAuth.ts';

interface Props {
	modalOpen: boolean;
	setModalOpen: (value: boolean) => void;
	memberDataList: MemberData[];
	onUpdate: (statusYN: boolean) => void;
	// onKPTUpdate: () => void;
}

export interface MemberData {
	member: {
		id: number;
		email: string;
		nickname: string;
		imgUrl: string;
	};
	jobCode: {
		id: number;
		detailName: string;
		detailDescription: string;
		imgUrl: string;
	};
}

interface DetailCodeData {
	id: number;
	detailName: string;
}

const ProjectApplicationStatus: React.FC<Props> = ({
	modalOpen,
	setModalOpen,
	// onKPTUpdate,
	memberDataList,
	onUpdate,
}): ReactElement => {
	useRequireAuth();
	const { profile } = useUserStore();
	const memberId = profile?.id;
	const { projectId } = useParams();

	const modalBackground = useRef<HTMLDivElement>(null);
	const [selectedSection, setSelectedSection] = useState<string | null>('Keep');
	const [textareaValue, setTextareaValue] = useState<string>('');
	const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
	const [nextSection, setNextSection] = useState<string | null>(null);
	const [applicationStatus, setApplicationStatus] = useState<MemberData[]>(memberDataList);

	const closeModalAndClearText = () => {
		setModalOpen(false); // 모달 닫기
		setTextareaValue(''); // 텍스트 영역 초기화
	};

	useEffect(() => {
		setApplicationStatus(memberDataList);
	}, [memberDataList, modalOpen]);

	const afterClick = () => {
		onUpdate(true);
	};

	const accept = async (acceptMemberId: number) => {
		try {
			const response = await axiosInstance.post(
				`/projects/${projectId}/acceptMember/${memberId}?acceptMemberId=${acceptMemberId}`,
			);
			// 멤버 재탐색
			// getData();
			// getApplyList();
			afterClick();
		} catch (error) {}
	};

	const refuse = async (refuseMemberId: number) => {
		try {
			const response = await axiosInstance.delete(
				`/projects/${projectId}/refuseMember/${memberId}?refuseMemberId=${refuseMemberId}`,
			);
			// 멤버 재탐색
			// getApplyList();
			afterClick();
		} catch (error) {}
	};

	const handleSectionClick = (section: string) => {
		if (textareaValue) {
			setShowConfirmationModal(true);
			setNextSection(section);
		} else {
			setSelectedSection(section);
		}
	};

	const confirmSectionChange = () => {
		setSelectedSection(nextSection);
		setTextareaValue('');
		setShowConfirmationModal(false);
	};

	const getBorderColorClass = () => {
		switch (selectedSection) {
			case 'Keep':
				return 'border-green-500'; // 초록색 테두리
			case 'Problem':
				return 'border-red-500'; // 빨간색 테두리
			case 'Try':
				return 'border-main-color'; // 메인 색상 테두리
			default:
				return 'border-main-color'; // 기본 테두리 색상
		}
	};

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const inputValue = e.target.value;
		if (inputValue.length > 50) {
			setTextareaValue(inputValue.slice(0, 50));
		} else {
			setTextareaValue(inputValue);
		}
	};

	return (
		<div>
			{modalOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10'
					ref={modalBackground}
					onClick={(e) => {
						if (e.target === modalBackground.current) {
							closeModalAndClearText(); // 모달 닫고 텍스트 초기화
						}
					}}
				>
					<div className='bg-white p-5 rounded-lg shadow-lg w-11/12 max-w-2xl modal-container'>
						<ul className={'grid gap-x-4 gap-y-3 grid-cols-3 '}>
							{memberDataList.map((member, index) => (
								<li key={index} className={'flex justify-center'}>
									<div className={'app-member-card p-5 text-xl'}>
										<div className={'app-member-img-box '}>
											<div>
												<ImageWithFallback src={`${member.member.imgUrl}`} alt={''} type={'member'} />
											</div>
											<div>
												<p className={'truncate text-center'}>{member.member.nickname}</p>
											</div>
										</div>
										<div className={'flex flex-col gap-x-4 justify-center items-center'}>
											<p className={'app-tag'}>직무</p>
											<p className={'mt-1'}>{member.jobCode.detailDescription}</p>
										</div>
										<div className={'flex justify-between'}>
											<button className={'app-home-btn'} onClick={() => accept(member.member.id)}>
												승인
											</button>
											<button className={'app-home-btn'} onClick={() => refuse(member.member.id)}>
												거절
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
			{showConfirmationModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20'>
					<div className='bg-white p-5 rounded-lg shadow-lg'>
						<p>진짜 초기화할까요?</p>
						<div className='flex mt-4'>
							<button className='flex-1 border-2 border-indigo-700 mr-2' onClick={confirmSectionChange}>
								확인
							</button>
							<button className='flex-1 border-2 border-red-600' onClick={() => setShowConfirmationModal(false)}>
								취소
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProjectApplicationStatus;
