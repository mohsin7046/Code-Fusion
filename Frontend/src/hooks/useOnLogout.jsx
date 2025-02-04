
export function UseOnLogout() {
    const logout = async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log("Error in logout hook" + error);
        }
    }
    return { logout };
}
