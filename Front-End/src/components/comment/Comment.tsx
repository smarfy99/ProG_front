import React, {useEffect, useState} from 'react';
import { useUserStore } from '../../stores/useUserStore';
import {axiosInstance} from "../../apis/lib/axios.ts";
import NestedComment from "./NestedComment.tsx";

interface CommentProps {
  contentCode: string,
  contentId?: string
}

const Comment: React.FC<CommentProps> = ({contentCode, contentId}) => {
  const { profile } = useUserStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const[editedComment, setEditedComment] = useState<string[]>([]);
  const [showReplies, setShowReplies] = useState<boolean[]>([]);
  const[showEditor, setShowEditor] = useState<boolean[]>([]);
  const memberId = profile?.id;

  useEffect(() => {
      fetchComments();
      console.log(memberId)
  }, []);


  //댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get('/comments', {
        params:{
          memberId: memberId,
          contentCode: contentCode,
          contentId: contentId
        }
      });

      console.log(response)

      setComments(response.data.data)
    } catch (error) {
      console.log(error)
    }
  };

  const addComment = async () => {
    try {
      await axiosInstance.post('/comments',
          {
            contentCode: contentCode,
            contentId: contentId,
            memberId: memberId,
            parentId: null,
            content: newComment
          });

      fetchComments();

      setNewComment('');
    } catch (error) {
      console.log(error)
    }
  };

  const updateComment = async (commentId: number, index: number) => {
      const isConfirmed = window.confirm('수정하시겠습니까?');

      if (isConfirmed) {
          try {
              await axiosInstance.patch(`/comments/${commentId}/${memberId}`, {
                  content: editedComment[index]
              })

              changeEditor(index, '')
              fetchComments();
          } catch (error) {
              console.log(error)
          }
      }
    }

  const deleteComment = async (commentId: number) => {
      const isConfirmed = window.confirm('삭제하시겠습니까?');

      if (isConfirmed) {
          try {
              await axiosInstance.delete(`/comments/${commentId}/${memberId}`);

              fetchComments();
          } catch (error) {
              console.log(error)
          }
      }
  }

  const changeEditor = (index: number, content: string) => {
        setShowEditor((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
        setEditedComment((prev) => {
          const newEditedCommentContents = [...prev];
          newEditedCommentContents[index] = content;
          return newEditedCommentContents;
      });
  };

  const toggleReplies = (index: number) => {
      setShowReplies((prev) => {
          const newState = [...prev];
          newState[index] = !newState[index];
          return newState;
      });
  };

    const formatDate = (dateString: string): string => {
        const serverDateTime = new Date(dateString);

        const koreaDateTime = new Date(serverDateTime.getTime() + 9 * 60 * 60 * 1000);

        const formattedDateTime = `${koreaDateTime.getFullYear()}.${String(
            koreaDateTime.getMonth() + 1
        ).padStart(2, '0')}.${String(koreaDateTime.getDate()).padStart(2, '0')} ${
            String(koreaDateTime.getHours()).padStart(2, '0')}:${
            String(koreaDateTime.getMinutes()).padStart(2, '0')}:${
            String(koreaDateTime.getSeconds()).padStart(2, '0')}`;

        return formattedDateTime
    };

  return (
      <div className="">
          <div className="text-xl">
              댓글 {comments.length}개
          </div>
          <div className="my-3">
              <div className="flex flex-col">
                  <div className="flex">
                      <img className="flex-none w-12 h-12 rounded-full" src={profile?.imgUrl || '/basic_profile_img.jpeg'} alt="Profile"/>
                      <div className="flex-initial w-full mx-3 my-3.5">
                          <p className="font-bold">{profile?.nickname || 'GUEST'}</p>
                      </div>
                  </div>

                  <textarea id="comment" name="comment" value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-none h-20 w-full mr-2 p-2 my-2 resize-none rounded border border-gray-300"
                            placeholder="댓글을 입력하세요"/>
                  <button className="bg-main-color text-white p-2 w-28 text-xl rounded ml-auto" onClick={addComment}>
                      작성
                  </button>
              </div>
          </div>
          <div>
              {comments.map((comment, index) => (
                  <div className="flex flex-col my-3" key={comment.id}>
                      <div className="p-2">
                          <div className="flex items-center">
                              <img className="flex-none w-12 h-12 rounded-full"
                                   src={comment.member.imgUrl || '/basic_profile_img.jpeg'}
                                   alt="Profile"/>
                              <div className="flex-initial w-full mx-3">
                                  <p className="font-bold">{comment.member.nickname}</p>
                                  <p className="text-xs">{comment.createdAt === comment.modifiedAt ? formatDate(comment.createdAt) : formatDate(comment.modifiedAt) + " (수정됨)"}</p>
                              </div>
                              {!comment.isDeleted && comment.member.id === memberId &&
                                  <div className="flex-initial w-32">
                                      <button className="p-2 text-sm rounded"
                                              onClick={() => changeEditor(index, comment.content)}>수정
                                      </button>
                                      <button className="p-2 text-sm rounded"
                                              onClick={() => deleteComment(comment.id)}>삭제
                                      </button>
                                  </div>}
                          </div>
                      </div>
                      <div className="p-2">
                          {comment.isDeleted ?
                              <p className="text-gray-500 italic"> ❗️삭제된 댓글입니다.</p> : (!showEditor[index] ?
                                      <p> {comment.content.split('\n').map((line, index) => (
                                          <React.Fragment key={index}>
                                              {line}
                                              <br/>
                                          </React.Fragment>
                                      ))} </p> :
                                      <div className="my-3">
                                          <div className="flex flex-col">
                                          <textarea id="comment" name="comment" value={editedComment[index]}
                                                    onChange={(e) => setEditedComment((prev) => {
                                                        const newEditedCommentContents = [...prev];
                                                        newEditedCommentContents[index] = e.target.value;
                                                        return newEditedCommentContents;
                                                    })}
                                                    className="flex-none h-20 w-full mr-2 p-2 my-5 resize-none rounded border border-gray-300"
                                                    placeholder="댓글을 입력하세요"/>
                                              <div className="flex justify-end space-x-2">
                                                  <button className="bg-main-color text-white p-2 w-28 text-xl rounded"
                                                          onClick={() => updateComment(comment.id, index)}>저장
                                                  </button>
                                                  <button className="bg-red-400 text-white p-2 w-28 text-xl rounded"
                                                          onClick={() => changeEditor(index, '')}>취소
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                              )}
                      </div>
                      <div className="p-2">
                          {(!comment.isDeleted || (comment.isDeleted && comment.children > 0)) &&
                              <button className="text-sm"
                                      onClick={() => toggleReplies(index)}>답글{comment.children > 0 ? " " + comment.children : ""}</button>}
                          {showReplies[index] &&
                              <NestedComment contentCode={contentCode} contentId={contentId} parentId={comment.id}/>}
                      </div>
                      <hr/>
                  </div>
              ))}
          </div>
      </div>
  );
};

export default Comment;