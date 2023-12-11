import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-5">
      <div className='text-3xl'>React Challenges</div>
      <ul className='list-decimal text-lg'>
        <li>
          <Link href="/day1">Show / Hide</Link>
        </li>
        <li>
          <Link href="/day2">Timer</Link>
        </li>
        <li>
          <Link href="/day3">Todo list</Link>
        </li>
        <li>
          <Link href="/day4">ProgressBar</Link>
        </li>
      </ul>
    </main>
  )
}
