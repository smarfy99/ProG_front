// import { useQuery } from "@tanstack/react-query";
// import { axiosInstance } from "./lib/axios";

// interface ActionData {
//   actionId: number;
//   content: string;
//   week: number;
// }

// const getAction = async (projectId: number): Promise<ActionData> => {
//   const { data } = await axiosInstance.get<ActionData>(`/actions/${projectId}`);
//   return data;
// };

// export const useActionQuery = (projectId: number) => {
//   //쿼리 키 : action,
//   return useQuery<ActionData, Error>(
//     ["action", projectId],
//     () => getAction(projectId)
//   );
// };
