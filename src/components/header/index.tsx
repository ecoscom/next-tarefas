import Link from "next/link"

export function Header() {
    return(
        <header className="w-full h-20 bg-[#0f0f0f] flex items-center justify-center">
            <section className="px-4 w-full max-w-5xl flex items-center justify-between">
                <nav className="flex items-center">
                    <Link className="no-underline" href="/">
                        <h1 className="text-[#fff] text-3xl">Tasks<span className="text-red-500 pl-0.5">+</span></h1>
                    </Link>
                    <Link className="bg-white text-black px-3 py-1 rounded-sm mx-3.5" href="/dashboard">Meu painel</Link>
                </nav>

                <button className="bg-transparent px-8 py-2 rounded-3xl text-white border-solid border-[1.5px] cursor-pointer hover:scale-105 hover:bg-white hover:text-black">Acessar</button>
            </section>
        </header>
    )
}