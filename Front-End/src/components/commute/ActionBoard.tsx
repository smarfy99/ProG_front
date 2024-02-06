// import { useParams } from "react-router-dom";
// import { useActionQuery } from "../../apis/useActionQuery";

const ActionBoard = () => {
  // const { projectId } = useParams();
  // const { data, isLoading, error } = useActionQuery(projectId);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error{error.message}</div>;

  // console.log(data);

  return (
    <div className="flex rounded-xl bg-sub-color h-40 w-96 mr-8 px-4 py-2">
      <div className="flex text-main-color font-semibold text-2xl">Action</div>
    </div>
  );
};

export default ActionBoard;
