import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../apis/lib/axios';

interface ChecklistItem {
	title: string;
	checkListId: number;
	isFinished: boolean;
}

interface TaskDetail {
	workId?: number;
}

interface TaskChkListProps {
	taskDetail: TaskDetail;
}

const TaskChkList: React.FC<TaskChkListProps> = ({ taskDetail }) => {
	const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
	const [newItemText, setNewItemText] = useState('');

	useEffect(() => {
		fetchChecklist();
	}, [taskDetail.workId]);

	const fetchChecklist = async () => {
		try {
			const response = await axiosInstance.get(`/worklist/${taskDetail.workId}`);
			setChecklist(response.data.data || []);
		} catch (error) {
			setChecklist([]);
		}
	};

	const addChecklistItem = async () => {
		if (!newItemText.trim()) return;
		const chkInfo = {
			workId: taskDetail.workId,
			title: newItemText,
		};

		try {
			await axiosInstance.post('/worklist', chkInfo, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			setNewItemText('');
			fetchChecklist();
		} catch (error) {}
	};

	const handleChecklistChange = async (checkListId: number) => {
		const item = checklist.find((item) => item.checkListId === checkListId);
		if (!item) return;

		const newIsFinished = !item.isFinished; // 현재 상태를 반전시킵니다.

		try {
			await axiosInstance.patch(
				`/worklist/${taskDetail.workId}/${checkListId}`,
				{
					isFinished: newIsFinished,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);

			fetchChecklist(); // 체크리스트를 다시 불러옵니다.
		} catch (error) {}
	};

	const removeChecklistItem = async (checkListId: number) => {
		try {
			await axiosInstance.delete(`/worklist/${checkListId}`);
			fetchChecklist();
		} catch (error) {}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addChecklistItem();
	};

	const calculateProgress = () => {
		const totalItems = checklist.length;
		const completedItems = checklist.filter((item) => item.isFinished).length;
		return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
	};

	const progressPercentage = calculateProgress(); // 프로그레스 바에 표시할 완료 비율 계산

	return (
		<div>
			<h2 className='font-semibold mb-2'>하위 업무</h2>
			<div className='flex progress-bar-container' style={{ margin: '20px 0' }}>
				<div className='w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-4'>
					<div className='bg-main-color h-4 rounded-full' style={{ width: `${progressPercentage}%` }}></div>
				</div>
				<span className='pl-6 pr-2 text-sm font-medium'>{progressPercentage}%</span>
			</div>
			<ul className='list-disc pl-6'>
				{checklist.map((item) => (
					<li key={item.checkListId} className='flex items-center mb-2'>
						<input type='checkbox' checked={item.isFinished} onChange={() => handleChecklistChange(item.checkListId)} />
						<span className={item.isFinished ? 'line-through ml-2' : 'ml-2'}>{item.title}</span>
						<button className='ml-auto text-red-500' onClick={() => removeChecklistItem(item.checkListId)}>
							X
						</button>
					</li>
				))}
			</ul>

			<form onSubmit={handleSubmit} className='flex mt-2'>
				<input
					type='text'
					className='border border-gray-300 rounded p-2 flex-grow'
					value={newItemText}
					onChange={(e) => setNewItemText(e.target.value)}
					placeholder='하위 업무 추가'
				/>
				<button type='submit' className='bg-blue-500 text-white p-2 ml-2 rounded'>
					추가
				</button>
			</form>
		</div>
	);
};

export default TaskChkList;
