import { ChangeEvent, useEffect, useState } from 'react';
import { FaRegCircleUser, FaBoltLightning, FaBookBookmark, FaCalendarCheck, FaCheck } from 'react-icons/fa6';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ReactQuill 스타일시트 임포트
import { axiosInstance } from '../../apis/lib/axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import TaskDatePicker from '../calendar/TaskDatePicker';
import { useMultipleDetailCodes } from '../../hooks/useMultipleDataCodes';
import Chip from '@mui/material/Chip';

interface TaskDetail {
	workId?: number;
}

interface ModifyTaskProps {
	taskDetail: TaskDetail;
	onClose: () => void;
	onTaskUpdate: () => void;
}

interface ProjectMember {
	member: {
		id: number;
		nickname: string;
		imgUrl: string | null;
	};
	jobCode: {
		id: number;
		detailName: string;
		detailDescription: string;
		imgUrl: string | null;
		isUse: boolean;
	};
}

interface DetailCode {
	id: number;
	detailName: string;
	detailDescription: string;
	imgUrl?: string | null;
}

const ModifyTask: React.FC<ModifyTaskProps> = ({ taskDetail, onTaskUpdate }) => {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	const { projectId } = useParams<{ projectId: string; workId: string }>();
	const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
	const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
	const [selectedPriorityId, setSelectedPriorityId] = useState<number | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
	const [title, setTitle] = useState<string>('');
	const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
	const [editorContent, setEditorContent] = useState<string>('');
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const [, setId] = useState<string>('');
	const [nickname, setNickname] = useState<string>('');
	const [endDay, setEndDay] = useState(tomorrow);
	const [taskModified, setTaskModified] = useState<boolean>(false);
	const [confirmModal, setConfirmModal] = useState<boolean>(false);

	const { data: multipleDetailCodesData } = useMultipleDetailCodes(['workType', 'workPriority', 'WorkStatus']);
	const workTypes = multipleDetailCodesData?.[0] ?? [];
	const workPriorities = multipleDetailCodesData?.[1] ?? [];
	const WorkStatus = multipleDetailCodesData?.[2] ?? [];

	const getPrjMember = async () => {
		try {
			const response = await axiosInstance.get(`/projects/${projectId}/members`);
			setProjectMembers(response.data.data);
		} catch (error) {}
	};

	const modifyTask = async () => {
		const modifyTaskInfo = {
			statusCode: selectedStatusId,
			typeCode: selectedTypeId,
			priorityCode: selectedPriorityId,
			consumerId: selectedMemberId,
			title: title,
			content: editorContent,
			startDay: moment().format('YYYY-MM-DD'),
			endDay: moment(endDay).format('YYYY-MM-DD'),
		};

		if (!title || !selectedStatusId || !selectedMemberId || !selectedTypeId || !selectedPriorityId || !editorContent) {
			setShowModal(true); // 필요한 모든 필드가 입력되지 않았으므로 모달 표시
			return; // 함수를 여기서 종료시켜서, API 호출을 방지
		}

		try {
			await axiosInstance.patch(`/works/${taskDetail.workId}`, modifyTaskInfo, {
				headers: {
					'Content-Type': 'application/json', // 명시적으로 Content-Type 설정
				},
			});
			onTaskUpdate(); // 태스크 수정 작업이 성공했을 때 콜백 함수 호출
			setTaskModified(!taskModified);
			setConfirmModal(true);
			handleClose();
		} catch (error) {}
	};

	const handleMemberChange = (event: ChangeEvent<HTMLSelectElement>): void => {
		// 선택된 멤버 ID를 문자열로 상태 업데이트, 빈 문자열이면 null 처리
		setSelectedMemberId(event.target.value ? Number(event.target.value) : null);
	};

	const handleWorkStatusClick = (id: number) => {
		setSelectedStatusId(id);
	};

	const handleWorkTypeClick = (id: number) => {
		setSelectedTypeId(id);
	};

	const handleWorkPriorityClick = (id: number) => {
		setSelectedPriorityId(id);
	};

	const editorChange = (content: string) => {
		setEditorContent(content);
	};

	const handleClose = () => {
		setIsOpen(!isOpen);
	};

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);
	};

	useEffect(() => {
		// 로컬 스토리지에서 userProfile을 가져옴
		const userProfileString = localStorage.getItem('userProfile');
		if (userProfileString) {
			const userProfile = JSON.parse(userProfileString);
			setId(userProfile.id); // 닉네임 상태 업데이트
			setNickname(userProfile.nickname);
		}

		getPrjMember();
	}, []);

	const closeModal = () => {
		setShowModal(false);
		setConfirmModal(false);
	};

	const chipStyle = (isSelected: boolean) => ({
		margin: 0.5,
		color: isSelected ? '#fff' : '#000',
		backgroundColor: isSelected ? '#4B33E3' : '#ffffff', // 선택 시 배경색 변경 대신, 하얀색 배경 유지
		border: isSelected ? `2px solid #4B33E3` : '1px solid #000000', // 선택된 Chip의 경우 border 색상을 main-color로 설정
		'&:hover': {
			opacity: 0.75,
		},
	});

	if (!isOpen) return null;

	return (
		<>
			<div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${!isOpen && 'hidden'}`} onClick={handleClose}></div>
			<div
				className={`fixed right-0 top-0 p-6 h-full overflow-y-auto bg-slate-50 p-4 rounded-md shadow-lg z-50 w-full max-w-2xl max-h-full transition-transform transform ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				} ease-in-out duration-300`}
			>
				<div className='flex justify-between items-center mb-4'>
					<h1 className='text-xl font-bold'>상세 업무 수정</h1>
					<button
						onClick={handleClose}
						className='text-white bg-gray-500 hover:bg-gray-600 font-bold py-2 px-4 rounded'
					>
						닫기
					</button>
				</div>
				<div className='flex items-center mb-4'>
					<FaRegCircleUser className='text-gray-600 mr-2' />
					<p className='text-md'>업무 요청자: {nickname}</p>
					<FaCalendarCheck className='text-md ml-4' />
					<p>업무 시작일: {moment().format('YYYY-MM-DD')}</p>
				</div>
				<p className='font-semibold mb-2'>업무 제목</p>
				<input
					type='text'
					value={title}
					onChange={handleTitleChange}
					className='border border-gray-300 rounded p-2 mr-2 w-full'
				/>
				<hr />
				<div className='flex my-4'>
					<FaRegCircleUser className='text-gray-600 mt-3 mr-2' />
					<label htmlFor='member-select' className='mt-2 mr-2'>
						담당자:
					</label>
					<select
						id='member-select'
						value={selectedMemberId ? selectedMemberId.toString() : ''}
						onChange={handleMemberChange}
						className='border border-gray-300 rounded p-2'
					>
						<option value=''>담당자 선택...</option>
						{projectMembers.map((member) => (
							<option key={member.member.id} value={member.member.id.toString()}>
								{member.member.nickname} - {member.jobCode.detailDescription}
							</option>
						))}
					</select>
				</div>
				<div className='flex'>
					<FaCheck className='mt-3' />
					{WorkStatus.map((workType: DetailCode) => (
						<Chip
							key={workType.id}
							label={workType.detailDescription}
							onClick={() => handleWorkStatusClick(workType.id)}
							variant='outlined'
							sx={chipStyle(selectedStatusId === workType.id)}
						/>
					))}
				</div>

				<div className='flex'>
					<FaBookBookmark className='mt-3' />
					{workTypes.map((workType: DetailCode) => (
						<Chip
							key={workType.id}
							label={workType.detailDescription}
							onClick={() => handleWorkTypeClick(workType.id)}
							variant='outlined'
							sx={chipStyle(selectedTypeId === workType.id)}
						/>
					))}
				</div>

				<div className='flex'>
					<FaBoltLightning className='mt-3' />
					{workPriorities.map((workPriority: DetailCode) => (
						<Chip
							key={workPriority.id}
							label={workPriority.detailDescription}
							onClick={() => handleWorkPriorityClick(workPriority.id)}
							variant='outlined'
							sx={chipStyle(selectedPriorityId === workPriority.id)}
						/>
					))}
				</div>
				<TaskDatePicker selectedDate={endDay} setSelectedDate={setEndDay} />
				<div className='flex flex-col'>
					<div className='mb-4'>
						<ReactQuill className='h-40' theme='snow' value={editorContent} onChange={editorChange} />
					</div>
				</div>
				{/* <TaskChkList /> */}
				<div className='flex justify-center'>
					<button onClick={() => setConfirmModal(true)} className='mt-10 bg-blue-500 text-white p-4 rounded'>
						업무 수정
					</button>
				</div>
			</div>
			{confirmModal && (
				<div
					className='fixed z-50 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center'
					id='my-modal'
				>
					<div className='relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
						<div className='mt-3 text-center'>
							<h3 className='text-lg leading-6 font-medium text-gray-900'>정말 업무를 수정하시겠습니까?</h3>
							<div className='mt-2 px-7 py-3'>
								<p className='text-sm text-gray-500'>프로젝트를 위해 조금만 더 힘내주세요!</p>
							</div>
							<div className='items-center px-4 py-3'>
								<button
									id='ok-btn'
									onClick={modifyTask}
									className='px-4 py-2 bg-main-color text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-green-300'
								>
									확인
								</button>
								<button
									id='cancel-btn'
									onClick={() => setConfirmModal(false)}
									className='mt-3 px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300'
								>
									취소
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
					<div className='bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto'>
						<h2 className='flex justify-center font-bold text-lg mb-4'>알림</h2>
						<p className='mb-4'>부족한 부분을 채워주세요!</p>
						<div className='flex justify-center'>
							<button
								onClick={closeModal}
								className='bg-main-color hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
							>
								확인
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ModifyTask;
