import CommuteCalendar from "../../../components/calendar/CommuteCalendar";
// import { useRequireAuth } from "../../../hooks/useRequireAuth";

const CommutePage = () => {
  //로그인이 필요한 페이지에 useRequireAuth 호출
  // useRequireAuth();

  return (
    <div className="flex flex-col justify-center">
      {/* action, ranking div */}
      <div className="flex justify-center mt-5">
        <div className="flex rounded-xl bg-sub-color h-40 w-96 mr-8 px-4 py-2">
          <div className="flex text-main-color font-semibold text-2xl">
            Action
          </div>
        </div>
        <div className="flex rounded-xl bg-sub-color h-40 w-80 px-4 py-2">
          <div className="flex text-main-color font-semibold text-2xl">
            Action
          </div>
        </div>
      </div>

      {/* calendar div */}
      <div className="flex h-[420px]">
        <CommuteCalendar />
      </div>
    </div>
  );
};

export default CommutePage;
