export async function signupUser(name: string, email: string, password: string) {
    try {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error("Failed to create user.");
        }

        return data;
    } catch (error: any) {
        throw new Error("Something went wrong.");
    }
}

export async function loginUser(email: string, password: string) {

    try {
        const res = await fetch("/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include"
        });
    
        const data = await res.json();
    
        return data;
    } catch (error: any) {
        throw new Error("Something went wrong.");
    }

}
