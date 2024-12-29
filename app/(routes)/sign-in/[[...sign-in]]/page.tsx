import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Welcome Back
                </h2>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Sign in to continue to your account
                </p>
                <SignIn
                    routing="path"
                    path="/sign-in"
                    appearance={{
                        elements: {
                            card: "shadow-md border border-gray-200",
                            formButtonPrimary: "bg-blue-600 text-white hover:bg-blue-700",
                        },
                    }}
                />
            </div>
        </div>
    );
}
