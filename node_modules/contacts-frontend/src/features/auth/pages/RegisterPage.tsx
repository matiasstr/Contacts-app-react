import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import Input from '../../../shared/components/Input';
import { useSignalValue } from '../../../shared/hooks/useSignalValue';
import { applyAuthSession, register } from '../services/auth.api';
import { authErrorSignal, authLoadingSignal } from '../state/auth.signals';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const authError = useSignalValue(authErrorSignal);
  const isLoading = useSignalValue(authLoadingSignal);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setValidationError(null);
    authErrorSignal.value = null;

    if (!displayName.trim() || !email.trim() || password.length < 6) {
      setValidationError('Name, email, and a password of at least 6 characters are required.');
      return;
    }

    try {
      authLoadingSignal.value = true;
      const session = await register({ displayName: displayName.trim(), email: email.trim(), password });
      applyAuthSession(session);
      navigate('/contacts', { replace: true });
    } catch (error) {
      authErrorSignal.value = error instanceof Error ? error.message : 'Unable to create account.';
    } finally {
      authLoadingSignal.value = false;
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-md border border-line bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-bold text-ink">Create account</h1>
        <p className="mt-2 text-sm text-muted">Register once, then start building your contact book.</p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <ErrorMessage message={validationError || authError} />
          <Input label="Name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" />
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Register
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link className="font-semibold text-brand hover:text-blue-700" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
