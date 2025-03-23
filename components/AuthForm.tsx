"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from "zod";
import { Button } from "@/components/ui/button"
import {Form } from "@/components/ui/form"
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormFieldOk from "./FormField";
import { useRouter } from "next/navigation";




const authFormSchema = (type : FormType) => {
    return z.object({
        name : type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email : z.string().email(),
        password : z.string().min(3)
    })
}

const AuthForm = ({type} : {type : FormType}) => {
    const formSchema = authFormSchema(type);
    const router = useRouter();

      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if(type === 'sign-up') {
            toast.success('Account created successfully. Please sign in.')
            router.push('/sign-in')
        }  else {
            toast.success('Sign in successfully.')
            router.push('/')
        }
    } catch (error) {
        console.log(error);
        toast.error(`There was an error: ${error} `)
    }
  }

  const isSign = type === 'sign-in';

  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src={"./logo.svg"} alt="logo" height={32} width={38}/>
                <h2 className="text-primary-100">XPrep</h2>
            </div>
            <h3>Pratice job interview with AI</h3>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                {!isSign && <FormFieldOk name="name" label="Name" placeholder="your name" type="text" control={form.control}/>}
                <FormFieldOk name="email" label="Email" placeholder="your email" type="email" control={form.control}/>
                <FormFieldOk name="password" label="Password" placeholder="your password" type="password" control={form.control}/>
                <Button className="btn" type="submit">{isSign ? 'Signin' : 'Create an Account'}</Button>
            </form>
        </Form>
        <p className="text-center">
            {isSign ? 'No account yet?' : 'Have an account already?'}
            <Link href={!isSign ? '/sign-in' : '/sign-up'} className="font-bold  ml-1">
                {!isSign ? "Sign in" : "Sign up"}
            </Link>
        </p>
    </div>

    </div>

  )
}

export default AuthForm
