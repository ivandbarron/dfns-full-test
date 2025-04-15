"use client";
import { useAuthStore } from "@/stores/authStore";
import { DelegatedLoginResponse } from "@dfns/sdk/generated/auth";
import { login } from "@/actions/non-custodial/delegated-user";

const LoginDelegatedUserForm = () => {
  const { token, setToken } = useAuthStore();

  const handleLoginAction = async (formData: FormData) => {
    const username = formData.get("username") as string;
    const response: DelegatedLoginResponse | undefined = await login(username);
    if (!response) {
      alert("Login failed");
      return;
    }
    setToken(response.token);
  };

  return (
    <form action={handleLoginAction}>
      <input type="text" placeholder="Email" name="username" />
      <button type="submit">Login</button>
      {!!token && <p className="text-blue-300">Logged In!</p>}
    </form>
  );
};

export default LoginDelegatedUserForm;
