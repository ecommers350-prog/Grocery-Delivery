import React, { useState } from "react"
import { heroSectionData } from "../assets/assets"
import { Link } from "react-router-dom"
import { BikeIcon, Loader2, Loader2Icon, LockIcon, Mail, UserIcon } from "lucide-react"

const Login = () => {
    const [isLoginState, setIsLoginState] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setLoading(true);
        setTimeout(() => window.location.href = "/", 1000)
    }
    return (
        <div className="min-h-screen flex">
            {/* Left side */}
            <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
                <img src={heroSectionData.hero_image} alt="" className="absolute inset-0 object-cover h-full bg-center opacity-10" />
                <div className="relative text-center px-12">
                    <h2 className="text-4xl font-semibold text-white mb-4">Welcome back to Instacart</h2>
                    <p>Fresh groceries and organic produce, delivered to your doorstep.</p>
                </div>
            </div>

            {/* right side */}
            <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
                <div className="w-full max-w-md">
                    {/* form header message */}
                    <div className="text-center mb-8">
                        <Link to={"/"} className="inline-flex items-center gap-2 mb-6">
                            <BikeIcon className="size-8 text-app-green" />
                            <span className="text-2xl font-semibold text-app-green">Instacart</span>
                        </Link>
                        <h1 className="text-2xl font-semibold text-app-green mb-2">
                            {isLoginState ? 'Sign up for an account': 'Sign in to your account'}
                        </h1>
                        <p className="text-sm text-app-text-light">
                            {isLoginState ? "Already have an account?" :"Don't have an account? " }
                            <button onClick={() => setIsLoginState(!isLoginState)} className="text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors">
                                {isLoginState ? "Sign In" : "Create One"}
                            </button>
                        </p>
                    </div>

                    {/* Login / Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isLoginState && (
                            <label className="text-sm flex flex-col gap-1" >
                                Name
                                <div className="relative">
                                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Your name"
                                        className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all" />
                                </div>
                            </label>
                        )}
                        <label className="text-sm flex flex-col gap-1" >
                            Email Address
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all" />
                            </div>
                        </label>
                        <label className="text-sm flex flex-col gap-1" >
                            Password
                            <div className="relative">
                                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="•••••••••••"
                                    className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all" />
                            </div>
                        </label>
                        <button type="submit" disabled={loading} className="flex-center w-full py-3 bg-gray-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50">
                            {loading ? <Loader2Icon className="animate-spin" /> : isLoginState ? "Sign In" : "sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
