import { db } from "@/db"
import { usersAllowed } from "@/drizzle/schema"
import { createClient } from "@/utils/supabase/server"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"

export default async function Team() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()

  if (!data) {
    redirect("/unauthorized")
  }

  const allowedUsers = await db
    .select()
    .from(usersAllowed)
    .where(eq(usersAllowed.name, data.user?.user_metadata.name))

  if (!allowedUsers[0]) {
    redirect("/unauthorized")
  }

  await db
    .update(usersAllowed)
    .set({ isLate: false })
    .where(eq(usersAllowed.name, data.user?.user_metadata.name))

  const members = await db.select().from(usersAllowed)

  return (
    <article>
      <h2 className=" text-white"> Team members </h2>
      <ul className="max-w-sm divide-y divide-gray-100" title="Team members">
        {members.map((member) => (
          <li key={member.name} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src="https://i.pravatar.cc/300"
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-white">
                  {member.name}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              {member.isLate ? (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <p className="text-xs leading-5 text-gray-500">
                    is about to pay
                  </p>
                  <div className="flex-none rounded-full bg-red-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <p className="text-xs leading-5 text-gray-500">is safe</p>
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
