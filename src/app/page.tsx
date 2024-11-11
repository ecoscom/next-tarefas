import Image from "next/image";

import heroImg from '../../public/assets/hero.png'
import { db } from '@/services/firebaseConection';

import { collection, getDocs} from 'firebase/firestore'

export default async function Home() {

  const commentRef = collection(db, "comments")
  const commentSnapshot = await getDocs(commentRef)

  const postRef = collection(db, "tarefas")
  const postSnapshot = await getDocs(postRef);

  return (
    <div className="bg-gray-800 w-full h-screen flex flex-col justify-center items-center">
      <main>
        <div className="flex flex-col justify-center items-center">
          <Image
            priority className="max-w-md object-contain w-auto h-auto" alt="Logo Tasks+" src={heroImg} 
            />
        </div>
        <h1 className="text-white text-center m-7 leading-[150%]">Manage your tasks.</h1>

        <div className="flex items-center justify-around text-gray-800">
          <section className="bg-[#fafafa] p-3 rounded hover:scale-105">
            <span>+{postSnapshot.size || 0} posts</span>
          </section>
          <section className="bg-[#fafafa] p-3 rounded hover:scale-105">
            <span>+{commentSnapshot.size || 0} comments</span>
          </section>
        </div>
      </main>
    </div>
  );
}