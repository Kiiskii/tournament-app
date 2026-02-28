import Languages from "@/components/languages";
import Login from "@/components/login";

export default async function Home() {
  return (
    <div className="flex-1 justify-center px-6 py-12 lg:px-8 min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
      <Languages />
      <div className="border-2 border-gray-900 w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg justify-center">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Login />
        </div>
      </div>
    </div>
  );
}
