import { useState, useEffect } from 'react';
import { axiosInstance } from '../../apis/lib/axios';
import { useRequireAuth } from '../../hooks/useRequireAuth';

import '../../styles/component/project/position.scss';

export const techStack = {
	mystack: [] as { techCode: number }[],
};

const TechStack = () => {
	useRequireAuth();
	const [tags, setTags] = useState<{ id: number; detailName: string }[]>([]);
	const [selectedTags, setSelectedTags] = useState<{ id: number; techCode: string }[]>([]);
	const [selectedValue, setSelectedValue] = useState<string>('');

	useEffect(() => {
		const getTags = async () => {
			try {
				const response = await axiosInstance.get('/codes/details/Tech');
				if (response.data.status === 'OK') {
					setTags(
						response.data.data.map(({ id, detailName }: { id: number; detailName: string }) => ({ id, detailName })),
					);
				}
			} catch (error) {}
		};

		getTags();
	}, []);

	const putTag = () => {
		const selectedTag = tags.find((tag) => tag.detailName === selectedValue);
		if (selectedTag && !selectedTags.some((tag) => tag.id === selectedTag.id)) {
			const newTag = { id: selectedTag.id, techCode: selectedTag.detailName };
			setSelectedTags((prevTags) => [...prevTags, newTag]);
			techStack.mystack.push({ techCode: selectedTag.id });
			setSelectedValue('');
		}
	};

	const removeTag = (idToRemove: number) => {
		setSelectedTags((prevTags) => {
			const updatedTags = prevTags.filter((tag) => tag.id !== idToRemove);
			techStack.mystack = updatedTags.map((tag) => ({ techCode: tag.id }));
			return updatedTags;
		});
	};

	return (
		<div>
			<div className='flex'>
				<div className='text-3xl font-bold mr-2'>기술 스택</div>
			</div>
			<hr className='my-3 border-1' />
			<div className='h-auto w-full bg-gray-50 rounded-xl'>
				{selectedTags.map((item, index) => (
					<span
						key={index}
						className='cursor-pointer inline-block m-1 p-1 px-3 rounded-2xl tech-stack'
						onClick={() => removeTag(item.id)}
					>
						{item.techCode} ❌
					</span>
				))}
			</div>
			<div className='mb-10 mt-2'>
				<select
					id='techStack'
					className='p-2 position-select'
					value={selectedValue}
					onChange={(e) => setSelectedValue(e.target.value)}
				>
					<option value='default'>기술 스택 선택</option>
					{tags.map((tag, index) => (
						<option key={index} value={tag.detailName}>
							{tag.detailName}
						</option>
					))}
				</select>

				<button onClick={putTag} className='ml-2 p-2 position-btn px-5 text-white'>
					등록
				</button>
			</div>
		</div>
	);
};

export default TechStack;
