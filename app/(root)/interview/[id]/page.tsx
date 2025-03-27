import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getCurrentUser, getTheInterviewByInterviewId} from "@/lib/dbactions";
import { getRandomInterviewCover } from "@/public/utils";
import Image from "next/image";
import { redirect } from "next/navigation";


const page = async ({params} : RouteParams) => {
    const {id} = await params;
    const parseId = parseInt(id,10);
    const interview = await getTheInterviewByInterviewId(parseId);
    const user = await getCurrentUser();

    if(!interview) redirect('/')

    return (
        <>
            <div className="felx flex-row gap-4 justify-between">
                <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                    <div className="flex flex-row gap-4">
                        <Image src={getRandomInterviewCover()} alt="cover-image" width={40} height={40} className="rounded-full object-cover size-[40px]"/>
                        <h3 className=" capitalize ">{interview.role} Interview</h3>
                        <DisplayTechIcons techStack={interview.techstack}/>
                    </div>
                    <p className=" bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize ">{interview.type}</p>
                </div>
                    <Agent userName={user?.name || ''} type="interview" interviewId={interview.id} questions={interview.questions} userId={user?.id}/>
            </div>
        </>

    )
}

export default page