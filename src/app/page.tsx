import Image from "next/image";

import heroImg from '../../public/assets/hero.png'

export default function Home() {
  return (
    <div className="bg-gray-800 w-full h-screen flex flex-col justify-center items-center">
      <main>
        <div className="flex flex-col justify-center items-center">
          <Image
            priority className="max-w-md object-contain w-auto h-auto" alt="Logo Tasks+" src={heroImg} 
            />
        </div>
        <h1 className="text-white text-center m-7 leading-[150%]">Manage your tasks. <br/> Teste</h1>
      </main>
    </div>
  );
}
