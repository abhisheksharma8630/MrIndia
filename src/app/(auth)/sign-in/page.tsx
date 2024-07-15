"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signIn, SignInResponse } from "next-auth/react"
import { z } from "zod"
import { Button } from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { useState } from "react"
import { signInSchema } from "@/schemas/signInSchema"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"


export default function page() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [isSubmitting,setisSubmitting] = useState(false);

    const form = useForm({
        resolver:zodResolver(signInSchema),
        defaultValues:{
            username:"",
            password:""
        }
    })

    const onSubmit = async (data:z.infer<typeof signInSchema>) => {
        setisSubmitting(true);
        try {
            if(username && password){
                const response:SignInResponse | undefined = await signIn("credentials",{
                    username:data.username,
                password:data.password,
                redirect:false,
                remember:true,
            });
            if(response?.error){
                toast({
                    title:'Failed',
                    description:response?.error,
                    variant:'destructive'
                })
            }
        }
        } catch (error) {
            console.log("error in signup", error);
            toast({
                title:'Failed',
                description: "Error while sign-up",
                variant:'destructive'
            })
        }finally{
            setisSubmitting(false);
        }
    }
  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control}
                    name="username"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="username" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField control={form.control}
                    name="password"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="********" type="password" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            </form>
        </Form>
    </div>
  )
}
