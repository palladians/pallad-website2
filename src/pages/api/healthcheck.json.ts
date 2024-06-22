import type { APIRoute } from "astro"
import { ofetch } from "ofetch"
import { takeLast } from "rambda"

type HeartbeatEntry = {
  status: number
  time: string
  msg: string
  ping: number
}

type HeartbearResponse = {
  heartbeatList: Record<string, HeartbeatEntry[]>
}

const HEARTBEAT_URL =
  "https://status.pallad.co/api/status-page/heartbeat/pallad"

export const GET: APIRoute = async () => {
  const statusData = await ofetch<HeartbearResponse>(HEARTBEAT_URL)
  const ok = Object.values(statusData.heartbeatList)
    .flatMap((list) => takeLast(1, list))
    .every((heartbeat) => heartbeat.status === 1)
  return new Response(JSON.stringify({ ok }))
}
