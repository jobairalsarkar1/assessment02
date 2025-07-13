import { MdEmail, MdPhone } from "react-icons/md";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  university: string;
  company: {
    title: string;
  };
};

export default function UserCard({ user }: { user: User }) {
  return (
    <div
      className="rounded-2xl h-[140px] bg-white border-2 border-gray-400 p-5 shadow-md transition-all hover:shadow-xl mb-4"
      tabIndex={0}
      aria-label={`User card for ${user.firstName} ${user.lastName}`}
    >
      <div className="flex items-center gap-5">
        <img
          src={user.image}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-16 w-16 rounded-full border-2 border-white shadow ring-2 ring-blue-200"
          loading="lazy"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-blue-700">{user.company.title}</p>
          <p className="text-xs text-gray-500">{user.university}</p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <a
              href={`mailto:${user.email}`}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
              aria-label={`Email ${user.firstName}`}
            >
              <MdEmail className="text-lg" />
              {user.email}
            </a>
            <a
              href={`tel:${user.phone.replace(/\D/g, "")}`}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
              aria-label={`Call ${user.firstName}`}
            >
              <MdPhone className="text-lg" />
              {user.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
