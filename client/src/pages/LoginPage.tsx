export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form className="flex flex-col gap-4 w-80">
        <input type="email" placeholder="Email" className="p-2 border rounded" />
        <input type="password" placeholder="Password" className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Sign In
        </button>
      </form>
    </div>
  )
}
