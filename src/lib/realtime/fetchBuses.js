import { TRANSLINK_API_KEY } from "$env/static/private";

export const fetchBuses = async () => {
    
    try {
        const fetchData = await fetch(`https://api.translink.ca/rttiapi/v1/buses?apikey=${TRANSLINK_API_KEY}`, {
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            }
        });

        if (fetchData.status !== 200) {
            throw new Error("Failed to fetch buses. Status Code: " + fetchData.status);
        }

        return await fetchData.json();
    } catch (err) {
        console.log("fetchBuses Failure. ")
        console.log(err);
        return [];
    }
}