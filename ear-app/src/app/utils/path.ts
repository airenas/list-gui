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
}
