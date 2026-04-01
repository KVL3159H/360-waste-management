import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        You do not have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <Button onClick={() => navigate(-1)} variant="outline">
        Go Back
      </Button>
    </div>
  );
}
