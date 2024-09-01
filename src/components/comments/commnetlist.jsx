import { useState, useEffect } from "react"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; 
import { db } from "../../firebase/firebase"
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import {ko} from "date-fns/locale";

export default function CommentList() {
    const params = useParams();
    const gamemode = params.gamemode;
    const id = params.id;
    const [comments, setComments] = useState([]);
    const user = JSON.parse(localStorage.getItem("user-info"));

    useEffect(() => {
        const fetchComments = async () => {
            const querySnapshot = await getDocs(collection(db, gamemode, id, "comments"));
            const commentsData = [];
            querySnapshot.forEach((doc) => {
                commentsData.push({ id: doc.id, ...doc.data() });
            });
            setComments(commentsData);
        };

        fetchComments();
    }, [gamemode, id]);

    async function handleDelete(commentid, password){

        if(confirm("정말 삭제하시겠습니까?") === false){
            return;
        }

        const input = user ? user.uid : prompt("비밀번호를 입력해주세요");
        if(input !== password){
            alert("비밀번호가 틀렸습니다.");
            return;
        }

        try{
            await deleteDoc(doc(db, gamemode, id, "comments", commentid));
            setComments(comments.filter(comment => comment.id !== commentid));
        } catch(e){
            console.log(e);
        }
    }

    return (
        <div>
            {comments
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((comment) => (
                    <Comment key={comment.id} comment={comment} handleDelete={handleDelete} />
                ))}
        </div>
    );
}

function Comment({comment, handleDelete}){

    return(
        <div className="flex flex-col">
            <div className="flex text-sm justify-between">
                <div className="font-bold">{comment.username}</div>
                <div>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}</div>

                <div onClick={()=>handleDelete(comment.id, comment.password)} className="text-red-500 hover:underline cursor-pointer border rounded px-1">삭제 🗑︎</div>
            </div>

            <div className="text-sm">{comment.comment}</div>
            <hr className="border-t border-gray-300" />
        </div>
    )
}