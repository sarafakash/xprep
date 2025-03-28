import Agent from "@/components/Agent"
import { getCurrentUser } from "@/lib/dbactions"


const page = async() => {

  const userData = await getCurrentUser();
  // console.log(userData);

  return (
    <>
        <h3>Interview Generation</h3>
        <Agent userName={userData?.name as string} userId={userData?.id as number} type="generate"/>
    </>
  )
}

export default page