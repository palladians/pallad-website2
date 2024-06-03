import type { APIRoute } from "astro"
import { Resend } from "resend"

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData()
  const email = form.get("email")?.toString()
  if (!email) return new Response(null, { status: 400 })
  const contact = await resend.contacts.create({
    audienceId: "86c75193-0b9c-4ce3-8fc2-ce88cc54568f",
    email,
  })
  const success = !contact.error
  return new Response(JSON.stringify({ success }), {
    status: 200,
  })
}
