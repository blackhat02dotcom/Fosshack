import { connectToDatabase } from "@/lib/db"
import { User } from "@/lib/models/user"
import { createToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    await connectToDatabase()

    const { name, email, password } = await req.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Create token
    const token = await createToken({
      id: user._id,
      email: user.email,
    })

    const response = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })

    // Set cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// now above are code for registeration and below are code for finance ,ai and buger 
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getUser } from "@/lib/auth"
import { User } from "@/lib/models/user"

export async function POST(req: Request) {
  try {
    const user = await getUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expense = await req.json()

    await connectToDatabase()
    const updatedUser = await User.findByIdAndUpdate(user.id, { $push: { "finance.expenses": expense } }, { new: true })

    return NextResponse.json({ expense: updatedUser.finance.expenses[updatedUser.finance.expenses.length - 1] })
  } catch (error) {
    console.error("Error adding expense:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getUser } from "@/lib/auth"
import { User } from "@/lib/models/user"

export async function GET(req: Request) {
  try {
    const user = await getUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const userData = await User.findById(user.id).select("finance")

    return NextResponse.json(userData.finance)
  } catch (error) {
    console.error("Error fetching finance data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



