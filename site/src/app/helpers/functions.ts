
export function createUrl(endpoint: string) {
    return location.protocol + '//' + location.hostname + '/' + endpoint;
}