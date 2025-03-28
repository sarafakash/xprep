import { Button } from "@/components/ui/button";
import { getCurrentUser, getFeedbackByInterviewId, getTheInterviewByInterviewId } from "@/lib/dbactions";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const intId = parseInt(id, 10);
  const user = await getCurrentUser();
  const interview = await getTheInterviewByInterviewId(intId);
  if (!interview) redirect('/');

  const feedback = await getFeedbackByInterviewId({
    interviewId: intId,
    userId: user?.id!
  })

  return (
    <section className="px-4 py-6 max-w-4xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-4xl font-semibold text-center">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center mb-6">
        <div className="flex flex-col md:flex-row gap-5 items-center">
          {/* Overall Impression */}
          <div className="flex items-center gap-2">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr className="mb-6" />

      <p className="mb-6">{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-xl font-semibold">Strengths</h3>
        <ul className="list-disc list-inside">
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-xl font-semibold">Areas for Improvement</h3>
        <ul className="list-disc list-inside">
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        {/* <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button> */}
      </div>
    </section>
  );
}

export default page;
