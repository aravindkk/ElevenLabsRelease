import { auth } from "@/auth";

const AGENT_ID = "agent_1901m04h5x08ej7a91czykww6dne";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ElevenLabs is not configured" },
      { status: 500 },
    );
  }

  const url = `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`;
  const response = await fetch(url, {
    headers: { "xi-api-key": apiKey },
  });

  if (!response.ok) {
    return Response.json(
      { error: "Failed to mint ElevenLabs conversation token" },
      { status: 502 },
    );
  }

  const data: { signed_url?: string } = await response.json();
  if (!data.signed_url) {
    return Response.json(
      { error: "No signed URL received from ElevenLabs" },
      { status: 502 },
    );
  }

  return Response.json({ signedUrl: data.signed_url });
}
