"use client";

import { ArrowRight, Moon } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { ProfileBox} from "@/components/Avatar";


export default function Home() {
  const router = useRouter();
  const handleExplore = () => {
    router.push('/signup');
  }
  return (
    <main className="min-h-screen bg-white text-black font-mono p-6 space-y-10">

      <nav className="flex justify-between items-center py-4 px-6 border-b-2 border-gray-200">

        <div className="flex items-center space-x-2">

          <div className="w-4 h-4 bg-black rotate-45"></div>
          <h1 className="text-2xl font-extrabold tracking-tight">Wellbeing Hub</h1>
        </div>


        <div className="flex items-center space-x-4">
          <button className="text-sm px-4 py-1 border border-black rounded hover:bg-black hover:text-white">
            Overview
          </button>
          <button onClick={()=>router.push('/dashboard')}
          className="text-sm px-4 py-1 border border-black rounded hover:bg-black hover:text-white">
            Dashboard
          </button>
          <button onClick={() => router.push('/login')}
          className="text-sm px-4 py-1 border border-black rounded hover:bg-black hover:text-white">
            Login
          </button>
          <button className="text-xl" title="Toggle Mode (inactive)">
            <ProfileBox/>
          </button>
        </div>
      </nav>
         


      <header className="text-center">
        <h1 className="text-4xl font-extrabold underline text-green-600">
          Wellbeing Hub
        </h1>
        <p className="text-lg mt-2 text-gray-700">
          Experience expert mental health care designed just for you.
        </p>
      </header>


      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">
          Conquer Life’s Chaos with a Smile 😄
        </h2>
        <p className="text-md text-gray-700">
          Tired of forgetting what you ate or why you cried over a sitcom? We’ve got your back. Track moods, meals, moves — and maybe find peace.
        </p>
      </section>


      <div className="text-center mt-6">
        <h3 className="text-xl font-bold mb-4">
          Where do you want to start today?
        </h3>
        <button onClick={handleExplore}
          className="bg-black text-white px-6 py-2 font-bold text-sm uppercase tracking-wide border-2 border-black hover:scale-105 transition-all">
          Explore Now
        </button>
      </div>


      <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mt-10 px-4">
        <BrutalistCard
          image="/activity.png"
          title="Activity Logger"
          desc="Follow your wellness journey — yoga, stretches, and more!"
          color="bg-pink-200"
          href="/log-activity"
        />
        <BrutalistCard
          image="/Nutrition.png"
          title="Nutrition Tracker"
          desc="Track your healthy meals and cheeky snacks too"
          color="bg-yellow-200"
          href="/nutrition-log"
        />
        <BrutalistCard
          image="/journaling.png"
          title="Daily Journal"
          desc="Jot down memories and highlights with our cute journal"
          color="bg-teal-200"
          href="/journal"
        />
      </div>
      <div className="text-center mt-10 text-sm">
        ⭐ “It’s like a therapist, a dietitian, and a fitness coach all trapped in one tab” {" "}
      </div>
    </main>
  );
}



function BrutalistCard({
  image,
  title,
  desc,
  color,
  href,
}: {
  image: string;
  title: string;
  desc: string;
  color: string;
  href?: string;
}) {

  const getButtonText = () => {
    if (title.includes("Activity")) return "Log Activity";
    if (title.includes("Nutrition")) return "Track Nutrition";
    if (title.includes("Journal")) return "Write Journal";
    return "Let’s Do This";
  };

  return (
    <div className={`${color} border-4 border-black p-6 flex justify-between items-center hover:scale-[1.02] transition-all rounded-xl`}>

      <div className="flex-1 pr-4">
        <h3 className="text-xl font-extrabold uppercase mb-1">{title}</h3>
        <p className="text-sm mb-4">{desc}</p>

        {href ? (
          <Link
            href={href}
            className="inline-flex items-center whitespace-nowrap bg-black text-white px-4 py-2 border-2 border-black hover:scale-105 transition-all text-sm font-semibold"
          >
            {getButtonText()} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        ) : (
          <button className="inline-flex items-center whitespace-nowrap bg-black text-white px-4 py-2 border-2 border-black hover:scale-105 transition-all text-sm font-semibold">
            {getButtonText()} <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        )}


      </div>
      {image && (
        <img
          src={image}
          alt={title}
          className="w-36 h-36 object-contain"
        />
      )}
    </div>
  );
}
