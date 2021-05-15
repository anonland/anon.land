
export function createUrl(endpoint: string) {
    return location.protocol + '//' + location.hostname + ':3000/' + endpoint;
}