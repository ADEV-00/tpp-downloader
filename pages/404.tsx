import Link from "next/link";

export default function FourOhFour() {
  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] flex flex-col dark:bg-gray-800 justify-center items-center text-center">
      <div>
        <h1 className="text-9xl font-black text-gray-800 dark:text-white">
          <span className="text-[#21B36C]">4</span>0
          <span className="text-[#4B9EFF]">4</span>
        </h1>
        <h2 className="text-gray-700 font-bold text-xl uppercase mb-7 dark:text-gray-300">
          OPPS! Page not found
        </h2>
        <Link href="/">
          <a className="font-bold py-3 px-4 bg-[#4B9EFF] mt-10 rounded-md shadow-md text-white">
            GO TO HOME
          </a>
        </Link>
      </div>
    </div>
  );
}
