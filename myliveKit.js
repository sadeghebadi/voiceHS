import { AgentSession, WorkerOptions, cli } from "@livekit/agents";
import { openai } from "@livekit/agents-plugin-openai";
import { cartesia } from "@livekit/agents-plugin-cartesia";
// import { silero } from "@livekit/agents-plugin-silero"; // optional VAD

async function entrypoint(ctx) {
  // create agent session
  const session = new AgentSession({
    ctx,
    // vad: await silero.VAD.load(),   // optional
    stt: openai.STT(),
    llm: openai.LLM({ model: "gpt-4o-mini" }),
    tts: cartesia.TTS({ voice: "alloy" }),
    instructions: "You are a helpful plumber booking assistant.",
  });

  // connect session to LiveKit
  await session.connect();

  // send initial greeting
  await session.sendMessage("Hello! How can I help you today?");
}

cli.runApp(new WorkerOptions({ entrypointFnc: entrypoint }));
