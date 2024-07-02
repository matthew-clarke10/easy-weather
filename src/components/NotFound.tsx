import { Link } from "react-router-dom"

function NotFound() {
  return (
    <section className="flex flex-col justify-center items-center h-screen text-2xl">
      <h1 className="text-6xl">Not Found</h1>
      <h2 className="m-8 text-center">The page you were looking for was not found. Click the button below to return to the home page.</h2>
      <Link to="/" className="rounded-lg bg-sky-400 hover:bg-sky-500 focus:bg-sky-500 px-12 py-6">Back to Home</Link>
    </section>
  )
}

export default NotFound