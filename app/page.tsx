import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
//import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";
//import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Database } from "@/lib/database.types";

const supabase = createServerComponentClient<Database>({ cookies });

const getAllsolutions = async () => {
  //const { data: solutions, error } = await supabase.from("solutions").select("*");
  const { data: solutions } = await supabase.from("solutions").select("*");
  return solutions;
};


export default async function Home() {
  const solutions = await getAllsolutions();
  
  //console.log(solutions);
  //console.log(error);

  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      <div className="flex flex-col gap-3">
        {solutions?.map((solution) => (
          <Link href={`/${solution.id}`} key={solution.id}>


            <Card>
              <CardHeader>
                <CardTitle> {solution.name} </CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
              </CardHeader>
              <CardContent>
                <p> {solution.description} </p>
              </CardContent>
              {/* <CardFooter>
                <p>Card Footer</p>
              </CardFooter> */}
            </Card>

          </Link>
        ))}
      </div>
    </main>
  );
}
