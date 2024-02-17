import Team from "@/components/Team"
import { db } from "@/db"
import { breakfastHistory, usersAllowed } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { TeamCalendar } from "./TeamCalendar"

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const breakfastHistoryData = await db
    .select({
      id: breakfastHistory.id,
      breakfastDate: breakfastHistory.breakfastDate,
      userName: usersAllowed.name,
    })
    .from(breakfastHistory)
    .innerJoin(usersAllowed, eq(breakfastHistory.userId, usersAllowed.id))
  const breakfastDates = breakfastHistoryData.map((item) => item.breakfastDate)

  let breakfastSelectedDate
  if (searchParams.selectedDate) {
    breakfastSelectedDate = await db
      .select({
        id: breakfastHistory.id,
        breakfastDate: breakfastHistory.breakfastDate,
        userName: usersAllowed.name,
      })
      .from(breakfastHistory)
      .where(
        eq(breakfastHistory.breakfastDate, new Date(searchParams.selectedDate)),
      )
      .innerJoin(usersAllowed, eq(breakfastHistory.userId, usersAllowed.id))
  }

  return (
    <div className="flex flex-row justify-evenly">
      <Team />
      <div className="max-w-xl">
        <h2 className="text-white">Agenda</h2>
        <ul className="mt-2 min-w-96 divide-y divide-gray-100  text-sm">
          {breakfastHistoryData.map(({ id, userName, breakfastDate }) => (
            <li
              key={id}
              className="flex flex-row justify-between py-6 text-white"
            >
              <h3 className="font-semibold ">{userName}</h3>
              <time dateTime={breakfastDate.toString()}>
                {breakfastDate.toDateString()}
              </time>
            </li>
          ))}
        </ul>
      </div>
      <TeamCalendar breakfastDates={breakfastDates}>
        <div className="mt-auto flex flex-col">
          {breakfastSelectedDate?.[0]?.userName ? (
            <h3 className="text-wrap font-semibold text-white">
              {breakfastSelectedDate[0].userName}
            </h3>
          ) : (
            <div className="font-semibold text-white">Pas de petit déj</div>
          )}
        </div>
      </TeamCalendar>
    </div>
  )
}
