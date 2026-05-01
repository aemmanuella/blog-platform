import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request)
{
    // all logic here
    let body;

    try {
        body = await req.json()
    }
    catch {
        return Response.json(
            { error: "Invalid or missing JSON body" },
            { status: 400 }
        );
    }


    const {email, password} = body;

    if (!email || !password)
    {
        return Response.json(
            { error: "Email and password are required" },
            { status: 400 }
        );
    }



    const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

    if(user.length === 0) {
        return Response.json(
            {error: "Invalid credentials"},
            {status: 401}
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user[0].passwordHash
    );

    if(!isPasswordValid) 
    {
        return Response.json(
            {error: "Invalid credentials"},
            {status: 401}
        );
    }

    return Response.json(
        {
            message: "Login successful",
            user: {
                id: user[0].id,
                name: user[0].name,
                email: user[0].email
            }
        },
        { status: 200 }
    );
}

