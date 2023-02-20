import { buildBuses } from "../../../lib/realtime/busBuilder";
import { getBuses } from "../../../lib/realtime/cache/realtimeCache"


export const GET = async ({ url }) => {
    const timestamp = parseFloat(url.searchParams.get("t")) || -1

    const [apiBuses, time, status] = await getBuses(timestamp);
    const builtBuses = await buildBuses(apiBuses);
    
    const responseObject = {
        status: status,
        buses: builtBuses,
        time: time
    }

    return new Response(JSON.stringify(responseObject), {
        headers: {
            "Content-Type": "application/JSON"
        }
    });
}