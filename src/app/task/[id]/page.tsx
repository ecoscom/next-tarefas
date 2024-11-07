

//import { useParams } from 'next/navigation';
import { Metadata } from 'next';
import { doc, collection, query, where, getDoc } from 'firebase/firestore';

import { db } from '@/services/firebaseConection';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tasks+',
};

export default async function Task({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    
    const id = (await params).id

    const docRef = doc(db, 'tarefas', id)

    const snapshot = await getDoc(docRef)

    if(snapshot.data() === undefined || !snapshot.data()?.public){
        notFound();
    }

    const task = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(snapshot.data()?.created?.seconds * 1000).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id,
    }

    console.log(task);
 
      
    return(
        
        <div className="container">
            <main className="main">
                <h1>Tarefa: {id}</h1>
            </main>
        </div>
)
}