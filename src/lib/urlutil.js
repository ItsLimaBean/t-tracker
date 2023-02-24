export const parseHash = (hash) => {
    if (hash && hash.length > 1) {
        const output = {};

        for (const hashItem of hash.substring(1).split("&")) {
            const splitHash = hashItem.split("=");
            if (splitHash.length === 2) {
                const key = splitHash[0];
                const value = splitHash[1];

                output[key] = value;
            }
        }

        return output;
    }
}