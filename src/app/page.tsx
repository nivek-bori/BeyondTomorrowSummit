import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') ?? 'student';

  return <div>Home Page</div>;
}