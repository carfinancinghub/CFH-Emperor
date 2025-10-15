// @ai-generated via ai-orchestrator
This component is converted to TSX, using `React.FC` for the component signature and explicitly typing the form submission event, which is the most critical event typing requirement here.

```tsx
import React, { useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import useAuth from './useAuth'; // Assuming useAuth provides typed outputs
import Navbar from './Navbar';

const LoginForm: FC = () => {
    // TypeScript infers string types correctly from initial state ''
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Assuming useAuth provides a properly typed login function (string, string) => Promise<void>
    const { login } = useAuth();

    /**
     * Types the event as a standard React Form Submission Event.
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(email, password);
            setMessage('✅ Login successful');
        } catch (err) {
            // Note: In a real app, you might want better error handling/display
            setMessage('❌ Login failed');
        }
    };

    // Note: Inline onChange handlers generally infer the event type correctly,
    // so explicit ChangeEvent typing is often omitted unless defining a separate function.

    return (
        <div>
            <Navbar />
            <div className="p-4 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                {message && <p className="mb-4 text-sm text-red-600">{message}</p>}
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
```