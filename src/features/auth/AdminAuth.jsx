import AuthForm from "./AuthForm";

function AdminAuth() {
  return <AuthForm role="admin" redirectTo="/admin" />;
}

export default AdminAuth;
