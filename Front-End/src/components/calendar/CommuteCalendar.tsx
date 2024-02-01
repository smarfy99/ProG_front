import {
  Calendar,
  // CalendarProps,
  momentLocalizer,
  ToolbarProps,
} from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/ko"; //한국어 locale 설정

const localizer = momentLocalizer(moment);
moment.locale("ko"); //locale 한국어로 설정

//툴바 커스텀
const CustomToolbar: React.FC<ToolbarProps> = ({
  onNavigate,
  label,
  onView,
}) => {
  const goToToday = () => {
    const now = new Date();
    onNavigate("TODAY", now);
    onView("month");
  };

  return (
    <div className="flex ">
      <button type="button" onClick={() => onNavigate("PREV")} className="flex">
        👈
      </button>
      <div>{label}</div>
      <button type="button" onClick={() => onNavigate("NEXT")} className="flex">
        👉
      </button>
      <button type="button" onClick={goToToday} className="flex">
        오늘
      </button>
    </div>
  );
};

//날짜 칸 커스텀
const dayPropGetter = (date: Date) => {
  const today = new Date(); //오늘 날짜

  const style = {
    backgroundColor:
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
        ? "#EBE9FC"
        : "white",
    color: "#ffdd",
    borderRadius: "30px",
  };
  return {
    style,
  };
};

// const CommuteCalendar = (props: Omit<CalendarProps, "localizer">) => {
//   return <BigCalendar {...props} localizer={localizer} />;
// };

const CommuteCalendar: React.FC = () => {
  return (
    <Calendar
      localizer={localizer}
      views={["month"]}
      components={{
        toolbar: CustomToolbar,
      }}
      dayPropGetter={dayPropGetter}
      // 여기에 다른 CalendarProps를 추가할 수 있습니다.
    />
  );
};

export default CommuteCalendar;
