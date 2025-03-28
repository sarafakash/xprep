import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser, getInterviewByUserId } from '@/lib/dbactions'
import Image from 'next/image'
import Link from 'next/link'

const page =  async () => {
  const user = await getCurrentUser();
  const userInterviews = await getInterviewByUserId(user?.id!);

  const hasPastInterviews = userInterviews?.length! > 0;

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg '>
          <h2 className='text-base md:text-2xl lg:text-3xl'>Get Interview-Ready with AI-Powered Practice & Feedback</h2>

          <p className='text-[12px] md:text-md lg:text-3xl'>
            Practice on real interview questions & get instant feedback
          </p>
          <Button asChild className= "btn-primary max-sm:w-full  w-20 ring-2 ring-offset-dark-100 hover:ring-white">
            <Link href={"/interview"}>Generate an Interview</Link>
          </Button>
        </div>

        <Image src="/robot.png" alt='robo-dude' width={400} height={400} className='max-sm:w-44 max-sm:h-35'/>

      </section>

      <section className='flex flex-col mt-8 gap-6'>
        <h2 >Your Generated Interviews</h2>
        <div className='interviews-section'>
          {
            hasPastInterviews? (
              userInterviews?.map((interview)=>(
                <InterviewCard {...interview} key={interview.id}/>
              ))
            ) : (
                  <p>There are no interviews avaliable.</p>
            )
          }
        </div>
      </section>

      {/* <section className='flex flex-col mt-8 gap-6'>
        <h2>Take an Interview</h2>
        <div className='interviews-section'>
        {dummyInterviews.map((interview)=>(
            <InterviewCard {...interview} key={interview.id}/>
          ))}
          <p>There are no interviews avaliable.</p>
        </div>
      </section> */}

    </>
  )
}

export default page