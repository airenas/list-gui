import { loadavg } from "os";

export class PathUtils {
    public static addURL(s1: string, s2: string): string {
        if (s1 && s2 && s1.length > 0 && s2.length > 0) {
            if (s1.endsWith('/') && s2.startsWith('/')) {
                return s1 + s2.substring(1);
            }
            if (!s1.endsWith('/') && !s2.startsWith('/')) {
                return s1 + '/' + s2;
            }
        }
        return s1 + s2;
    }

    public static isSetURL(str: string): boolean {
        return str && (str.startsWith('https:') || str.startsWith('http:'));
    }

    public static getPort(location: URL): string {
        const defaultPort = location.protocol === 'https:' ? '443' : '80';
        if (location.port !== defaultPort && location.port !== '') {
            return ':' + location.port;
        } else {
            return '';
        }
    }

    public static basePathName(allPath: string, routersURL: string): string {
        if (allPath.endsWith(routersURL)) {
            return allPath.substring(0, allPath.length - routersURL.length);
        }
        return '';
    }
}
