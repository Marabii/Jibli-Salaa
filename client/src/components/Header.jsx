import { LogIn } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between mb-20">
      <Link href="/">
        <h1 className="w-16">Jibli Salaa</h1>
      </Link>
      <nav>
        <ul className="flex space-x-5">
          <Link href="/traveler">
            <li>Traveler</li>
          </Link>
          <Link href="/buyer">
            <li>Buyer</li>
          </Link>
          <Link href="/latest-deals">
            <li>Latest Deals</li>
          </Link>
        </ul>
      </nav>
      <div>
        <Link href="/login">
          <LogIn />
        </Link>
      </div>
    </header>
  );
}
