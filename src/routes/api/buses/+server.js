import { removeClient, addClient } from "$lib/server/realtime/realtime";
import { error } from "@sveltejs/kit";


export const GET = async ({ request }) => {
    if (!request.headers.get("accept") || !request.headers.get("accept").includes("text/event-stream")) {
        throw new error(406, "Not Acceptable");
    }

    const uuid = crypto.randomUUID();
	const stream = new ReadableStream({
		start(controller) {
            addClient(uuid, controller);
		},
		cancel() {
			removeClient(uuid);
		}
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream"
		}
	});
}