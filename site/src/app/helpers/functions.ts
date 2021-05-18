
export function createUrl(endpoint: string) {
    return location.protocol + '//' + location.hostname + (location.hostname == 'localhost' ? ':3000/' : '/') + endpoint;
}