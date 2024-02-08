import CommuteCalendar from "../../../components/calendar/CommuteCalendar";
import { useParams } from "react-router-dom";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import ActionBoard from "../../../components/commute/ActionBoard";
import RankingBoard from "../../../components/commute/RankingBoard";

const CommutePage = () => {
	//로그인이 필요한 페이지에 useRequireAuth 호출
	useRequireAuth();

  const { projectId } = useParams();

  console.log(projectId);

  return (
    <div className="flex flex-col justify-center">
      {/* action, ranking div */}
      <div className="flex justify-center mt-5">
        <ActionBoard />
        <RankingBoard />
      </div>

			{/* calendar div */}
			<div className='flex justify-center h-[430px]'>
				<CommuteCalendar />
			</div>
		</div>
	);
};

export default CommutePage;
