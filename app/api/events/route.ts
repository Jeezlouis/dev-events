import connectDB from "@/lib/mongodb";
import { Event } from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const event = Object.fromEntries(formData.entries())

        const file = formData.get('image') as File;

        if(!file) {
            return NextResponse.json({ message: "Image is required"}, { status: 400 })
        }

        let tags = JSON.parse(formData.get('tags') as string)
        let aganda = JSON.parse(formData.get('agenda') as string)

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url

        
        // Normalize slug to match lookup behavior
        if (event.slug && typeof event.slug === 'string') {
            event.slug = event.slug.trim().toLowerCase()
        }

        const createdEvent = await Event.create({
            ...event, 
            tags: tags,
            aganda: aganda
        })

        return NextResponse.json({ message: "Event Created Successfully", event: createdEvent }, { status: 201 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "Event Creation Failed", error: e instanceof Error ? e.message : "Unknown" }, {status: 500})
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1  })

        return NextResponse.json({ message: "Events Retrieved Successfully", events }, { status: 200 })
    } catch (e) {
        console.error('Error retrieving events:', e)
        return NextResponse.json(
            { message: "Event Retrieval Failed", error: e instanceof Error ? e.message : String(e) }, 
            { status: 500 }
        )
    }
}
