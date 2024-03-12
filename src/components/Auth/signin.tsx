import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import GoogleAuth from "./googleauth.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import useSignIn from '../../hooks/useSignIn';

export default function SignIn() {
    const { login , loggingin, error} = useSignIn();

    const formSchema = z.object({
        email: z.string().email({ message: "올바르지 않은 이메일입니다." }),
        password: z.string().min(8, { message: "8자 이상 입력해주세요." }).max(50, { message: "50자를 초과할 수 없습니다." }),
      })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      });

    const handleSubmit = (inputs) => {
        login(inputs);
    }

    return (
        <Card className="flex flex-col justify-between">
            <CardHeader>
                <CardTitle>로그인</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1">
                    <GoogleAuth />
                </div>
                <Separator />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>이메일</FormLabel>
                                    <FormControl>
                                        <Input placeholder="exmaple@gmail.com" tpye="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                         <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>비밀번호</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <Button type="submit" className="w-full mt-4" disabled={loggingin}>로그인</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}