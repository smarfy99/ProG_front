import { useAttendanceStartMutation } from '../../apis/useAttendanceMutation';

export interface CommuteCheckBtnProps {
	projectId: number;
	memberId: number;
}

const CommuteCheckBtn = ({ projectId, memberId }: CommuteCheckBtnProps) => {
	const { mutate: startAttendance } = useAttendanceStartMutation();

	//출근 버튼 클릭 시
	const handleStartAttendance = () => {
		startAttendance({ projectId, memberId });
	};

	return (
		<div className='flex justify-center space-x-2'>
			<button className='flex w-20 h-20 bg-white rounded-2xl' onClick={handleStartAttendance}>
				출근
			</button>
			<button className='flex w-20 h-20 bg-white rounded-2xl'>퇴근</button>
		</div>
	);
};

export default CommuteCheckBtn;
