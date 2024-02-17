"use client"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PropsWithChildren } from "react"

export const TeamCalendar = ({
  breakfastDates,
  children,
}: PropsWithChildren<{ breakfastDates: Date[] }>) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }
  return (
    <Calendar
      mode="multiple"
      className=" my-auto  bg-black bg-opacity-50 text-white"
      selected={breakfastDates}
      onDayClick={(selectedDate) => {
        return router.push(
          `${pathname}?${createQueryString(
            "selectedDate",
            format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          )}`,
        )
      }}
      footer={children}
    />
  )
}
