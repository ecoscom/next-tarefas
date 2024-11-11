

'use client'

//import { Metadata } from 'next';
import { doc, collection, query, where, getDoc, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

import { db } from '@/services/firebaseConection';
import { notFound, useSearchParams } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { Task } from '@/types/task';
import { Textarea } from '@/components/textarea';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';

interface CommentProps{
    id: string;
    comment: string;
    taskId: string;
    user: string;
    name: string;
    created: Date;
}



export default function TaskPage() {
    
    //const params = useParams();
    const { id } = useParams();
    const [task, setTask] = useState<Task>({
        tarefa: "",
        public: false,
        created: new Date(),
        user: "",
        id: "",
    });
    const [input, setInput] = useState("");
    const [comments, setComments] = useState<CommentProps[]>([]);

    useEffect(() => {
        async function fetchData(){
            const docRef = doc(db, 'tarefas', id as string)
            const snapshot = await getDoc(docRef)
            if(snapshot.data() === undefined || !snapshot.data()?.public){
                notFound();
            }

            setTask({
                tarefa: snapshot.data()?.tarefa,
                public: snapshot.data()?.public,
                created: new Date(snapshot.data()?.created?.seconds * 1000),
                user: snapshot.data()?.user,
                id: id as string,
            })

            const q = query(collection(db, "comments"), where("taskId", "==", id))
            const snapshotComments = await getDocs(q)
            let allComments: CommentProps[] = [];
            snapshotComments.forEach((doc) => {
                allComments.push({
                    id: doc.id,
                    comment: doc.data().comment,
                    user: doc.data().user,
                    name: doc.data().name,
                    taskId: doc.data().taslId,
                    created: doc.data().created,
                })
            })
            setComments(allComments);
            console.log(allComments);

        }
        fetchData(); 
        
    },[])

    const {data: session} = useSession();

    

    
      
    async function handleComent(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(input === "") return;

        if(!session?.user?.email || !session?.user?.name) return;

        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: id
            })
            const data = {
                id: docRef.id,
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: id as string,
                created: new Date(),
            };

            setComments((oldItems) => [...oldItems, data]);
            setInput("")

        } catch (error) {
            console.log(error)
        }
        
    }

    async function handleDeleteComment(id: string){
        try {
            const docRef = doc(db, "comments", id)
            await deleteDoc(docRef)

            const deleteComment = comments.filter((comment)=> comment.id !== id)
            setComments(deleteComment)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        
        <div className="w-full max-w-5xl mt-10 mx-auto mb-0 py-0 px-4 flex flex-col justify-center items-center">
            <main className="w-full">
                <h1 className='mb-3'>Task</h1>
                <article className='border-solid border-2 border-gray-600 leading-[150%] rounded flex items-center justify-center'>
                    <p className='w-full whitespace-pre-wrap'>
                        {task.tarefa}
                    </p>
                </article>
            </main>

            <section className='my-4 mx-0 w-full max-w-5xl'>
                <h2 className='my-3 mx-0'>Make a coment</h2>
                <form onSubmit={handleComent}>
                    <Textarea
                        placeholder='Insert your comment...'
                        value={input}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>)=>
                            setInput(event.target.value)}
                    />
                    <button
                        disabled={!session?.user} 
                        className='w-full py-3 px-0 rounded text-white bg-[#3183ff] text-lg cursor-pointer'>Comment</button>
                </form>
            </section>

            <section className='my-4 mx-0 w-full max-w-5xl'>
                <h2>Comments:</h2>
                {comments.length === 0 && (
                    <span>No comments</span>
                )}
                {comments.map((comment) => (
                    <article key={comment.id} className='border-solid border-2 border-gray-50 p-3 rounded mt-3'>
                        <div className='flex items-center'>
                            <label className='bg-gray-500 p-2 mr-2 rounded'>{comment.name}</label>
                            {comment.user === session?.user?.email && (
                                <button 
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className='border-0 bg-transparent cursor-pointer'>
                                    <FaTrash size={18} color='red' />
                                </button>
                            )}
                        </div>
                        <p className='mt-3 whitespace-pre-wrap'>{comment.comment}</p>
                    </article>
                ))}

            </section>
        </div>
)
}