import React from 'react';
import useContextMenu, { ContextMenuItem } from '../../hooks/useContextMenu.tsx';
import { axiosInstance } from '../../apis/lib/axios.ts';

interface ProjectMemberContextProps {
	children: React.ReactNode;
	memberInfo: {
		leaderId: number | undefined;
		roleCodeName: string | undefined;
		projectId: string | undefined;
		memberId: number;
		gitProfile: string;
	};
	onUpdate: (statusYN: boolean) => void;
}

const ProjectMemberContext: React.FC<ProjectMemberContextProps> = ({
	children,
	// projectId,
	// memberId,
	// gitProfile,
	onUpdate,
	memberInfo,
}) => {
	const { contextMenuRef, contextMenuState, handleContextMenu, handleMenuItemClick } = useContextMenu();

	// 직무변경
	// 추방
	// 깃 프로필
	const confirmAction = (message: string): boolean => {
		return window.confirm(message);
	};

	// leaderId: number;
	// roleCode: number;
	// projectId: string | undefined;
	// memberId: number;
	// gitProfile: string;

	// 멤버 추방
	// const exile = async (projectId: string | undefined, exiledId: number): Promise<void> => {
	const exile = async (): Promise<void> => {
		try {
			if (!confirmAction('정말 추방하시겠습니까?')) return;
			await axiosInstance.delete(
				`/projects/${memberInfo.projectId}/exiled/${memberInfo.leaderId}?exileId=${memberInfo.memberId}`,
			);
			onUpdate(true);
		} catch (error) {}
	};

	// 멤버 직무 변경
	// const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
	//     setSelectedPosCode(parseInt(e.target.value));
	// };
	// const [selectedPosCode, setSelectedPosCode] = useState<number | null>(null);
	const handleClick = (event: React.MouseEvent) => {
		let menuItems: ContextMenuItem[] = [
			{
				label: 'GitHub 보기',
				action: () =>
					handleMenuItemClick(() => {
						const githubPage = `https://github.com/${memberInfo.gitProfile}`;
						window.open(githubPage, '_blank');
					}),
			},
			{
				label: '추방',
				action: () =>
					handleMenuItemClick(async () => {
						// await exile(projectId, memberId);
						await exile();
					}),
			},
		];

		if (memberInfo.roleCodeName === 'TeamLeader') {
			menuItems = menuItems.filter((item) => item.label !== '추방');
		}

		handleContextMenu(event, menuItems);
	};

	return (
		<div onClick={handleClick}>
			{children}
			{contextMenuState.isOpen && (
				<div
					ref={contextMenuRef}
					className='fixed rounded bg-gray-100 border border-gray-300 shadow shadow-gray-500 py-1 z-50'
					style={{ top: contextMenuState.y, left: contextMenuState.x }}
				>
					{contextMenuState.menuItems.map((item) => (
						<div key={item.label} className='px-4 py-2 cursor-pointer hover:bg-gray-200' onClick={() => item.action()}>
							{item.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ProjectMemberContext;
