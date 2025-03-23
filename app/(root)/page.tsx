import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg '>
          <h2 className='text-base md:text-2xl lg:text-3xl'>Get Interview-Ready with AI-Powered Practice & Feedback</h2>

          <p className='text-[12px] md:text-md lg:text-3xl'>
            Practice on real interview questions & get instant feedback
          </p>
          <Button asChild className= "btn-primary max-sm:w-full">
            <Link href={"/interview"}>Start and Interview</Link>
          </Button>
        </div>

        <Image src="/robot.png" alt='robo-dude' width={400} height={400} className='max-sm:w-70 max-sm:h-60'/>

      </section>
      <section className='flex flex-col mt-8 gap-6'>
        <h2>Your interviews</h2>
        <div className='interviews-section'>
          <p>You haven't taken any interviews yet.</p>
        </div>

      </section>
    </>
  )
}

export default page