'use client'
import { authOptions } from "@/authOption";
import { db } from "@/services/firebaseConection";

import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc} from "firebase/firestore";
import { Textarea } from "@/components/textarea";
import type { Metadata } from "next"
import { getServerSession } from 'next-auth'
import { redirect } from "next/navigation"
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Task } from "@/types/task";

//export const metadata: Metadata = {
//    title: 'Tasks+ - Dashboard'
//}


export default function Dashboard(){

    const { data: session } = useSession()
    
    if(!session?.user) {
        redirect('/')
    }

    
    const [input, setInput] = useState("")
    const [publicTask, setPublicTask] = useState(false)
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        async function loadTarefas(){
            const tarefasRef = collection(db, "tarefas")
            const q = query(
                tarefasRef,
                orderBy("created", "desc"),
                where("user", "==", session?.user?.email)
            )
        

            onSnapshot(q, (snapshot) => {
                let lista = [] as Task[];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public
                    })
                });

                setTasks(lista)
            });
        }   

        loadTarefas();
    }, [session?.user?.email])

    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        setPublicTask(event.target.checked)

    }

    async function handleRegisterTask(event: FormEvent){
        event.preventDefault();

        if(input === "") return;

        try{
            await addDoc(collection(db, "tarefas"), {
                tarefa: input,
                created: new Date(),
                user: session?.user?.email,
                public: publicTask
            });

            setInput("")
            setPublicTask(false);

        }catch(error){
            console.log(error)
        }
    }

    async function handleShare(id: string){
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        )
        alert("URL copiada com sucesso")
    }

    async function handleDeleteTask(id: string){
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef)
    }

    return (
        <div className="w-full bg-white">
            <main>
                <section className="w-full  flex items-center justify-center bg-gray-950">
                    <div className="max-w-5xl w-full px-4 pb-7 mt-14">
                        <h1 className="text-white mb-2">Task:</h1>
                        <form onSubmit={handleRegisterTask}>
                            <Textarea 
                                placeholder="Digit your task..."
                                value={input}
                                onChange={ (event:ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                            />
                            <div className="my-3">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4"
                                    checked={publicTask}
                                    onChange={handleChangePublic}
                                />
                                <label className="ml-2 text-white">Public task?</label>
                            </div>
                            <button className="w-full text-white bg-[#3183f3] rounded-lg py-3 text-xl" type="submit">Create</button>
                        </form>
                    </div>
                </section>
                
                <section className="mt-8 px-4 w-full flex flex-col items-center justify-center">
                    
                <div className="max-w-5xl w-full px-4 pb-7 mt-14">
                    <h1 className="text-center text-black text-3xl mb-3">My Tasks</h1>
                    
                    {tasks.map((item) => (
                        <article key={item.id} className="mb-3 leading-[150%] flex flex-col rounded items-start border-solid border-2 border-gray-500 p-3">
                            {item.public && (
                                <div className="flex items-center justify-center my-1">
                                    <label className="bg-[#3183ff] py-0.5 px-1 text-white rounded text-xs mx-2 cursor-pointer">PÚBLICO</label>
                                    <button
                                        onClick={()=> handleShare(item.id)} 
                                        className="bg-transparent border-0 mx-2">
                                        <FiShare2 
                                            size={22}
                                            color="#3183ff"
                                        />
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center justify-between w-full">
                                {item.public ? (
                                    <Link href={`/task/${item.id}`}>
                                        <p className="text-black whitespace-pre-wrap">{item.tarefa}</p>
                                    </Link>
                                ) : (
                                    <p className="text-black whitespace-pre-wrap">{item.tarefa}</p>
                            )}
                                <button 
                                    onClick={()=> handleDeleteTask(item.id)}
                                    className="cursor-pointer bg-transparent border-0 mx-2">
                                    <FaTrash
                                        size={24}
                                        color="#ea3140"
                                    />
                                </button>
                            </div>
                        </article>
                    ))}
                    
                </div>
                </section>
            </main>

        </div>
    )
}

